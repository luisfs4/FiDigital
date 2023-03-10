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

	//Regulaciones
	$routes->group('regulaciones', ['filter' => 'Permiso_regulaciones'], static function ($routes) {

		$routes->get('/', 'Regulacion::vista_formulario');
		$routes->get('regulaciones', 'Regulacion::vista_formulario');
		$routes->post('get_datatable_ajax', 'Regulacion::get_datatable_ajax'); //Datatable Panel
		$routes->post('get_by_id_ajax', 'Regulacion::get_by_id_ajax'); //Modales del panel
		$routes->post('get_by_ajax', 'Regulacion::get_by_ajax'); //Vista ciudadano

		//Estatus regulaciones
		$routes->post('post_regulacion', 'Regulacion::post_regulacion'); //Crear regulación en panel
		$routes->post('update_regulacion', 'Regulacion::update_regulacion'); //Actualizar regulación
		$routes->post('validar_regulacion', 'Regulacion::validar_regulacion'); //Validar regulación
		$routes->post('publicar_regulacion', 'Regulacion::publicar_regulacion'); //Publicar regulación
		$routes->post('desactivar_regulacion', 'Regulacion::desactivar_regulacion'); //Desactivar regulación
		$routes->post('abrogar_regulacion', 'Regulacion::abrogar_regulacion'); //Abrogar regulación
		$routes->post('editar_regulacion', 'Regulacion::editar_regulacion'); //Editar regulación

		//Modificaciones
		$routes->get('modificaciones', 'Regulacion::vista_modificaciones');
		$routes->post('get_modificaciones_by_ajax', 'Regulacion::get_modificaciones_by_ajax'); //Traer modificaciones
		$routes->post('post_modificacion', 'Regulacion::post_modificacion'); //Crear Modificación
		$routes->post('update_modificacion', 'Regulacion::update_modificacion'); //Actualizar modificación

		//Cambios
		$routes->post('get_cambios_by_ajax', 'Regulacion::get_cambios_by_ajax'); //Traer cambios
	});

	//Seccion Tramites
	$routes->group('tramites', ['filter' => 'Permiso_tramites_servicios'], static function ($routes) {

		$routes->get('/', 'Tramite::listado');
		$routes->get('Formulario', 'Tramite::vista_formulario');

		//Crear trámite
		$routes->post('post_tramite', 'Tramite::post_tramite');
		$routes->post('get_json_tramite', 'Tramite::get_json_tramite_by_ajax');

		//Editar trámite
		$routes->get('(:num)/editar', 'Tramite::editar_tramite/$1');
		$routes->get('(:num)/montos', 'Tramite::actualizar_montos_tramite/$1');
		$routes->post('post_editar_tramite', 'Tramite::post_editar_tramite');
		$routes->post('update_terminado_montos', 'Tramite::update_terminado_montos');
		$routes->post('guardar_pdf', 'Tramite::guardar_pdf');
		$routes->post('get_cambios_by_ajax', 'Tramite::get_cambios_by_ajax');
		$routes->post('cambios_tramite', 'Tramite::update_cambios_tramite');

		//Estatus trámite
		$routes->post('validar_tramite', 'Tramite::validar_tramite');
		$routes->post('publicar_tramite', 'Tramite::publicar_tramite');
		$routes->post('desactivar_tramite', 'Tramite::desactivar_tramite');

		//Complementos

		//Oficinas
		$routes->group('oficinas', static function ($routes) {
			$routes->post('post_oficina', 'Oficina::post_oficina');
			$routes->post('get_by_ajax', 'Tramite::get_oficinas_by_ajax');
		});

		//Autoridades responsables
		$routes->post('post_autoridades_responsables', 'Tramite::post_autoridades_responsables');
		$routes->post('get_autoridades_responsables_by_ajax', 'Tramite::get_autoridades_responsables_by_ajax');

		//Borradores
		$routes->group('borradores', static function ($routes) {
			$routes->get('/', 'Tramite::borradores');
			$routes->post('post_borrador', 'Tramite::post_borrador');
			$routes->post('get_by_ajax', 'Tramite::get_borradores_by_ajax');
			$routes->post('desactivar_borrador', 'Tramite::desactivar_borrador');
			$routes->post('enviar_borrador', 'Tramite::enviar_borrador');
			$routes->post('regresar_borrador', 'Tramite::regresar_borrador');
			$routes->get('(:num)/editar', 'Tramite::editar_borrador/$1');
			$routes->get('(:num)/copiar', 'Tramite::copiar_borrador/$1');
			$routes->get('(:num)/validar', 'Tramite::validar_borrador/$1');
			$routes->get('(:num)/visualizar', 'Tramite::visualizar_borrador/$1');
		});

		//Grupos
		$routes->group('grupos', static function ($routes) {
			$routes->get('/', 'Tramite::grupos');
			$routes->post('post_grupo', 'Tramite::post_grupo');
			$routes->post('get_by_ajax', 'Tramite::get_grupos_by_ajax');
			$routes->get('(:num)/editar', 'Tramite::editar_grupo/$1');
		});
	});

	//Visitas
	$routes->group('visitas', ['filter' => 'Permiso_visitas'], static function ($routes) {
		$routes->get('/', 'visita::listado');
		$routes->get('formulario', 'visita::vista_formulario');
		$routes->get('listado', 'visita::listado');
		$routes->post('post_visita', 'visita::post_visita');
		$routes->post('get_by_ajax', 'visita::get_by_ajax');
		$routes->get('(:num)/editar', 'visita::editar_visita/$1');
		$routes->post('post_editar_visita', 'visita::post_editar_visita');
		$routes->post('guardar_pdf', 'visita::guardar_pdf');
		$routes->post('get_cambios_by_ajax', 'visita::get_cambios_by_ajax');
		$routes->post('cambios_visitas', 'visita::update_cambios_visita');
	});

	//Visitadores
	$routes->group('visitadores', ['filter' => 'Permiso_visitadores'], static function ($routes) {
		//Panel
		$routes->get('/', 'Visitador::listado');
		$routes->get('listado', 'Visitador::listado');
		$routes->get('formulario', 'Visitador::vista_formulario');
		$routes->post('post_visitador', 'Visitador::post_visitador');
		$routes->post('get_by_ajax', 'Visitador::get_by_ajax');
		$routes->get('(:num)/editar', 'Visitador::editar_visitador/$1');
		$routes->post('post_editar_visitador', 'Visitador::post_editar_visitador');
		$routes->post('get_cambios_by_ajax', 'Visitador::get_cambios_by_ajax');
		$routes->post('cambios_visitadores', 'Visitador::update_cambios_visitadores');
	});

	//Seccion Perfil
	$routes->get('Perfil', 'Usuario::perfil');

	//Seccion Usuarios
	$routes->get('Usuarios', 'Usuario::usuarios', ['filter' => 'Permiso_usuarios']);
});

//Trámites ciudadano
$routes->group('tramites', static function ($routes) {

	//Vista ciudadana
	$routes->get('(:num)/detalle', 'Tramite::detalle/$1');

	//Filtros
	$routes->post('direcciones/get_by_ajax', 'Tramite::get_direcciones_by_ajax');
	$routes->post('sectores/get_by_ajax', 'Tramite::get_sectores_by_ajax');
	$routes->post('grupos/get_by_ajax', 'Tramite::get_grupos_by_ajax');

	//Consultar tramites
	$routes->post('get_by_ajax', 'Tramite::get_by_ajax');

	//Consultar formato
	$routes->get('(:num)/formato', 'Tramite::render_formato/$1');
	$routes->get('(:num)/pdf', 'Tramite::render_formato/$1');
	$routes->get('corregir_pasos', 'Tramite::corregir_pasos');
});

//Visitas
$routes->group('visitas', static function ($routes) {

	//Vista ciudadana
	$routes->get('(:num)/detalle', 'Visita::detalle/$1');

	//Consultar visitas
	$routes->post('get_by_ajax', 'Visita::get_by_ajax');
});

//Visitadores
$routes->group('Visitadores', static function ($routes) {

	//Vista ciudadana
	$routes->get('(:num)/detalle', 'Visitador::detalle/$1');

	//Consultar Visitadores
	$routes->post('get_by_ajax', 'Visitador::get_by_ajax');
});

//Regulaciones
$routes->group('regulaciones', static function ($routes) {
	//Ciudadano
	$routes->get('(:num)/detalle', 'Regulacion::detalle/$1'); //Vista ciudadano
	$routes->post('get_by_ajax', 'Regulacion::get_by_ajax'); //Vista ciudadano
});

//Inclusiones
$routes->group('include', static function ($routes) {
	$routes->get('panel_busqueda', 'Inicio::return_panel_busqueda');
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
