<?php
// Serveur PHP local pour développer le dashboard : npm run dev:api
// Les données (storage, uploads, config) vont dans .local-server/ et ne sont jamais déployées.

$root = dirname(__DIR__) . '/.local-server';
putenv("ESA_ROOT=$root");
@mkdir("$root/config", 0755, true);

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (preg_match('#^/api/([a-z]+)\.php$#', $uri, $m) && is_file(dirname(__DIR__) . "/public/api/{$m[1]}.php")) {
    require dirname(__DIR__) . "/public/api/{$m[1]}.php";
    return true;
}

if (preg_match('#^/uploads/[0-9/]+[a-f0-9]+\.(webp|jpe?g|png|gif|mp4|webm)$#', $uri, $m) && is_file($root . $uri)) {
    $types = ['webp' => 'image/webp', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
        'gif' => 'image/gif', 'mp4' => 'video/mp4', 'webm' => 'video/webm'];
    header('Content-Type: ' . $types[$m[1]]);
    readfile($root . $uri);
    return true;
}

http_response_code(404);
echo 'Not found';
return true;
