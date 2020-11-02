<?php
namespace classes;
/**
*	base application class
**/
class application
{
    // instance of the f3-framework
    static protected $f3;

    // for database connection
    static protected $db;

    // for email connection
    static protected $em;

    // the logger object
    static protected $lg;

    // the web interface
    static protected $wb;

    // the geo interface
    static protected $geo;

    // the session
    static protected $ss;

    // anti csrf token to validate last post
    static protected $csrf;

    //! Instantiate class
    function __construct()
    {
        // store framework instance locally
        self::$f3 = \Base::instance();

        // store web instance locally
        self::$wb = \Web::instance();

        // store web geo interface locally
        self::$geo = \Web\Geo::instance();

        // create database connection
        self::$f3->set('DB',

            self::$db = new \DB\SQL(

                // default type is mysql
                (self::$f3->get('database.type') ? self::$f3->get('database.type') : 'mysql')

                    // default host is localhost
                    .':host='.(self::$f3->get('database.host') ? self::$f3->get('database.host') : 'localhost')

                        // default port is 3306
                        .';port='.(self::$f3->get('database.port') ? self::$f3->get('database.port') : '3306')

                            // database name
                            .';dbname='.self::$f3->get('database.data'),

                // database user
                self::$f3->get('database.user'),

                // database password
                self::$f3->get('database.pass')
            )
        );

        // create mail server connection
        self::$em = new \SMTP(

            // default hostname is localhost
            self::$f3->get('mail.host') ? self::$f3->get('mail.host') : 'localhost',

            // default port is 25
            self::$f3->get('mail.port') ? self::$f3->get('mail.port') : '25',

            // default scheme is empty, non ssl
            self::$f3->get('mail.scheme') ? self::$f3->get('mail.scheme') : '',

            // default user is empty
            self::$f3->get('mail.user') ? self::$f3->get('mail.user') : '',

            // default password is empty
            self::$f3->get('mail.pass') ? self::$f3->get('mail.pass') : ''
        );

        // init the logger object
        self::$lg = new \Log(date('Y-m-d').'.log');

        // when no language files are found
        if (!count(glob(self::$f3->get('LOCALES').'*.ini'))) {
            die ('NO_LOCALE_FILES');
        }
        
        // when called from commandline ... 
        if (self::$f3->get('CLI')) {

            // ... disable output buffering
            while (ob_get_level()) {
                ob_end_flush();
            }

            // ... turn implicit flush
            ob_implicit_flush(1);
        }
    }

    //! HTTP route pre-processor:
    // - set / init very important variables
    // - normalize uri through reroute to /language/page
    // - normalize content of variables PARAMS.page and PARAMS.lang
    // - set put parameter to PUT array
    static function beforeroute($f3)
    {
        // if empty page is set
        if (self::$f3->get('PARAMS.page') == "") {

            // try to determine page id
            self::$f3->set('PARAMS.page',

                // try set default page from config, otherwise 'home'
                self::$f3->get('frontend.website.defaultpage')
                    ? self::$f3->get('frontend.website.defaultpage')
                    : 'home'
            );

            // update full uri parameter
            self::$f3->set('PARAMS.0', '/'.self::$f3->get('PARAMS.page'));
        }

        // split uri segments to array
        $_t = array_filter(explode('/', self::$f3->get('PARAMS.0')));

        // if more than 2 segments in path
        if (count($_t) > 2) {

            // take last segment as page id
            self::$f3->set('PARAMS.page', end($_t));
        }

        // empty or language without dict
        if (self::$f3->get('PARAMS.lang') == ""
            || !file_exists(self::$f3->get('LOCALES').self::$f3->get('PARAMS.lang').'.ini')) {

            // set fallback default language
            self::$f3->set('PARAMS.lang', self::$f3->get('FALLBACK'));  

            // try to overwrite default with brower setting auto detection
            foreach (explode(',', strtolower(self::$f3->get('LANGUAGE'))) as $lang) {

                // if a language file for the language exists
                if (file_exists(self::$f3->get('LOCALES').$lang.'.ini')) {

                    // set the first language found to parameter
                    self::$f3->set('PARAMS.lang', $lang);

                    // leave language loop
                    break;
                }
            }

            // reroute to seo uri
            self::$f3->reroute('/'.self::$f3->get('PARAMS.lang').self::$f3->get('PARAMS.0'));
        }

        // set language to the one detected above
        self::$f3->set('LANGUAGE', self::$f3->get('PARAMS.lang'));

        // split uri segments to array
        $_t = array_filter(explode('/', self::$f3->get('PARAMS.0')));

        // remove the language parameter
        array_shift($_t);

        // store page path without language
        self::$f3->set('PARAMS.1', '/'.implode('/', $_t));

        // set default response mime
        self::$f3->set('RESPONSE.mime', 'text/html');

        // parse put variables
        parse_str(file_get_contents("php://input"), $put_vars);

        // store put variables to global array 'PUT'
        self::$f3->set('PUT', $put_vars);

        // set default user auth
        self::$f3->set('USER.auth', 0);

        // if the database auth table and field is given via config AND a user is logged in
        if (self::$f3->get('auth.userdata.authtable')
            && self::$f3->get('auth.userdata.authfield')
                && self::$f3->get('auth.userdata.userfield')
                    && self::$f3->get('SESSION.user')) {

            // if the user in the session is found
            if ($_r = self::$db->exec(
                array(
                    "SELECT
                        `".self::$f3->get('auth.userdata.authfield')."`
                    FROM
                        `".self::$f3->get('auth.userdata.authtable')."`
                    WHERE
                        `".self::$f3->get('auth.userdata.userfield')."` = :user"
                ),
                array(
                    array(
                        ':user' => self::$f3->get('SESSION.user'),
                    )
                )
            )) {
                // if only one user found
                if (count($_r) === 1) {

                    // store reverse binary string of user access value
                    self::$f3->set('USER.auth', strrev(decbin($_r[0][self::$f3->get('auth.userdata.authfield')])));
                }
            }
        }
    }

    //! HTTP route post-processor
    // - output RESPONSE.data with content header RESPONSE.mime
    // - check for cli execution
    // - check for google recaptcha frontend request
    static function afterroute()
    {
        // don't include after route methods for CLI execution
        if (self::$f3->get('CLI')) {
            return;
        }

        // set content type header
        header('Content-Type: '.strtolower(self::$f3->get('RESPONSE.mime')));

        // if a response filename is set
        if (self::$f3->get('RESPONSE.filename')) {

            // add content disposition header for downloading file
            header('Content-Disposition: attachment; filename="'.self::$f3->get('RESPONSE.filename').'"');
        }

        // Render template depending on result mime type 
        switch (strtolower(self::$f3->get('RESPONSE.mime'))) {

            // html output
            default:
            case 'text/html':
                // output data
                echo \Template::instance()->render('template.htm');
                break;

            // json output
            case 'application/json':
                // output the response data array as json, pretty print when in debug mode
                echo json_encode(self::$f3->get('RESPONSE.data'), (self::$f3->get('DEBUG') ? JSON_PRETTY_PRINT : NULL));
                break;

            // plain text
            case 'text/plain':
                // output plain text template
                echo \Template::instance()->render('template.txt');
                break;

            // xml
            case 'application/xml':
            case 'text/xml':
                // output xml template
                echo self::$f3->get('RESPONSE.data');
                break;

            // pdf
            case 'application/pdf':
                // write pdf data
                echo self::$f3->get('RESPONSE.data');
                break;

            // csv
            case 'text/csv':
                echo self::$f3->get('RESPONSE.data');
                break;
        }

        // reset flash messages
        self::$f3->set('SESSION.message', array());
    }
}
