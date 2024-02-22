<body class="g-sidenav-show  bg-gray-100" style="min-height: 100vh;">
	<aside class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 " data-color="danger" id="sidenav-main">
		<div class="sidenav-header d-flex">
			<img src="<?= base_url('public/imagenes/logo.png'); ?>" class="navbar-brand-img" alt="main_logo" style="width: 100%;max-height: unset;object-fit: contain;object-position: left center;padding-left: 1rem;">
		</div>
		<hr class="horizontal dark mt-0">
		<div class="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
			<ul class="navbar-nav">

				<li class="nav-item">
					<a class="nav-link <?= $ruta == 'Inicio' ? 'active' : '' ?>" href="<?= base_url('/panel/sesiones') ?>">
						<div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
							<i class="fas fa-home mb-1" style="font-size: 0.85rem;"></i>
						</div>
						<span class="nav-link-text ms-1">Inicio</span>
					</a>
				</li>

				<?php 
				if ($permisos->permiso_sesiones == 1) {
				?>
					<li class="nav-item">
						<a class="nav-link <?= $ruta == 'Listado de sesiones' ? 'active' : '' ?>" href="<?= base_url('/panel/sesiones') ?>">
							<div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
								<i class="fas fa-folder mb-1" style="font-size: 0.85rem;"></i>
							</div>
							<span class="nav-link-text ms-1">Sesiones</span>
						</a>
					</li>
				<?php
				}
				?>

				<?php 
				if ($permisos->permiso_direcciones == 1) {
				?>
					<li class="nav-item">
						<a class="nav-link <?= $ruta == 'Listado de direcciones' ? 'active' : '' ?>" href="<?= base_url('/panel/direcciones') ?>">
							<div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
								<i class="fas fa-building mb-1" style="font-size: 0.85rem;"></i>
							</div>
							<span class="nav-link-text ms-1">Direcciones</span>
						</a>
					</li>
				<?php
				}
				?>

				<?php 
				if ($permisos->permiso_programas == 1) {
				?>
					<li class="nav-item">
						<a class="nav-link <?= $ruta == 'Listado de programas' ? 'active' : '' ?>" href="<?= base_url('/panel/programas') ?>">
							<div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
								<i class="fas fa-tasks mb-1" style="font-size: 0.85rem;"></i>
							</div>
							<span class="nav-link-text ms-1">Programas</span>
						</a>
					</li>
				<?php
				}
				?>

				<?php 
				if ($permisos->permiso_expedientes == 1) {
				?>
					<li class="nav-item">
						<a class="nav-link <?= $ruta == 'Listado de expedientes' ? 'active' : '' ?>" href="<?= base_url('/panel/sesiones/expedientes') ?>">
							<div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
								<i class="fas fa-archive mb-1" style="font-size: 0.85rem;"></i>
							</div>
							<span class="nav-link-text ms-1">Expedientes</span>
						</a>
					</li>
				<?php
				}
				?>

				<?php 
				if ($permisos->permiso_usuarios == 1) {
				?>
					<li class="nav-item">
						<a class="nav-link <?= $ruta == 'Usuarios' ? 'active' : '' ?>" href="<?= base_url('/panel/usuarios'); ?>">
							<div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
								<i class="fas fa-user-cog mb-1" style="font-size: 0.85rem;"></i>
							</div>
							<span class="nav-link-text ms-1">Usuarios</span>
						</a>
					</li>
				<?php
				}
				?>

				<li class="nav-item mt-3">
					<h6 class="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Cuenta</h6>
				</li>

				<li class="nav-item">
					<a class="nav-link  <?= $ruta == 'Perfil' ? 'active' : '' ?> " href="<?= base_url('/panel/perfil') ?>">
						<div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
							<i class="fas fa-id-card-alt mb-1" style="font-size: 0.85rem;"></i>
						</div>
						<span class="nav-link-text ms-1">Mi perfil</span>
					</a>
				</li>

			</ul>
		</div>

		<div class="sidenav-footer mx-3 ">
			<a class="btn bg-gradient-danger mt-3 w-100 btn_cerrar_session">Cerrar sesión</a>
		</div>

	</aside>

	<main class="main-content position-relative max-height-vh-100 border-radius-lg ps ps--active-y">
		<!-- Navbar -->
		<nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
			<div class="container-fluid py-1 px-3">
				<nav aria-label="breadcrumb">
					<ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
						<li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="javascript:;"><?= getenv('name') ?></a></li>
						<li class="breadcrumb-item text-sm text-dark active" aria-current="page">Panel de administración</li>
					</ol>
					<h6 class="font-weight-bolder mb-0"><?= $ruta ?></h6>
				</nav>
				<div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
					<div class="ms-md-auto pe-md-3 d-flex align-items-center">
						<div class="input-group">
							<span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i></span>
							<input type="text" class="form-control busqueda_nav" placeholder="Buscar...">
						</div>
					</div>
					<ul class="navbar-nav  justify-content-end">
						<li class="nav-item d-flex align-items-center">
							<a href="javascript:;" class="nav-link text-body font-weight-bold px-0">
								<i class="fa fa-user me-sm-1"></i>
								<span class="d-sm-inline d-none"><?= $_SESSION['nombres'] . " " . $_SESSION['ape_paterno'] ?></span>
							</a>
						</li>
						<li class="nav-item d-xl-none ps-3 d-flex align-items-center">
							<a href="javascript:;" class="nav-link text-body p-0" id="iconNavbarSidenav">
								<div class="sidenav-toggler-inner">
									<i class="sidenav-toggler-line"></i>
									<i class="sidenav-toggler-line"></i>
									<i class="sidenav-toggler-line"></i>
								</div>
							</a>
						</li>
						<li class="nav-item px-3 d-flex align-items-center">
							<a href="javascript:;" class="nav-link text-body p-0">
								<i class="fa fa-cog fixed-plugin-button-nav cursor-pointer"></i>
							</a>
						</li>
						<li class="nav-item dropdown pe-2 d-flex align-items-center">
							<a href="javascript:;" class="nav-link text-body p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
								<i class="fa fa-bell cursor-pointer"></i>
							</a>
							<ul class="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton">
								<li class="mb-2">
									<a class="dropdown-item border-radius-md" href="javascript:;">
										<div class="d-flex py-1">
											<div class="my-auto">
												<img src="<?= base_url('public/imagenes/logo.png'); ?>" class="avatar avatar-sm  me-3'); ?>">
											</div>
											<div class="d-flex flex-column justify-content-center">
												<h6 class="text-sm font-weight-normal mb-1">
													<span class="font-weight-bold">Sin notificaciones nuevas
												</h6>
												<p class="text-xs text-secondary mb-0 ">
													<i class="fa fa-clock me-1"></i>
													Justo ahora
												</p>
											</div>
										</div>
									</a>
								</li>

							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<!-- End Navbar -->