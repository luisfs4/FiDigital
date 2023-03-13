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
        $consulta->select("DATE_FORMAT(e.created_at, '%d/%m/%Y %h:%i %p') as created_at");
        $consulta->select("DATE_FORMAT(e.updated_at, '%d/%m/%Y %h:%i %p') as updated_at");
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

	public function get_sesiones_by_ajax($data_filtros)
	{
		$consulta = $this->db->table("sesiones as s");
		$consulta->select("s.*");

		//Búsqueda
		if (!empty($data_filtros['id_sesion'])) {
			$consulta->where('id_sesion', $data_filtros['id_sesion']);
		}
	}

	public function post_sesion($data)
	{
		$sesiones = $this->db->table("sesiones");
		$id_sesion = $data['id_sesion'];
		unset($data['id_sesion']);

		if (empty($id_sesion)) {

			$data += [
				"created_at" => date('Y-m-d H:i:s'),
				"created_by" => $this->session->id_usuario
			];

			$bandera = $sesiones->insert($data);

		} else {

			$data += [
				"updated_at" => date('Y-m-d H:i:s'),
				"updated_by" => $this->session->id_usuario
			];

			$sesiones->where('id_sesion', $id_sesion);
			$sesiones->set($data);
			$bandera = $sesiones->update();
		}

		if ($bandera) {
			return true;
		} else {
			return false;
		}
	}
}
