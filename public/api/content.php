<?php
// Contenu public des pages Actualités et Vie étudiante (géré depuis /admin).
require_once __DIR__ . '/lib/content.php';

esa_headers();
// Pas de cache : une modification faite dans le dashboard doit apparaître immédiatement.
header('Cache-Control: no-cache');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    esa_fail('Method not allowed', 405);
}

$doc = esa_content_doc();
if (!$doc) {
    // Rien n'a encore été enregistré : le site utilise son contenu intégré.
    esa_json(['success' => true, 'content' => null]);
}

$content = $doc['content'];
$published = function ($items) {
    return array_values(array_filter($items, function ($item) {
        return !empty($item['published']);
    }));
};
$content['actualites']['events'] = $published($content['actualites']['events']);
$content['actualites']['videos'] = $published($content['actualites']['videos']);
$content['vieEtudiante']['albums'] = $published($content['vieEtudiante']['albums']);

esa_json(['success' => true, 'version' => $doc['version'], 'content' => $content]);
