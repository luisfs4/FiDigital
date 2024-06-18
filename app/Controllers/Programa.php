<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ProgramaModel;

class Programa extends BaseController
{
	protected $session;
	protected $ProgramaModel;

	public function __construct()
	{
		$this->session = \Config\Services::session();
		$this->ProgramaModel = new ProgramaModel();
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
			"ruta" => 'Listado de programas',
			'scripts' => [
				['src' => base_url("public/js/panel/programas/listado.js?v=" . time())]
			]
		];

		// Imprimir vista
		$this->renderView(['panel/programas/listado'], $data_view);
	}

	public function get_programas()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'get_programas');
	}

	public function post_programa()
	{
		return $this->sendAjaxResponse($this->request->getPost(), 'post_programa');
	}

}
