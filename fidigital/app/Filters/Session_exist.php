<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Session_exist implements FilterInterface
{
    protected $session;
    protected $db;

    public function __construct()
    {
        $this->session = \Config\Services::session();
        $this->db      = \Config\Database::connect();
    }

    public function before(RequestInterface $request, $arguments = null)
    {
        //Si la session no existe
        if (!$this->session->is_logged) {
            return redirect()->to(site_url('cuenta'));
        } else {
            $usuario = $this->db->table('usuarios'); //Obtenemos el usuario
            $usuario->where('id_usuario', $this->session->id_usuario);
            $result = $usuario->get()->getRowObject();

            if ($result->estatus != 'activo') {  //Si la cuenta no se encuentra activa
                $this->session->destroy();
                return redirect()->to(site_url('cuenta'));
            }
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
