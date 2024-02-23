<?php

namespace App\Models;

use CodeIgniter\Model;

class SolicitudModel extends Model
{
	protected $db;
	protected $session;

	public function __construct()
	{
		$this->db       = \Config\Database::connect();
		$this->session  =  \Config\Services::session();
	}

	public function get_solicitudes($data_filtros)
	{
		$consulta = $this->db->table("solicitudes as s");
		$consulta->select("cd.direccion, cp.programa, p.*");
		$consulta->select("s.*");
		$consulta->join("cat_direcciones cd", "s.id_direccion = cd.id_direccion", "inner");
		$consulta->join("cat_programas cp", "s.id_programa = cp.id_programa", "inner");
		$consulta->join("proveedores p", "s.id_proveedor = p.id_proveedor", "inner");
	
		//Búsqueda
		if (!empty($data_filtros['id_programa'])) {
			$consulta->where('cp.id_programa', $data_filtros['id_programa']);
			return $consulta->get()->getRowObject();
		}

		if (!empty($data_filtros['id_solicitud'])) {
			$consulta->where('s.id_solicitud', $data_filtros['id_solicitud']);
			return $consulta->get()->getRowObject();
		}

		if (!empty($data_filtros['id_sesion'])) {
			$consulta->where('s.id_sesion', $data_filtros['id_sesion']);
		}
	
		return $consulta->get()->getResultObject();
	}
	
	public function post_solicitud($data)
	{
		$data['admision_prevencion'] = $data['admision_prevencion'] == 'on' ? 1 : 0;
		
		$query = $this->db->table("solicitudes");

		if (isset($data['id_solicitud'])) {
			$id_solicitud = $data['id_solicitud'];
			unset($data['id_solicitud']);
		}

		if (empty($id_solicitud)) {

			$data += [
				"created_at" => date('Y-m-d H:i:s'),
				"created_by" => $this->session->id_usuario
			];

			$bandera = $query->insert($data);
		} else {

			$data += [
				"updated_at" => date('Y-m-d H:i:s'),
				"updated_by" => $this->session->id_usuario
			];

			$query->where('id_solicitud', $id_solicitud);
			$query->set($data);
			$bandera = $query->update();
		}

		if ($bandera) {
			return true;
		} else {
			return false;
		}
	}

}
