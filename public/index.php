<?php

declare(strict_types=1);

use Dduers\CountdownWeb\Application;

// composer autoload
require_once '../vendor/autoload.php';

// get fatfree base instance
$_app = Application::instance();
// load configuration
$_app::config();
// boot fatfree, listen for requests
$_app::run();
