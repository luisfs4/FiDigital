<div class="container-fluid py-4">

	<div class="row">
		<div class="col-lg-12 text-center">
			<h3 class="text-black"><?= $titulo ?></h3>
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
					<input type=\"hidden\" class=\"input_punto\" name=\"id_visitador\" value=\"$id_visitador\">
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
					<input type=\"hidden\" class=\"input_punto\" name=\"id_visitador\" value=\"$id_visitador\">
					<input type=\"hidden\" name=\"json_visitador\" value='" . json_encode($visitador) . "'>
					<script>let editar = 1;</script>
				";

				$loading = ' is-loading ';
			}

			?>
		</div>

		<div class="multisteps-form mb-5">

			<div class="row">
				<div class="col-12 col-xl-10 col-lg-11 col-sm-12 mx-auto my-4">
					<div class="multisteps-form__progress <?= $loading ?>">
						<button class="multisteps-form__progress-btn js-active" type="button" title="Datos del visitador">
							<span>Datos del expediente <span class="contador_campos">(<span class="contador_validos"></span> / <span class="contador_totales"></span>)</span></span>
						</button>
						<button class="multisteps-form__progress-btn" type="button" title="Datos de contacto">
							<span>Datos del punto <span class="contador_campos">(<span class="contador_validos"></span> / <span class="contador_totales"></span>)</span></span></span>
						</button>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-12 col-lg-10 m-auto">
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

										
										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_correo" class="form-label">Proveedor *</label>
												<select name="id_proveedor" class="form-control input_expediente" required="required">
													<option value="1">Proveedor 1</option>
												</select>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="" class="form-label">Monto *</label>
												<input type="number" class="form-control input_expediente" placeholder="0" name="monto" min="0" max="999999999" required>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="" class="form-label">Fecha de pago *</label>
												<input type="date" class="form-control input_expediente" name="fecha_pago" required>
											</div>
										</div>

                                        
										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_correo" class="form-label">Dirección *</label>
												<select name="id_proveedor" class="form-control input_expediente" required="required">
													<option value="1">Dirección 1</option>
												</select>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_correo" class="form-label">Programa *</label>
												<select name="id_proveedor" class="form-control input_expediente" required="required">
													<option value="1">Programa 1</option>
												</select>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="ruta_perfil_visitador" class="form-label">CFDI *</label>
												<input type="file" class="form-control input_punto input_punto_ruta" placeholder="Escribe el nombre..." target-input="ruta_cfdi" target=".contenedor_ver_cfdi">
												<input type="hidden" class="form-control input_punto" name="ruta_cfdi">

											</div>

											<div class="col-lg-12 d-flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_cfdi" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm d-flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver CFDI
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Verificación *</label>
												<input type="file" class="form-control input_punto input_punto_ruta" placeholder="Escribe el nombre..." target-input="ruta_verificacion" target=".contenedor_ver_verificacion">
												<input type="hidden" class="form-control input_punto" name="ruta_verificacion">

											</div>

											<div class="col-lg-12 d-flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_verificacion" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm d-flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver verificación
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Estado de cuenta *</label>
												<input type="file" class="form-control input_punto input_punto_ruta" placeholder="Escribe el nombre..." target-input="ruta_edo_cuenta" target=".contenedor_ver_edo_cuenta">
												<input type="hidden" class="form-control input_punto" name="ruta_edo_cuenta">

											</div>

											<div class="col-lg-12 d-flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_edo_cuenta" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm d-flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver estado de cuenta
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Opinion de cumplimiento *</label>
												<input type="file" class="form-control input_punto input_punto_ruta" placeholder="Escribe el nombre..." target-input="ruta_opinion_cumplimiento" target=".contenedor_ver_opinion_cumplimiento">
												<input type="hidden" class="form-control input_punto" name="ruta_opinion_cumplimiento">

											</div>

											<div class="col-lg-12 d-flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_opinion_cumplimiento" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm d-flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver opinion
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Contrato *</label>
												<input type="file" class="form-control input_punto input_punto_ruta" placeholder="Escribe el nombre..." target-input="ruta_contrato" target=".contenedor_ver_contrato">
												<input type="hidden" class="form-control input_punto" name="ruta_contrato">

											</div>

											<div class="col-lg-12 d-flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_contrato" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm d-flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver contrato
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Recepción *</label>
												<input type="file" class="form-control input_punto input_punto_ruta" placeholder="Escribe el nombre..." target-input="ruta_recepcion" target=".contenedor_ver_recepcion">
												<input type="hidden" class="form-control input_punto" name="ruta_recepcion">

											</div>

											<div class="col-lg-12 d-flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_recepcion" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm d-flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver recepción
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Testigo *</label>
												<input type="file" class="form-control input_punto input_punto_ruta" placeholder="Escribe el nombre..." target-input="ruta_testigo" target=".contenedor_ver_testigo">
												<input type="hidden" class="form-control input_punto" name="ruta_testigo">

											</div>

											<div class="col-lg-12 d-flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_testigo" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm d-flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver testigo
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="" class="form-label">Observaciones *</label>
												<textarea placeholder="Escribe tus observaciones aquí..." class="form-control input_expediente" name="observaciones" required></textarea>
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

									<div class="row align-items-end gy-2">

										<div class="col-lg-12 text-center">
											<h6 class="mb-0 font-weight-normal text-info text-gradient">Datos de contacto</h6>
											<p class="text-sm mb-0">Por favor completa todos los campos requeridos</p>
										</div>

										<hr class="horizontal dark my-3">

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_domicilio" class="form-label">Domicilio *</label>
												<input type="text" class="form-control input_punto" placeholder="Escribe el domicilio ..." name="visitador_domicilio" required>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_telefono" class="form-label">Numero Telefónico *</label>
												<input type="number" min="0" max="9999999999" class="form-control input_punto" placeholder="3338182200" name="visitador_telefono" required>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_ext" class="form-label">Ext *</label>
												<input type="number" min="0" max="99999" class="form-control input_punto" placeholder="2500" name="visitador_ext" required>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_correo" class="form-label">Correo electrónico *</label>
												<input type="email" class="form-control input_punto" placeholder="Escribe el correo ..." name="visitador_correo" required>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-control-label">Dias de atención</label>
												<select class="form-control input_punto select2_init" name="visitador_dias_atencion" multiple>
													<option>Lunes</option>
													<option>Martes</option>
													<option>Miercoles</option>
													<option>Jueves</option>
													<option>Viernes</option>
													<option>Sabado</option>
													<option>Domingo</option>
												</select>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-control-label">Horario de atención inicio</label>
												<input type="time" class="form-control input_punto" name="horario_inicio" required>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-control-label">Horario de atención fin</label>
												<input type="time" class="form-control input_punto" name="horario_fin" required>
											</div>
										</div>

									</div>
								</form>
								<div class="row flex-row justify-content-between mt-4">
									<div class="w-auto">
										<button class="btn bg-gradient-light mb-0 js-btn-prev" type="button" title="Atrás">Atrás</button>
									</div>
									<div class="w-auto">
										<button class="btn bg-gradient-dark ms-2 mb-0 crear_visitador" type="button" title="Crear">Crear visitador</button>
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