<?php
// API du dashboard d'administration (/admin). Toutes les actions passent par ?action=...
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/content.php';
require_once __DIR__ . '/lib/media.php';
require_once __DIR__ . '/lib/stats.php';

esa_headers();

$method = $_SERVER['REQUEST_METHOD'];
$action = is_string($_GET['action'] ?? null) ? $_GET['action'] : '';

// --- Actions publiques --------------------------------------------------------

if ($action === 'login' && $method === 'POST') {
    $input = esa_input();
    $user = esa_login((string) ($input['email'] ?? ''), (string) ($input['password'] ?? ''));
    esa_log($user, 'Connexion');
    esa_json(['success' => true, 'user' => esa_public_user($user), 'csrf' => $_SESSION['csrf']]);
}

if ($action === 'me' && $method === 'GET') {
    $user = esa_current_user();
    esa_json($user
        ? ['success' => true, 'user' => esa_public_user($user), 'csrf' => $_SESSION['csrf']]
        : ['success' => true, 'user' => null]);
}

// --- Actions réservées aux personnes connectées --------------------------------

$user = esa_require_user();
if ($method === 'POST') {
    esa_require_csrf();
}

switch ("$method $action") {
    case 'POST logout':
        esa_logout();
        esa_json(['success' => true]);

    case 'GET content':
        $doc = esa_content_doc();
        esa_json([
            'success' => true,
            'version' => $doc['version'] ?? 0,
            'updatedAt' => $doc['updatedAt'] ?? null,
            'updatedBy' => $doc['updatedBy'] ?? null,
            'content' => $doc['content'] ?? null,
        ]);

    case 'POST save_content':
        if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 3 * 1024 * 1024) {
            esa_fail('Contenu trop volumineux.', 413);
        }
        $input = esa_input();
        if (!is_array($input['content'] ?? null)) {
            esa_fail('Contenu manquant.');
        }
        $doc = esa_save_content($input['content'], (int) ($input['baseVersion'] ?? -1), $user, esa_text($input['summary'] ?? '', 300));
        esa_json(['success' => true, 'version' => $doc['version'], 'content' => $doc['content'], 'updatedAt' => $doc['updatedAt']]);

    case 'POST upload':
        if (empty($_FILES['file'])) {
            $max = ini_get('post_max_size');
            esa_fail("Aucun fichier reçu. Il est peut-être trop volumineux (limite du serveur : $max).", 413);
        }
        $url = esa_store_upload($_FILES['file']);
        esa_json(['success' => true, 'url' => $url]);

    case 'GET media':
        $used = esa_content_urls(esa_content_doc()['content'] ?? null);
        $items = array_map(function ($item) use ($used) {
            $item['used'] = isset($used[$item['url']]);
            return $item;
        }, esa_list_uploads());
        esa_json(['success' => true, 'items' => $items, 'limits' => [
            'upload' => ini_get('upload_max_filesize'), 'post' => ini_get('post_max_size'),
        ]]);

    case 'POST delete_media':
        $url = (string) (esa_input()['url'] ?? '');
        $used = esa_content_urls(esa_content_doc()['content'] ?? null);
        if (isset($used[$url])) {
            esa_fail('Ce fichier est encore utilisé sur le site. Retirez-le d\'abord du contenu.');
        }
        esa_delete_upload($url);
        esa_log($user, 'Fichier supprimé de la médiathèque');
        esa_json(['success' => true]);

    case 'GET stats':
        $year = (int) ($_GET['year'] ?? gmdate('Y'));
        if ($year < 2020 || $year > 2100) {
            esa_fail('Année invalide.');
        }
        $months = [];
        for ($m = 1; $m <= 12; $m++) {
            $s = esa_stats_month(sprintf('%04d-%02d', $year, $m));
            $months[] = ['month' => $m, 'views' => $s['views'], 'visitors' => $s['uniques'], 'contacts' => $s['contacts'] ?? 0];
        }
        $detail = null;
        $month = (int) ($_GET['month'] ?? 0);
        if ($month >= 1 && $month <= 12) {
            $s = esa_stats_month(sprintf('%04d-%02d', $year, $month));
            $days = [];
            $count = esa_days_in_month($year, $month);
            for ($d = 1; $d <= $count; $d++) {
                $row = $s['days'][(string) $d] ?? [];
                $days[] = ['day' => $d, 'views' => $row['v'] ?? 0, 'visitors' => $row['u'] ?? 0, 'contacts' => $row['contacts'] ?? 0];
            }
            arsort($s['pages']);
            arsort($s['referrers']);
            arsort($s['devices']);
            $detail = [
                'month' => $month, 'views' => $s['views'], 'visitors' => $s['uniques'], 'contacts' => $s['contacts'] ?? 0,
                'days' => $days, 'pages' => $s['pages'], 'referrers' => $s['referrers'], 'devices' => $s['devices'],
            ];
        }
        esa_json(['success' => true, 'year' => $year, 'years' => esa_stats_years(), 'months' => $months, 'detail' => $detail]);

    case 'GET activity':
        esa_json(['success' => true, 'items' => esa_read('activity', [])]);

    case 'GET backups':
        $items = [];
        foreach (esa_backups() as $file) {
            $name = basename($file, '.php');
            $doc = esa_read("backups/$name", []);
            $items[] = [
                'name' => $name, 'version' => $doc['version'] ?? 0, 'updatedAt' => $doc['updatedAt'] ?? null,
                'updatedBy' => $doc['updatedBy'] ?? null, 'summary' => $doc['summary'] ?? '',
            ];
        }
        esa_json(['success' => true, 'items' => $items]);

    case 'POST restore_backup':
        $input = esa_input();
        $name = (string) ($input['name'] ?? '');
        if (!preg_match('/^content-\d{8}-\d{6}-v\d+$/', $name)) {
            esa_fail('Version introuvable.');
        }
        $backup = esa_read("backups/$name", null);
        if (!is_array($backup['content'] ?? null)) {
            esa_fail('Version introuvable.');
        }
        $label = 'Restauration de la version ' . ($backup['version'] ?? '?');
        $doc = esa_save_content($backup['content'], (int) ($input['baseVersion'] ?? -1), $user, $label);
        esa_json(['success' => true, 'version' => $doc['version'], 'content' => $doc['content']]);

    case 'POST change_password':
        $input = esa_input();
        if (!password_verify((string) ($input['current'] ?? ''), $user['hash'])) {
            esa_fail('Mot de passe actuel incorrect.');
        }
        $new = (string) ($input['password'] ?? '');
        esa_validate_password($new);
        esa_update_user($user['id'], function ($u) use ($new) {
            $u['hash'] = password_hash($new, PASSWORD_DEFAULT);
            return $u;
        });
        esa_log($user, 'Mot de passe modifié');
        esa_json(['success' => true]);

    case 'POST update_profile':
        $name = esa_text(esa_input()['name'] ?? '', 80);
        if ($name === '') {
            esa_fail('Le nom est obligatoire.');
        }
        $updated = esa_update_user($user['id'], function ($u) use ($name) {
            $u['name'] = $name;
            return $u;
        });
        esa_json(['success' => true, 'user' => esa_public_user($updated)]);

    case 'GET users':
        esa_require_user('admin');
        esa_json(['success' => true, 'items' => array_map('esa_public_user', esa_users())]);

    case 'POST create_user':
        esa_require_user('admin');
        $input = esa_input();
        $email = strtolower(esa_text($input['email'] ?? '', 254));
        $name = esa_text($input['name'] ?? '', 80);
        $role = ($input['role'] ?? '') === 'admin' ? 'admin' : 'editor';
        $password = (string) ($input['password'] ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $name === '') {
            esa_fail('Nom et email valides obligatoires.');
        }
        esa_validate_password($password);
        $created = esa_locked('users', function () use ($email, $name, $role, $password) {
            $users = esa_users();
            foreach ($users as $u) {
                if ($u['email'] === $email) {
                    esa_fail('Un compte existe déjà avec cet email.');
                }
            }
            $new = [
                'id' => bin2hex(random_bytes(8)), 'email' => $email, 'name' => $name, 'role' => $role,
                'hash' => password_hash($password, PASSWORD_DEFAULT), 'createdAt' => esa_now(), 'lastLogin' => null,
            ];
            $users[] = $new;
            esa_write('users', $users);
            return $new;
        });
        esa_log($user, "Compte créé : $name");
        esa_json(['success' => true, 'user' => esa_public_user($created)]);

    case 'POST delete_user':
        esa_require_user('admin');
        $id = (string) (esa_input()['id'] ?? '');
        if ($id === $user['id']) {
            esa_fail('Vous ne pouvez pas supprimer votre propre compte.');
        }
        esa_locked('users', function () use ($id) {
            $users = array_values(array_filter(esa_users(), function ($u) use ($id) {
                return $u['id'] !== $id;
            }));
            esa_write('users', $users);
        });
        esa_log($user, 'Compte supprimé');
        esa_json(['success' => true]);

    case 'POST reset_password':
        esa_require_user('admin');
        $input = esa_input();
        $password = (string) ($input['password'] ?? '');
        esa_validate_password($password);
        $updated = esa_update_user((string) ($input['id'] ?? ''), function ($u) use ($password) {
            $u['hash'] = password_hash($password, PASSWORD_DEFAULT);
            return $u;
        });
        if (!$updated) {
            esa_fail('Compte introuvable.', 404);
        }
        esa_log($user, 'Mot de passe réinitialisé : ' . $updated['name']);
        esa_json(['success' => true]);

    default:
        esa_fail('Action inconnue.', 404);
}

function esa_days_in_month(int $year, int $month): int {
    return (int) gmdate('t', gmmktime(0, 0, 0, $month, 1, $year));
}
