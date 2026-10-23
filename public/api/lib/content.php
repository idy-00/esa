<?php
// Contenu éditable des pages Actualités et Vie étudiante : lecture, validation, sauvegarde, historique.

require_once __DIR__ . '/core.php';

const ESA_BACKUPS_KEPT = 40;

function esa_text($value, int $max): string {
    if (!is_string($value)) {
        return '';
    }
    $value = trim(str_replace("\r\n", "\n", $value));
    // Retire les caractères de contrôle sauf retours à la ligne.
    $value = preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', $value) ?? '';
    return mb_substr($value, 0, $max);
}

/** N'accepte que les fichiers du site (uploads, media, racine) — jamais de javascript: ou d'URL externe. */
function esa_local_url($value): string {
    $value = esa_text($value, 300);
    if ($value === '') {
        return '';
    }
    if (!preg_match('#^/(uploads|media)/[A-Za-z0-9/_.-]+\.(webp|jpe?g|png|gif|mp4|webm)$#', $value)
        && !preg_match('#^/[A-Za-z0-9_.-]+\.(webp|jpe?g|png|gif|mp4|webm)$#', $value)) {
        return '';
    }
    return strpos($value, '..') === false ? $value : '';
}

function esa_youtube_id($value): string {
    $value = esa_text($value, 300);
    if (preg_match('#^(?:https?://)?(?:www\.|m\.)?(?:youtube\.com/(?:watch\?v=|embed/|shorts/)|youtu\.be/)([A-Za-z0-9_-]{11})#', $value, $m)) {
        return $m[1];
    }
    return preg_match('/^[A-Za-z0-9_-]{11}$/', $value) ? $value : '';
}

function esa_slug($value, string $fallback): string {
    $value = esa_text($value, 100);
    if (!preg_match('/^[a-z0-9-]{1,80}$/', $value)) {
        $value = $fallback;
    }
    return $value;
}

function esa_date($value): string {
    $value = esa_text($value, 10);
    return preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) && strtotime($value) ? $value : '';
}

function esa_photos($list, int $max = 300): array {
    $out = [];
    foreach (is_array($list) ? array_slice($list, 0, $max) : [] as $photo) {
        $src = esa_local_url($photo['src'] ?? '');
        if ($src !== '') {
            $out[] = ['src' => $src, 'alt' => esa_text($photo['alt'] ?? '', 200)];
        }
    }
    return $out;
}

function esa_unique_ids(array $items): array {
    $seen = [];
    foreach ($items as $i => $item) {
        $id = $item['id'];
        $n = 2;
        while (isset($seen[$id])) {
            $id = $item['id'] . '-' . $n++;
        }
        $seen[$id] = true;
        $items[$i]['id'] = $id;
    }
    return $items;
}

/** Valide et nettoie le document complet envoyé par le dashboard. */
function esa_sanitize_content(array $c): array {
    $a = $c['actualites'] ?? [];
    $v = $c['vieEtudiante'] ?? [];

    $events = [];
    foreach (array_slice(is_array($a['events'] ?? null) ? $a['events'] : [], 0, 500) as $i => $e) {
        $title = esa_text($e['title'] ?? '', 200);
        if ($title === '') {
            continue;
        }
        $events[] = [
            'id' => esa_slug($e['id'] ?? '', 'evenement-' . ($i + 1)),
            'published' => !empty($e['published']),
            'featured' => !empty($e['featured']),
            'date' => esa_date($e['date'] ?? ''),
            'endDate' => esa_date($e['endDate'] ?? ''),
            'location' => esa_text($e['location'] ?? '', 200),
            'title' => $title,
            'summary' => esa_text($e['summary'] ?? '', 600),
            'body' => esa_text($e['body'] ?? '', 20000),
            'cover' => esa_local_url($e['cover'] ?? ''),
            'photos' => esa_photos($e['photos'] ?? []),
        ];
    }

    $videos = [];
    foreach (array_slice(is_array($a['videos'] ?? null) ? $a['videos'] : [], 0, 100) as $i => $vid) {
        $title = esa_text($vid['title'] ?? '', 200);
        $src = esa_local_url($vid['src'] ?? '');
        $youtube = esa_youtube_id($vid['youtube'] ?? '');
        if ($title === '' || ($src === '' && $youtube === '')) {
            continue;
        }
        $videos[] = [
            'id' => esa_slug($vid['id'] ?? '', 'video-' . ($i + 1)),
            'published' => !empty($vid['published']),
            'title' => $title,
            'subtitle' => esa_text($vid['subtitle'] ?? '', 300),
            'description' => esa_text($vid['description'] ?? '', 3000),
            'src' => $youtube !== '' ? '' : $src,
            'poster' => esa_local_url($vid['poster'] ?? ''),
            'youtube' => $youtube,
        ];
    }

    $albums = [];
    foreach (array_slice(is_array($v['albums'] ?? null) ? $v['albums'] : [], 0, 100) as $i => $al) {
        $title = esa_text($al['title'] ?? '', 200);
        if ($title === '') {
            continue;
        }
        $albums[] = [
            'id' => esa_slug($al['id'] ?? '', 'album-' . ($i + 1)),
            'published' => !empty($al['published']),
            'layout' => ($al['layout'] ?? '') === 'mosaic' ? 'mosaic' : 'grid',
            'title' => $title,
            'subtitle' => esa_text($al['subtitle'] ?? '', 300),
            'photos' => esa_photos($al['photos'] ?? []),
        ];
    }

    $hero = function ($h, bool $withImage = false) {
        $out = [
            'eyebrow' => esa_text($h['eyebrow'] ?? '', 80),
            'title' => esa_text($h['title'] ?? '', 200),
            'text' => esa_text($h['text'] ?? '', 600),
        ];
        if ($withImage) {
            $out['image'] = esa_local_url($h['image'] ?? '');
        }
        return $out;
    };

    return [
        'actualites' => [
            'hero' => $hero($a['hero'] ?? []),
            'community' => [
                'title' => esa_text($a['community']['title'] ?? '', 200),
                'subtitle' => esa_text($a['community']['subtitle'] ?? '', 300),
                'photos' => esa_photos($a['community']['photos'] ?? [], 6),
            ],
            'eventsSection' => [
                'title' => esa_text($a['eventsSection']['title'] ?? '', 200),
                'subtitle' => esa_text($a['eventsSection']['subtitle'] ?? '', 300),
            ],
            'videos' => esa_unique_ids($videos),
            'events' => esa_unique_ids($events),
        ],
        'vieEtudiante' => [
            'hero' => $hero($v['hero'] ?? [], true),
            'amicale' => [
                'title' => esa_text($v['amicale']['title'] ?? '', 200),
                'text' => esa_text($v['amicale']['text'] ?? '', 5000),
                'image' => esa_local_url($v['amicale']['image'] ?? ''),
            ],
            'albums' => esa_unique_ids($albums),
        ],
    ];
}

/** Document stocké : ['version' => int, 'updatedAt' => ..., 'updatedBy' => ..., 'content' => ...] ou null. */
function esa_content_doc(): ?array {
    return esa_read('content', null);
}

function esa_save_content(array $content, int $baseVersion, array $user, string $summary): array {
    return esa_locked('content', function () use ($content, $baseVersion, $user, $summary) {
        $current = esa_content_doc();
        $currentVersion = $current['version'] ?? 0;
        if ($baseVersion !== $currentVersion) {
            esa_json([
                'success' => false, 'conflict' => true,
                'message' => 'Quelqu\'un d\'autre a modifié le contenu entre-temps. Rechargez la page pour récupérer la dernière version.',
            ], 409);
        }
        if ($current) {
            esa_write('backups/content-' . gmdate('Ymd-His') . '-v' . $currentVersion, $current);
            esa_prune_backups();
        }
        $doc = [
            'version' => $currentVersion + 1,
            'updatedAt' => esa_now(),
            'updatedBy' => $user['name'],
            'summary' => $summary,
            'content' => esa_sanitize_content($content),
        ];
        esa_write('content', $doc);
        esa_log($user, $summary !== '' ? $summary : 'Contenu modifié');
        return $doc;
    });
}

function esa_backups(): array {
    $files = glob(esa_storage_dir('backups') . '/content-*.php') ?: [];
    rsort($files);
    return $files;
}

function esa_prune_backups(): void {
    foreach (array_slice(esa_backups(), ESA_BACKUPS_KEPT) as $file) {
        @unlink($file);
    }
}

function esa_log(array $user, string $action): void {
    esa_locked('activity', function () use ($user, $action) {
        $log = esa_read('activity', []);
        array_unshift($log, ['at' => esa_now(), 'user' => $user['name'], 'action' => esa_text($action, 300)]);
        esa_write('activity', array_slice($log, 0, 300));
    });
}

/** Toutes les URL de fichiers référencées par le contenu (pour la médiathèque). */
function esa_content_urls(?array $content): array {
    $urls = [];
    $content = $content ?? [];
    array_walk_recursive($content, function ($value) use (&$urls) {
        if (is_string($value) && strpos($value, '/uploads/') === 0) {
            $urls[$value] = true;
        }
    });
    return $urls;
}
