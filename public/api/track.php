<?php
// Compteur de visites anonyme appelé par le site à chaque changement de page.
require_once __DIR__ . '/lib/stats.php';

esa_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    esa_fail('Method not allowed', 405);
}

$input = esa_input();
$ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 400);
$path = esa_stats_normalize_path(is_string($input['p'] ?? null) ? substr($input['p'], 0, 200) : '');

if ($path !== null && !esa_stats_is_bot($ua) && ($_SERVER['HTTP_DNT'] ?? '') !== '1') {
    try {
        esa_stats_record($path, is_string($input['r'] ?? null) ? substr($input['r'], 0, 500) : '', $ua);
    } catch (Throwable $e) {
        error_log('[ESA stats] ' . $e->getMessage());
    }
}

http_response_code(204);
