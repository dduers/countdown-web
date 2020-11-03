<?php
namespace classes;
/**
*	base application class
**/
class application
{
    // instance of the f3-framework
    static protected $f3;

    //! Instantiate class
    function __construct()
    {
        // store framework instance locally
        self::$f3 = \Base::instance();
    }

    //! HTTP route pre-processor:
    // - set / init very important variables
    // - normalize uri through reroute to /language/page
    // - normalize content of variables PARAMS.page and PARAMS.lang
    // - set put parameter to PUT array
    static function beforeroute($f3)
    {
        // set language to the one detected above
        self::$f3->set('LANGUAGE', 'en');

        // set default response mime
        self::$f3->set('RESPONSE.mime', 'text/html');

        // parse put variables
        parse_str(file_get_contents("php://input"), $put_vars);

        // store put variables to global array 'PUT'
        self::$f3->set('PUT', $put_vars);
    }

    //! HTTP route post-processor
    // - output RESPONSE.data with content header RESPONSE.mime
    // - check for cli execution
    // - check for google recaptcha frontend request
    static function afterroute()
    {
        // set content type header
        header('Content-Type: '.strtolower(self::$f3->get('RESPONSE.mime')));

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
        }

        // reset flash messages
        self::$f3->set('SESSION.message', array());
    }

        /**
     * custom f3 framework error handler
     * @param \Base $f3_ instance of the f3 framework
     * @return bool for error handled, false for fallback to default error handler
     */
    public function onerror(\Base $f3_)
    {
        // switch to default error handler, when it's a cli call or debugging is enabled
        if ($f3_->get('DEBUG') >= 3) {

            // return false, to fallback to default error handler
            return (false);
        }

        // depending on the error code
        switch ($f3_->get('ERROR.code')) {

            // 403 - access denied
            // 404 - content not found
            // 405 - method not allowed
            case 403:
            case 404:
            case 405:

                // push flash message
                $f3_->push('SESSION.message', [
                    'type' => 'danger',
                    'text' => $f3_->get('ERROR.text'),
                ]);

                break;

            // 500 - internal server error
            case 500:

                // if debug is enabled
                if ($f3_->get('DEBUG')) {

                    // push flash message
                    $f3_->push('SESSION.message', [
                        'type' => 'danger',
                        'text' => $f3_->get('ERROR.text'),					
                    ]);

                // if debug is disabled
                } else {

                    // push flash message
                    $f3_->push('SESSION.message', [
                        'type' => 'danger',
                        'text' => 'Internal Server Error (500)',					
                    ]);
                }

                break;
        }

        // return true for error handled
        return (true);
    }
}
