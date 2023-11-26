<?php

declare(strict_types=1);

namespace classes\controller;

use classes\application;
use classes\model\countdown;

final class backend extends application
{
    private const USERNAME = 'admin';
    private const PASSWORD = 'CyberStorm12-';

    private static countdown $_model_countdown;

    private static function commonTasks(): void
    {
        self::$_model_countdown = new countdown();
    }

    /**
     * GET requests
     */
    function get(): void
    {
        self::commonTasks();
        // if a login exists
        if (self::$_f3->get('SESSION.username') === self::USERNAME) {
            // store countdown entries for frontend
            self::$_f3->set('RESPONSE.records', self::$_model_countdown->getAllRecords());
            return;
        }
        return;
    }

    /**
     * POST requests
     */
    function post(): void
    {
        if (self::$_f3->get('POST.username') !== self::USERNAME || self::$_f3->get('POST.password') !== self::PASSWORD) {
            self::$_f3->error(403);
            return;
        }
        self::$_f3->set('SESSION.username', self::$_f3->get('POST.username'));
        //self::$_f3->set('SESSION.password', self::$_f3->get('POST.password'));
        self::$_f3->reroute('/' . self::$_f3->get('PARAMS.page'));
        return;
    }

    /**
     * DELETE requests
     */
    function delete(): void
    {
        self::commonTasks();
        self::$_f3->set('RESPONSE.mime', 'application/json');
        $_id_record = (string)self::$_f3->get('PARAMS.id');
        if ($_id_record === '') {
            self::$_f3->error(400);
            return;
        }
        if (self::$_f3->get('SESSION.username') !== self::USERNAME) {
            self::$_f3->error(403);
            return;
        }
        if (!self::$_model_countdown->countdownExists($_id_record)) {
            self::$_f3->error(404);
            return;
        }
        self::$_f3->set('RESPONSE.data', [
            'result' => self::$_model_countdown->deleteRecord($_id_record),
        ]);
        return;
    }
}
