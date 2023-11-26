<?php

declare(strict_types=1);

namespace classes\controller;

use classes\application;
use classes\model\countdown;

final class c extends application
{
    private countdown $_model_countdown;

    /**
     * common for all methods
     */
    function commonTasks()
    {
        $this->_model_countdown = new countdown();
    }

    /**
     * GET requests
     */
    function get()
    {
        $this->commonTasks();

        // if the data file not exists
        if (self::$_f3->get('PARAMS.id') && !$this->_model_countdown->countdownExists(self::$_f3->get('PARAMS.id'))) {
            self::$_f3->error(404);
            return;
        }

        if (self::$_f3->get('AJAX'))
            self::$_f3->set('RESPONSE.mime', 'application/json');

        if (self::$_f3->get('PARAMS.id'))
            self::$_f3->set('RESPONSE.data', $this->_model_countdown->getCountdownDataAssoc(self::$_f3->get('PARAMS.id')));
    }

    /**
     * POST requests
     */
    function post()
    {
        $this->commonTasks();

        // create countdown, reroute to the countdown
        self::$_f3->reroute('/' . self::$_f3->get('PARAMS.page') . '/' . $this->_model_countdown->createCountdown(self::$_f3->get('POST'), self::$_f3->get('FILES')));
        return;
    }
}
