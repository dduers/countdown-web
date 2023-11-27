<?php

declare(strict_types=1);

namespace Dduers\CountdownWeb;

use Base;
use DB\jig;
use Dduers\F3App\F3App;
use Dduers\F3App\Service\DatabaseService;

/**
 * application base controller
 * @author Daniel Duersteler <daniel.duersteler@xsite.ch>
 **/
class Application extends F3App
{
    protected static Base $_f3;
    protected static jig $_db;

    /**
     * common tasks
     */
    protected static function init()
    {
        self::$_f3 = Base::instance();
        self::$_db = DatabaseService::getService();
    }

    /**
     * custom f3 framework error handler
     * @param Base $f3_ instance of the $_f3 framework
     * @return bool for error handled, false for fallback to default error handler
     */
    public static function onerror(Base $f3_)
    {
        // switch to default error handler, when it's a cli call or debugging is enabled
        if ($f3_->get('DEBUG') > 1) {
            // return false, to fallback to default error handler
            return false;
        }

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

        // return true for error handled
        return true;
    }

    /**
     * set content type header
     * @param string $mime_
     * @return void
     */
    protected static function setContentType(string $mime_): void
    {
        parent::header('Content-Type', $mime_, true);
    }

    /**
     * set content length header
     * @param int $length_
     * @return void
     */
    protected static function setContentLength(int $length_): void
    {
        parent::header('Content-Length', (string)$length_, true);
    }

    /**
     * set body data, also merge dynamically added front end control configs
     * @param array $data_
     * @return void
     */
    protected static function setContentData(array $data_ = []): void
    {
        $_data = [];
        //$_controls = self::$_frontend_controls::getControls();
        //if (count($_controls))
        //$_data = array_merge_recursive(['controls' => self::$_frontend_controls::getControls()], $data_);
        //else 
        $_data = $data_;
        parent::body($_data);
    }

    /**
     * set the content disposition header
     * @param string $filename_
     * @param string $type_ attachment | inline
     * @return void
     */
    protected static function setContentDisposition(string $filename_, string $type_ = 'attachment'): void
    {
        parent::header('Content-Disposition', $type_ . '; filename="' . $filename_ . '"', true);
    }

    /**
     * add data for template rendering, VIEWVARS.*
     * @param string|array $data_
     * @return void
     */
    protected static function addTemplateData(string|array $data_, string $prefix_ = 'VIEWVARS.'): void
    {
        self::$_f3->mset($data_, $prefix_);
    }
}
