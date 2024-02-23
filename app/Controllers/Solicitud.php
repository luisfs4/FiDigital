<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\SolicitudModel;
use App\Models\SesionModel;

class Solicitud extends BaseController
{
	protected $session;
	protected $ProgramaModel;
	protected $SesionModel;

	public function __construct()
	{
		$this->session =  \Config\Services::session();
		$this->ProgramaModel = new SolicitudModel();
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

		$response = $this->ProgramaModel->$method($data_filtros);

		return $this->response->setStatusCode($response ? 200 : 204)->setJSON($response);
	}

	public function sendResponse($data_filtros, $method)
	{
		$response = $this->ProgramaModel->$method($data_filtros);
		return $response ? $response : [];
	}

	public function listado()
	{
		// Title de la pagina
		$data_view = [
			"ruta" => 'Solicitudes',
			'scripts' => [
				['src' => base_url('public/js/panel/solicitudes/listado.js')]
			]
		];

		// Imprimir vista
		$this->renderView(['panel/solicitudes/listado'], $data_view);
	}

	public function get_solicitudes()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'get_solicitudes');
	}

	public function post_solicitud()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'post_solicitud');
	}

	public function formulario()
	{
		// Tittle de la pagina
		$data_view = [
			"ruta" => 'Solicitudes',
			"direcciones" => $this->SesionModel->get_direcciones([]),
			"programas" => $this->SesionModel->get_programas([]),
			"sesiones" => $this->SesionModel->get_sesiones([]),
			"proveedores" => $this->SesionModel->get_proveedores([]),
			'scripts' => [
				0 => [
					'src' => base_url('public/js/panel/solicitudes/formulario.js')
				],
				1 => [
					'src' => base_url('public/js/librerias/multi_step.js')
				]
			]
		];

		// Data para formulario
		$data_formulario = [
			'titulo' => 'Nueva solicitud',
			'Subtitulo' => '   '
		];

		// Imprimir vista
		$this->renderView(['panel/solicitudes/formulario'], array_merge($data_view, $data_formulario));
	}
}
