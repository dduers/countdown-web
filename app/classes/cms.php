<?php
namespace classes;

/**
 * cms class
 * common methods to be available for page controllers
 */
class cms extends application
{
    /**
     * get or set framework variables
     * @param string $name_ name of the var
     * @param $value_ (optional) if set, the var is updated with the value
     * @return current or set value of var
     */
    static protected function vars(string $name_, $value_ = NULL)
    {
        // if a value was passed
        if (isset($value_)) {

            // set the value and return new content
            return (parent::$f3->set($name_, $value_));

        // if no value was passed
        } else {

            // return current content of var
            return (parent::$f3->get($name_));
        }
    }

    /**
     * write log entries
     * @param string $text_ the text to log
     * @param string $format_ (optional) r for rfc 2822 log format
     * @return result of logger write method
     */
    static protected function logs(string $text_, string $format_ = 'r'): void
    {
        // write entry to log file
        parent::$lg->write($text_, $format_);
    }

    /**
     * send an email message through smtp
     * @param array|string $to_ array of receiver email addresses or string with comma separated email addresses
     * @param string $subject_ subject of message
     * @param string $message_ either a string with the message text of a template filename
     * @param string $from_addr_ (optional) email address to set for sender
     * @param string $from_name_ (optional) name to set for sender
     * @param array $attach_ (optional) array of filenames
     * @return bool true on success, false on error
     */
    static protected function mail($to_, string $subject_, string $message_, string $from_addr_ = NULL, string $from_name_ = NULL, array $attach_ = []): bool
    { 
        // set content type and encoding of email message
        parent::$em->set('Content-type', parent::$f3->get('mail.mime').'; charset='.parent::$f3->get('ENCODING'));

        // if to is a string
        if (is_string($to_)) {

            // explode to array
            $to_ = explode(',', $to_);
        }

        // prepare receiver array
        $_toaddr = [];
        foreach ($to_ as $_x) {
            $_toaddr[] = '<'.trim($_x).'>';
        }

        // convert receiver array to string
        $_toaddr = implode(', ', $_toaddr); 

        // set mail receiver
        parent::$em->set('To', $_toaddr);

        // set mail sender, default to configuration defaults, if not set
        $from_addr_ = $from_addr_ ? $from_addr_ : self::vars('mail.defaultsender.email');
        $from_name_ = $from_name_ ? $from_name_ : self::vars('mail.defaultsender.name');
        parent::$em->set('From', '"'.$from_name_.'" '.'<'.$from_addr_.'>');

        // set message subject
        parent::$em->set('Subject', $subject_);

        // add attachments
        foreach ($attach_ as $_x) {
            parent::$em->attach($_x);
        }

        // if message is an existing template filename
        if (file_exists(parent::$f3->get('UI').'mail/'.$message_.'.htm')) {

            // send message text
            return (

                // returns TRUE or FALSE
                parent::$em->send(\Template::instance()->render('mail/'.$message_.'.htm', parent::$f3->get('mail.mime')))
            );

        // if message is not a template filename
        } else {

            // send message text
            return (

                // returns TRUE or FALSE
                parent::$em->send($message_)
            );
        }
    }

    /**
     * custom f3 framework error handler
     * @param \Base $f3_ instance of the f3 framework
     * @return bool for error handled, false for fallback to default error handler
     */
    public function onerror(\Base $f3_)
    {
        // switch to default error handler, when it's a cli call or debugging is enabled
        if ($f3_->get('CLI') || $f3_->get('DEBUG') >= 3) {

            // return false, to fallback to default error handler
            return (false);
        }

        // depending on the error code
        switch ($f3_->get('ERROR.code')) {

            // 403 - access denied
            // 404 - content not found
            // 405 - method not allowed
            case 403:
            case 404:
            case 405:

                $f3_->set('RESPONSE.data.content.carousel.items',
                    [
                        [
                            'image' => 'data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
                            'title' => $f3_->get('DICT.error.'.$f3_->get('ERROR.code').'_title'),
                            'subtitle' => $f3_->get('DICT.error.'.$f3_->get('ERROR.code').'_subtitle'),
                            'button' => $f3_->get('DICT.navigation.1'),
                            'href' => '/'.$f3_->get('PARAMS.lang').'/home',
                        ],
                    ]
                );

                // push flash message
                $f3_->push('SESSION.message', [
                    'type' => 'danger',
                    'text' => $f3_->get('ERROR.text'),
                ]);

                // set error page
                self::vars('PARAMS.page', self::vars('ERROR.code'));

                break;

            // 500 - internal server error
            case 500:

                // if debug is enabled
                if ($f3_->get('DEBUG')) {

                    // push flash message
                    $f3_->push('SESSION.message', [
                        'type' => 'danger',
                        'text' => $f3_->get('ERROR.text'),					
                    ]);

                // if debug is disabled
                } else {

                    // push flash message
                    $f3_->push('SESSION.message', [
                        'type' => 'danger',
                        'text' => 'Internal Server Error (500)',					
                    ]);
                }

                break;
        }

        // return true for error handled
        return (true);
    }
}
