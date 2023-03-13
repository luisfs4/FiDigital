<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (is_file(SYSTEMPATH . 'Config/Routes.php')) {
	require SYSTEMPATH . 'Config/Routes.php';
}

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Inicio');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);
$routes->setIgnoreCaseSensitive(true);

// The Auto Routing (Legacy) is very dangerous. It is easy to create vulnerable apps
// where controller filters or CSRF protection are bypassed.
// If you don't want to define all routes, please use the Auto Routing (Improved).
// Set `$autoRoutesImproved` to true in `app/Config/Feature.php` and set the following to true.
//$routes->setAutoRoute(false);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/', 'Inicio::index');
$routes->get('Inicio', 'Inicio::index');
$routes->get('cerrar_sesion', 'Cuenta::logout');
$routes->get('get_json_tramite', 'Tramite::get_json_tramite');
$routes->get('ciudadano', 'Inicio::ciudadano');
$routes->get('funcionario', 'Inicio::funcionario');

$routes->group('cuenta', ['filter' => 'auth'], static function ($routes) {
	//Pagina de login
	$routes->get('/', 'Cuenta::index');
	$routes->get('cuenta', 'Cuenta::index');
	$routes->get('login', 'Cuenta::index');
	$routes->get('iniciar_sesion', 'Cuenta::index');
	//Post para validar credenciales
	$routes->post('post_login', 'Cuenta::post_login');
	$routes->post('cambiar_contrasena', 'Cuenta::cambiar_contrasena', ['filter' => 'Session_exist']);
});

$routes->group('panel', ['filter' => 'Session_exist'], static function ($routes) {

	$routes->get('/', 'Cuenta::redirect');

	//Seccion Perfil
	$routes->get('Perfil', 'Usuario::perfil');

	//Seccion Usuarios
	$routes->get('Usuarios', 'Usuario::usuarios', ['filter' => 'Permiso_usuarios']);

	//Sección de expedientes
	$routes->group('Expedientes', ['filter' => 'Permiso_expedientes'], static function ($routes) {
		//Listado de expedientes
		$routes->get('/', 'Expedientes::listado');
		$routes->get('formulario', 'Expedientes::formulario');
		$routes->post('get_by_ajax', 'Expedientes::get_by_ajax');
		
		$routes->group('sesiones', static function ($routes) {
			$routes->post('post_sesion', 'Expedientes::post_sesion');
			$routes->post('get_by_ajax', 'Expedientes::get_sesion_by_ajax');
		});
	});
});

//Usuarios
$routes->group('usuarios', static function ($routes) {
	$routes->post('get_by_ajax', 'Usuario::get_by_ajax');
	$routes->post('get_by_id_ajax', 'Usuario::get_by_id_ajax');
	$routes->post('post_disable_by_ajax', 'Usuario::post_disable_by_ajax');
	$routes->post('get_dependencia_by_ajax', 'Usuario::get_direcciones');
	$routes->post('get_unidad_by_ajax', 'Usuario::get_unidades');
});

/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (is_file(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
