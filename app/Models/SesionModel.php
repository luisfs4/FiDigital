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
			->select('cd.*')
			->select('p.*')
			->select('pg.*')
			->select('ce.*')
			->select('(SELECT COUNT(*) FROM puntos WHERE puntos.id_expediente = e.id_expediente) as contador_puntos')
			->select("DATE_FORMAT(e.created_at, '%d/%m/%Y %h:%i %p') as created_at")
			->select("DATE_FORMAT(e.updated_at, '%d/%m/%Y %h:%i %p') as updated_at")
			->select("DATE_FORMAT(COALESCE(e.updated_at, e.created_at), '%d/%m/%Y %H:%i:%s') as ultima_modificacion")
			->select('e.*')
			->select('CONCAT_WS(" ", u.nombres, u.ape_paterno,  u.ape_materno) as usuario')
			->join('usuarios as u', 'u.id_usuario = e.created_by', 'left')
			->join('cat_direcciones as cd', 'cd.id_direccion = e.id_direccion', 'left')
			->join('proveedores as p', 'p.id_proveedor = e.id_proveedor', 'left')
			->join('cat_programas as pg', 'pg.id_programa = e.id_programa', 'left')
			->join('cat_estatus as ce', 'ce.id_estatus = e.id_estatus', 'left');

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
		$consulta->select("COALESCE((
			SELECT
				MAX(CAST(SUBSTRING_INDEX(p.jerarquia, '.', -1) AS UNSIGNED)) + 1
			FROM
				puntos AS p
			WHERE
				p.id_sesion = s.id_sesion AND LENGTH(p.jerarquia) - LENGTH(REPLACE(p.jerarquia, '.', '')) = 1
		), 1) AS siguiente_disponible");

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
        $consulta->select("p.presupuesto_autorizado - IFNULL((SELECT SUM(e.monto_autorizado) 
		FROM expedientes e 
		WHERE e.id_punto = p.id_punto), 0) AS monto_restante", false);

		$consulta->select("ce.estatus");
		$consulta->select("(SELECT COUNT(*) FROM puntos as c WHERE c.padre_id = p.id_punto) as contador_hijos");
		$consulta->select("COALESCE((
								SELECT
									MAX(CAST(SUBSTRING_INDEX(c.jerarquia, '.', -1) AS UNSIGNED)) + 1
								FROM
									puntos AS c
								WHERE
									c.padre_id = p.id_punto AND LEFT(c.jerarquia, LENGTH(p.jerarquia)) = p.jerarquia
							), 1) AS siguiente_disponible");
		$consulta->join("expedientes as e", 'e.id_expediente = p.id_expediente', 'left');
		$consulta->join("cat_estatus as ce", 'ce.id_estatus = e.id_estatus', 'left');

		//Búsqueda
		if (!empty($data_filtros['id_punto'])) {
			$consulta->where('p.id_punto', $data_filtros['id_punto']);
		}

		//Búsqueda
		if (!empty($data_filtros['padre_id'])) {
			$consulta->where('p.padre_id', $data_filtros['padre_id']);
		}

		//Búsqueda
		if (!empty($data_filtros['id_expediente'])) {
			$consulta->where('p.id_expediente', $data_filtros['id_expediente']);
		}

		//Búsqueda
		if (!empty($data_filtros['id_sesion'])) {
			$consulta->where('p.id_sesion', $data_filtros['id_sesion']);
			$consulta->where("LENGTH(jerarquia) - LENGTH(REPLACE(jerarquia, '.', '')) = 1");
		}

		//echo $consulta->getCompiledSelect();exit();
		return $consulta->get()->getResultObject();
	}


    /**
     * --------------------------------- Inicio Sección Seguimiento ----------------------------------------
     */

	 public function post_seguimiento($data_seguimiento)
	 {
		 $data_seguimiento += [
			 "created_by" => $this->session->id_usuario,
			 "created_at" => date('Y-m-d H:i:s'),
		 ];
 
		 $seguimientos = $this->db->table("seguimientos");
		 $seguimientos->set($data_seguimiento);
		 return $seguimientos->insert();
	 }
 
	 public function get_seguimiento($filtros)
	 {
		 $seguimientos = $this->db->table("seguimientos as s");
		 $seguimientos->select("s.*");
		 $seguimientos->select("s.created_by as id_usuario_msg");
		 $seguimientos->select('DATE_FORMAT(s.created_at,"%d/%m/%Y %h:%i %p") as created_at');
		 $seguimientos->select("concat_ws(' ', u.nombres, u.ape_paterno) as creador");
		 $seguimientos->join('usuarios as u', 'ON u.id_usuario = s.created_by', 'left');
 
		 if (!empty($filtros['id_expediente'])) {
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
		// Preparar la subconsulta SQL directamente como una cadena
		$subconsultaSQL = "(SELECT e.id_proveedor, COUNT(e.id_expediente) as total_expedientes FROM expedientes e GROUP BY e.id_proveedor) as exp";

		// Consulta principal
		$consulta = $this->db->table("proveedores as p")
			->select("p.*, ce.*, exp.total_expedientes") // Incluye el total de expedientes en la selección
			->join("cat_estatus ce", "p.id_estatus = ce.id_estatus", "inner")
			->join($subconsultaSQL, "p.id_proveedor = exp.id_proveedor", "left"); // Unir con la subconsulta

		// Aplicar filtros de búsqueda si existen
		if (!empty($data_filtros['id_proveedor'])) {
			$consulta->where('p.id_proveedor', $data_filtros['id_proveedor']);
		}

		// Ejecutar la consulta y retornar el resultado
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

	public function cambiar_estatus($data_filtros)
	{
		$consulta = $this->db->table("expedientes as e");

		$data_update = [
			"updated_at" => date('Y-m-d H:i:s'),
			"updated_by" => $this->session->id_usuario,
			"estatus" => $data_filtros['nuevo_estatus']
		];

		$consulta->where('id_expediente', $data_filtros['id_expediente']);
		$consulta->set($data_update);
		return $consulta->update();
	}

	public function post_proveedor($data)
	{
		$proveedores = $this->db->table("proveedores");

		if (isset($data['id_proveedor'])) {
			$id_proveedor = $data['id_proveedor'];
			unset($data['id_proveedor']);
		}

		if (empty($id_proveedor)) {

			$datos = [
				'tipo_persona' => $data['tipo_persona'],
				'nombre' => $data['nombre'],
				'correo' => $data['correo'],
				'telefono' => $data['telefono'],
				'nombre_fiscal' => $data['tipo_persona'] === 'moral' ? $data['nombre_fiscal'] : null,
				'nombre_comercial' => $data['tipo_persona'] === 'moral' ? $data['nombre_comercial'] : null,
				// Los campos de archivos se asumen que serán actualizados después, aquí los inicializamos
				'acta_constitutiva' => null,
				'boleta_registro' => null,
				'poder_representante_legal' => null,
				'solicitud_registro' => null,
				'curriculum_empresarial' => null,
				'identificacion_oficial' => null,
				'comprobante_domicilio' => null,
				'constancia_situacion_fiscal' => null,
				'opinion_cumplimiento' => null,
				'estado_cuenta_bancario' => null,
				'documento_datos_contacto' => null,
				'created_by' => $this->session->id_usuario,
				'created_at' => date('Y-m-d H:i:s'),
				// Puedes agregar más campos según sean necesarios para tu formulario y base de datos
			];

			try {

				$this->db->transStart(); // Inicia la transacción

				$id_proveedor = $proveedores->insert($datos, true);
				if ($id_proveedor === false) {
					throw new \Exception('No se pudieron insertar los datos básicos del proveedor.');
				}

				// Ruta base para guardar archivos, asegúrate de que exista y tenga permisos adecuados
				$rutaBase = WRITEPATH . 'documentos/proveedores/' . $id_proveedor;
				if (!is_dir($rutaBase)) {
					mkdir($rutaBase, 0777, true);
				}

				// Procesar cada archivo esperado
				foreach ($data['archivos'] as $nombre_archivo => $archivo) {

					var_dump($archivo);
					if ($archivo->isValid() && !$archivo->hasMoved()) {
						$nuevoNombre = $archivo->getRandomName();
						$archivo->move($rutaBase, $nuevoNombre);
						// Actualizar la base de datos con la ruta del archivo
						$proveedores->update($id_proveedor, [$archivo => 'documentos/proveedores/' . $id_proveedor . '/' . $nuevoNombre]);
					} else {
						throw new \RuntimeException('Error al mover el archivo: ' . $archivo);
					}
				}

				$this->db->transComplete(); // Completa la transacción

				if ($this->db->transStatus() === false) {
					throw new \RuntimeException('La transacción falló.');
				}

				return $id_proveedor; // Ajusta esto a tu ruta de éxito
			} catch (\Exception $e) {
				$this->db->transRollback(); // Revertir todos los cambios si algo falla
				return redirect()->back()->withInput()->with('error', 'Hubo un problema al guardar la información: ' . $e->getMessage());
			}

			$bandera = $proveedores->insert($data);
		} else {

			$data += [
				"updated_at" => date('Y-m-d H:i:s'),
				"updated_by" => $this->session->id_usuario
			];

			unset($data['archivos']);

			$proveedores->where('id_proveedor', $id_proveedor);
			$proveedores->set($data);
			$bandera = $proveedores->update();
		}

		if ($bandera) {
			return true;
		} else {
			return false;
		}
	}

	public function post_expediente($data)
	{
		$sesiones = $this->db->table("expedientes");

		if (isset($data['id_expediente'])) {
			$id_expediente = $data['id_expediente'];
			unset($data['id_expediente']);
		}

		$id_seccion = $data['id_seccion'];
		unset($data['id_seccion']);

		$id_carpeta = $data['id_carpeta'];
		unset($data['id_carpeta']);

		$id_subcarpeta = $data['id_subcarpeta'];
		unset($data['id_subcarpeta']);

		if (!empty($id_subcarpeta)) {
			$data['id_punto'] = $id_subcarpeta;
		} else if (!empty($id_carpeta)) {
			$data['id_punto'] = $id_carpeta;
		} else if (!empty($id_seccion)) {
			$data['id_punto'] = $id_seccion;
		}

		if (empty($id_expediente)) {

			$data += [
				"created_at" => date('Y-m-d H:i:s'),
				"created_by" => $this->session->id_usuario,
				"id_estatus" => 1
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
				"created_by" => $this->session->id_usuario,
				"estatus" => "incompleta"
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
		$puntos = $this->db->table("puntos");

		if (isset($data['id_punto'])) {
			$id_punto = $data['id_punto'];
			unset($data['id_punto']);
		}

		//Insertar null en lugar de 0
		if ($data['padre_id'] == '') {
			$data['padre_id'] = null;
		}

		if (empty($id_punto)) {

			$data += [
				"created_at" => date('Y-m-d H:i:s'),
				"created_by" => $this->session->id_usuario,
			];

			$bandera = $puntos->insert($data);
		} else {

			$data += [
				"updated_at" => date('Y-m-d H:i:s'),
				"updated_by" => $this->session->id_usuario
			];

			$puntos->where('id_punto', $id_punto);
			$puntos->set($data);
			$bandera = $puntos->update();
		}

		if ($bandera) {
			return true;
		} else {
			return false;
		}
	}

	public function check_jerarquia($data_filtros)
	{
		$jerarquia = $data_filtros['jerarquia'];
		$puntos = $this->db->table("puntos");

		$check_jerarquia = $puntos->where('jerarquia', $jerarquia)->countAllResults();

		if ($check_jerarquia > 0) {
			// Ya existe un registro con la misma jerarquía
			return ['duplicate' => true];
		} else {
			return ['duplicate' => false];
		}
	}
}
