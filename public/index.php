<?php
/**
 * MAIN FRONTEND CONTROLLER
 */

// composer autoload
require_once __DIR__."/../vendor/autoload.php";

// get fatfree base instance
$_f3 = \Base::instance();

// load configuration files
foreach (glob(__DIR__."/../app/config/*.ini") as $_inifile) {
    $_f3->config($_inifile);
}

// boot fatfree, listen for requests
$_f3->run();
