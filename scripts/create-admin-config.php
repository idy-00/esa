<?php
// Génère config/admin.php (secret + compte administrateur initial).
// Usage : php scripts/create-admin-config.php <email> "<Nom>" <mot-de-passe> [fichier-de-sortie]
// Le fichier généré ne doit jamais être commité : il est envoyé une seule fois sur le serveur.

if ($argc < 4) {
    fwrite(STDERR, "Usage : php scripts/create-admin-config.php <email> \"<Nom>\" <mot-de-passe> [sortie]\n");
    exit(1);
}

[, $email, $name, $password] = $argv;
$out = $argv[4] ?? 'config-admin.local.php';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 10) {
    fwrite(STDERR, "Email invalide ou mot de passe trop court (10 caractères minimum).\n");
    exit(1);
}

$config = [
    'secret' => bin2hex(random_bytes(32)),
    'bootstrap_user' => [
        'email' => strtolower($email),
        'name' => $name,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ],
];

file_put_contents($out, "<?php\nreturn " . var_export($config, true) . ";\n");
echo "Configuration écrite dans $out\n";
