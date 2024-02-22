<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\EncuestaModel;
use App\Models\CuentaModel;

class Cuenta extends BaseController
{
    protected $session;
    protected $CuentaModel;

    public function __construct()
    {
        //Load model
        $this->session =  \Config\Services::session();
        $this->CuentaModel = new CuentaModel();
    }

    public function index()
    {
        $data_view = [
            "ruta" => 'Iniciar sesión'
        ];

        echo view('panel/base/head', $data_view) . view('panel/cuenta/menu') . view('panel/cuenta/iniciar_sesion') . view('panel/cuenta/footer');
    }

    public function post_login()
    {
        if ($this->request->isAJAX()) {
            $data = [
                "correo"     => trim($this->request->getPost("correo")),
                "contrasena" => trim($this->request->getPost("contrasena")),
            ];

            if ($res = $this->CuentaModel->auth($data)) {
                http_response_code(200);
                echo "autorizado";
            } else {
                http_response_code(200);
                echo strval($res);
            }
        } else {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }
    }

    public function logout()
    {
        $this->CuentaModel->logout($this->session->id_usuario);
        $this->session->destroy();
        return redirect()->to(site_url("cuenta"));
    }

    public function cambiar_contrasena()
    {
        $cactual     = $this->request->getPost('cactual');
        $contrasena  = $this->request->getPost('contrasena');

        if ($this->CuentaModel->cambiar_contrasena($cactual, $contrasena)) {
            $this->response->setStatusCode(200);
            return true;
        } else {
            $this->response->setStatusCode(203);
            return true;
        }
    }

    public function redirect()
    {
        if ($this->session->has('is_logged')) {
            switch (true) {
                case $this->session->permisos->permiso_usuarios == 1:
                    return redirect()->to(site_url('panel/usuarios'));
                    break;
                case $this->session->permisos->permiso_sesiones == 1:
                    return redirect()->to(site_url('panel/sesiones'));
                    break;
                case $this->session->permisos->permiso_direcciones == 1:
                    return redirect()->to(site_url('panel/direcciones'));
                    break;
                case $this->session->permisos->permiso_programas == 1:
                    return redirect()->to(site_url('panel/programas'));
                    break;
                default:
                    return redirect()->to(site_url('403'));
                    break;
            }
            //return redirect()->to('/Panel');
        }
    }
}
