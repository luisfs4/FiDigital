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
$routes->get('/', 'Cuenta::index', ['filter' => 'auth']);
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
	$routes->get('perfil', 'Usuario::perfil');
	$routes->add('puntos', 'Punto::get_jerarquia');
	$routes->post('puntos/eliminar_punto', 'Sesiones::eliminar_punto');

	//Sección de seguimiento
	$routes->group('seguimiento', static function ($routes) {
		$routes->post('get_by_ajax', 'Sesiones::get_seguimiento_by_ajax');
		$routes->post('post_seguimiento', 'Sesiones::post_seguimiento');
	});

	//Seccion Usuarios
	$routes->get('Usuarios', 'Usuario::usuarios', ['filter' => 'Permiso_usuarios']);

	//Seccion proveedores
	$routes->group('proveedores', ['filter' => 'Permiso_proveedores'], static function ($routes) {
		$routes->get('/', 'Sesiones::listado_proveedores');
		$routes->post('get_proveedores_by_ajax', 'Sesiones::get_proveedores_by_ajax');
		$routes->post('agregar', 'Sesiones::agregar_proveedor');
		$routes->post('post_proveedor', 'Sesiones::post_proveedor');
		$routes->post('archivar_proveedor', 'Sesiones::cambiar_estatus_proveedor');
	});

	//Sección de sesiones
	$routes->group('Sesiones', ['filter' => 'Permiso_sesiones'], static function ($routes) {
		//Listado de sesiones
		$routes->get('/', 'Sesiones::listado');
		$routes->get('formulario', 'Sesiones::formulario');
		$routes->post('get_seguimiento_by_ajax', 'Sesiones::get_seguimiento_by_ajax');
		$routes->post('get_by_ajax', 'Sesiones::get_by_ajax');
		$routes->post('guardar_documento', 'Sesiones::guardar_pdf');
		$routes->post('post_sesion', 'Sesiones::post_sesion');
		$routes->get('expedientes/(:num)/detalle', 'Sesiones::detalle/$1');

		$routes->group('expedientes', static function ($routes) {
			$routes->get('/', 'Sesiones::listado_expedientes');
			$routes->post('cambiar_estatus', 'Sesiones::cambiar_estatus');
			$routes->post('post_expediente', 'Sesiones::post_expediente');
			$routes->post('get_by_ajax', 'Sesiones::get_expedientes_by_ajax');
			$routes->post('get_expedientes', 'Sesiones::get_expedientes_by_ajax');
		});

		$routes->group('puntos', static function ($routes) {
			$routes->get('listado', 						'Punto::listado', ['filter' => 'Permiso_sesiones']);

			$routes->post('post_punto', 				'Sesiones::post_punto');
			$routes->post('check_jerarquia',		'Sesiones::check_jerarquia');
			$routes->post('get_by_ajax', 				'Sesiones::get_puntos_by_ajax');
			$routes->post('cambiar_estatus', 		'Punto::cambiar_estatus');

			$routes->get('get_observaciones', 	'Punto::get_observaciones');
			$routes->post('post_observaciones', 'Punto::post_observaciones');
		});
	});

	//Sección de direcciones
	$routes->group('direcciones', ['filter' => 'Permiso_direcciones'], static function ($routes) {
		//Listado de sesiones
		$routes->get('/', 'Direccion::listado');
		$routes->post('post_direccion', 'Direccion::post_direccion');
		$routes->post('get_direcciones', 'Direccion::get_direcciones');
	});

	//Sección de programas
	$routes->group('programas', ['filter' => 'Permiso_programas'], static function ($routes) {
		$routes->get('/', 'Programa::listado');
		$routes->post('post_programa', 'Programa::post_programa');
		$routes->post('get_programas', 'Programa::get_programas');
	});

	$routes->group('solicitudes', ['filter' => 'Permiso_programas'], static function ($routes) {
		$routes->get('/', 'Solicitud::listado');
		$routes->post('post_solicitud', 'Solicitud::post_solicitud');
		$routes->post('get_solicitudes', 'Solicitud::get_solicitudes');
		$routes->get('formulario', 'Solicitud::formulario');
	});

	//Seccion Usuarios
	$routes->group('usuarios', ['filter' => 'Permiso_usuarios'], static function ($routes) {
		$routes->get('/', 'Usuario::listado');
		$routes->post('crear', 'Usuario::post_usuario');
		$routes->post('editar', 'Usuario::editar');
		$routes->post('get_by_ajax', 'Usuario::get_by_ajax', ['filter' => 'Session_exist']);
		$routes->post('get_permisos', 'Usuario::get_permisos');
		$routes->post('get_permisos_transparencia', 'Usuario::get_permisos_transparencia');
		$routes->post('update_permisos', 'Usuario::update_permisos');
		$routes->post('post_usuario', 'Usuario::post_usuario');
		$routes->post('update_permisos_transparencia', 'Usuario::update_permisos_transparencia');
		$routes->post('lista_permisos_transparencia_disponibles', 'Usuario::lista_permisos_transparencia_disponibles');
		$routes->post('post_disable_by_ajax', 'Usuario::post_disable_by_ajax');
		$routes->post('post_enable_by_ajax', 'Usuario::post_enable_by_ajax');
	});

	$routes->get("cat_programas", 	"Sesiones::cat_programas");
	$routes->get("cat_direcciones", "Sesiones::cat_direcciones");
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
