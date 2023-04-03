<?php

namespace App\Models;

use CodeIgniter\Model;

class SesionModel extends Model
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
		$consulta = $this->db->table("expedientes as e")
			->select('e.*')
			->select('cd.*')
			->select('p.*')
			->select('pg.*')
			->select('(SELECT COUNT(*) FROM puntos WHERE puntos.id_expediente = e.id_expediente) as contador_puntos')
			->select("DATE_FORMAT(e.created_at, '%d/%m/%Y %h:%i %p') as created_at")
			->select("DATE_FORMAT(e.updated_at, '%d/%m/%Y %h:%i %p') as updated_at")
			->select("DATE_FORMAT(COALESCE(e.updated_at, e.created_at), '%d/%m/%Y %H:%i:%s') as ultima_modificacion")
			->select('CONCAT_WS(" ", u.nombres, u.ape_paterno,  u.ape_materno) as usuario')
			->join('usuarios as u', 'u.id_usuario = e.created_by', 'left')
			->join('cat_direcciones as cd', 'cd.id_direccion = e.id_direccion', 'left')
			->join('proveedores as p', 'p.id_proveedor = e.id_proveedor', 'left')
			->join('cat_programas as pg', 'pg.id_programa = e.id_programa', 'left');

		if (isset($data_filtros['id_expediente'])) {
			$consulta->where('e.id_expediente', $data_filtros['id_expediente']);
		}

		$expedientes = $consulta->get()->getResultObject();

		foreach ($expedientes as $key => $expediente) {
			$puntos = $this->get_puntos(['id_expediente' => $expediente->id_expediente]);
			$expedientes[$key]->puntos = json_encode($puntos);
		}

		return $expedientes;
	}

	public function get_sesiones($data_filtros)
	{
		$consulta = $this->db->table("sesiones as s");
		$consulta->select("s.*");
		$consulta->select('(SELECT COUNT(*) FROM puntos WHERE puntos.id_sesion = s.id_sesion) as contador_puntos');
		$consulta->select("DATE_FORMAT(s.created_at, '%d/%m/%Y %h:%i %p') as created_at");
		$consulta->select("DATE_FORMAT(s.updated_at, '%d/%m/%Y %h:%i %p') as updated_at");
		$consulta->select("DATE_FORMAT(COALESCE(s.updated_at, s.created_at), '%d/%m/%Y %H:%i:%s') as ultima_modificacion");
		$consulta->select('CONCAT_WS(" ", u.nombres, u.ape_paterno,  u.ape_materno) as usuario');

		$consulta->join('usuarios as u', 'u.id_usuario = s.created_by', 'left');

		//Búsqueda
		if (!empty($data_filtros['id_sesion'])) {
			$consulta->where('id_sesion', $data_filtros['id_sesion']);
		}

		$sesiones = $consulta->get()->getResultObject();

		foreach ($sesiones as $key => $sesion) {
			$puntos = $this->get_puntos(['id_sesion' => $sesion->id_sesion]);
			$sesiones[$key]->puntos = json_encode($puntos);
		}

		return $sesiones;
	}

	public function get_puntos($data_filtros)
	{
		$consulta = $this->db->table("puntos as p");
		$consulta->select("p.*");

		//Búsqueda
		if (!empty($data_filtros['id_punto'])) {
			$consulta->where('id_punto', $data_filtros['id_punto']);
		}

		//Búsqueda
		if (!empty($data_filtros['id_expediente'])) {
			$consulta->where('id_expediente', $data_filtros['id_expediente']);
		}

		//Búsqueda
		if (!empty($data_filtros['id_sesion'])) {
			$consulta->where('id_sesion', $data_filtros['id_sesion']);
		}

		if (!empty($data_filtros['sin_expediente'])) {
			$consulta->where('id_expediente is null');
		}

		return $consulta->get()->getResultObject();
	}
	
    public function get_seguimiento($filtros)
    {
        $seguimientos = $this->db->table("seguimientos as s");
        $seguimientos->select("s.*");
        $seguimientos->select("s.created_by as id_usuario_msg");
        $seguimientos->select('DATE_FORMAT(s.created_at,"%d/%m/%Y %h:%i %p") as created_at');
        $seguimientos->select("concat_ws(' ', u.nombres, u.ape_paterno) as creador");
        $seguimientos->join('usuarios as u', 'ON u.id_usuario = s.created_by', 'inner');

        if (isset($filtros['id_expediente'])) {
            $seguimientos->where('s.id_expediente', $filtros['id_expediente']);
        }

        $seguimientos->orderBy('s.id_seguimiento');

        $datos = $seguimientos->get()->getResultObject();

        return $datos;
    }

	public function get_direcciones($data_filtros)
	{
		$consulta = $this->db->table("cat_direcciones as cd");
		$consulta->select("cd.*");

		//Búsqueda
		if (!empty($data_filtros['id_direccion'])) {
			$consulta->where('id_direccion', $data_filtros['id_direccion']);
		}

		return $consulta->get()->getResultObject();
	}

	public function get_proveedores($data_filtros)
	{
		$consulta = $this->db->table("proveedores as p");
		$consulta->select("p.*");

		//Búsqueda
		if (!empty($data_filtros['id_proveedor'])) {
			$consulta->where('id_proveedor', $data_filtros['id_proveedor']);
		}

		return $consulta->get()->getResultObject();
	}

	public function get_programas($data_filtros)
	{
		$consulta = $this->db->table("cat_programas as cp");
		$consulta->select("cp.*");

		//Búsqueda
		if (!empty($data_filtros['id_programa'])) {
			$consulta->where('id_programa', $data_filtros['id_programa']);
		}

		return $consulta->get()->getResultObject();
	}

	public function post_expediente($data)
	{
		$sesiones = $this->db->table("expedientes");

		if (isset($data['id_expediente'])) {
			$id_expediente = $data['id_expediente'];
			unset($data['id_expediente']);
		}

		if (empty($id_expediente)) {

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

			$sesiones->where('id_expediente', $id_expediente);
			$sesiones->set($data);
			$bandera = $sesiones->update();
		}

		if ($bandera) {
			return true;
		} else {
			return false;
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

	public function post_punto($data)
	{
		$sesiones = $this->db->table("puntos");
		$id_punto = $data['id_punto'];
		unset($data['id_punto']);

		if (empty($id_sesion)) {

			$data += [
				"created_at" => date('Y-m-d H:i:s'),
				"created_by" => $this->session->id_usuario,
				"estaus" => 'Incompleto'
			];

			$bandera = $sesiones->insert($data);
		} else {

			$data += [
				"updated_at" => date('Y-m-d H:i:s'),
				"updated_by" => $this->session->id_usuario
			];

			$sesiones->where('id_punto', $id_punto);
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
