<?php

namespace App\Models;

use CodeIgniter\Model;

class UsuarioModel extends Model
{
    protected $db;
    protected $session;

    public function __construct()
    {
        $this->db       = \Config\Database::connect();
        $this->session  =  \Config\Services::session();
    }

    public function post_usuarios($data)
    {
        $usuarios = $this->db->table("usuarios");
        $data += [
            "created_at" => date('Y-m-d H:i:s'),
            "created_by" => $this->session->id_usuario
        ];

        if ($usuarios->insert($data)) {
            return true;
        } else {
            return false;
        }
    }

    public function get_by_ajax($data_filtros)
    {
        $usuarios = $this->db->table("usuarios as u");
        $usuarios->select("u.*");
        $usuarios->select("DATE_FORMAT(u.created_at, '%d/%m/%Y %h:%i %p') as created_at");
        $usuarios->select("DATE_FORMAT(u.updated_at, '%d/%m/%Y %h:%i %p') as updated_at");
        $usuarios->select("DATE_FORMAT(u.logged_at, '%d/%m/%Y %h:%i %p') as logged_at");
        $usuarios->select('CONCAT_WS(" ", u.nombres, u.ape_paterno,  u.ape_materno) as usuario');
        $usuarios->select('cd.direccion');
        $usuarios->join('cat_direcciones as cd', 'ON cd.id_direccion = u.id_direccion', 'left');

        //Búsqueda
        if (!empty($data_filtros['search'])) {
            $usuarios->Like('u.nombres', $data_filtros['search']);
            $usuarios->orLike('u.ape_paterno', $data_filtros['search']);
            $usuarios->orLike('u.ape_materno', $data_filtros['search']);
        }

        $datos = $usuarios->get()->getResultObject();

        return $datos;
    }

    public function get_direcciones($data_filtros, $orden = array())
    {
        $consulta = $this->db->table("cat_direcciones as cd");

        if (!empty($orden)) {
            foreach ($orden as $key => $value) {
                $consulta->orderBy($key, $value);
            }
        } else {
            $consulta->orderBy('cd.direccion', 'ASC');
        }

        return $consulta->get()->getResultObject();
    }


    public function get_unidades($data_filtros, $orden = array())
    {
        $consulta = $this->db->table("cat_unidades as cu");

        if (!empty($data_filtros['id_direccion'])) {
            $consulta->where('cu.id_direccion', $data_filtros['id_direccion']);
        }

        //echo $consulta->getCompiledSelect(false);

        return $consulta->get()->getResultObject();
    }
}
