<?php

namespace App\Models;

use CodeIgniter\Model;

class CuentaModel extends Model
{
    protected $db;
    protected $session;

    public function __construct()
    {
        $this->db       = \Config\Database::connect();
        $this->session  =  \Config\Services::session();
    }

    public function auth($data)
    {
        $usuarios = $this->db->table("usuarios");
        $usuarios->where("correo", $data["correo"]);

        if ($usuarios->countAllResults() > 0) { //Existe el usuario

            $usuarios = $this->db->table("usuarios");
            $usuarios->select("usuarios.*");
            $usuarios->select("cat_coordinaciones.coordinacion");
            $usuarios->select("cat_direcciones.direccion");
            $usuarios->select("cat_unidades.unidad");
            $usuarios->join("cat_direcciones", "cat_direcciones.id_direccion = usuarios.id_direccion", "left");
            $usuarios->join("cat_coordinaciones", "cat_coordinaciones.id_coordinacion = usuarios.id_coordinacion", "left");
            $usuarios->join("cat_unidades", "cat_unidades.id_unidad = usuarios.id_unidad", "left");
            $usuarios->where("correo", $data["correo"]);

            $result = $usuarios->get()->getRowObject(); // Datos del usuario
            //echo $usuarios->getCompiledSelect();exit();

            if (password_verify($data["contrasena"], $result->contrasena)) { //Verifica que la contraseña sea correcta

                switch ($result->estatus) {
                    case "activo":

                        $session_Data = [
                            "id_usuario"           => $result->id_usuario,
                            "id_coordinacion"      => $result->id_coordinacion,
                            "coordinacion"         => $result->coordinacion,
                            "id_direccion"         => $result->id_direccion ?? '0',
                            "direccion"            => $result->direccion ?? '',
                            "id_unidad"            => $result->id_unidad ?? '0',
                            "unidad"               => $result->unidad ?? '',
                            "nombres"              => $result->nombres,
                            "ape_paterno"          => $result->ape_paterno,
                            "ape_materno"          => $result->ape_materno,
                            "correo"               => $result->correo,
                            "perfil"               => $result->perfil,
                            "telefono"             => $result->telefono,
                            "permisos"             => $this->get_permisos($result->id_usuario),
                            "is_logged"            => true
                        ];

                        $this->session->set($session_Data);

                        $usuarios = $this->db->table("usuarios");
                        $usuarios->where("correo", $data["correo"]);
                        $ultimo_login = [
                            'logged_at' => date('Y-m-d H:i:s')
                        ];
                        $usuarios->update($ultimo_login);

                        return http_response_code(200);
                        break;
                    case "inactivo":
                        http_response_code(500);
                        echo "La cuenta esta inactiva";
                        break;
                    case "suspendido":
                        http_response_code(500);
                        echo "La cuenta esta suspendida";
                        break;
                }
            } else {
                echo "La contraseña no es correcta";
                http_response_code(500);
            }
        } else {
            http_response_code(500);
            echo "El correo no está registrado";
        }
    }
    
    public function get_permisos($id_usuario)
    {
        $consulta = $this->db->table("permisos as p");
        $consulta->where('p.id_usuario', $id_usuario);

        return $consulta->get()->getRowObject();
    }

    public function cambiar_contrasena($cactual, $contrasena)
    {

        //Verifica que la contraseña actual sea correcta
        $usuarios = $this->db->table("usuarios");
        $usuarios->select("contrasena");
        $usuarios->where("id_usuario", $this->session->id_usuario);
        $usuario = $usuarios->get()->getRowObject();

        if (password_verify($cactual, $usuario->contrasena)) {
            $data_password = [
                'contrasena' => password_hash($contrasena, PASSWORD_BCRYPT),
                'updated_at' => date('Y-m-d H:i:s'),
                'updated_by' => $this->session->id_usuario
            ];

            $usuarios = $this->db->table("usuarios");
            $usuarios->where("id_usuario", $this->session->id_usuario);

            return $usuarios->update($data_password);
        } else {
            return false;
        }
    }

    public function perfil($perfil)
    {
        $filename = $this->session->id_usuario . ".jpg";
        if ($perfil->move(FCPATH . "uploads/perfiles", $filename, true)) {
            $usuario = $this->db->table("usuarios");
            $usuario->where("id_usuario", $this->session->id_usuario);

            //Update perfil session
            $this->session->set("perfil", $filename);

            return $usuario->update([
                "perfil" => $filename,
                "updated_at" => date('Y-m-d H:i:s'),
                "updated_by" => $this->session->id_usuario
            ]);
        } else {
            return false;
        }
    }

    public function logout($id)
    {
        //Hacer algo cuando se deslogueee
    }

    public function prueba()
    {
        $datos_insert = [
            'nombres' => 'Luis Felipe',
            'ape_paterno' => 'Sánchez',
            'ape_materno' => 'Buenrostro',
            'telefono' => '3317458602',
            'ext' => '4575',
            'created_at' => date('d-m-Y H:i:s'),
            'correo' => 'luisfelipe.sanchez@zapopan.gob.mx'
        ];
        $usuario = $this->db->table("usuarios");
        echo $usuario->set($datos_insert)->getCompiledInsert();

        $usuario = $this->db->table("usuarios");
        echo $usuario->set($datos_insert)->insert();
        echo '<br><br><br>';
        $usuario = $this->db->table("usuarios");
        echo json_encode($usuario->get()->getResultObject());
    }
}
