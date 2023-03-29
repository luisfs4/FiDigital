<body>
	<div class="container position-sticky z-index-sticky top-0">
		<div class="row">
			<div class="col-12">
				<!-- Navbar -->
				<nav class="navbar navbar-expand-lg blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
					<div class="container-fluid pe-0">
						<img src="<?= base_url('public/imagenes/logo.png'); ?>" class="w-15 px-2" alt="Logo principal">
						<button class="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
							<span class="navbar-toggler-icon mt-2">
								<span class="navbar-toggler-bar bar1"></span>
								<span class="navbar-toggler-bar bar2"></span>
								<span class="navbar-toggler-bar bar3"></span>
							</span>
						</button>
						<div class="collapse navbar-collapse justify-content-end">
							
							<ul class="navbar-nav d-lg-block d-none">
								<li class="nav-item">
									<a href="<?= base_url() ?>" class="btn btn-sm btn-round mb-0 me-1 bg-gradient-dark icon-move-left"><i class="fas fa-arrow-left text-xs me-2"></i>Ir a la pagina principal</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
				<!-- End Navbar -->
			</div>
		</div>
	</div>