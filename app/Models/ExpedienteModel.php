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
        $consulta->select('s.*');
        $consulta->select("DATE_FORMAT(e.created_at, '%d/%m/%Y %H:%i') as created_at");
        $consulta->select("DATE_FORMAT(e.updated_at, '%d/%m/%Y %H:%i') as updated_at");
        $consulta->select("DATE_FORMAT(COALESCE(e.updated_at, e.created_at), '%d/%m/%Y %H:%i:%s') as ultima_modificacion");
        $consulta->select('CONCAT_WS(" ", u.nombres, u.ape_paterno,  u.ape_materno) as usuario');
        $consulta->join('puntos as p', 'ON p.id_expediente = e.id_expediente', 'left');
        $consulta->join('sesiones as s', 'ON p.id_sesion = s.id_sesion', 'left');
        $consulta->join('usuarios as u', 'ON u.id_usuario = e.created_by', 'left');
        
        if(isset($data_filtros['id_expediente'])){
            $consulta->where('e.id_expediente', $data_filtros['id_expediente']);
        }

        return $consulta->get()->getResultObject();
    }

}
