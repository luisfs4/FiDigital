<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\UsuarioModel;

class Usuario extends BaseController
{
    protected $session;
    protected $db;
    protected $UsuarioModel;

    public function __construct()
    {
        $this->session = \Config\Services::session();
        $this->db = \Config\Database::connect();

        //Cargar modelos
        $this->UsuarioModel = new UsuarioModel();
    }

    public function perfil()
    {
        $data_view = [
            "ruta" => "Perfil"
        ];

        $data_tramites = [
            ""
        ];

        //Incluir scripts custom para esa unica vista sin afectar el include general
        $scripts_view = [
            "scripts" => [
                ["src" => base_url("public/js/panel/usuarios.js?v=" . time())]
            ]
        ];

        echo view("panel/base/head", $data_view) . view("panel/base/menu", $this->session->get()) . view("panel/usuarios/perfil", $data_tramites) . view("panel/base/footer", $scripts_view);
    }

    public function usuarios()
    {
        $data_view = [
            "ruta" => "Usuarios"
        ];

        //Incluir scripts custom para esa unica vista sin afectar el include general
        $scripts_view = [
            "scripts" => [
                ["src" => base_url("public/js/panel/usuarios.js?v=" . time())]
            ]
        ];

        echo view("panel/base/head", $data_view) . view("panel/base/menu", $this->session->get()) . view("panel/usuarios/usuarios") . view("panel/base/footer", $scripts_view);
    }

    public function get_by_ajax()
    {
        if ($this->request->isAJAX()) {
            $data_filtros = $this->request->getPost();
            if ($response = $this->UsuarioModel->get_by_ajax($data_filtros)) {
                $this->response->setStatusCode(200);
                return $this->response->setJSON($response);
            } else {
                $this->response->setStatusCode(204);
            }
        } else {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }
    }

    public function post_usuario()
    {
        if ($this->request->isAJAX()) {
            $data_filtros = $this->request->getPost();
            if ($response = $this->UsuarioModel->post_usuarios($data_filtros)) {
                $this->response->setStatusCode(200);
                return $this->response->setJSON($response);
            } else {
                $this->response->setStatusCode(204);
            }
        } else {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }
    }

    public function get_direcciones()
    {
        if ($this->request->isAJAX()) {
            $data_filtros = $this->request->getPost();
            if ($response = $this->UsuarioModel->get_direcciones($data_filtros)) {
                $this->response->setStatusCode(200);
                return $this->response->setJSON($response);
            } else {
                $this->response->setStatusCode(204);
            }
        } else {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }
    }

    function get_unidades()
    {
        $UsuarioModel = new UsuarioModel();
        $data_filtros = $this->request->getPost();
        if ($response = $UsuarioModel->get_unidades($data_filtros)) {
            return json_encode($response);
        } else {
            return json_encode([]);
        }
    }

    function get_permisos()
    {
        if ($response = $this->UsuarioModel->get_permisos($this->request->getPost())) {
            return json_encode($response);
        } else {
            return json_encode([]);
        }
    }

    function update_permisos()
    {
        if ($response = $this->UsuarioModel->update_permisos($this->request->getPost())) {
            return json_encode($response);
        } else {
            return json_encode([]);
        }
    }

    function post_disable_by_ajax()
    {
        $UsuarioModel = new UsuarioModel();
        $data_filtros = $this->request->getPost();
        if ($response = $UsuarioModel->post_disable_by_ajax($data_filtros)) {
            return json_encode($response);
        } else {
            return json_encode([]);
        }
    }

    function post_enable_by_ajax()
    {
        $UsuarioModel = new UsuarioModel();
        $data_filtros = $this->request->getPost();
        if ($response = $UsuarioModel->post_enable_by_ajax($data_filtros)) {
            return json_encode($response);
        } else {
            return json_encode([]);
        }
    }

}
