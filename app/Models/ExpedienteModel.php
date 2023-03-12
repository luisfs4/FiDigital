<?php

namespace App\Models;

use CodeIgniter\Model;

class ExpedienteModel extends Model
{
    protected $db;
    protected $session;

    public function __construct()
    {
        $this->db       = \Config\Database::connect();
        $this->session  =  \Config\Services::session();
    }
    
    public function get_expedientes($data_filtros)
    {
        $consulta = $this->db->table("expedientes as e");
        $consulta->select('e.*');
        $consulta->select('p.*');
        $consulta->join('puntos as p', 'ON p.id_expediente = e.id_expediente');
        
        if(isset($data_filtros['id_expediente'])){
            $consulta->where('e.id_expediente', $data_filtros['id_expediente']);
        }

        return $consulta->get()->getResultObject();
    }

}
