<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Permiso_programas implements FilterInterface
{
    protected $session;

    public function __construct()
    {
        $this->session = \Config\Services::session();
    }

    public function before(RequestInterface $request, $arguments = null)
    {
        $mantenimiento = false;
        if (!$this->session->is_logged) {
            return redirect()->to(site_url('cuenta'));
        } else if ($mantenimiento && $this->session->id_usuario != 31) {
            echo view('errors/html/error_503');
            exit();
            return  false;
        } else {
            if ($this->session->permisos->permiso_programas != 1) {
                throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
                return false;
            }
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
