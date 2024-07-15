<?php

namespace App\Models;

use CodeIgniter\Model;

class PuntoModel extends Model
{
    protected $table = 'puntos';
    protected $primaryKey = 'id_punto';

    protected $returnType = 'array';
    protected $useSoftDeletes = false;

	private $session;

    protected $allowedFields = ['jerarquia', 'nombre_punto', 'observaciones', 'padre_id', 'id_expediente', 'id_sesion', 'created_at', 'created_by', 'updated_at', 'updated_by'];

	public function __construct()
	{
        parent::__construct();
		$this->session = \Config\Services::session();
	}

    public function getHierarchy($padre_id = null, $filtros = [])
    {
        return $this->getChildren($padre_id, $filtros);
    }


    private function getChildren($padre_id, $data_filtros)
    {
        $this->select("puntos.*, ce.estatus");
        $this->select("IFNULL(puntos.presupuesto_autorizado, 0) - IFNULL(puntos.presupuesto_utilizado, 0) AS monto_restante", false);
        // Agrega un campo que indica si un punto tiene hijos
        $this->select("(SELECT COUNT(*) FROM puntos as child WHERE child.padre_id = puntos.id_punto) AS tiene_hijos");

        // Búsqueda por filtros
        if (!empty($data_filtros['id_punto'])) {
            $this->where('puntos.id_punto', $data_filtros['id_punto']);
        }

        if (!empty($data_filtros['id_expediente'])) {
            $this->where('puntos.id_expediente', $data_filtros['id_expediente']);
        }

        if (!empty($data_filtros['id_sesion'])) {
            $this->where('puntos.id_sesion', $data_filtros['id_sesion']);
        }

        $this->where('padre_id', $padre_id);
        $this->orderBy('jerarquia', 'ASC');
        $this->join("expedientes as e", 'e.id_expediente = puntos.id_expediente', 'left');
        $this->join("cat_estatus as ce", 'ce.id_estatus = e.id_estatus', 'left');

        $result = $this->findAll();

        $hierarchy = [];
        foreach ($result as $row) {
            // Recursivamente obtiene hijos si los hay
            $children = $this->getChildren($row['id_punto'], $data_filtros);
            if (!empty($children)) {
                $row['children'] = $children;
            }
            $hierarchy[] = $row;
        }

        return $hierarchy;
    }

    public function get_observaciones($data_filters)
    {
        if(empty($data_filters["id_punto"])) return false;
        $puntos = $this->db->table("puntos");

        $puntos->select("id_punto");
        $puntos->select("observaciones");
        $puntos->where('id_punto', $data_filters["id_punto"]);
        return $puntos->get()->getRowObject();
    }

    public function post_observaciones($data_filters)
    {
        try {
            $this->db->transBegin();
            if(empty($data_filters["id_punto"]) || empty($data_filters["observaciones"])) {
                throw new \Exception("Faltan campos");
            }

            $data = $data_filters + [
                "updated_at" => date("Y-m-d H:i:s"), 
                "updated_by" => $this->session->get("id_usuario")
            ];

            $puntos = $this->db->table("puntos");
            $puntos->where('id_punto', $data_filters["id_punto"]);
            if(!$puntos->update($data)){
                throw new \Exception("Error al actualizar el punto");
            }
            $this->db->transCommit();

            return json_encode([
                "success"   => true,
                "message"   => "Observaciones actualizadas correctamente"
            ]);
        } catch (\Throwable $th) {
            $this->db->transRollback();

            if(env("CI_ENVIRONMENT") == "development") {
                return json_encode([
                    "success"   => false, 
                    "message"   => $th->getMessage(),
                    "trace"     => $th->getTrace(),
                    "query"     => $this->db->showLastQuery(),
                ]);
            }else{
                return json_encode([
                    "success"   => false,
                    "message"   => "Error al actualizar el punto"
                ]);
            }
        }
    }
}
