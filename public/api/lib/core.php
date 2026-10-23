<?php
// Fonctions communes de l'API : chemins, stockage JSON protégé, réponses HTTP.
// Ce fichier ne produit aucune sortie s'il est appelé directement.

if (!defined('ESA_ROOT')) {
    // Racine du site (là où se trouvent api/, config/, storage/, uploads/).
    // ESA_ROOT peut être surchargé en local (voir scripts/dev-router.php).
    define('ESA_ROOT', rtrim(getenv('ESA_ROOT') ?: dirname(__DIR__, 2), '/\\'));
}

const ESA_GUARD = "<?php http_response_code(404); exit; ?>\n";

function esa_path(string $relative): string {
    return ESA_ROOT . '/' . ltrim($relative, '/');
}

function esa_config(): array {
    static $config = null;
    if ($config === null) {
        $file = esa_path('config/admin.php');
        $config = file_exists($file) ? (require $file) : [];
        if (!is_array($config)) {
            $config = [];
        }
    }
    return $config;
}

function esa_secret(): string {
    $secret = esa_config()['secret'] ?? '';
    if (strlen($secret) < 32) {
        error_log('[ESA admin] config/admin.php secret is missing or too short.');
        esa_json(['success' => false, 'message' => 'Configuration du serveur incomplète.'], 500);
    }
    return $secret;
}

function esa_storage_dir(string $sub = ''): string {
    $dir = esa_path('storage' . ($sub !== '' ? '/' . $sub : ''));
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $root = esa_path('storage');
    // Défense en profondeur : les fichiers sont déjà en .php protégés, on bloque aussi le dossier.
    if (!file_exists("$root/.htaccess")) {
        @file_put_contents("$root/.htaccess", "Require all denied\nDeny from all\n");
        @file_put_contents("$root/index.html", '');
    }
    return $dir;
}

/** Lit un fichier de données protégé (storage/<name>.php). */
function esa_read(string $name, $default = null) {
    $file = esa_storage_dir() . "/$name.php";
    if (!is_file($file)) {
        return $default;
    }
    $raw = file_get_contents($file);
    if ($raw === false) {
        return $default;
    }
    if (strncmp($raw, ESA_GUARD, strlen(ESA_GUARD)) === 0) {
        $raw = substr($raw, strlen(ESA_GUARD));
    }
    $data = json_decode($raw, true);
    return $data === null ? $default : $data;
}

/** Écrit de façon atomique un fichier de données protégé. */
function esa_write(string $name, $data): void {
    $file = esa_storage_dir(dirname($name) === '.' ? '' : dirname($name)) . '/' . basename($name) . '.php';
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, ESA_GUARD . $json, LOCK_EX) === false || !rename($tmp, $file)) {
        @unlink($tmp);
        throw new RuntimeException("Écriture impossible : $name");
    }
}

/** Exécute $fn sous verrou exclusif pour éviter les écritures concurrentes. */
function esa_locked(string $lockName, callable $fn) {
    $handle = fopen(esa_storage_dir() . '/.lock-' . preg_replace('/[^a-z0-9_-]/i', '_', $lockName), 'c');
    if (!$handle || !flock($handle, LOCK_EX)) {
        throw new RuntimeException('Verrou indisponible');
    }
    try {
        return $fn();
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function esa_headers(): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
    header('X-Robots-Tag: noindex');
}

function esa_json(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function esa_fail(string $message, int $status = 400): void {
    esa_json(['success' => false, 'message' => $message], $status);
}

function esa_input(): array {
    $input = json_decode(file_get_contents('php://input'), true);
    return is_array($input) ? $input : [];
}

function esa_client_ip(): string {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    // Derrière le proxy nginx de l'hébergeur, REMOTE_ADDR peut être une IP locale :
    // on prend alors la dernière IP ajoutée par le proxy (non falsifiable par le client).
    $isLocal = !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
    if ($isLocal && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = array_map('trim', explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']));
        $last = end($parts);
        if (filter_var($last, FILTER_VALIDATE_IP)) {
            return $last;
        }
    }
    return $ip;
}

function esa_now(): string {
    return gmdate('c');
}
