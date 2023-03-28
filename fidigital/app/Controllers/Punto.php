<?php namespace App\Controllers;

use App\Models\PuntoModel;

class Punto extends BaseController
{
    public function get_jerarquia()
    {
        $puntoModel = new PuntoModel();
        $hierarchy = $puntoModel->getHierarchy($this->request->getPost('id_punto'), $this->request->getPost());

        echo json_encode($hierarchy);
        // Ahora $hierarchy contiene la jerarquía de puntos en un array multidimensional.
    }
}
