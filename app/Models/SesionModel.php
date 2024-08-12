<?php

namespace App\Models;

use CodeIgniter\Model;

class SesionModel extends Model
{
	protected $db;
	protected $session;

	public function __construct()
	{
		$this->db = \Config\Database::connect();
		$this->session = \Config\Services::session();
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
			->join('puntos', 'puntos.id_expediente = e.id_expediente', 'left')
			->join('proveedores as p', 'p.id_proveedor = e.id_proveedor', 'left')
			->join('cat_direcciones as cd', 'cd.id_direccion = puntos.id_direccion', 'left')
			->join('cat_programas as pg', 'pg.id_programa = puntos.id_programa', 'left')
			->join('cat_estatus as ce', 'ce.id_estatus = e.id_estatus', 'left');

		if (isset($data_filtros['id_expediente'])) {
			$consulta->where('e.id_expediente', $data_filtros['id_expediente']);
		}

		if (isset($data_filtros['id_punto'])) {
			$consulta->where('e.id_punto', $data_filtros['id_punto']);
		}

		if (isset($data_filtros['not_id_expediente'])) {
			$consulta->where('e.id_expediente !=', $data_filtros['not_id_expediente']);
		}

		if(isset($data_filtros["expedientes_relacionados"])) {
			$expedientes_relacionados = $this->db->table('expedientes')
				->select('id_sesion')
				->select('JSON_ARRAYAGG(
						JSON_OBJECT(
							"id_expediente", id_expediente, 
							"fecha_pago", fecha_pago, 
							"created_at", created_at, 
							"monto_pagado", monto_pagado)
						)
					AS expedientes_relacionados')
				->groupBy('id_sesion')
				->getCompiledSelect();
			$consulta->join("($expedientes_relacionados) AS er", "er.id_sesion = e.id_sesion");
			$consulta->select('er.expedientes_relacionados');
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

		$consulta->orderBy("numero_sesion", "DESC");
		$sesiones = $consulta->get()->getResultObject();

		foreach ($sesiones as $key => $sesion) {
			$puntos = $this->get_puntos(['id_sesion' => $sesion->id_sesion]);
			$sesiones[$key]->puntos = json_encode($puntos);
		}

		return $sesiones;
	}

	public function get_numero_sesiones($data_filtros){
			$sesion = $this->db->table("sesiones");
			$sesion->select("id_sesion");
			$sesion->select("nombre_sesion");
			$sesion->select("numero_sesion");

			$sesion->orderBy("numero_sesion", "DESC");

			if(!empty($data_filtros['id_sesion'])){
				$sesion->where('id_sesion', $data_filtros['id_sesion']);
				return $sesion->get()->getRowObject();
			}
			return $sesion->get()->getResultObject();
	}

	public function get_puntos($data_filtros)
	{
		$consulta = $this->db->table("puntos as p");
		$consulta->select("p.*");
		$consulta->select("CAST(IFNULL(p.presupuesto_autorizado,0) AS DECIMAL(10,2)) as presupuesto_autorizado", false);
		$consulta->select("CAST(p.presupuesto_autorizado - IFNULL((SELECT SUM(e.monto_pagado) 
			FROM expedientes e 
			WHERE e.id_punto = p.id_punto), 0) AS DECIMAL(10, 2)) AS monto_restante", false);
		$consulta->select("CAST(IFNULL((SELECT SUM(e.monto_pagado) 
			FROM expedientes e 
			WHERE e.id_punto = p.id_punto), 0) AS DECIMAL(10, 2)) AS pagado", false);
		$consulta->select("cd.direccion");
		$consulta->select("cp.programa");
		$consulta->select("(SELECT COUNT(*) FROM puntos as c WHERE c.padre_id = p.id_punto) as contador_hijos");
		$consulta->select("COALESCE((
								SELECT
									MAX(CAST(SUBSTRING_INDEX(c.jerarquia, '.', -1) AS UNSIGNED)) + 1
								FROM
									puntos AS c
								WHERE
									c.padre_id = p.id_punto AND LEFT(c.jerarquia, LENGTH(p.jerarquia)) = p.jerarquia
							), 1) AS siguiente_disponible");

		// Subconsultas para obtener los IDs de los niveles
		$consulta->select("p.id_punto AS id_nivel_1");
		$consulta->select("p.padre_id AS id_nivel_2");
		$consulta->select("IF(p.padre_id IS NULL, NULL, (SELECT padre_id FROM puntos WHERE id_punto = p.padre_id)) AS id_nivel_3");
		$consulta->select("IF(p.padre_id IS NULL, NULL, (SELECT padre_id FROM puntos WHERE id_punto = (SELECT padre_id FROM puntos WHERE id_punto = p.padre_id))) AS id_nivel_4");
		$consulta->select("IF(p.padre_id IS NULL, NULL, (SELECT padre_id FROM puntos WHERE id_punto = (SELECT padre_id FROM puntos WHERE id_punto = (SELECT padre_id FROM puntos WHERE id_punto = p.padre_id)))) AS id_nivel_5");

		$consulta->join("expedientes as e", 'e.id_expediente = p.id_expediente', 'left');
		$consulta->join("cat_direcciones as cd", 'cd.id_direccion = p.id_direccion', 'left');
		$consulta->join("cat_programas as cp", 'cp.id_programa = p.id_programa', 'left');

		if(!empty($data_filtros["datos_sesion"]) && $data_filtros["datos_sesion"]){
			$consulta->select("s.nombre_sesion");
			$consulta->select("s.numero_sesion");
			$consulta->select("s.tipo");
			$consulta->join("sesiones as s", 's.id_sesion = p.id_sesion', 'left');
		}

		// Búsqueda
		if (!empty($data_filtros['id_punto'])) {
			$consulta->where('p.id_punto', $data_filtros['id_punto']);
		}

		// Búsqueda
		if (!empty($data_filtros['padre_id'])) {
			$consulta->where('p.padre_id', $data_filtros['padre_id']);
		}

		// Búsqueda
		if (!empty($data_filtros['id_expediente'])) {
			$consulta->where('p.id_expediente', $data_filtros['id_expediente']);
		}

		// Excluir
		if (!empty($data_filtros['excluir'])) {
			$consulta->where('p.id_punto !=', $data_filtros['excluir']);
		}

		// Búsqueda
		if (!empty($data_filtros['id_sesion'])) {
			$consulta->where('p.id_sesion', $data_filtros['id_sesion']);
			$consulta->where("(
				LENGTH(jerarquia) - LENGTH(REPLACE(jerarquia, '.', '')) = 0 OR
				LENGTH(jerarquia) - LENGTH(REPLACE(jerarquia, '.', '')) = 1
			)");
		}

		if(!empty($data_filtros["numero_sesion"])){
			$consulta->where('s.numero_sesion', $data_filtros["numero_sesion"]);
		}

		if(!empty($data_filtros["tipo_sesion"])){
			$consulta->where('s.tipo', $data_filtros["tipo_sesion"]);
		}

		if(!empty($data_filtros["estatus"])){
			$consulta->where('IFNULL(p.estatus, "CREADO")', $data_filtros["estatus"]);
		}

		if(!empty($data_filtros["id_direccion"])){
			$consulta->where('p.id_direccion', $data_filtros["id_direccion"]);
		}

		if(!empty($data_filtros["id_programa"])){
			$consulta->where('p.id_programa', $data_filtros["id_programa"]);
		}

		if(!empty($data_filtros["search"])){
			if(is_array($data_filtros["search"])){
				if(!empty($data_filtros["search"]["value"])){
					$consulta->like('p.nombre_punto', $data_filtros["search"]["value"]);
				}
			}
			else{
				$consulta->like('p.nombre_punto', $data_filtros["search"]);
			}
		}

		$consulta->orderBy('p.jerarquia');

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

		if(isset($data_filtros["activo"])){
			$consulta->where('cd.activo', $data_filtros["activo"]);
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

		if(isset($data_filtros["activo"])){
			$consulta->where('p.activo', $data_filtros["activo"]);
		}

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

		if(!empty($data_filtros["id_direccion"])){
			$consulta->where('cp.id_direccion', $data_filtros["id_direccion"]);
		}

		if(isset($data_filtros["activo"])){
			$consulta->where('cp.activo', $data_filtros["activo"]);
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

	public function cambiar_estatus_proveedor($data){
		try {
			if(empty($data["id_proveedor"]) || !isset($data["activo"])){ 
				throw new \Exception("Faltan datos para la actualización del estatus del proveedor.");
			}

			$proveedor = $this->db->table("proveedores");
			$proveedor->where("id_proveedor", $data["id_proveedor"]);
			$proveedor->set("activo", $data["activo"] == "0" ? false : true);

			if(!$proveedor->update()){
				throw new \Exception("No se pudo actualizar el estatus del proveedor.");
			}

			$estatus = $data["activo"] == "0" ? "archivo" : "desarchivo";
			return json_encode([
				"success" => true,
				"mensaje" => "El proveedor se $estatus correctamente."
			]);

		} catch (\Throwable $th) {
			return match (ENVIRONMENT){
				'development'=> json_encode([
					"success"	=> false,
					"mensaje"	=> $th->getMessage(),
					"trace" 	=> $th->getTraceAsString(),
					"sql" 		=> $this->db->showLastQuery(),
				]),
				default => json_encode([
					"success" => false,
					"mensaje" => "Error al cambiar el estatus."
				])
			};
		}
	}

	public function post_proveedor($data)
	{
		$proveedores = $this->db->table("proveedores");

		$id_proveedor = $data['id_proveedor'] ?? null;

		$datos = [
			'tipo_persona' => $data['tipo_persona'],
			'nombre' => $data['nombre'],
			'correo' => $data['correo'],
			'telefono' => $data['telefono'],
			'nombre_fiscal' => $data['tipo_persona'] === 'moral' ? $data['nombre_fiscal'] : null,
			'nombre_comercial' => $data['tipo_persona'] === 'moral' ? $data['nombre_comercial'] : null,
			'es_agente_capacitador' => $data['es_agente_capacitador'] ?? false,
		];

		try {
			$this->db->transStart(); // Inicia la transacción

			if (empty($id_proveedor)) {
				$datos['created_by'] = $this->session->id_usuario;
				$datos['created_at'] = date('Y-m-d H:i:s');
				
				$id_proveedor = $proveedores->insert($datos, true);
				if ($id_proveedor === false) {
					throw new \Exception('No se pudieron insertar los datos básicos del proveedor.');
				}
			} else {
				$datos['updated_by'] = $this->session->id_usuario;
				$datos['updated_at'] = date('Y-m-d H:i:s');
				$proveedores->where('id_proveedor', $id_proveedor);
				if (!$proveedores->update($datos)) {
					throw new \Exception('No se pudieron actualizar los datos del proveedor.');
				}
			}

			// Procesar archivos
			$campos_archivos = [
				'acta_constitutiva',
				'boleta_registro',
				'poder_representante_legal',
				'solicitud_registro',
				'curriculum_empresarial',
				'identificacion_oficial',
				'comprobante_domicilio',
				'constancia_situacion_fiscal',
				'opinion_cumplimiento',
				'estado_cuenta_bancario',
				'documento_datos_contacto'
			];

			$proveedores->where('id_proveedor', $id_proveedor);
			$proveedor = $proveedores->get()->getRowObject();
			$datos_archivos = [];

			foreach ($campos_archivos as $key) {
				if(!empty($data["archivos"][$key])){
					$datos_archivos[$key] = $data["archivos"][$key];

					if(!is_null($proveedor->$key)){
						$ruta_archivo = FCPATH . $proveedor->$key;

						if(file_exists($ruta_archivo)){
							unlink($ruta_archivo);
						}
					}
				}
			}

			if(!empty($datos_archivos)){
				$proveedores->where('id_proveedor', $id_proveedor)->set($datos_archivos);	
				if(!$proveedores->update()){
					throw new \Exception('No se pudieron insertar los archivos del proveedor.');
				} 
			}

			$this->db->transComplete(); // Completa la transacción

			if ($this->db->transStatus() === false) {
				throw new \RuntimeException('La transacción falló.');
			}

			return $id_proveedor; // Retorna el ID del proveedor o puedes ajustar esto según tu necesidad
		} catch (\Exception $e) {
			$this->db->transRollback(); // Revertir todos los cambios si algo falla

			foreach($campos_archivos as $key){
				if(!empty($data["archivos"][$key]) && file_exists($data["archivos"][$key])){
					unlink($data["archivos"][$key]);
				}
			}

			return redirect()->back()->withInput()->with('error', 'Hubo un problema al guardar la información: ' . $e->getMessage());
		}
	}

	private function nuevo_estatus_punto($id_punto){
		$estatus = "Creado";

		$cat_estatus = [
			"1" => "Procesado",
			"2" => "Pagado",
			"3" => "Completado",
		];

		$expedientes = $this->db->table("expedientes");
		$expedientes->select("id_punto");
		$expedientes->select("MIN(id_estatus) AS menor_estatus");
		$expedientes->where("id_punto", $id_punto);
		$expedientes->groupBy("id_punto");
		$result = $expedientes->get()->getRowObject();

		if($result){ $estatus = $cat_estatus[$result->menor_estatus]; }
		return $estatus;
	}

	private function nuevo_estatus_expediente($id_expediente): ?int {
    $expediente = $this->db->table("expedientes")
                           ->where("id_expediente", $id_expediente)
                           ->get()
                           ->getRowObject();
    if (!$expediente) return null;

    if (!$this->verificar_datos_pago($expediente)) return 1;

    $nombre_archivos = ["cfdi", "verificacion", "contrato", "recepcion", "testigo", "caratula"];

    foreach ($nombre_archivos as $nombre) {
        if ($this->archivo_incompleto($expediente, $nombre)) {
					return 2;
				}
    }

    return 3;
}

private function verificar_datos_pago($expediente): bool {
    return !is_null($expediente->monto_pagado) && 
           !is_null($expediente->fecha_pago) && 
           ($expediente->na_carta_instruccion === "1" || !empty($expediente->ruta_carta_instruccion));
}

private function archivo_incompleto($expediente, string $nombre): bool {
    return $expediente->{"na_$nombre"} !== "1" && empty($expediente->{"ruta_$nombre"});
}

	public function post_expediente($data)
	{
		try {
			$this->db->transStart();

			$sesiones = $this->db->table("expedientes");

			if (isset($data['id_expediente'])) {
				$id_expediente = $data['id_expediente'];
				unset($data['id_expediente']);
			}

			$nombres_expediente = [
				"ruta_cfdi", "ruta_verificacion", "ruta_contrato", "ruta_recepcion", "ruta_testigo", 
				"ruta_caratula", "ruta_carta_instruccion",
			];
			$nombres_proveedor = [
				"opinion_cumplimiento",
				"estado_cuenta_bancario",
			];

			if(isset($data["archivos"])){
				$archivos = $data["archivos"];
				unset($data["archivos"]);
			}

			foreach (array_merge($nombres_expediente, $nombres_proveedor) as $nombre) {
				if(isset($data[$nombre])){
					unset($data[$nombre]);
				}
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

				if(!$sesiones->insert($data)) throw new \Exception("No se pudo insertar la información del expediente.");

				$id_expediente = $this->db->insertID();
			} else {

				$data += [
					"updated_at" => date('Y-m-d H:i:s'),
					"updated_by" => $this->session->id_usuario
				];

				$sesiones->where('id_expediente', $id_expediente)->set($data);
				if(!$sesiones->update()) throw new \Exception("No se pudo actualizar la información del expediente.");
			}

			$sesiones->where('id_expediente', $id_expediente);
			$expediente = $sesiones->get()->getRowObject();
			$datos_expediente = [];
			foreach ($nombres_expediente as $key) {
				if(!empty($archivos[$key])){
					$datos_expediente[$key] = $archivos[$key];

					if(!is_null($expediente->$key)){
						$ruta_archivo = FCPATH . $expediente->$key;

						if(file_exists($ruta_archivo)){
							unlink($ruta_archivo);
						}
					}
				}
			}

			if(!empty($datos_expediente)){
				$sesiones->where('id_expediente', $id_expediente)->set($datos_expediente);	
				if(!$sesiones->update()){
					throw new \Exception('No se pudieron insertar los archivos del proveedor.');
				} 
			}

			$id_estatus = $this->nuevo_estatus_expediente($id_expediente);
			$sesiones->where("id_expediente", $id_expediente);
			$sesiones->set("id_estatus", $id_estatus);
			if(!$sesiones->update()){
				throw new \Exception("No se pudo actualizar el estatus del expediente.");
			}

			$estatus_punto = $this->nuevo_estatus_punto($expediente->id_punto);
			$puntos = $this->db->table("puntos");
			$puntos->where("id_punto", $expediente->id_punto);
			$puntos->set("estatus", $estatus_punto);
			if(!$puntos->update()){
				throw new \Exception("No se pudo actualizar el estatus del punto.");
			}

			$proveedores = $this->db->table("proveedores");
			$proveedores->where("id_proveedor", $data['id_proveedor']);
			$proveedor = $proveedores->get()->getRowObject();
			$data_proveedor = [];
			foreach ($nombres_proveedor as $key) {
				if(!empty($archivos[$key])){
					$data_proveedor[$key] = $archivos[$key];
					if(!is_null($proveedor->{$key})){
						$ruta_archivo = FCPATH . $proveedor->$key;

						if(file_exists($ruta_archivo)){
							unlink($ruta_archivo);
						}
					}
				}
			}

			if(!empty($data_proveedor)){
				$data_proveedor += [
					'id_proveedor' => $data['id_proveedor'],
					'updated_at' => date('Y-m-d H:i:s'),
					'updated_by' => $this->session->id_usuario
				];
				$proveedores->where("id_proveedor", $data_proveedor["id_proveedor"]);
				$proveedores->set($data_proveedor);
				if(!$proveedores->update()) throw new \Exception("No se pudo actualizar la información del proveedor.");
			}

			$this->db->transCommit();
			return true;
		} catch (\Throwable $th) {
			$this->db->transRollback();

			foreach($nombres_expediente as $key){
				if(!empty($archivos[$key]) && file_exists($archivos[$key])){
					unlink($archivos[$key]);
				}
			}

			foreach($nombres_proveedor as $key){
				if(!empty($archivos[$key]) && file_exists($archivos[$key])){
					unlink($archivos[$key]);
				}
			}

			match(ENVIRONMENT) {
				'development' => json_encode([
					"message" => $th->getMessage(),
					"trace" => $th->getTraceAsString(),
					"sql" => $this->db->showLastQuery(),
				]),
				default => false
			};
		}
		
	}

	public function post_sesion($data)
	{
		try {
			$this->db->transBegin();

			$nombres_sesion = ["acta_comite"];

			if(isset($data["archivos"])){
				$archivos = $data["archivos"];
				unset($data["archivos"]);
			}

			foreach ($nombres_sesion as $nombre) {
				if(isset($data[$nombre])){
					unset($data[$nombre]);
				}
			}

			$sesiones = $this->db->table("sesiones");
			$id_sesion = $data['id_sesion'];
			unset($data['id_sesion']);

			if (empty($id_sesion)) {
				$data += [
					"created_at" => date('Y-m-d H:i:s'),
					"created_by" => $this->session->id_usuario,
					"estatus" => "incompleta"
				];

				if(!$sesiones->insert($data)) throw new \Exception("No se pudo insertar la información de la sesión.");
				$id_sesion = $this->db->insertID();
			} else {

				$data += [
					"updated_at" => date('Y-m-d H:i:s'),
					"updated_by" => $this->session->id_usuario
				];

				$sesiones->where('id_sesion', $id_sesion);
				$sesiones->set($data);
				if(!$sesiones->update()) throw new \Exception("No se pudo actualizar la información de la sesión.");
			}

			$sesiones->where('id_sesion', $id_sesion);
			$sesion = $sesiones->get()->getRowObject();
			$datos_sesion = [];

			foreach ($nombres_sesion as $key) {
				if(!empty($archivos[$key])){
					$datos_sesion[$key] = $archivos[$key];

					if(!is_null($sesion->$key)){
						$ruta_archivo = FCPATH . $sesion->$key;

						if(file_exists($ruta_archivo)){
							unlink($ruta_archivo);
						}
					}
				}
			}

			if(!empty($datos_sesion)){
				$sesiones->where('id_sesion', $id_sesion)->set($datos_sesion);	
				if(!$sesiones->update()){
					throw new \Exception('No se pudieron insertar los archivos de la sesion.');
				} 
			}

			$this->db->transCommit();
			return true;
		} catch (\Throwable $th) {
			//throw $th;
			$this->db->transRollback();
			if(ENVIRONMENT == 'development'){
				return json_encode([
					"message" => $th->getMessage(),
					"trace" => $th->getTraceAsString(),
					"sql" => $this->db->showLastQuery(),
				]);
			} else {
				return false;
			}
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

	public function eliminar_punto($id_punto)
	{
		// Verifica que el usuario tiene el permiso para eliminar puntos
		if (!$this->session->permisos->permiso_eliminar_puntos) {
			return ['success' => false, 'message' => 'No tienes permiso para eliminar puntos.'];
		}

		$puntos = $this->db->table("puntos");

		// Verifica si el punto tiene puntos hijos
		$puntos->where('padre_id', $id_punto);
		if ($puntos->countAllResults() > 0) {
			return ['success' => false, 'message' => 'No se puede eliminar un punto que tiene sub-puntos.'];
		}

		// Intenta eliminar el punto
		$puntos->where('id_punto', $id_punto);
		if ($puntos->delete()) {
			// Verifica que la fila fue realmente eliminada
			if ($this->db->affectedRows() > 0) {
				return ['success' => true, 'message' => 'El punto ha sido eliminado correctamente.'];
			} else {
				return ['success' => false, 'message' => 'No se encontró el punto especificado o ya fue eliminado.'];
			}
		} else {
			// Manejo de errores de base de datos o fallos en la eliminación
			return ['success' => false, 'message' => 'Error al intentar eliminar el punto.'];
		}
	}

	public function check_jerarquia($data_filtros)
	{
		$jerarquia = $data_filtros['jerarquia'];
		$id_sesion = $data_filtros['id_sesion'];
		$puntos = $this->db->table("puntos");

		$check_jerarquia = $puntos->where('jerarquia', $jerarquia)->where('id_sesion', $id_sesion)->countAllResults();

		if ($check_jerarquia > 0) {
			// Ya existe un registro con la misma jerarquía
			return ['duplicate' => true];
		} else {
			return ['duplicate' => false];
		}
	}
}
