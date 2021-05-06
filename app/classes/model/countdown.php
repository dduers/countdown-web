<?php
declare(strict_types=1);
namespace classes\model;

class countdown
{
    private $_f3;
    private $_web;

    function __construct()
    {
        $this->_f3 = \Base::instance();
        $this->_web = \Web::instance();
    }

    public function countdownExists(string $id_): bool
    {
        return file_exists($this->_f3->get('UPLOADS').$this->_f3->get('PARAMS.id').'.json');
    }

    public function getCountdownDataAssoc(string $id_): array
    {
        if (!$this->countdownExists($id_))
            return [];
        return json_decode(file_get_contents($this->_f3->get('UPLOADS').$this->_f3->get('PARAMS.id').'.json'), true);
    }

    public function createCountdown(array $data_, array $files_): string
    {
        // filter data by keys
        $_data = array_filter($data_, function($value_, $key_) {
            return in_array($key_, ['title', 'date', 'description', 'url', 'goodbye']);
        }, ARRAY_FILTER_USE_BOTH);

        // avoid xss attacks by normalizing and cleaning user input
        $_data['title'] = $this->_f3->clean($_data['title']);
        $_data['description'] = nl2br($this->_f3->clean($_data['description']));
        $_data['url'] = $this->_f3->clean($_data['url']);
        $_data['date'] = $this->_f3->clean($_data['date']);
        $_data['goodbye'] = $this->_f3->clean($_data['goodbye']);

        $_id_countdown = $this->createCountdownId();

        // write json file with data
        $this->_f3->write($this->_f3->get('UPLOADS').$_id_countdown.'.json', json_encode($_data));

        // if a file was uploaded
        if (file_exists($files_['picture']['tmp_name'])) {
            $_overwrite = true;

            // upload files
            $_files = $this->_web->receive(function($file_, $formFieldName_)
            { 
                $_ext = substr($file_['name'], strrpos($file_['name'], '.'));
                if ($_ext !== '.jpg')
                    return false; 
                return true;
            }, 
            $_overwrite, 
            function($slug_) use ($_id_countdown)
            {
                // get extension of the file
                $_ext = substr($slug_, strrpos($slug_, '.')); 
                return $this->_f3->get('UPLOADS').'../public/images/'.$_id_countdown.$_ext; 
            }); 

            $_filename = array_keys($_files)[0];
            if (file_exists($_filename)) {
                $_image = new \Image($_filename);
                // resize to width
                $_image->resize(250);
                $this->_f3->write($_filename, $_image->dump('jpeg', 100));
            }
        }

        return $_id_countdown;
    }

    private function createCountdownId(): string
    {
        do {
            $_result = $this->randomString();
        } while (file_exists($this->_f3->get('UPLOADS').$this->_f3->get('PARAMS.id').'.json'));
        return $_result;
    }

    private function randomString(): string
    {
        return bin2hex(random_bytes(16));
    }
}