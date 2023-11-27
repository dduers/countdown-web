<?php

declare(strict_types=1);

namespace Dduers\CountdownWeb\Controller;

use Dduers\CountdownWeb\Application;
use Dduers\CountdownWeb\Entity\CountdownEntity;

final class c extends Application
{
    private CountdownEntity $_model_countdown;

    /**
     * common for all requests
     */
    function commonTasks()
    {
        parent::init();
        $this->_model_countdown = new CountdownEntity();
    }

    /**
     * GET requests
     */
    function get()
    {
        $this->commonTasks();

        // if the data file not exists
        if (self::$_f3->get('PARAMS.id') && !$this->_model_countdown->recordExists(self::$_f3->get('PARAMS.id'))) {
            self::$_f3->error(404);
            return;
        }

        if (self::$_f3->get('AJAX'))
            self::$_f3->set('RESPONSE.mime', 'application/json');

        if (self::$_f3->get('PARAMS.id'))
            self::$_f3->set('RESPONSE.data', $this->_model_countdown->getRecordById(self::$_f3->get('PARAMS.id')));
    }

    /**
     * POST requests
     */
    function post()
    {
        $this->commonTasks();

        // create countdown, reroute to the countdown
        self::$_f3->reroute('/' . self::$_f3->get('PARAMS.page') . '/' . $this->_model_countdown->createRecord(self::$_f3->get('POST'), self::$_f3->get('FILES')));
        return;
    }
}
