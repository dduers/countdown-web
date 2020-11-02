<?php

/**
 * 
 * MAIN FRONTEND CONTROLLER
 * 
 */

// environment checks
if ((float)PCRE_VERSION<7.9) {
    trigger_error('PCRE version is out of date');
}

// composer autoload
require_once __DIR__."/../vendor/autoload.php";

// get fatfree base instance
$_f3 = \Base::instance();

// load configuration files
foreach (glob(__DIR__."/../app/config/*.ini") as $_inifile) {
    $_f3->config($_inifile);
}

// minifier route
$_f3->route('GET /m/@type',

    function($f3_, $args_) {

        // path to the files
        $_path = $args_['type'].'/';

        // close potential hacking attempts
        $_files = preg_replace('/(\.+\/)/','', $_GET['files']); 

        // output minified files
        echo \Web::instance()->minify($_files, null, true, $_path);
    },
    
    // caching time for minified files in seconds
    3600*24
);

// boot fatfree, listen for requests
$_f3->run();
