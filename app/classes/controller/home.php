<?php
declare(strict_types=1);
namespace classes\controller;

class home extends \classes\cms {

    /**
     * GET requests
     */
    function get()
    {
        // ajax switch, when getting an ajax request over GET method
        if (self::vars('AJAX')) {

        }
    }
}
