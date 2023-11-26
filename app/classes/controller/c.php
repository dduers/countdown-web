<?php

declare(strict_types=1);

namespace classes\controller;

use classes\application;
use classes\model\countdown;

class c extends application
{
    private $_model_countdown;

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
        if (self::$f3->get('PARAMS.id') && !$this->_model_countdown->countdownExists(self::$f3->get('PARAMS.id'))) {
            self::$f3->error(404);
            return;
        }

        if (self::$f3->get('AJAX'))
            self::$f3->set('RESPONSE.mime', 'application/json');

        if (self::$f3->get('PARAMS.id'))
            self::$f3->set('RESPONSE.data', $this->_model_countdown->getCountdownDataAssoc(self::$f3->get('PARAMS.id')));
    }

    /**
     * POST requests
     */
    function post()
    {
        $this->commonTasks();

        // create countdown, reroute to the countdown
        self::$f3->reroute('/' . self::$f3->get('PARAMS.page') . '/' . $this->_model_countdown->createCountdown(self::$f3->get('POST'), self::$f3->get('FILES')));
        return;
    }
}
