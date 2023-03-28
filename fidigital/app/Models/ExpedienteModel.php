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
        $consulta->select('cd.*');
        $consulta->select('p.*');
        $consulta->select('pg.*');
        $consulta->select('(SELECT COUNT(*) FROM puntos WHERE puntos.id_expediente = e.id_expediente) as contador_puntos');
        $consulta->select("DATE_FORMAT(e.created_at, '%d/%m/%Y %h:%i %p') as created_at");
        $consulta->select("DATE_FORMAT(e.updated_at, '%d/%m/%Y %h:%i %p') as updated_at");
        $consulta->select("DATE_FORMAT(COALESCE(e.updated_at, e.created_at), '%d/%m/%Y %H:%i:%s') as ultima_modificacion");
        $consulta->select('CONCAT_WS(" ", u.nombres, u.ape_paterno,  u.ape_materno) as usuario');
        $consulta->join('usuarios as u', 'ON u.id_usuario = e.created_by', 'left');
        $consulta->join('cat_direcciones as cd', 'ON cd.id_direccion = e.id_direccion', 'left');
        $consulta->join('proveedores as p', 'ON p.id_proveedor = e.id_proveedor', 'left');
        $consulta->join('cat_programas as pg', 'ON pg.id_programa = e.id_programa', 'left');
        
        if(isset($data_filtros['id_expediente'])){
            $consulta->where('e.id_expediente', $data_filtros['id_expediente']);
        }

        $expedientes = $consulta->get()->getResultObject();

        foreach ($expedientes as $key => $expediente) {
            $puntos = $this->get_puntos(['id_expediente' => $expediente->id_expediente]);
            $expedientes[$key]->puntos = json_encode($puntos);
        }

        return $expedientes;
    }

	public function get_sesiones_by_ajax($data_filtros)
	{
		$consulta = $this->db->table("sesiones as s");
		$consulta->select("s.*");

		//Búsqueda
		if (!empty($data_filtros['id_sesion'])) {
			$consulta->where('id_sesion', $data_filtros['id_sesion']);
		}

        return $consulta->get()->getResultObject();
	}

	public function get_puntos($data_filtros)
	{
		$consulta = $this->db->table("puntos as p");
		$consulta->select("p.*");

		//Búsqueda
		if (!empty($data_filtros['id_punto'])) {
			$consulta->where('id_punto', $data_filtros['id_punto']);
		}

        return $consulta->get()->getResultObject();
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

        if(isset($data['id_expediente'])){
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
