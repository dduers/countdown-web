<?php

declare(strict_types=1);

namespace Dduers\CountdownWeb\Controller;

use Dduers\CountdownWeb\Application;
use Dduers\CountdownWeb\Entity\CountdownEntity;

final class c extends Application
{
    private static CountdownEntity $_model_countdown;

    /**
     * common for all requests
     */
    private static function commonTasks()
    {
        parent::init();
        self::$_model_countdown = new CountdownEntity();
        parent::setContentType('text/html');
    }

    private static function ajaxResponse(): void
    {
        if (!parent::vars('AJAX'))
            return;
        parent::setContentType('application/json');
        if (self::vars('PARAMS.id'))
            parent::body(self::$_model_countdown->getRecordById(self::vars('PARAMS.id')));
    }

    /**
     * GET requests
     */
    function get()
    {
        self::commonTasks();
        // if the data file not exists
        if (parent::vars('PARAMS.id') && !self::$_model_countdown->recordExists(self::vars('PARAMS.id'))) {
            parent::error(404);
            return;
        }
        parent::addTemplateData(['data' => self::$_model_countdown->getRecordById(self::vars('PARAMS.id'))]);
        self::ajaxResponse();
        return;
    }

    /**
     * POST requests
     */
    function post()
    {
        self::commonTasks();
        // create countdown, reroute to the countdown
        parent::$_f3->reroute('/' . parent::vars('PARAMS.page') . '/' . self::$_model_countdown->createRecord(parent::vars('POST')));
        return;
    }
}
