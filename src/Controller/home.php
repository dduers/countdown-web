<?php

declare(strict_types=1);

namespace Dduers\CountdownWeb\Controller;

use Dduers\CountdownWeb\Application;

final class home extends Application
{
    /**
     * common for all requests
     */
    function commonTasks()
    {
        parent::init();
        parent::setContentType('text/html');
    }

    /**
     * GET requests
     */
    function get()
    {
        self::commonTasks();
    }
}
