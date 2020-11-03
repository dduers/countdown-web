<?php
declare(strict_types=1);
namespace classes\controller;

class home extends \classes\application {

    /**
     * GET requests
     */
    function get()
    {
        // if there is no countdown selected
        if (!($_record_id = self::$f3->get('PARAMS.id'))) {

            $_datetime = new \DateTime();
            $_datetime->modify('+1 day');

            self::$f3->set('RESPONSE.form.fields', [
                [
                    'name' => 'title',
                    'type' => 'text',
                    'readonly' => false,
                    'disabled' => false,
                    'required' => true,
                    'label' => 'Title',
                ],
                [
                    'name' => 'description',
                    'type' => 'textarea',
                    'readonly' => false,
                    'disabled' => false,
                    'required' => false,
                    'label' => 'Description',
                ],
                [
                    'name' => 'url',
                    'type' => 'input',
                    'readonly' => false,
                    'disabled' => false,
                    'required' => false,
                    'label' => 'Website',
                ],
                [
                    'name' => 'picture',
                    'type' => 'file',
                    'readonly' => false,
                    'disabled' => false,
                    'required' => false,
                    'label' => 'Picture',
                ],
                [
                    'name' => 'date',
                    'type' => 'text',
                    'readonly' => false,
                    'disabled' => false,
                    'required' => true,
                    'label' => 'Expiration Date',
                    'value' => $_datetime->format('Y-m-d H:i'),
                ],
                [
                    'name' => 'submit',
                    'type' => 'button',
                    'readonly' => false,
                    'disabled' => false,
                    'label' => 'Submit',
                ],
            ]);

            return;
        }

        /**
         * if a record id is given
         */

        // if the data file not exists
        if (!file_exists(self::$f3->get('UPLOADS').$_record_id.'.json')) {
            self::$f3->error(404);
            return;
        }

        if (self::$f3->get('AJAX')) {
            self::$f3->set('RESPONSE.mime', 'application/json');
        }
        
        self::$f3->set('RESPONSE.data', json_decode(file_get_contents(self::$f3->get('UPLOADS').$_record_id.'.json'), true));
    }

    /**
     * POST requests
     */
    function post() 
    {
        // sanitize posted values
        self::$f3->set('POST.title', self::$f3->clean(self::$f3->get('POST.title')));
        self::$f3->set('POST.description', nl2br(self::$f3->clean(self::$f3->get('POST.description'))));
        self::$f3->set('POST.url', self::$f3->clean(self::$f3->get('POST.url')));
        self::$f3->set('POST.date', self::$f3->clean(self::$f3->get('POST.date')));

        // generate record id
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
                if ($_ext <> '.jpg') {
                
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
                self::$f3->set('TEMP1.picturefilename',
                    '..'
                    .DIRECTORY_SEPARATOR.'public' 
                    .DIRECTORY_SEPARATOR.'images'
                    .DIRECTORY_SEPARATOR.self::$f3->get('TEMP1.recordid').$_ext
                );

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

        } else {

            self::$f3->push('SESSION.message', array(
                'type' => 'danger',
                'text' => self::$f3->get('DICT.uploaderror'),					
            ));	

            self::$f3->reroute('/');
            return;
        }

        // write json file with data
        file_put_contents(self::$f3->get('UPLOADS').$_record_id.'.json', json_encode(self::$f3->get('POST')));

        // reroute to the countdown
        self::$f3->reroute('/'.$_record_id);
    }

    /**
     * generate random string 
     * @param int $length_ length of the string
     */
    private function randomString(int $length_ = 6) : string
    {
        return substr(str_shuffle(MD5(microtime())), 0, $length_);
    }
}
