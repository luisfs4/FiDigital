<?php

namespace App\Models;

use CodeIgniter\Model;

class ProgramaModel extends Model
{
	protected $db;
	protected $session;

	public function __construct()
	{
		$this->db       = \Config\Database::connect();
		$this->session  =  \Config\Services::session();
	}

	public function get_programas($data_filtros)
	{
		$consulta = $this->db->table("cat_programas as cp");
		$consulta->select("cp.*, cd.direccion, COUNT(e.id_expediente) as expedientes_asignados");
		$consulta->join("cat_direcciones cd", "cp.id_direccion = cd.id_direccion", "inner");
		$consulta->join("expedientes e", "cp.id_programa = e.id_programa", "left");
		$consulta->groupBy("cp.id_programa");
	
		//Búsqueda
		if (!empty($data_filtros['id_programa'])) {
			$consulta->where('cp.id_programa', $data_filtros['id_programa']);
			return $consulta->get()->getRowObject();
		}
	
		return $consulta->get()->getResultObject();
	}
	
	public function post_programa($data)
	{
		$query = $this->db->table("cat_programas");

		if (isset($data['id_programa'])) {
			$id_programa = $data['id_programa'];
			unset($data['id_programa']);
		}

		if (empty($id_programa)) {

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

			$query->where('id_programa', $id_programa);
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
