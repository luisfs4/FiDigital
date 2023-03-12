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
				]
			]

		];

		//Imprimir vista
		echo view('panel/base/head', $data_view) . view('panel/base/menu', $this->session->get()) . view('panel/expedientes/listado') . view('panel/base/footer', $scripts_view);
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
}