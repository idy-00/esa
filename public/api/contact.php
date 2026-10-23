<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), geolocation=(), microphone=()');
header("Content-Security-Policy: default-src 'none'; base-uri 'none'; frame-ancestors 'none'");

$allowedOrigins = ['https://esa.sn', 'https://www.esa.sn'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit();
}

function inputText($value, $maxLength = 1000) {
    if (!is_string($value)) {
        return '';
    }

    $value = trim($value);
    return strlen($value) <= $maxLength ? $value : '';
}

function html($value) {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function hasEnoughWords($value, $minimumWords) {
    preg_match_all('/[\\p{L}]{2,}/u', $value, $words);
    return count($words[0]) >= $minimumWords;
}

// The decoy field and elapsed time stop automated submissions without affecting visitors.
$honeypot = inputText($input['website'] ?? '', 200);
$formStartedAt = filter_var($input['form_started_at'] ?? null, FILTER_VALIDATE_INT);
if ($honeypot !== '' || !$formStartedAt || time() - $formStartedAt < 3 || time() - $formStartedAt > 86400) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Envoi non valide. Veuillez réessayer.']);
    exit();
}

$nom = inputText($input['nom'] ?? '', 100);
$prenom = inputText($input['prenom'] ?? '', 100);
$email = filter_var(inputText($input['email'] ?? '', 254), FILTER_VALIDATE_EMAIL);
$telephone = inputText($input['telephone'] ?? '', 40);
$formation = inputText($input['formation'] ?? '', 50);
$message = inputText($input['message'] ?? '', 3000);

if (!$nom || !$prenom || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Champs requis manquants']);
    exit();
}

if (!hasEnoughWords($nom . ' ' . $prenom, 2) || !hasEnoughWords($message, 3)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Merci de renseigner un nom et un message complets.']);
    exit();
}

$nomHtml = html($nom);
$prenomHtml = html($prenom);
$emailHtml = html($email);
$telephoneHtml = html($telephone);
$formationHtml = html($formation);
$messageHtml = nl2br(html($message));

$formationLabels = [
    'bts' => 'BTS / DTS',
    'licence' => 'Licence Professionnelle',
    'master1' => 'Master 1',
    'master2' => 'Master 2',
    'continue' => 'Formation Continue',
    'autre' => 'Autre / Information générale'
];
$formationLabel = $formationLabels[$formation] ?? $formation;
$formationLabelHtml = html($formationLabel);

// Load API key from config file
$configPath = __DIR__ . '/../config/brevo.php';
if (!file_exists($configPath)) {
    error_log('[ESA contact] Brevo configuration is missing.');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Le service est temporairement indisponible.']);
    exit();
}
$config = require $configPath;
$apiKey = $config['api_key'] ?? '';

$emailContent = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #003366; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #003366; }
        .value { margin-top: 5px; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #003366; margin-top: 10px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nouvelle demande de contact - ESA</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nom complet</div>
                <div class='value'>{$prenomHtml} {$nomHtml}</div>
            </div>
            <div class='field'>
                <div class='label'>Email</div>
                <div class='value'><a href='mailto:{$emailHtml}'>{$emailHtml}</a></div>
            </div>
            <div class='field'>
                <div class='label'>Téléphone</div>
                <div class='value'>" . ($telephoneHtml ?: 'Non renseigné') . "</div>
            </div>
            <div class='field'>
                <div class='label'>Formation souhaitée</div>
                <div class='value'>" . ($formationLabelHtml ?: 'Non spécifiée') . "</div>
            </div>
            <div class='field'>
                <div class='label'>Message</div>
                <div class='message-box'>{$messageHtml}</div>
            </div>
        </div>
        <div class='footer'>
            Ce message a été envoyé depuis le formulaire de contact de esa.sn
        </div>
    </div>
</body>
</html>
";

$data = [
    'sender' => [
        'name' => 'ESA - Site Web',
        'email' => 'noreply@esa.sn'
    ],
    'to' => [
        ['email' => 'contact@esa.sn', 'name' => 'ESA Contact']
    ],
    'replyTo' => [
        'email' => $email,
        'name' => "{$prenom} {$nom}"
    ],
    'subject' => "Nouvelle demande de contact - {$prenom} {$nom}",
    'htmlContent' => $emailContent
];

$ch = curl_init('https://api.brevo.com/v3/smtp/email');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json',
    'api-key: ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    try {
        require_once __DIR__ . '/lib/stats.php';
        esa_stats_increment('contacts');
    } catch (Throwable $e) {
        error_log('[ESA stats] ' . $e->getMessage());
    }
    echo json_encode(['success' => true, 'message' => 'Email envoyé avec succès']);
} else {
    error_log("[ESA contact] Brevo request failed with HTTP status $httpCode.");
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi. Veuillez réessayer plus tard.']);
}
?>
