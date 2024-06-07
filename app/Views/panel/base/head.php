<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0">
    <meta name="organization" content="<?= getenv('organization') ?>" />
    <meta name="lang" content="es-ES" />
    <meta name="description" content="<?= getenv('description') ?>" />

    <title>
        <?php
        $titulo_pagina = "&nbsp;|&nbsp;" . $ruta;
        
        echo getenv('name') . $titulo_pagina;
        ?>

    </title>

    <!--    Librerias Principales     -->

    <!-- AOS -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />

    <!-- Nucleo Icons -->
    <link href="<?= base_url('public/vendors/boostrap_lib/css/nucleo-icons.css'); ?>" rel="stylesheet" />
    <link href="<?= base_url('public/vendors/boostrap_lib/css/nucleo-svg.css'); ?>" rel="stylesheet" />

    <!-- Font Awesome Icons -->
    <script src="https://kit.fontawesome.com/42d5adcbca.js" crossorigin="anonymous"></script>
    <link href="<?= base_url('public/vendors/boostrap_lib/css/nucleo-svg.css'); ?>" rel="stylesheet" />

    <!-- CSS Dashboard -->
    <link id="pagestyle" href="<?= base_url('public/vendors/boostrap_lib/css/dashboard.css'); ?>" rel="stylesheet" />

    <!-- Intro Js -->
    <link href="https://unpkg.com/intro.js/minified/introjs.min.css" rel="stylesheet" type="text/css" />

    <!-- SELECT 2 -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />

    <!-- CSS Principal -->
    <link href="<?= base_url('public/css/estilos.css?v=').date('YmdHis'); ?>" rel="stylesheet" />
    
    <!-- CSS Versión Moviles -->
    <link href="<?= base_url('public/css/moviles.css?v=').date('YmdHis'); ?>" rel="stylesheet" />

    <!-- Filepond -->
    <link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet">

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="<?=base_url('public/imagenes/favicon/apple-touch-icon.png')?>">
    <link rel="icon" type="image/png" sizes="32x32" href="<?=base_url('public/imagenes/favicon/favicon-32x32.png')?>">
    <link rel="icon" type="image/png" sizes="16x16" href="<?=base_url('public/imagenes/favicon/favicon-16x16.png')?>">
    <link rel="manifest" href="<?=base_url('public/imagenes/favicon/site.webmanifest');?>">
    <link rel="mask-icon" href="<?=base_url('public/imagenes/favicon/safari-pinned-tab.svg" color="#5bbad5"')?>">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

</head>