<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ExpedienteModel;

class Expedientes extends BaseController
{
	protected $session;
	protected $db;
	protected $UsuarioModel;

	public function __construct()
	{
		$this->session =  \Config\Services::session();
		$this->db      = \Config\Database::connect();

		//Cargar modelos
		$this->ExpedienteModel    = new ExpedienteModel();
	}

	public function listado()
	{
		//Tittle de la pagina
		$data_view = [
			"ruta" => 'Listado de expedientes'
		];

		//Incluir scripts custom para esa unica vista sin afectar el include general
		$scripts_view = [
			'scripts' => [
				0 => [
					'src' => base_url('js/panel/expedientes/listado.js')
				],
				1 => [
					'src' => base_url('js/panel/expedientes/sesiones.js')
				],
				2 => [
					'src' => base_url('js/panel/expedientes/puntos.js')
				]
			]

		];

		//Imprimir vista
		echo view('panel/base/head', $data_view) . view('panel/base/menu', $this->session->get()) . view('panel/expedientes/listado') . view('panel/base/footer', $scripts_view);
	}

	public function formulario()
	{
		//Tittle de la pagina
		$data_view = [
			"ruta" => 'Listado de expedientes',
			"direcciones" => $this->get_direcciones([]),
			"programas" => $this->get_programas([]),
			"proveedores" => $this->get_proveedores([]),
		];

		//Incluir scripts custom para esa unica vista sin afectar el include general
		$scripts_view = [
			'scripts' => [
				0 => [
					'src' => base_url('js/panel/expedientes/formulario.js')
				],
				1 => [
					'src' => base_url('js/librerias/multi_step.js')
				]
			]

		];

		//Data para formulario
		$data_formulario = [
			'titulo' => 'Crear expediente',
			'Subtitulo' => '	'
		];

		//Imprimir vista
		echo view('panel/base/head', $data_view) . view('panel/base/menu', $this->session->get()) . view('panel/expedientes/formulario', $data_formulario) . view('panel/base/footer', $scripts_view);
	}

	public function detalle($id_expediente)
	{
		//Tittle de la pagina
		$data_view = [
			"ruta" => 'Listado de expedientes'
		];

		$expedientes = $this->ExpedienteModel->get_expedientes(['id_expediente' => $id_expediente]);

		if (!empty($expedientes)) {
			$expediente = $expedientes[0];
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}

		$data_view += [
			'expediente' => $expediente
		];

		//Incluir scripts custom para esa unica vista sin afectar el include general
		$scripts_view = [
			'scripts' => [
				0 => [
					'src' => base_url('js/panel/expedientes/detalle.js')
				]
			]

		];

		//Imprimir vista
		echo view('panel/base/head', $data_view) . view('panel/base/menu', $this->session->get()) . view('panel/expedientes/detalle') . view('panel/base/footer', $scripts_view);
	}

	public function guardar_pdf()
	{
		if ($this->request->isAJAX()) {
			$file = $this->request->getFile('documento'); //Archivos del formulario
			$response = subir_archivo(date('Ymd'), $file, 'expedientes');

			if ($response != '') {
				$this->response->setStatusCode(200);
				return $response;
			} else {
				$this->response->setStatusCode(204);
			}
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}

	/**
	 * Obtiene todos los resultados basado en los filtros
	 *
	 * @param data_filtros[]: array de valores para filtrar
	 */

	public function get_by_ajax()
	{
		if ($this->request->isAJAX()) {
			$data_filtros = $this->request->getPost();
			if ($response = $this->ExpedienteModel->get_expedientes($data_filtros)) {
				$this->response->setStatusCode(200);
				return $this->response->setJSON($response);
			} else {
				$this->response->setStatusCode(204);
			}
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}

	public function get_programas($data_filtros)
	{
		if ($response = $this->ExpedienteModel->get_programas($data_filtros)) {
			return $response;
		} else {
			return [];
		}
	}

	public function get_direcciones($data_filtros)
	{
		if ($response = $this->ExpedienteModel->get_direcciones($data_filtros)) {
			return $response;
		} else {
			return [];
		}
	}

	public function get_proveedores($data_filtros)
	{
		if ($response = $this->ExpedienteModel->get_proveedores($data_filtros)) {
			return $response;
		} else {
			return [];
		}
	}

	public function get_sesiones_by_ajax()
	{
		if ($this->request->isAJAX()) {
			$data_filtros = $this->request->getPost();
			if ($response = $this->ExpedienteModel->get_sesiones_by_ajax($data_filtros)) {
				$this->response->setStatusCode(200);
				return $this->response->setJSON($response);
			} else {
				$this->response->setStatusCode(204);
			}
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}

	public function get_puntos_by_ajax()
	{
		if ($this->request->isAJAX()) {
			$data_filtros = $this->request->getPost();
			if ($response = $this->ExpedienteModel->get_puntos($data_filtros)) {
				$this->response->setStatusCode(200);
				return $this->response->setJSON($response);
			} else {
				$this->response->setStatusCode(204);
			}
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}

	public function get_seguimiento_by_ajax()
	{
		if ($this->request->isAJAX()) {
			$data_filtros = $this->request->getPost();
			if ($response = $this->ExpedienteModel->get_seguimiento($data_filtros)) {
				$this->response->setStatusCode(200);
				return $this->response->setJSON($response);
			} else {
				$this->response->setStatusCode(204);
			}
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}

	public function post_sesion()
	{
		if ($this->request->isAJAX()) {
			$data_filtros = $this->request->getPost();
			if ($response = $this->ExpedienteModel->post_sesion($data_filtros)) {
				$this->response->setStatusCode(200);
				return $this->response->setJSON($response);
			} else {
				$this->response->setStatusCode(403);
			}
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}

	public function post_expediente()
	{
		if ($this->request->isAJAX()) {
			$data_filtros = $this->request->getPost();
			if ($response = $this->ExpedienteModel->post_expediente($data_filtros)) {
				$this->response->setStatusCode(200);
				return $this->response->setJSON($response);
			} else {
				$this->response->setStatusCode(403);
			}
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}

	public function post_punto()
	{
		if ($this->request->isAJAX()) {
			$data_filtros = $this->request->getPost();
			if ($response = $this->ExpedienteModel->post_punto($data_filtros)) {
				$this->response->setStatusCode(200);
				return $this->response->setJSON($response);
			} else {
				$this->response->setStatusCode(403);
			}
		} else {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}
	}
}
