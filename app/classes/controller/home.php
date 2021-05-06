<?php
declare(strict_types=1);
namespace classes\controller;

class home extends \classes\application 
{
    private $_model_countdown;

    function commonTasks()
    {
        $this->_model_countdown = new \classes\model\countdown();
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
        self::$f3->reroute('/' . $this->_model_countdown->createCountdown(self::$f3->get('POST'), self::$f3->get('FILES')));
        return;
        /*

        // sanitize posted values
        self::$f3->set('POST.title', self::$f3->clean(self::$f3->get('POST.title')));
        self::$f3->set('POST.description', self::$f3->clean(nl2br(self::$f3->clean(self::$f3->get('POST.description'))), 'br'));
        self::$f3->set('POST.url', self::$f3->clean(self::$f3->get('POST.url')));
        self::$f3->set('POST.date', self::$f3->clean(self::$f3->get('POST.date')));

        // generate record id
        $_record_id = $this->randomString();
        while (file_exists(self::$f3->get('UPLOADS').$_record_id.'.json'))
            $_record_id = $this->randomString();

        self::$f3->set('TEMP1.recordid', $_record_id);

        // if a file was given for updload
        if (file_exists(self::$f3->get('FILES.picture.tmp_name'))) {

            // flag to overwrite existing files
            $_overwrite = true;

            // upload files
            $_files = self::$wb->receive(function($file_, $formFieldName_) 
            { 
                // check filename
                $_ext = substr($file_['name'], strrpos($file_['name'], '.'));
                // if it is not an jpg file
                if ($_ext !== '.jpg') {
                    // save message for usage in template
                    self::$f3->push('SESSION.message', array(
                        'type' => 'danger',
                        'text' => self::$f3->get('DICT.nojpgfile'),					
                    ));	
                    // block fileupload
                    return false; 
                }
                // return true moves the file to the upload folder
                return true;
            }, 
            $_overwrite, 
            function($slug_)
            {
                // get extension of the file
                $_ext = substr($slug_, strrpos($slug_, '.')); 
 
                // make filename (relative to upload directory)
                self::$f3->set('TEMP1.picturefilename', self::$f3->get('UPLOADS').'../public/images/'.self::$f3->get('TEMP1.recordid').$_ext);

                // move uploaded file
                return self::$f3->get('TEMP1.picturefilename');  
            }); 

            // if file was not found
            if (!file_exists(self::$f3->get('TEMP1.picturefilename'))) {

                self::$f3->push('SESSION.message', array(
                    'type' => 'danger',
                    'text' => self::$f3->get('DICT.uploaderror'),					
                ));	

                self::$f3->reroute('/');
                return;
            }

            // resize image for usage in the shop
            $_image = new \Image(self::$f3->get('TEMP1.picturefilename'));

            // resize to width
            $_image->resize(250);

            // save the image 
            self::$f3->write(
                self::$f3->get('TEMP1.picturefilename'), 
                $_image->dump('jpeg', 100)
            );
        }

        // write json file with data
        file_put_contents(self::$f3->get('UPLOADS').$_record_id.'.json', json_encode(self::$f3->get('POST')));

        */
    }
}
