<?php

declare(strict_types=1);
require_once '../vendor/autoload.php';

use Dduers\CountdownWeb\Application;

$_app = Application::instance([
    'config_allow' => true,
    'config_defaultdictionaries' => true,
]);

// addhoc add minifier route
$_app::addRoute(
    'GET /m/@type',
    function ($f3_, $args_) {
        // path to the files
        $_path = $args_['type'] . '/';
        // close potential hacking attempts
        $_files = preg_replace('/(\.+\/)/', '', $_GET['files']);
        // output minified files
        echo Web::instance()->minify($_files, null, true, $_path);
    },
    // caching time for minified files in seconds
    60 * 60 * 3
);

$_app::run();
