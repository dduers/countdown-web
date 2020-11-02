<?php
declare(strict_types=1);
namespace classes\controller;

class home extends \classes\cms {

    /**
     * GET requests
     */
    function get()
    { 
        // set data for carousel
        $this->setContentData(); 

        // ajax switch, when getting an ajax request over GET method
        if (self::vars('AJAX') || self::vars('GET.ajax')) {
        
            // get news for the homepage
            $_model_news = new \classes\model\fi_news();
            foreach ($_model_news->getNews('date', 'DESC') as $_r) {  
                self::$f3->push('TEMP1.news', [
                    'dismissible' => false,
                    'type' => $_r['type'],
                    'text' => '<strong>['.date('d.m.Y', strtotime($_r['date'])).'] '.$_r['name'].'</strong><br/>'.$_r['text'],
                ]); 
            }

            // set response mime type
            self::vars('RESPONSE.mime', 'application/json');

            // set response data
            self::vars('RESPONSE.data', [
                'controls' => [
                    // messages
                    'fi-news' => [
                        'ctrltype' => 'bs4messages',
                        'options' => self::vars('TEMP1.news'),
                    ],
                ],
            ]);
        }
    }

    // view data for server side rendering
    private function setContentData()
    {
        // carousel items
        self::vars('RESPONSE.data.content.carousel.items',
            array(
                array(
                    'image' => 'images/carousel-home-1.jpg',
                    'title' => self::vars('DICT.home.carousel_1_title'),
                    'subtitle' => self::vars('DICT.home.carousel_1_subtitle'),
                    'button' => self::vars('DICT.home.carousel_1_button'),
                    'href' => '/',
                ),
                array(
                    'image' => 'images/carousel-home-2.jpg',
                    'title' => self::vars('DICT.home.carousel_2_title'),
                    'subtitle' => self::vars('DICT.home.carousel_2_subtitle'),
                    'button' => self::vars('DICT.home.carousel_2_button'),
                    'href' => '/statistics',
                ),
                array(
                    'image' => 'images/carousel-home-3.jpg',
                    'title' => self::vars('DICT.home.carousel_3_title'),
                    'subtitle' => self::vars('DICT.home.carousel_3_subtitle'),
                    'button' => self::vars('DICT.home.carousel_3_button'),
                    'href' => '/help',
                ),
                array(
                    'image' => 'images/carousel-home-4.jpg',
                    'title' => self::vars('DICT.home.carousel_4_title'),
                    'subtitle' => self::vars('DICT.home.carousel_4_subtitle'),
                    'button' => self::vars('DICT.home.carousel_4_button'),
                    'href' => '/contact',
                ),
                array(
                    'image' => 'images/carousel-home-5.jpg',
                    'title' => self::vars('DICT.home.carousel_5_title'),
                    'subtitle' => self::vars('DICT.home.carousel_5_subtitle'),
                    'button' => self::vars('DICT.home.carousel_5_button'),
                    'href' => '/fishing/species',
                ),
            )
        );	 
    }
}
