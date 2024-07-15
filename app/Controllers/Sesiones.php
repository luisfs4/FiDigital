<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\SesionModel;

class Sesiones extends BaseController
{
	protected $session;
	protected $SesionModel;

	public function __construct()
	{
		$this->session = \Config\Services::session();
		$this->SesionModel = new SesionModel();
	}

	private function renderView($views, $data = [])
	{
		$output = view("panel/base/head", $data);
		$output .= view("panel/base/menu", $this->session->get());

		foreach ($views as $view) {
			$output .= view($view, $data);
		}

		$output .= view("panel/base/footer", $data);
		echo $output;
	}

	/**
	 * Obtiene todos los resultados basado en los filtros
	 *
	 * @param data_filtros[]: array de valores para filtrar
	 */

	private function sendAjaxResponse($data_filtros, $method)
	{
		if (!$this->request->isAJAX()) {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}

		$response = $this->SesionModel->$method($data_filtros);

		return $this->response->setStatusCode($response ? 200 : 204)->setJSON($response);
	}

	public function sendResponse($data_filtros, $method)
	{
		$response = $this->SesionModel->$method($data_filtros);
		return $response ? $response : [];
	}

	public function listado()
	{
		// Title de la pagina
		$data_view = [
			"ruta" => "Listado de sesiones",
			"scripts" => [
				["src" => base_url("public/js/panel/sesiones/listado.js?v=" . time())],
				["src" => base_url("public/js/panel/sesiones/sesiones.js?v=" . time())],
				["src" => base_url("public/js/panel/sesiones/puntos.js?v=" . time())]
			],
			
			"programas" 	=> $this->get_programas([]),
			"direcciones" => $this->get_direcciones([]),
		];
		// Imprimir vista
		$this->renderView(["panel/sesiones/listado"], $data_view);
	}

	public function listado_expedientes()
	{
		// Title de la pagina
		$data_view = [
			"ruta" => "Listado de expedientes",
			"scripts" => [
				["src" => base_url("public/js/panel/sesiones/listado_expedientes.js?v=" . time())],
			]
		];

		// Imprimir vista
		$this->renderView(["panel/sesiones/expedientes"], $data_view);
	}

	public function listado_proveedores()
	{
		// Title de la pagina
		$data_view = [
			"ruta" => "Proveedores",
			"scripts" => [
				["src" => base_url("public/js/panel/proveedores/listado.js?v=" . time())],
			]
		];

		// Imprimir vista
		$this->renderView(["panel/proveedores/listado"], $data_view);
	}

	public function formulario()
	{
		// Tittle de la pagina
		$data_view = [
			"ruta" => "Listado de sesiones",
			"direcciones" => $this->get_direcciones([]),
			"programas" => $this->get_programas([]),
			"proveedores" => $this->get_proveedores(["activo" => 1]),
			"sesiones" => $this->get_sesiones([]),
			"puntos" => $this->get_puntos([]),
			"scripts" => [
				0 => [
					"src" => base_url("public/js/panel/sesiones/formulario.js?v=" . time())
				],
				1 => [
					"src" => base_url("public/js/librerias/multi_step.js?v=" . time())
				]
			]
		];

		// Data para formulario
		$data_formulario = [
			"titulo" => "Crear expediente",
			"Subtitulo" => "   "
		];

		// Imprimir vista
		$this->renderView(["panel/sesiones/formulario"], array_merge($data_view, $data_formulario));
	}

	public function detalle($id_expediente)
	{
		$data_view = [
			"ruta" => "Listado de expedientes",
			"scripts" => [
				["src" => base_url("public/js/panel/sesiones/detalle.js?v=" . time())]
			]
		];

		$sesiones = $this->SesionModel->get_expedientes(["id_expediente" => $id_expediente]);

		if (!empty($sesiones)) {
			$data_view["expediente"] = $sesiones[0];
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}

		$this->renderView(["panel/sesiones/detalle"], $data_view);
	}

	public function guardar_pdf()
	{
		if ($this->request->isAJAX()) {
			$file = $this->request->getFile("documento");
			$response = subir_archivo(date("Ymd"), $file, "sesiones");
			echo $response;
			return $this->response->setStatusCode($response ? 200 : 204);
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}

	public function eliminar_punto()
	{
		$response = $this->SesionModel->eliminar_punto($this->request->getPost('id_punto'));
		return $this->response->setStatusCode(200)->setJSON($response);
	}

	public function get_sesiones()
	{
		return $this->sendResponse($this->request->getPost(), "get_sesiones");
	}

	public function get_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "get_sesiones");
	}

	public function cambiar_estatus()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "cambiar_estatus");
	}

	public function get_expedientes_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "get_expedientes");
	}

	public function get_direcciones_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "get_direcciones");
	}

	public function get_proveedores_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "get_proveedores");
	}

	public function get_puntos_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "get_puntos");
	}

	public function get_seguimiento_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "get_seguimiento");
	}

	public function cambiar_estatus_proveedor(){
		return $this->sendAjaxResponse($this->request->getPost(), "cambiar_estatus_proveedor");
	}

	public function post_proveedor()
	{
		$archivos = []; // Para almacenar información de archivos

		// Asumiendo que tienes campos de archivo en tu formulario
		$nombresArchivos = ["acta_constitutiva", "boleta_registro", "poder_representante_legal", "solicitud_registro", "curriculum_empresarial", "identificacion_oficial", "comprobante_domicilio", "constancia_situacion_fiscal", "opinion_cumplimiento", "estado_cuenta_bancario", "documento_datos_contacto"];

		foreach ($nombresArchivos as $nombreArchivo) {
			$archivo = $this->request->getFile($nombreArchivo);
			if (isset($archivo) && $archivo->isValid() && !$archivo->hasMoved()) {
				$archivos[$nombreArchivo] = "/FiDigital/" . subir_archivo(date("Ymd"), $archivo, "proveedores");
			}
		}

		return $this->sendAjaxResponse(array_merge($this->request->getPost(), ["archivos" => $archivos]), "post_proveedor");
	}

	/**
	 * ----------------------------- Inicio Sección Seguimiento ------------------------------------
	 */

	public function post_seguimiento()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "post_seguimiento");
	}

	/**
	 * ------------------------------ Fin Sección Seguimiento ------------------------------------
	 */

	public function post_sesion()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "post_sesion");
	}

	public function post_expediente()
	{
		// return json_encode($this->request->getPost());

		$archivos = []; // Para almacenar información de archivos

		// Asumiendo que tienes campos de archivo en tu formulario
		$nombres_expediente = [
			"ruta_cfdi", "ruta_verificacion", "ruta_contrato", "ruta_recepcion", "ruta_testigo", 
			"ruta_caratula", "ruta_carta_instruccion",
		];
		foreach ($nombres_expediente as $nombre) {
			$archivo = $this->request->getFile($nombre);
			if (isset($archivo) && $archivo->isValid() && !$archivo->hasMoved()) {
				$archivos[$nombre] = "/FiDigital/" . subir_archivo(date("Ymd"), $archivo, "expedientes");
			}
		}

		$nombres_proveedor = [
			"opinion_cumplimiento",
			"estado_cuenta_bancario",
		];
		foreach ($nombres_proveedor as $nombre) {
			$archivo = $this->request->getFile($nombre);
			if (isset($archivo) && $archivo->isValid() && !$archivo->hasMoved()) {
				$archivos[$nombre] = "/FiDigital/" . subir_archivo(date("Ymd"), $archivo, "proveedores");
			}
		}

		return $this->sendAjaxResponse(array_merge($this->request->getPost(), ["archivos" => $archivos]), "post_expediente");
	}

	public function post_punto()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "post_punto");
	}

	public function check_jerarquia()
	{
		return $this->sendAjaxResponse($this->request->getPost(), "check_jerarquia");
	}

	public function get_puntos($data_filtros)
	{
		return $this->sendResponse($data_filtros, "get_puntos");
	}

	public function get_direcciones($data_filtros)
	{
		return $this->sendResponse($data_filtros, "get_direcciones");
	}

	public function get_proveedores($data_filtros)
	{
		return $this->sendResponse($data_filtros, "get_proveedores");
	}

	public function get_programas($data_filtros)
	{
		return $this->sendResponse($data_filtros, "get_programas");
	}

	public function get_numero_sesiones($data_filtros)
	{
		return $this->sendResponse($data_filtros, "get_numero_sesiones");
	}
}
