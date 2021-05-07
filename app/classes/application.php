<?php
declare(strict_types=1);
namespace classes;
/**
*	base application class
**/
class application extends \Prefab
{
    // instance of the f3-framework
    static protected $f3;
    // web class
    static protected $web;
    // jig database
    static protected $jig;

    /**
     * constructor
     */
    function __construct()
    {
        // store framework instance locally
        self::$f3 = \Base::instance();
        // store fwebclass instance
        self::$web = \Web::instance();
        // jig database
        self::$f3->set('DB', self::$jig = new \DB\Jig(self::$f3->get('jig.root'), \DB\Jig::FORMAT_JSON));
    }

    /**
     * http route preprocessor
     * @param \Base $f3_ fatfree framework instance
     */
    public static function beforeroute(\Base $f3_)
    {
        // set language to the one detected above
        $f3_->set('LANGUAGE', 'en');
        // set default response mime
        $f3_->set('RESPONSE.mime', 'text/html');
        // set default page
        if (!$f3_->get('PARAMS.page'))
            $f3_->set('PARAMS.page', 'home');
    }

    //! HTTP route post-processor
    // - output RESPONSE.data with content header RESPONSE.mime
    // - check for cli execution
    // - check for google recaptcha frontend request
    public static function afterroute(\Base $f3_)
    {
        // set content type header
        header('Content-Type: '.strtolower(self::$f3->get('RESPONSE.mime')));
        // Render template depending on result mime type 
        switch (strtolower($f3_->get('RESPONSE.mime'))) {
            // html output
            default:
            case 'text/html':
                // output data
                echo \Template::instance()->render('template.htm');
                break;
            // json output
            case 'application/json':
                // output the response data array as json, pretty print when in debug mode
                echo json_encode($f3_->get('RESPONSE.data'), ($f3_->get('DEBUG') ? JSON_PRETTY_PRINT : 0));
                break;
        }
        // reset flash messages
        $f3_->set('SESSION.message', []);
    }

        /**
     * custom f3 framework error handler
     * @param \Base $f3_ instance of the f3 framework
     * @return bool for error handled, false for fallback to default error handler
     */
    public static function onerror(\Base $f3_)
    {
        // switch to default error handler, when it's a cli call or debugging is enabled
        if ($f3_->get('DEBUG') > 0) {
            // return false, to fallback to default error handler
            return false;
        }

        // depending on the error code
        switch ($f3_->get('ERROR.code')) {

            // 403 - access denied
            // 404 - content not found
            // 405 - method not allowed
            case 400:
            case 401:
            case 403:
            case 404:
            case 405:
                $f3_->push('SESSION.message', [
                    'type' => 'danger',
                    'text' => $f3_->get('ERROR.text'),
                ]);
                break;
            // 500 - internal server error
            case 500:
                // if debug is enabled
                if ($f3_->get('DEBUG')) {
                    $f3_->push('SESSION.message', [
                        'type' => 'danger',
                        'text' => $f3_->get('ERROR.text'),					
                    ]);
                // if debug is disabled
                } else {
                    $f3_->push('SESSION.message', [
                        'type' => 'danger',
                        'text' => 'Internal Server Error (500)',					
                    ]);
                }
                break;
        }

        // return true for error handled
        return true;
    }
}
