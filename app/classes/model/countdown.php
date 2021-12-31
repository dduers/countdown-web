<?php
declare(strict_types=1);
namespace classes\model;

class countdown extends \DB\Jig\Mapper
{
    private $_f3;
    private $_web;

    public function __construct() {

        // load database
        parent::__construct(\Base::instance()->get('DB'), 'countdown.json');

        // fatfree class instances
        $this->_f3 = \Base::instance();
        $this->_web = \Web::instance();
    }

    /**
     * check if the countdown exists by id
     * @param string $id_ id of the countdown
     * @return bool true for exists, false for not exists
     */
    public function countdownExists(string $id_): bool
    {
        $this->load(['@_id = ?', $id_]);
        return !$this->dry();
    }

    /**
     * get countdown data as assoc array by countdown id
     * @param string $id_ id of the countdown
     * @return array countdown data as assoc array
     */
    public function getCountdownDataAssoc(string $id_): array
    {
        $this->load(['@_id = ?', $id_]);
        if ($this->dry())
            return [];
        return $this->cast();
    }

    /**
     * create a new countdown record
     * @param array $data_ the user data
     * @param array $files_ the picture files to upload
     * @return string id of the new record
     */
    public function createCountdown(array $data_, array $files_): string
    {
        // only allow certain keys in user data
        $_data = array_filter($data_, function($value_, $key_) {
            return in_array($key_, ['title', 'date', 'description', 'url', 'goodbye']);
        }, ARRAY_FILTER_USE_BOTH);

        // avoid xss attacks by normalizing and cleaning user input
        $_data['title'] = $this->_f3->clean($_data['title'] ?? '');
        $_data['description'] = nl2br($this->_f3->clean($_data['description'] ?? ''));
        $_data['url'] = $this->_f3->clean($_data['url'] ?? '');
        $_data['date'] = $this->_f3->clean($_data['date'] ?? '');
        $_data['goodbye'] = $this->_f3->clean($_data['goodbye'] ?? '');

        // insert new record from user data
        $this->copyfrom($_data);
        $this->insert();

        // get countdown id 
        $_id_countdown = (string)$this->get('_id');

        // overwrite existing files
        $_overwrite = true;

        // upload picture files
        $_files = $this->_web->receive(function($file_, $formFieldName_)
        { 
            if ($file_['type'] !== 'image/jpeg')
                return false; 
            return true;
        }, 
        // overwrite existing files
        $_overwrite, 
        // create path and filename for upload
        function($slug_) use ($_id_countdown)
        {
            return $this->_f3->get('UPLOADS').'../public/images/c/'.$_id_countdown.'.jpg'; 
        }); 

        $_filename = array_keys($_files)[0];
        if ($_filename && file_exists($_filename)) {
            $_image = new \Image($_filename);
            // resize to width
            $_image->resize(250);
            $this->_f3->write($_filename, $_image->dump('jpeg', 100));
        }

        // return the id of the new record
        return $_id_countdown;
    }
}
