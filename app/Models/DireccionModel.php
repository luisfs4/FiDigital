<?php

namespace App\Models;

use CodeIgniter\Model;

class DireccionModel extends Model
{
	protected $db;
	protected $session;

	public function __construct()
	{
		$this->db       = \Config\Database::connect();
		$this->session  =  \Config\Services::session();
	}

	public function get_direcciones($data_filtros)
	{
		$consulta = $this->db->table("cat_direcciones as cp");
		$consulta->select("cp.*");

		//Búsqueda
		if (!empty($data_filtros['id_direccion'])) {
			$consulta->where('id_direccion', $data_filtros['id_direccion']);
			return $consulta->get()->getRowObject();
		}

		return $consulta->get()->getResultObject();
	}

	public function post_direccion($data)
	{
		$query = $this->db->table("cat_direcciones");

		if (isset($data['id_direccion'])) {
			$id_direccion = $data['id_direccion'];
			unset($data['id_direccion']);
		}

		if (empty($id_direccion)) {

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

			$query->where('id_direccion', $id_direccion);
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
