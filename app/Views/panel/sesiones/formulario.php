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

		<div class="multisteps-form mb-7">

			<div class="row">
				<div class="col-12 col-xl-10 col-lg-11 col-sm-12 mx-auto my-4">
					<div class="multisteps-form__progress <?= $loading ?>">
						<button class="multisteps-form__progress-btn js-active" type="button" title="Datos del visitador">
							<span>Datos del expediente <span class="contador_campos">(<span class="contador_validos"></span> / <span class="contador_totales"></span>)</span></span>
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
												<label for="id_proveedor" class="form-label">Proveedor *</label>
												<select name="id_proveedor" id="id_proveedor" class="form-control input_expediente" required>
													<option value="">Selecciona una opción</option>
													<?php
													foreach ($proveedores as $key => $value) {
														echo '<option value="' . $value->id_proveedor . '">' . $value->nombre_comercial . '</option>';
													}
													?>
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
												<label for="id_punto" class="form-label">Sesión *</label>
												<select class="select2 form-control input_sesion" required="required">
													<option value="">Seleccona una opción</option>
												</select>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="id_punto" class="form-label">Punto *</label>
												<select name="id_punto" class="select2 form-control input_expediente" required="required">
													<option value="">Seleccona una opción</option>
												</select>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_correo" class="form-label">Dirección *</label>
												<select name="id_direccion" class="form-control input_expediente" required="required">
													<option value="">Seleccona una opción</option>
													<?php

													foreach ($direcciones as $key => $value) {
														echo '<option value="' . $value->id_direccion . '">' . $value->direccion . '</option>';
													}

													?>
												</select>
											</div>
										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="visitador_correo" class="form-label">Programa *</label>
												<select name="id_programa" class="form-control input_expediente" required="required">
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
												<label for="ruta_cfdi" class="form-label">CFDI *</label>
												<input id="ruta_cfdi" required type="file" class="form-control input_punto input_expediente_ruta" placeholder="Escribe el nombre..." target-input="ruta_cfdi" target=".contenedor_ver_cfdi">
												<input type="hidden" class="form-control input_punto" name="ruta_cfdi">
											</div>
											<div class="col-lg-12 flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_cfdi" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver CFDI
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="ruta_verificacion" class="form-label">Verificación *</label>
												<input id="ruta_verificacion" type="file" class="form-control input_punto input_expediente_ruta" placeholder="Escribe el nombre..." target-input="ruta_verificacion" target=".contenedor_ver_verificacion">
												<input type="hidden" class="form-control input_punto" name="ruta_verificacion">

											</div>

											<div class="col-lg-12 flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_verificacion" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver verificación
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="ruta_edo_cuenta" class="form-label">Estado de cuenta *</label>
												<input id="ruta_edo_cuenta" type="file" class="form-control input_punto input_expediente_ruta" placeholder="Escribe el nombre..." target-input="ruta_edo_cuenta" target=".contenedor_ver_edo_cuenta">
												<input type="hidden" class="form-control input_punto" name="ruta_edo_cuenta">
												
											</div>

											<div class="col-lg-12 flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_edo_cuenta" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver estado de cuenta
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Opinion de cumplimiento *</label>
												<input type="file" class="form-control input_punto input_expediente_ruta" placeholder="Escribe el nombre..." target-input="ruta_opinion_cumplimiento" target=".contenedor_ver_opinion_cumplimiento">
												<input type="hidden" class="form-control input_punto" name="ruta_opinion_cumplimiento">

											</div>

											<div class="col-lg-12 flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_opinion_cumplimiento" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver opinion
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Contrato *</label>
												<input type="file" class="form-control input_punto input_expediente_ruta" placeholder="Escribe el nombre..." target-input="ruta_contrato" target=".contenedor_ver_contrato">
												<input type="hidden" class="form-control input_punto" name="ruta_contrato">

											</div>

											<div class="col-lg-12 flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_contrato" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver contrato
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Recepción *</label>
												<input type="file" class="form-control input_punto input_expediente_ruta" placeholder="Escribe el nombre..." target-input="ruta_recepcion" target=".contenedor_ver_recepcion">
												<input type="hidden" class="form-control input_punto" name="ruta_recepcion">

											</div>

											<div class="col-lg-12 flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_recepcion" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver recepción
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Testigo *</label>
												<input type="file" class="form-control input_punto input_expediente_ruta" placeholder="Escribe el nombre..." target-input="ruta_testigo" target=".contenedor_ver_testigo">
												<input type="hidden" class="form-control input_punto" name="ruta_testigo">

											</div>

											<div class="col-lg-12 flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_testigo" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver testigo
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label class="form-label">Caratula *</label>
												<input type="file" class="form-control input_punto input_expediente_ruta" placeholder="Escribe el nombre..." target-input="ruta_caratula" target=".contenedor_ver_caratuka">
												<input type="hidden" class="form-control input_punto" name="ruta_caratula">

											</div>

											<div class="col-lg-12 flex justify-content-end align-items-center ms-auto mt-2 contenedor_ver_caratuka" style="display: none;">
												<a href="" target="_blank" class="btn btn-warning btn-sm flex align-items-center">
													<i class="fas fa-eye me-2 pe-none" style="font-size: 14px;" aria-hidden="true"></i>Ver caratula
												</a>
											</div>

										</div>

										<div class="col-xxl-4 col-lg-6 col-sm-12">
											<div class="form-group">
												<label for="" class="form-label">Observaciones *</label>
												<textarea placeholder="Escribe tus observaciones aquí..." class="form-control input_expediente" name="observaciones"></textarea>
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