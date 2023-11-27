<?php

declare(strict_types=1);

namespace Dduers\CountdownWeb;

use Base;
use DB\Jig;
use DB\Jig\Mapper;
//use Dduers\F3App\Service\CookieService;
use Dduers\F3App\Service\DatabaseService;
use Web;

/**
 * common data model methods in mappers
 */
class Repository extends Mapper
{
    protected Base $_f3;
    protected Jig $_db;
    protected Web $_web;
    //protected CookieService $_cookie;

    /**
     * constructor
     */
    public function __construct()
    {
        $this->_f3 = Base::instance();
        $this->_db = DatabaseService::getService();
        //$this->_cookie = CookieService::instance();
        parent::__construct($this->_db, static::TABLE_NAME);
    }

    /**
     * get currency by id
     * @param int $id_
     * @return array the currency record
     */
    /*
    public function getRecordById(int $id_): array
    {
        $_result = [];
        foreach ($this->find(['id = ?', $id_]) as $_r)
            $_result[] = $_r->cast();
        return $_result;
    }
    */

    /**
     * get all records
     * @return array the currency record
     */
    public function getRecords(): array
    {
        $_result = [];
        foreach ($this->find() as $_r)
            $_result[] = $_r->cast();
        return $_result;
    }

    /**
     * create a record
     * @param array $data_
     * @return int id of new record or empty string, when failed
     */
    /*
    public function createRecord(array $data_): int
    {
        $_data = $this->sanitize_data($data_);
        if (!$this->check_required($_data))
            return 0;
        $this->reset();
        $this->copyfrom($_data);
        $this->insert();
        return (int)$this->get('_id');
    }
    */

    /**
     * update a record
     * @param array $data_ data for the record
     * @param int $id_ the id of the record
     * @return bool false on error / true on success
     */
    /*
    public function updateRecord(array $data_, int $id_): bool
    {
        $_data = $this->sanitize_data($data_);
        $this->load(['id = ?', $id_]);
        if (!$this->check_required($_data) || $this->dry())
            return false;
        $this->copyfrom($_data);
        if ($this->changed())
            $this->update();
        return true;
    }
    */

    /**
     * delete a record
     * @param int $id_ id of the record
     * @return bool true on success, false on error
     */
    /*
    public function deleteRecord(int $id_): bool
    {
        $this->load(['id = ?', $id_]);
        if ($this->dry())
            return false;
        $this->erase();
        return true;
    }
    */

    /**
     * filter unused keys from a data arras
     * @param array $data_
     */
    private function sanitize_data(array $data_): array
    {
        $_result = [];
        $_result = array_filter($data_, fn ($field_) => (in_array($field_, $this->fields())), ARRAY_FILTER_USE_KEY);
        return $_result;
    }

    /**
     * check data for all required field given
     * @param array $data_
     * @return bool
     */
    /*
    private function check_required(array $data_): bool
    {
        foreach ($this->fields() as $f_)
            if (((($data_[$f_] ?? NULL) === NULL) && $this->required($f_)) && !str_starts_with($f_, 'date_') && $f_ !== 'id')
                return false;
        return true;
    }
    */
}
