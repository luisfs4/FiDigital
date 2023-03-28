<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\EncuestaModel;

class Inicio extends BaseController
{

	public function index()
	{
		//Tittle de la pagina
		$data_view = [
			"ruta" => 'Inicio'
		];

		//Incluir scripts custom para esa unica vista sin afectar el include general
		$scripts_view = [
			'scripts' => [
				0 => [
					'src' => base_url('public/js/vistas/busqueda.js')
				]
			]

		];

		//Imprimir vista
		echo view('panel/base/head', $data_view) . view('panel/base/footer', $scripts_view);
	}

}