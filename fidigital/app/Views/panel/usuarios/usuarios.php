<form class="container-fluid pt-4 pb-2 collapse" id="formulario_usuarios">
	<div class="card mb-4">
		<div class="card-header">
			<div class="row align-items-center">
				<div class="col-8">
					<h6 class="mb-0">Nuevo usuario</h6>
				</div>
				<div class="col-4 text-end">
					<a href="javascript:;" class="btn guia_regulacion btn-sm bg-gradient-danger mb-0">
						Guía&nbsp;&nbsp;<div class="fas fa-question-circle"></div>
					</a>
					<button class="btn btn-sm bg-gradient-danger mb-0 switch_boton_formulario" data-bs-toggle="collapse" data-bs-target="#formulario_regulaciones" aria-expanded="true" aria-controls="formulario_regulaciones">
						<div class="fas fa-times"></div>
					</button>
				</div>
			</div>
		</div>
		<div class="card-body">
			<div>
				<div class="row">
					<div class="col-lg-4 col-md-6 col-sm-12">
						<div class="form-group">
							<label class="form-control-label">Nombres</label>
							<input required type="text" class="form-control tramite_nombre_oficial input_usuario" name="nombres" placeholder="Escribe los nombres...">
						</div>
					</div>
					<div class="col-lg-4 col-md-6 col-sm-12">
						<div class="form-group">
							<label class="form-control-label">Apellido paterno</label>
							<input required type="text" class="form-control input_usuario" name="ape_paterno" placeholder="Escribe apellido paterno...">
						</div>
					</div>
					<div class="col-lg-4 col-md-6 col-sm-12">
						<div class="form-group">
							<label class="form-control-label">Apellido Materno</label>
							<input required type="text" class="form-control input_usuario" name="ape_materno" placeholder="Escribe el apellido materno...">
						</div>
					</div>
				</div>
			</div>
			<hr class="horizontal dark my-2">

			<!-- Fechas -->
			<div>
				<div class="row">
					<div class="col-lg-3">
						<label class="form-control-label">Dirección</label>
						<select class="form-control input_usuario" name="id_direccion">
							<option value="">Selecciona una opción</option>
						</select>
					</div>
					<div class="col-lg-3">
						<label class="form-control-label">Unidad</label>
						<select class="form-control input_usuario" name="id_unidad">
							<option value="">Selecciona una opción</option>
						</select>
					</div>
					<div class="col-lg-3">
						<div class="form-group">
							<label class="form-control-label">Permisos</label>
							<select required class="form-control input_usuario" name="permisos">
								<option value="">Selecciona una opción</option>
								<option value="">Administrador</option>
								<option value="">Usuario</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<div>

				<div class="col-12 text-end mt-2">
					<a href="#!" class="btn btn-sm bg-gradient-success mb-0 btn_guardar_usuario">
						Guardar &nbsp;<div class="fas fa-save"></div>
					</a>
				</div>
			</div>
		</div>
	</div>
</form>

<div class="container-fluid pt-2 pb-4">
	<div class="row">
<!-- 
	<button class="btn btn-danger ms-auto me-4 w-auto bg-gradient-danger switch_boton_formulario btn_nueva_regulacion" type="button" data-bs-toggle="collapse" data-bs-target="#formulario_usuarios" aria-expanded="false" aria-controls="formulario_usuarios">
		Nuevo&nbsp;&nbsp;<div class="fa fa-plus-circle"></div>
	</button>
-->
		<div class="col-12">
			<div class="card mb-4">
				<div class="card-header pb-0">
					<h6>Listado de usuarios</h6>
				</div>
				<div class="card-body px-0 pt-0 pb-2">
					<div class="table-responsive p-0">
						<table class="table align-items-center justify-content-center mb-0 mt-3 tabla_usuarios">
							<thead>
								<tr>
									<th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nombre de usuario</th>
									<th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Dirección</th>
									<th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Última vez</th>
									<th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Estatus</th>
									<th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Opciones</th>
								</tr>
							</thead>
							<tbody>
								
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>