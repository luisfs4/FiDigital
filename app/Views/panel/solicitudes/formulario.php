<link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet">

<div class="container-fluid py-4">
	<div class="row">
		<div class="col-lg-12 text-center">
			<h3 class="text-black mb-3"><?= $titulo ?></h3>
			<h5 class="text-secondary font-weight-normal subtitulo_formulario"><?= $subtitulo ?? '' ?></h5>

			<?php

			$loading = '';

			if (isset($readonly)) {
				/**
				 * Setear variable readonly a 1 para llamar a la función que pondrá los campos de solo lectura
				 */

				echo "				
					<script>let readonly = 1;</script>
				";
			}

			if (isset($visualizar)) {
				/**
				 * Imprimir el input con el id de borrador a validar
				 * Imprimir JSON con los datos del borrador
				 * Setear variable editar a 1 para insertar los valores en todos los campos
				 */

				echo "
					<input type=\"hidden\" class=\"input_expediente\" name=\"id_visitador\" value=\"$id_visitador\">
					<input type=\"hidden\" name=\"json_visitador\" value='" . json_encode($visitador) . "'>
					<script>let editar = 1;</script>
					<script>let visualizar = 1;</script>
				";

				$loading = ' is-loading ';
			}


			if (isset($editar)) {
				/**
				 * Imprimir el input con el id de borrador a editar
				 * Imprimir JSON con los datos del borrador
				 * Setear variable editar a 1 para llamar a la función de editado
				 */

				echo "
					<input type=\"hidden\" class=\"input_expediente\" name=\"id_visitador\" value=\"$id_visitador\">
					<input type=\"hidden\" name=\"json_visitador\" value='" . json_encode($visitador) . "'>
					<script>let editar = 1;</script>
				";

				$loading = ' is-loading ';
			}

			?>
		</div>

		<div class="multisteps-form mb-7">

			<div class="row mt-4">
				<div class="col-12 col-xxl-10 col-lg-11 m-auto">
					<div class="multisteps-form__form <?= $loading ?>" style="height: 762px;">

						<div class="card multisteps-form__panel p-4 border-radius-xl bg-white js-active" data-animation="FadeIn">
							<div class="multisteps-form__content px-4">

								<form data-validate="parsley">
									<div class="row align-items-start gy-2">

										<div class="col-lg-12 text-center">
											<h6 class="mb-0 font-weight-normal text-info text-gradient">Datos de la solicitud</h6>
											<p class="text-sm mb-0">Por favor completa todos los campos requeridos</p>
										</div>

										<hr class="horizontal dark my-3">

										<!-- Selección de Sesion -->
										<div class="col-lg-3 col-md-6 mb-3">
											<label for="direccion" class="form-label">Sesión</label>
											<select class="form-select input_solicitud" id="id_sesion" name="id_sesion" required>
												<option selected disabled value="">Selecciona...</option>
												<?php foreach ($sesiones as $sesion) : ?>
													<option value="<?= htmlspecialchars($sesion->id_sesion); ?>"><?= $sesion->numero_sesion?> <?= htmlspecialchars($sesion->nombre_sesion); ?></option>
												<?php endforeach; ?>
											</select>
										</div>

										<!-- Selección de Dirección -->
										<div class="col-lg-3 col-md-6 mb-3">
											<label for="direccion" class="form-label">Dirección</label>
											<select class="form-select input_solicitud" id="id_direccion" name="id_direccion" required>
												<option selected disabled value="">Selecciona...</option>
												<?php foreach ($direcciones as $direccion) : ?>
													<option value="<?= htmlspecialchars($direccion->id_direccion); ?>"><?= htmlspecialchars($direccion->direccion); ?></option>
												<?php endforeach; ?>
											</select>
										</div>

										<!-- Selección de Programa -->
										<div class="col-lg-3 col-md-6 mb-3">
											<label for="programa" class="form-label">Programa</label>
											<select class="form-select input_solicitud" id="id_programa" name="id_programa" required>
												<option selected disabled value="">Selecciona...</option>
												<?php foreach ($programas as $programa) : ?>
													<option value="<?= htmlspecialchars($programa->id_programa); ?>"><?= htmlspecialchars($programa->programa); ?></option>
												<?php endforeach; ?>
											</select>
										</div>

										<!-- Tipo de Adquisición -->
										<div class="col-lg-2 col-md-4 mb-3">
											<label for="tipo_adquisicion" class="form-label">Tipo de Adquisición</label>
											<select class="form-control form-select input_solicitud" id="tipo_adquisicion" name="tipo_adquisicion" required>
												<option value="">Selecciona...</option>
												<option value="ordinaria">Ordinaria</option>
												<option value="extraordinaria">Extraordinaria</option>
											</select>
										</div>

										<!-- Proveedor -->
										<div class="col-lg-4 col-md-4 mb-3">
											<label for="proveedor" class="form-label">Proveedor</label>
											<select class="form-select input_solicitud" id="id_proveedor" name="id_proveedor" required>
												<option selected disabled value="">Selecciona...</option>
												<?php foreach ($proveedores as $proveedor) : ?>
													<option value="<?= htmlspecialchars($proveedor->id_proveedor); ?>"><?= htmlspecialchars($proveedor->nombre); ?></option>
												<?php endforeach; ?>
											</select>
										</div>

										<!-- Monto -->
										<div class="col-lg-3 col-md-4 mb-3">
											<label for="monto" class="form-label">Monto</label>
											<input type="number" class="form-control input_solicitud" step="1000" id="monto" name="monto" placeholder="Ingresa el monto" min="0" required>
										</div>

										<!-- Presupuesto -->
										<div class="col-lg-3 col-md-4 mb-3">
											<label for="presupuesto" class="form-label">Presupuesto</label>
											<input type="number" class="form-control input_solicitud" step="1000" id="presupuesto" name="presupuesto" placeholder="Ingresa el monto" min="0" required>
										</div>

										<!-- Checkbox Admisión/Prevención -->
										<div class="col-lg-2 col-md-4 mb-3">
											<label for="admision_prevencion" class="form-label">Admisión/Prevención</label>
											<div class="form-check">
												<input class="form-check-input input_solicitud" type="checkbox" id="admision_prevencion" name="admision_prevencion">
												<label class="form-check-label" for="admision_prevencion">Sí</label>
											</div>
										</div>


									</div>

								</form>

								<div class="row flex-row justify-content-end mt-4">
									<div class="w-auto">
										<button class="btn bg-gradient-dark ms-2 mb-0 btn_guardar" type="button" title="Guardar">Guardar solicitud</button>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="https://unpkg.com/filepond/dist/filepond.min.js"></script>
<!-- Plugin: File Validate Type -->
<script src="https://unpkg.com/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.min.js"></script>
<!-- Plugin: File Validate Size -->
<script src="https://unpkg.com/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.min.js"></script>
<!-- Plugin: Image Preview (opcional si deseas previsualizaciones de imágenes) -->
<script src="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.js"></script>
<link href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css" rel="stylesheet">

<script>
	document.addEventListener('DOMContentLoaded', function() {
		// Asegúrate de registrar los plugins que necesitas
		FilePond.registerPlugin(
			FilePondPluginFileValidateType,
			FilePondPluginFileValidateSize,
			FilePondPluginImagePreview
		);

		// Configura FilePond
		FilePond.setOptions({
			labelIdle: 'Arrastra y suelta tu archivo o <span class="filepond--label-action">Examina</span>',
			maxFileSize: '3MB',
			maxFiles: 1,
			acceptedFileTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
			fileValidateTypeDetectType: (source, type) => new Promise((resolve, reject) => {
				// Usa la función de detección de tipo de archivo para personalizar cómo determinas el tipo de archivo
				resolve(type);
			}),
			labelFileProcessingError: (error) => {
				// Personaliza el mensaje de error
				switch (error.code) {
					case 'file-too-large':
						return 'Archivo demasiado grande';
					case 'file-invalid-type':
						return 'Tipo de archivo no permitido';
					default:
						return 'Error al subir archivo';
				}
			}
		});

		// Inicializa FilePond en todos los elementos input de tipo file
		FilePond.parse(document.body);


		$('[name="id_punto"], [name="id_seccion"], [name="id_carpeta"], [name="id_subcarpeta"]').on('change', function() {
			let siguienteDisponible = $(this).find('option:selected').attr('siguiente_disponible');
			let jerarquia = $(this).find('option:selected').attr('jerarquia');

			if (siguienteDisponible) {
				let nuevaJerarquia = jerarquia ? `${jerarquia}.${siguienteDisponible}` : siguienteDisponible;
				$('[name="jerarquia"]').val(nuevaJerarquia);
			}
		});

		$('[name="id_sesion"]').on('change', (e) => {
			const id_sesion = $(e.currentTarget).val();
			cargar_opciones_puntos('[name="id_punto"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', {
				id_sesion: id_sesion
			});
			$('[name="id_seccion"], [name="id_carpeta"], [name="id_subcarpeta"]').empty().append('<option value="">Selecciona una opción</option>');
		});

		$('[name="id_punto"]').on('change', (e) => {
			const id_punto = $(e.currentTarget).val();
			cargar_opciones_puntos('[name="id_seccion"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', {
				padre_id: id_punto
			});
			$('[name="id_carpeta"], [name="id_subcarpeta"]').empty().append('<option value="">Selecciona una opción</option>');
		});

		$('[name="id_seccion"]').on('change', (e) => {
			const id_punto = $(e.currentTarget).val();
			cargar_opciones_puntos('[name="id_carpeta"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', {
				padre_id: id_punto
			});
			$('[name="id_subcarpeta"]').empty().append('<option value="">Selecciona una opción</option>');
		});

		$('[name="id_carpeta"]').on('change', (e) => {
			const id_punto = $(e.currentTarget).val();
			cargar_opciones_puntos('[name="id_subcarpeta"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', {
				padre_id: id_punto
			});
		});

		$('#monto_autorizado').on('change', function() {
			var valorAutorizado = $(this).val();
			$('#monto_pagado').attr('max', valorAutorizado);
			$('#monto_pagado').parsley().validate();
		});
	});
</script>