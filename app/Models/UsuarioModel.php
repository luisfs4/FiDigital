<?php

namespace App\Models;

use CodeIgniter\Model;

class UsuarioModel extends Model
{
    protected $db;
    protected $session;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->session = \Config\Services::session();
    }

    public function post_usuarios($data)
    {
        $usuarios = $this->db->table("usuarios");
        $data += [
            "created_at" => date('Y-m-d H:i:s'),
            "created_by" => $this->session->id_usuario ?? '',
            "estatus" => 'activo'
        ];

        if ($usuarios->insert($data)) {
            $id_usuario = $this->db->insertID();
            $this->db->table("permisos")->insert(['id_usuario' => $id_usuario]);

            return true;
        } else {
            return false;
        }
    }

    public function get_by_ajax($data_filtros)
    {
        $usuarios = $this->db->table("usuarios as u");
        $usuarios->select("u.*")
            ->select("DATE_FORMAT(u.created_at, '%d/%m/%Y %h:%i %p') as created_at")
            ->select("DATE_FORMAT(u.updated_at, '%d/%m/%Y %h:%i %p') as updated_at")
            ->select("DATE_FORMAT(u.logged_at, '%d/%m/%Y %h:%i %p') as logged_at")
            ->select('CONCAT_WS(" ", u.nombres, u.ape_paterno,  u.ape_materno) as nombre_usuario');

        //Búsqueda
        if (!empty($data_filtros['search'])) {
            $usuarios->Like('u.nombres', $data_filtros['search']);
            $usuarios->orLike('u.ape_paterno', $data_filtros['search']);
            $usuarios->orLike('u.ape_materno', $data_filtros['search']);
        }

        $datos = $usuarios->get()->getResultArray();

        foreach ($datos as $key => $usuario) {
            $datos[$key]['permisos'] = $this->get_permisos(['id_usuario' => $usuario['id_usuario']]);
        }

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

    public function get_permisos($data)
    {
        $consulta = $this->db->table("permisos as up");

        if (!empty($data['id_usuario'])) {
            $consulta->where('up.id_usuario', $data['id_usuario']);
            $permisos = $consulta->get()->getRowArray();

            unset($permisos['id_permiso']);
            unset($permisos['id_usuario']);

            return (object) $permisos;
        }

        if (!empty($data['id_usuario'])) {
            $consulta->where('up.id_usuario', $data['id_usuario']);

            $permisos = $consulta->get()->getRowArray();

            unset($permisos['id_permiso']);
            unset($permisos['id_usuario']);

            return (object) $permisos;
        } else {
            return [];
        }

        return $consulta->get()->getResultObject();
    }

    public function update_permisos($data)
    {
        if (empty($data['id_usuario'])) {
            return false; // No se puede actualizar sin un id_usuario
        }

        // Asumiendo que todos los datos excepto 'id_usuario' son permisos
        $permisos = $data['permisos'];
        unset($permisos['id_usuario']); // Eliminar 'id_usuario' de los datos de permisos

        $consulta = $this->db->table("permisos");

        // Actualizar la tabla permisos
        $consulta->where('id_usuario', $data['id_usuario']);
        $consulta->set($permisos);

        return $consulta->update();
    }

    public function post_disable_by_ajax($data)
    {
        if (empty($data['id_usuario'])) {
            return false; // No actualizar sin un id_usuario
        }

        $consulta = $this->db->table("usuarios");

        // Actualizar
        $consulta->where('id_usuario', $data['id_usuario']);
        $consulta->set(['estatus' => 'inactivo']);

        return $consulta->update();
    }

    public function post_enable_by_ajax($data)
    {
        if (empty($data['id_usuario'])) {
            return false; // No actualizar sin un id_usuario
        }

        $consulta = $this->db->table("usuarios");

        // Actualizar la tabla permisos
        $consulta->where('id_usuario', $data['id_usuario']);
        $consulta->set(['estatus' => 'activo']);

        return $consulta->update();
    }
}
