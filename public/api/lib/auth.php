<?php
// Comptes administrateurs, sessions et protection CSRF du dashboard.

require_once __DIR__ . '/core.php';

const ESA_SESSION_IDLE = 4 * 3600;
const ESA_SESSION_MAX = 12 * 3600;
const ESA_LOGIN_MAX_FAILS = 5;
const ESA_LOGIN_WINDOW = 15 * 60;
const ESA_PASSWORD_MIN = 10;

function esa_users(): array {
    $users = esa_read('users', null);
    if ($users === null) {
        // Premier lancement : création du compte initial défini dans config/admin.php.
        $boot = esa_config()['bootstrap_user'] ?? null;
        $users = [];
        if (is_array($boot) && !empty($boot['email']) && !empty($boot['password_hash'])) {
            $users[] = [
                'id' => bin2hex(random_bytes(8)),
                'email' => strtolower(trim($boot['email'])),
                'name' => $boot['name'] ?? 'Administrateur',
                'role' => 'admin',
                'hash' => $boot['password_hash'],
                'createdAt' => esa_now(),
                'lastLogin' => null,
            ];
            esa_write('users', $users);
        }
    }
    return $users;
}

function esa_public_user(array $user): array {
    return [
        'id' => $user['id'], 'email' => $user['email'], 'name' => $user['name'],
        'role' => $user['role'], 'createdAt' => $user['createdAt'] ?? null, 'lastLogin' => $user['lastLogin'] ?? null,
    ];
}

function esa_session_start(): void {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.gc_maxlifetime', (string) ESA_SESSION_MAX);
    session_save_path(esa_storage_dir('sessions'));
    session_name('esa_admin');
    session_set_cookie_params([
        'lifetime' => 0, 'path' => '/api/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict',
    ]);
    session_start();
}

function esa_current_user(): ?array {
    esa_session_start();
    $id = $_SESSION['uid'] ?? null;
    if (!$id) {
        return null;
    }
    $now = time();
    if ($now - ($_SESSION['last'] ?? 0) > ESA_SESSION_IDLE || $now - ($_SESSION['started'] ?? 0) > ESA_SESSION_MAX) {
        esa_logout();
        return null;
    }
    foreach (esa_users() as $user) {
        if ($user['id'] === $id) {
            $_SESSION['last'] = $now;
            return $user;
        }
    }
    esa_logout();
    return null;
}

function esa_require_user(?string $role = null): array {
    $user = esa_current_user();
    if (!$user) {
        esa_fail('Votre session a expiré. Veuillez vous reconnecter.', 401);
    }
    if ($role === 'admin' && $user['role'] !== 'admin') {
        esa_fail('Action réservée aux administrateurs.', 403);
    }
    return $user;
}

function esa_require_csrf(): void {
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($sent) || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $sent)) {
        esa_fail('Jeton de sécurité invalide. Rechargez la page.', 403);
    }
}

function esa_login_blocked(string $key): bool {
    $attempts = esa_read('login-attempts', []);
    $recent = array_filter($attempts[$key] ?? [], function ($t) {
        return $t > time() - ESA_LOGIN_WINDOW;
    });
    return count($recent) >= ESA_LOGIN_MAX_FAILS;
}

function esa_login_record_failure(string $key): void {
    esa_locked('login-attempts', function () use ($key) {
        $attempts = esa_read('login-attempts', []);
        foreach ($attempts as $k => $list) {
            $attempts[$k] = array_values(array_filter($list, function ($t) {
                return $t > time() - ESA_LOGIN_WINDOW;
            }));
            if (!$attempts[$k]) {
                unset($attempts[$k]);
            }
        }
        $attempts[$key][] = time();
        esa_write('login-attempts', $attempts);
    });
}

function esa_login(string $email, string $password): array {
    $email = strtolower(trim($email));
    $ipKey = 'ip:' . substr(hash('sha256', esa_client_ip()), 0, 16);
    $mailKey = 'mail:' . substr(hash('sha256', $email), 0, 16);
    if (esa_login_blocked($ipKey) || esa_login_blocked($mailKey)) {
        esa_fail('Trop de tentatives. Réessayez dans 15 minutes.', 429);
    }

    $found = null;
    foreach (esa_users() as $user) {
        if (hash_equals($user['email'], $email)) {
            $found = $user;
        }
    }
    // Vérification systématique pour un temps de réponse constant.
    $hash = $found['hash'] ?? password_hash(bin2hex(random_bytes(8)), PASSWORD_DEFAULT);
    if (!password_verify($password, $hash) || !$found) {
        esa_login_record_failure($ipKey);
        esa_login_record_failure($mailKey);
        esa_fail('Email ou mot de passe incorrect.', 401);
    }

    esa_session_start();
    session_regenerate_id(true);
    $_SESSION = [
        'uid' => $found['id'], 'started' => time(), 'last' => time(),
        'csrf' => bin2hex(random_bytes(32)),
    ];

    esa_update_user($found['id'], function ($u) use ($password) {
        $u['lastLogin'] = esa_now();
        if (password_needs_rehash($u['hash'], PASSWORD_DEFAULT)) {
            $u['hash'] = password_hash($password, PASSWORD_DEFAULT);
        }
        return $u;
    });
    return $found;
}

function esa_logout(): void {
    esa_session_start();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 3600, 'path' => $p['path'], 'secure' => $p['secure'],
            'httponly' => true, 'samesite' => 'Strict',
        ]);
    }
    session_destroy();
}

function esa_update_user(string $id, callable $fn): ?array {
    return esa_locked('users', function () use ($id, $fn) {
        $users = esa_users();
        foreach ($users as $i => $user) {
            if ($user['id'] === $id) {
                $users[$i] = $fn($user);
                esa_write('users', $users);
                return $users[$i];
            }
        }
        return null;
    });
}

function esa_validate_password(string $password): void {
    if (mb_strlen($password) < ESA_PASSWORD_MIN) {
        esa_fail('Le mot de passe doit contenir au moins ' . ESA_PASSWORD_MIN . ' caractères.');
    }
    if (mb_strlen($password) > 200) {
        esa_fail('Mot de passe trop long.');
    }
}
