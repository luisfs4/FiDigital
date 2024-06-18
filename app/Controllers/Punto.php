<?php
namespace App\Controllers;

use App\Models\PuntoModel;

class Punto extends BaseController
{
    protected $PuntoModel;

    public function __construct()
    {
        $this->PuntoModel = new PuntoModel();
    }

    public function get_jerarquia()
    {
        $hierarchy = $this->PuntoModel->getHierarchy($this->request->getPost('id_punto'), $this->request->getPost());
        return $this->response->setJSON($hierarchy);
    }
}
