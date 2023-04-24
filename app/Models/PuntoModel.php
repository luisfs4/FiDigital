<?php

namespace App\Models;

use CodeIgniter\Model;

class PuntoModel extends Model
{
    protected $table = 'puntos';
    protected $primaryKey = 'id_punto';

    protected $returnType = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['jerarquia', 'nombre_punto', 'observaciones', 'padre_id', 'id_expediente', 'id_sesion', 'created_at', 'created_by', 'updated_at', 'updated_by'];

    public function getHierarchy($padre_id = null, $filtros = [])
    {
        return $this->getChildren($padre_id, $filtros);
    }

    private function getChildren($padre_id, $data_filtros)
    {
        $this->select("puntos.*");
        $this->select("e.*");

        //Búsqueda
        if (!empty($data_filtros['id_punto'])) {
            $this->where('id_punto', $data_filtros['id_punto']);
        }

        //Búsqueda
        if (!empty($data_filtros['id_expediente'])) {
            $this->where('id_expediente', $data_filtros['id_expediente']);
        }

        //Búsqueda
        if (!empty($data_filtros['id_sesion'])) {
            $this->where('id_sesion', $data_filtros['id_sesion']);
        }

        $this->where('padre_id', $padre_id);
        $this->join("expedientes as e", 'e.id_expediente = puntos.id_expediente', 'left');
        $result = $this->findAll();


        $hierarchy = [];
        foreach ($result as $row) {
            $children = $this->getChildren($row['id_punto'], $data_filtros);
            if (count($children) > 0) {
                $row['children'] = $children;
            }
            $hierarchy[] = $row;
        }

        return $hierarchy;
    }
}
