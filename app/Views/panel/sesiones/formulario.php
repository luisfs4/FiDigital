<link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet">

<div class="container-fluid py-4">
	<div class="row">
		<div class="col-lg-12 text-center">
			<h3 class="text-black mb-5"><?= $titulo ?></h3>
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

			<div class="row">
				<div class="col-12 col-xl-10 col-lg-11 col-sm-12 mx-auto my-4">
					<div class="multisteps-form__progress <?= $loading ?>">
						<button class="multisteps-form__progress-btn js-active" type="button" title="Datos del expediente">
							<span>Datos del expediente <span class="contador_campos">(<span class="contador_validos"></span> / <span class="contador_totales"></span>)</span></span>
						</button>

						<button class="multisteps-form__progress-btn" type="button" title="Archivos del expediente">
							<span>Archivos del expediente <span class="contador_campos">(<span class="contador_validos"></span> / <span class="contador_totales"></span>)</span></span>
						</button>

						<button class="multisteps-form__progress-btn" type="button" title="Datos del proveedor">
							<span>Datos del proveedor <span class="contador_campos">(<span class="contador_validos"></span> / <span class="contador_totales"></span>)</span></span>
						</button>

					</div>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-12 col-xxl-10 col-lg-11 m-auto">
					<div class="multisteps-form__form <?= $loading ?>" style="height: 762px;">

						<div class="card multisteps-form__panel p-4 border-radius-xl bg-white js-active" data-animation="FadeIn">
							<div class="multisteps-form__content px-4">

								<form data-validate="parsley">
									<div class="row align-items-start gy-2">

										<div class="col-lg-12 text-center">
											<h6 class="mb-0 font-weight-normal text-info text-gradient">Datos del expediente</h6>
											<p class="text-sm mb-0">Por favor completa todos los campos requeridos</p>
										</div>

										<hr class="horizontal dark my-3">

										<div class="col-lg-3">
											<div class="form-group">
												<label class="form-control-label">Sesión:</label>
												<select name="id_sesion" class="input_punto form-control input-lg p-2 select_sesion input_sesion input_expediente" required>
													<option value="">Selecciona una opción</option>
												</select>
											</div>
										</div>
										<div class="col-lg-3">
											<div class="form-group">
												<label class="form-control-label"><i class="far fa-calendar-alt"></i> Punto:</label>
												<select name="id_punto" class="input_punto select_punto id_punto form-control input-lg p-2 input_expediente" required>
												</select>
											</div>
										</div>

										<div class="col-lg-2">
											<div class="form-group">
												<label class="form-control-label"><i class="far fa-calendar-alt"></i> Sección:</label>
												<select name="id_seccion" class="input_punto id_seccion form-control input-lg p-2 input_expediente">
												</select>
											</div>
										</div>
										<div class="col-lg-2">
											<div class="form-group">
												<label class="form-control-label"><i class="far fa-calendar-alt"></i> Carpeta:</label>
												<select name="id_carpeta" class="input_punto id_carpeta form-control input-lg p-2 input_expediente">
												</select>
											</div>
										</div>
										<div class="col-lg-2">
											<div class="form-group">
												<label class="form-control-label"><i class="far fa-calendar-alt"></i> Subcarpeta:</label>
												<select name="id_subcarpeta" class="input_punto id_subcarpeta form-control input-lg p-2 input_expediente">
												</select>
											</div>
										</div>

										<div class="col-xxl-2 col-lg-4 col-sm-12">
											<div class="form-group">
												<label for="monto_autorizado" class="form-label">Monto autorizado*</label>
												<input type="number" id="monto_autorizado" class="form-control input_expediente" placeholder="0" name="monto_autorizado" min="0" max="999999999" required>
											</div>
										</div>

										<div class="col-xxl-2 col-lg-4 col-sm-12">
											<div class="form-group">
												<label for="monto_pagado" class="form-label">Monto pagado*</label>
												<input type="number" id="monto_pagado" class="form-control input_expediente" placeholder="0" name="monto_pagado" min="0" max="999999999" required>
											</div>
										</div>

										<div class="col-xxl-2 col-lg-4 col-sm-12">
											<div class="form-group">
												<label for="" class="form-label">Fecha de pago</label>
												<input type="date" class="form-control input_expediente" name="fecha_pago" required>
											</div>
										</div>

										<div class="col-xxl-2 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_correo" class="form-label">Dirección</label>
												<select name="id_direccion" class="form-control input_expediente" required>
													<option value="">Seleccona una opción</option>
													<?php

													foreach ($direcciones as $key => $value) {
														echo '<option value="' . $value->id_direccion . '">' . $value->direccion . '</option>';
													}

													?>
												</select>
											</div>
										</div>

										<div class="col-xxl-3 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_correo" class="form-label">Programa</label>
												<select name="id_programa" class="form-control input_expediente" required>
													<option value="">Seleccona una opción</option>
													<?php

													foreach ($programas as $key => $value) {
														echo '<option value="' . $value->id_programa . '">' . $value->programa . '</option>';
													}

													?>
												</select>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="" class="form-label">Observaciones</label>
												<textarea placeholder="Escribe tus observaciones aquí..." class="form-control input_expediente" name="observaciones"></textarea>
											</div>
										</div>


									</div>

								</form>

								<div class="row flex-row justify-content-end mt-4">
									<div class="w-auto">
										<button class="btn bg-gradient-dark ms-2 mb-0 js-btn-next" type="button" title="Siguiente">Siguiente</button>
									</div>
								</div>
							</div>
						</div>

						<div class="card multisteps-form__panel p-4 border-radius-xl bg-white" data-animation="FadeIn">
							<div class="multisteps-form__content px-4">

								<form data-validate="parsley">
									<div class="row align-items-start gy-2 my-3">

										<div class="col-lg-12 text-center">
											<h6 class="mb-0 font-weight-normal text-info text-gradient">Archivos del expediente</h6>
											<p class="text-sm mb-0">Por favor adjunta todos los documentos requeridos</p>
										</div>
										<hr class="horizontal dark my-3">

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="ruta_cfdi" class="form-label">CFDI</label>
												<input id="ruta_cfdi" type="file" class="form-control input_expediente_ruta filepond" name="ruta_cfdi" data-max-file-size="5MB" data-max-files="1">
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="ruta_verificacion" class="form-label">Verificación</label>
												<input id="ruta_verificacion" type="file" class="form-control input_expediente_ruta filepond" name="ruta_verificacion" data-max-file-size="5MB" data-max-files="1">
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="ruta_edo_cuenta" class="form-label">Estado de cuenta</label>
												<input id="ruta_edo_cuenta" type="file" class="form-control input_expediente_ruta filepond" name="ruta_edo_cuenta" data-max-file-size="5MB" data-max-files="1">
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Opinion de cumplimiento</label>
												<input type="file" class="form-control input_expediente filepond" name="ruta_opinion_cumplimiento" data-max-file-size="5MB" data-max-files="1">
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Contrato</label>
												<input type="file" class="form-control input_expediente filepond" name="ruta_contrato" data-max-file-size="5MB" data-max-files="1" required>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Recepción</label>
												<input type="file" class="form-control input_expediente filepond" name="ruta_recepcion" data-max-file-size="5MB" data-max-files="1">
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Testigo</label>
												<input type="file" class="form-control input_expediente filepond" name="ruta_testigo" data-max-file-size="5MB" data-max-files="1">
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Caratula</label>
												<input type="file" class="form-control input_expediente filepond" name="ruta_caratula" data-max-file-size="5MB" data-max-files="1">
											</div>
										</div>

									</div>
								</form>

								<div class="row flex-row justify-content-end mt-4">
									<div class="w-auto">
										<button class="btn bg-gradient-dark ms-2 mb-0 js-btn-next" type="button" title="Siguiente">Siguiente</button>
									</div>
								</div>
							</div>
						</div>

						<div class="card multisteps-form__panel p-4 border-radius-xl bg-white" data-animation="FadeIn">
							<div class="multisteps-form__content px-4">

								<form data-validate="parsley">
									<div class="row align-items-start gy-2">

										<div class="col-lg-12 text-center">
											<h6 class="mb-0 font-weight-normal text-info text-gradient">Datos del proveedor</h6>
											<p class="text-sm mb-0">Por favor completa todos los campos requeridos</p>
										</div>

										<hr class="horizontal dark my-3">

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="id_proveedor" class="form-label">Proveedor</label>
												<select name="id_proveedor" id="id_proveedor" class="form-control input_expediente" required>
													<option value="">Selecciona una opción</option>
													<?php
													foreach ($proveedores as $key => $value) {
														echo '<option value="' . $value->id_proveedor . '">' . $value->nombre . '</option>';
													}
													?>
												</select>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="ruta_cfdi" class="form-label">Identificación oficial</label>
												<input type="file" class="form-control input_expediente filepond" name="ruta_cfdi" data-max-file-size="5MB" data-max-files="1">
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="ruta_verificacion" class="form-label">Comprobante de domicilio</label>
												<input type="file" class="form-control input_expediente filepond" name="ruta_verificacion" data-max-file-size="5MB" data-max-files="1">
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Opinión de cumplimiento</label>
												<input type="file" class="form-control input_expediente filepond" name="ruta_recepcion" data-max-file-size="5MB" data-max-files="1">
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Estado de Cuenta</label>
												<input type="file" class="form-control input_expediente filepond" name="ruta_recepcion" data-max-file-size="5MB" data-max-files="1">
											</div>

										</div>

									</div>
								</form>

								<div class="row flex-row justify-content-end mt-4">
									<div class="w-auto">
										<button class="btn bg-gradient-dark ms-2 mb-0 crear_expediente" type="button" title="Crear">Crear expediente</button>
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
	let monto_autorizado_punto = 0;

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
			if (id_punto) {
				monto_autorizado_punto = $(e.currentTarget).children('option:selected').attr('monto_restante')
				actualizar_max_monto(monto_autorizado_punto)
				cargar_opciones_puntos('[name="id_seccion"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', {
					padre_id: id_punto
				});
				$('[name="id_carpeta"], [name="id_subcarpeta"]').empty().append('<option value="">Selecciona una opción</option>');
			}
		});

		$('[name="id_seccion"]').on('change', (e) => {
			const id_punto = $(e.currentTarget).val();
			if (id_punto) {
				monto_autorizado_punto = $(e.currentTarget).children('option:selected').attr('monto_restante')
				actualizar_max_monto(monto_autorizado_punto)
				cargar_opciones_puntos('[name="id_carpeta"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', {
					padre_id: id_punto
				});
				$('[name="id_subcarpeta"]').empty().append('<option value="">Selecciona una opción</option>');
			}
		});

		$('[name="id_carpeta"]').on('change', (e) => {
			const id_punto = $(e.currentTarget).val();
			if (id_punto) {
				monto_autorizado_punto = $(e.currentTarget).children('option:selected').attr('monto_restante')
				actualizar_max_monto(monto_autorizado_punto)
				cargar_opciones_puntos('[name="id_subcarpeta"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', {
					padre_id: id_punto
				});
			}
		});

		$('#monto_autorizado').on('change', function() {
			var valorAutorizado = $(this).val();
			$('#monto_pagado').attr('max', valorAutorizado);
			$('#monto_pagado').parsley().validate();
		});

		const actualizar_max_monto = (monto) => {
			$('#monto_autorizado').attr('max', monto);
		}
	});
</script>