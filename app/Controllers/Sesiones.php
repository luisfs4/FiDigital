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
		$this->session =  \Config\Services::session();
		$this->SesionModel = new SesionModel();
	}

	private function renderView($views, $data = [])
	{
		$output = view('panel/base/head', $data);
		$output .= view('panel/base/menu', $this->session->get());

		foreach ($views as $view) {
			$output .= view($view, $data);
		}

		$output .= view('panel/base/footer', $data);
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
			"ruta" => 'Listado de sesiones',
			'scripts' => [
				0 => [
					'src' => base_url('public/js/panel/sesiones/listado.js')
				],
				1 => [
					'src' => base_url('public/js/panel/sesiones/sesiones.js')
				],
				2 => [
					'src' => base_url('public/js/panel/sesiones/puntos.js')
				]
			]
		];

		// Imprimir vista
		$this->renderView(['panel/sesiones/listado'], $data_view);
	}

	public function formulario()
	{
		// Tittle de la pagina
		$data_view = [
			"ruta" => 'Listado de sesiones',
			"direcciones" => $this->get_direcciones([]),
			"programas" => $this->get_programas([]),
			"proveedores" => $this->get_proveedores([]),
			"puntos" => $this->get_puntos([]),
			'scripts' => [
				0 => [
					'src' => base_url('public/js/panel/sesiones/formulario.js')
				],
				1 => [
					'src' => base_url('public/js/librerias/multi_step.js')
				]
			]
		];

		// Data para formulario
		$data_formulario = [
			'titulo' => 'Crear expediente',
			'Subtitulo' => '   '
		];

		// Imprimir vista
		$this->renderView(['panel/sesiones/formulario'], array_merge($data_view, $data_formulario));
	}

	public function detalle($id_expediente)
	{
		$data_view = [
			"ruta" => 'Listado de sesiones',
			'scripts' => [
				['src' => base_url('public/js/panel/sesiones/detalle.js')]
			]
		];

		$sesiones = $this->SesionModel->get_expedientes(['id_expediente' => $id_expediente]);

		if (!empty($sesiones)) {
			$data_view['expediente'] = $sesiones[0];
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}

		$this->renderView(['panel/sesiones/detalle'], $data_view);
	}

	public function guardar_pdf()
	{
		if ($this->request->isAJAX()) {
			$file = $this->request->getFile('documento');
			$response = subir_archivo(date('Ymd'), $file, 'sesiones');
			echo $response;
			return $this->response->setStatusCode($response ? 200 : 204);
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}

	public function get_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'get_sesiones');
	}

	public function cambiar_estatus()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'cambiar_estatus');
	}

	public function get_expedientes_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'get_expedientes');
	}

	public function get_direcciones_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'get_direcciones');
	}

	public function get_proveedores_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'get_proveedores');
	}

	public function get_puntos_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'get_puntos');
	}

	public function get_seguimiento_by_ajax()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'get_seguimiento');
	}

	public function agregar_proveedor()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'post_proveedor');
	}

	public function post_sesion()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'post_sesion');
	}

	public function post_expediente()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'post_expediente');
	}

	public function post_punto()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'post_punto');
	}

	public function check_jerarquia()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'check_jerarquia');
	}

	public function get_puntos($data_filtros)
	{
		return $this->sendResponse($data_filtros, 'get_puntos');
	}

	public function get_direcciones($data_filtros)
	{
		return $this->sendResponse($data_filtros, 'get_direcciones');
	}

	public function get_proveedores($data_filtros)
	{
		return $this->sendResponse($data_filtros, 'get_proveedores');
	}

	public function get_programas($data_filtros)
	{
		return $this->sendResponse($data_filtros, 'get_programas');
	}
}
