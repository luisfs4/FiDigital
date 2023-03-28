<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Auth implements FilterInterface
{
    protected $session;

    public function __construct()
    {
        $this->session = \Config\Services::session();
    }

    public function before(RequestInterface $request, $arguments = null)
    {
        if ($this->session->has('is_logged')) {
            switch (true) {
                case $this->session->permisos->permiso_usuarios == 1:
                    return redirect()->to(site_url('panel/usuarios'));
                    break;
                default:
                    return redirect()->to(site_url('403'));
                    break;
            }
            //return redirect()->to('/Panel');
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
