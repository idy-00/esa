<?php
// Statistiques de fréquentation : un fichier agrégé par mois, aucune donnée personnelle
// stockée (les visiteurs sont identifiés par une empreinte anonyme renouvelée chaque mois).

require_once __DIR__ . '/core.php';

const ESA_TRACKED_PAGES = [
    '/' => true, '/a-propos' => true, '/formations' => true, '/actualites' => true,
    '/vie-etudiante' => true, '/contact' => true,
];

function esa_stats_empty_month(): array {
    return ['days' => [], 'pages' => [], 'referrers' => [], 'devices' => [], 'contacts' => 0];
}

function esa_stats_normalize_path(string $path): ?string {
    $path = strtolower(rtrim(parse_url($path, PHP_URL_PATH) ?: '/', '/')) ?: '/';
    if (isset(ESA_TRACKED_PAGES[$path])) {
        return $path;
    }
    if (preg_match('#^/actualites/[a-z0-9-]{1,80}$#', $path)) {
        return $path;
    }
    return null;
}

function esa_stats_is_bot(string $ua): bool {
    return $ua === '' || (bool) preg_match('/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|headless|lighthouse|curl|wget|python|http/i', $ua);
}

function esa_stats_device(string $ua): string {
    if (preg_match('/ipad|tablet|(android(?!.*mobile))/i', $ua)) {
        return 'tablette';
    }
    if (preg_match('/mobi|iphone|android/i', $ua)) {
        return 'mobile';
    }
    return 'ordinateur';
}

function esa_stats_source(string $referrer): string {
    $host = strtolower(parse_url($referrer, PHP_URL_HOST) ?: '');
    $host = preg_replace('/^(www\.|m\.|l\.|lm\.)/', '', $host);
    if ($host === '' || $host === 'esa.sn') {
        return 'Accès direct';
    }
    $known = [
        'google' => 'Google', 'bing' => 'Bing', 'yahoo' => 'Yahoo', 'duckduckgo' => 'DuckDuckGo',
        'facebook' => 'Facebook', 'fb.' => 'Facebook', 'instagram' => 'Instagram',
        'whatsapp' => 'WhatsApp', 'wa.me' => 'WhatsApp', 'linkedin' => 'LinkedIn', 'lnkd.in' => 'LinkedIn',
        't.co' => 'X (Twitter)', 'twitter' => 'X (Twitter)', 'x.com' => 'X (Twitter)',
        'tiktok' => 'TikTok', 'youtube' => 'YouTube', 'chatgpt' => 'ChatGPT',
    ];
    foreach ($known as $needle => $label) {
        if (strpos($host, $needle) !== false) {
            return $label;
        }
    }
    return substr($host, 0, 60);
}

/** Enregistre une page vue. */
function esa_stats_record(string $path, string $referrer, string $ua): void {
    $month = gmdate('Y-m');
    $day = (string) (int) gmdate('j');
    $visitor = substr(hash_hmac('sha256', esa_client_ip() . '|' . $ua . '|' . $month, esa_secret()), 0, 16);

    esa_locked("stats-$month", function () use ($month, $day, $visitor, $path, $referrer, $ua) {
        $visitors = esa_read("stats/visitors-$month", []);
        $seenDays = $visitors[$visitor] ?? [];
        $newToday = !in_array((int) $day, $seenDays, true);
        if ($newToday) {
            $seenDays[] = (int) $day;
            $visitors[$visitor] = $seenDays;
            esa_write("stats/visitors-$month", $visitors);
        }

        $stats = esa_read("stats/$month", esa_stats_empty_month());
        $stats['days'][$day]['v'] = ($stats['days'][$day]['v'] ?? 0) + 1;
        $stats['days'][$day]['u'] = ($stats['days'][$day]['u'] ?? 0) + ($newToday ? 1 : 0);
        $stats['pages'][$path] = ($stats['pages'][$path] ?? 0) + 1;
        $stats['uniques'] = count($visitors);
        if ($newToday) {
            // Provenance et appareil comptés une fois par visiteur et par jour.
            $source = esa_stats_source($referrer);
            $device = esa_stats_device($ua);
            $stats['referrers'][$source] = ($stats['referrers'][$source] ?? 0) + 1;
            $stats['devices'][$device] = ($stats['devices'][$device] ?? 0) + 1;
        }
        esa_write("stats/$month", $stats);
    });
}

/** Incrémente un compteur simple du mois (ex. demandes de contact). */
function esa_stats_increment(string $counter): void {
    $month = gmdate('Y-m');
    $day = (string) (int) gmdate('j');
    esa_locked("stats-$month", function () use ($month, $day, $counter) {
        $stats = esa_read("stats/$month", esa_stats_empty_month());
        $stats[$counter] = ($stats[$counter] ?? 0) + 1;
        $stats['days'][$day][$counter] = ($stats['days'][$day][$counter] ?? 0) + 1;
        esa_write("stats/$month", $stats);
    });
}

function esa_stats_month(string $month): array {
    $stats = esa_read("stats/$month", esa_stats_empty_month());
    $views = 0;
    foreach ($stats['days'] as $d) {
        $views += $d['v'] ?? 0;
    }
    $stats['views'] = $views;
    $stats['uniques'] = $stats['uniques'] ?? 0;
    return $stats;
}

function esa_stats_years(): array {
    $years = [(int) gmdate('Y')];
    foreach (glob(esa_storage_dir('stats') . '/[0-9][0-9][0-9][0-9]-[0-9][0-9].php') ?: [] as $file) {
        $years[] = (int) substr(basename($file), 0, 4);
    }
    $years = array_values(array_unique($years));
    rsort($years);
    return $years;
}
