<?php

declare(strict_types=1);

namespace Dduers\CountdownWeb\Controller;

use Dduers\CountdownWeb\Application;
use Dduers\CountdownWeb\Entity\CountdownEntity;
use Log;

final class backend extends Application
{
    private const USERNAME = 'admin';
    private const PASSWORD = 'CyberStorm12-';

    private static CountdownEntity $_model_countdown;

    /**
     * common for all requests
     * @return void
     */
    private static function commonTasks(): void
    {
        parent::init();
        self::$_model_countdown = new CountdownEntity();
        parent::setContentType('text/html');
    }

    /**
     * GET requests
     */
    function get(): void
    {
        self::commonTasks();
        // if a login exists
        if (parent::vars('SESSION.username') === self::USERNAME) {
            // store countdown entries for frontend
            parent::addTemplateData(['records' => self::$_model_countdown->getAllRecords()]);
            return;
        }
        return;
    }

    /**
     * POST requests
     */
    function post(): void
    {
        self::commonTasks();
        if (parent::vars('POST.username') !== self::USERNAME || parent::vars('POST.password') !== self::PASSWORD) {
            parent::error(403);
            return;
        }
        parent::vars('SESSION.username', parent::vars('POST.username'));
        parent::$_f3->reroute('/' . parent::vars('PARAMS.page'));
        return;
    }

    /**
     * DELETE requests
     */
    function delete(): void
    {
        self::commonTasks();
        
        $_log = new Log('log.txt');
        $_log->write((string)parent::vars('DELETE.id'));

        $_id_record = (string)parent::vars('DELETE.id');
        if ($_id_record === '') {
            parent::error(400);
            return;
        }
        if (parent::vars('SESSION.username') !== self::USERNAME) {
            parent::error(403);
            return;
        }
        if (!self::$_model_countdown->recordExists($_id_record)) {
            parent::error(404);
            return;
        }
        parent::setContentType('application/json');
        parent::setContentData(['result' => self::$_model_countdown->deleteRecord($_id_record)]);
        return;
    }
}
