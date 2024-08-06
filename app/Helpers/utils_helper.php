<?php

use App\Models\UsuarioModel;

function replace_accents($str)
{
    $str = htmlentities($str, ENT_COMPAT, "UTF-8");
    $str = preg_replace('/&([a-zA-Z])(uml|acute|grave|circ|tilde|ring);/', '$1', $str);
    return html_entity_decode($str);
}

/**
 * @param int $key id para la carpeta donde se va guardar el archivo
 * @param string $carpeta nombre de la carpeta donde se va a guardar
 * @param $file archivo que se va subir
 */
function subir_archivo($key, $file, $carpeta, $nombre = null)
{
    helper('security');

    //Guarda el pdf
    //var_dump($file);exit();
    if ($file != null) {
        if (file_exists($file)) { //Si suben pdf
            $filename = ($nombre ? strval($nombre)."_" : "") . date("Ymdhis") . "." . $file->getExtension();
            $filename =  sanitize_filename($filename);
            $carpeta = "public/documentos/$carpeta/$key/";

            if (!file_exists($carpeta)) { //Crear carpeta si no existe
                mkdir($carpeta, 0777, true);
            }

            //echo FCPATH . $carpeta. $filename; exit();
            if ($file->move(FCPATH . $carpeta, $filename)) {
                return $carpeta . $filename;
            } else {
                return '';
            }
        }
    }
}
