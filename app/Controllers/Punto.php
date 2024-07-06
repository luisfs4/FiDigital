<?php
namespace App\Controllers;

use App\Models\PuntoModel;

class Punto extends BaseController
{
    protected $PuntoModel;
	protected $session;

    public function __construct()
    {
		$this->session = \Config\Services::session();
        $this->PuntoModel = new PuntoModel();
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
	 * @param array  array de valores para filtrar
     * @param string metodo del modelo
     * @param string nombre del modelo
	 */
	private function sendAjaxResponse($data_filtros, $method, $model="PuntoModel")
	{
		if (!$this->request->isAJAX()) {
			throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
		}

		$response = $this->$model->$method($data_filtros);
		return $this->response->setStatusCode($response ? 200 : 204)->setJSON($response);
	}

    public function get_jerarquia()
    {
        $hierarchy = $this->PuntoModel->getHierarchy($this->request->getPost('id_punto'), $this->request->getPost());
        return $this->response->setJSON($hierarchy);
    }

	public function listado()
	{
		$sesiones_controller = new Sesiones();
		// Title de la pagina
		$data_view = [
			"ruta" => "Listado de puntos",
            "seccion" => "Puntos",
			"scripts" => [
				["src" => base_url("public/js/panel/puntos/listado.js?v=" . time())],
			],

			"programas" 		=> $sesiones_controller->get_programas([]),
			"direcciones"		=> $sesiones_controller->get_direcciones([]),
			"sesiones"			=> $sesiones_controller->get_numero_sesiones([]),
		];

		// Imprimir vista
		$this->renderView(["panel/puntos/listado"], $data_view);
	}

	public function cambiar_estatus(){
		return $this->sendAjaxResponse($this->request->getPost(), "cambiar_estatus");
	}
}
