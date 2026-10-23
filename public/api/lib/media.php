<?php
// Envoi et gestion des fichiers (photos, vidéos) déposés depuis le dashboard.

require_once __DIR__ . '/core.php';

const ESA_IMAGE_MAX_BYTES = 15 * 1024 * 1024;
const ESA_VIDEO_MAX_BYTES = 300 * 1024 * 1024;
const ESA_IMAGE_MAX_SIDE = 2000;

function esa_uploads_dir(string $sub = ''): string {
    $root = esa_path('uploads');
    $dir = $root . ($sub !== '' ? '/' . $sub : '');
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    if (!file_exists("$root/.htaccess")) {
        // Aucun script ne doit jamais s'exécuter depuis le dossier des fichiers envoyés.
        @file_put_contents("$root/.htaccess", "Options -Indexes -ExecCGI\n"
            . "RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8 .phar\n"
            . "<FilesMatch \"\\.(?i:php|phtml|phar|pl|py|cgi|sh)$\">\nRequire all denied\n</FilesMatch>\n"
            . "<IfModule mod_headers.c>\nHeader set X-Content-Type-Options nosniff\n</IfModule>\n");
    }
    return $dir;
}

function esa_upload_error(int $code): string {
    switch ($code) {
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            return 'Fichier trop volumineux pour le serveur (limite : ' . ini_get('upload_max_filesize') . ').';
        case UPLOAD_ERR_PARTIAL:
            return 'Envoi interrompu, veuillez réessayer.';
        case UPLOAD_ERR_NO_FILE:
            return 'Aucun fichier reçu.';
        default:
            return 'Erreur lors de l\'envoi du fichier.';
    }
}

/** Enregistre le fichier envoyé et renvoie son URL publique. */
function esa_store_upload(array $file): string {
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
        esa_fail(esa_upload_error($file['error'] ?? UPLOAD_ERR_NO_FILE));
    }
    $sub = gmdate('Y/m');
    $name = bin2hex(random_bytes(10));
    $info = @getimagesize($file['tmp_name']);

    if ($info !== false) {
        if ($file['size'] > ESA_IMAGE_MAX_BYTES) {
            esa_fail('Image trop lourde (15 Mo maximum).');
        }
        $types = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp', IMAGETYPE_GIF => 'gif'];
        if (!isset($types[$info[2]])) {
            esa_fail('Format d\'image non accepté. Utilisez JPG, PNG ou WebP.');
        }
        $dir = esa_uploads_dir($sub);
        $reencoded = esa_reencode_image($file['tmp_name'], $info, "$dir/$name");
        if ($reencoded !== null) {
            return "/uploads/$sub/" . basename($reencoded);
        }
        $target = "$dir/$name." . $types[$info[2]];
        if (!move_uploaded_file($file['tmp_name'], $target)) {
            esa_fail('Impossible d\'enregistrer le fichier sur le serveur.', 500);
        }
        return "/uploads/$sub/" . basename($target);
    }

    $ext = strtolower(pathinfo($file['name'] ?? '', PATHINFO_EXTENSION));
    $mime = function_exists('finfo_open') ? finfo_file(finfo_open(FILEINFO_MIME_TYPE), $file['tmp_name']) : '';
    $videoMimes = ['mp4' => ['video/mp4', 'application/mp4'], 'webm' => ['video/webm']];
    if (!isset($videoMimes[$ext]) || ($mime !== '' && !in_array($mime, $videoMimes[$ext], true))) {
        esa_fail('Format non accepté. Photos : JPG, PNG, WebP. Vidéos : MP4.');
    }
    if ($file['size'] > ESA_VIDEO_MAX_BYTES) {
        esa_fail('Vidéo trop lourde (300 Mo maximum). Pour les longues vidéos, utilisez plutôt un lien YouTube.');
    }
    $target = esa_uploads_dir($sub) . "/$name.$ext";
    if (!move_uploaded_file($file['tmp_name'], $target)) {
        esa_fail('Impossible d\'enregistrer le fichier sur le serveur.', 500);
    }
    return "/uploads/$sub/$name.$ext";
}

/** Ré-encode l'image avec GD (supprime les métadonnées, limite la taille). Renvoie null si GD absent. */
function esa_reencode_image(string $tmp, array $info, string $targetNoExt): ?string {
    if (!function_exists('imagecreatefromstring') || $info[2] === IMAGETYPE_GIF) {
        return null;
    }
    if ($info[0] * $info[1] > 50000000) {
        esa_fail('Image trop grande (dimensions).');
    }
    $src = @imagecreatefromstring(file_get_contents($tmp));
    if (!$src) {
        esa_fail('Image illisible ou corrompue.');
    }
    [$w, $h] = [imagesx($src), imagesy($src)];
    $scale = min(1, ESA_IMAGE_MAX_SIDE / max($w, $h));
    $nw = (int) round($w * $scale);
    $nh = (int) round($h * $scale);
    $dst = imagecreatetruecolor($nw, $nh);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
    imagedestroy($src);

    if (function_exists('imagewebp')) {
        $target = "$targetNoExt.webp";
        $ok = imagewebp($dst, $target, 82);
    } else {
        $target = "$targetNoExt.jpg";
        $ok = imagejpeg($dst, $target, 85);
    }
    imagedestroy($dst);
    if (!$ok) {
        esa_fail('Impossible d\'enregistrer l\'image.', 500);
    }
    return $target;
}

function esa_list_uploads(): array {
    $root = esa_uploads_dir();
    $items = [];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
    foreach ($iterator as $file) {
        $rel = str_replace('\\', '/', substr($file->getPathname(), strlen($root)));
        if (!preg_match('#^/\d{4}/\d{2}/[a-f0-9]{20}\.(webp|jpe?g|png|gif|mp4|webm)$#', $rel)) {
            continue;
        }
        $items[] = [
            'url' => '/uploads' . $rel,
            'size' => $file->getSize(),
            'date' => gmdate('c', $file->getMTime()),
            'type' => preg_match('/\.(mp4|webm)$/', $rel) ? 'video' : 'image',
        ];
    }
    usort($items, function ($a, $b) {
        return strcmp($b['date'], $a['date']);
    });
    return $items;
}

function esa_delete_upload(string $url): void {
    if (!preg_match('#^/uploads/(\d{4}/\d{2}/[a-f0-9]{20}\.(webp|jpe?g|png|gif|mp4|webm))$#', $url, $m)) {
        esa_fail('Fichier invalide.');
    }
    $path = esa_uploads_dir() . '/' . $m[1];
    if (is_file($path)) {
        @unlink($path);
    }
}
