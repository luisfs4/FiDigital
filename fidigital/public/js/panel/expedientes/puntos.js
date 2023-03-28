const crear_punto = async (json_editar = []) => {

    disableBtn('.btn_nuevo_punto');
    let titulo = 'Nuevo punto';
    let btn_confirmar = `Crear punto<i class="fas fa-arrow-right ms-2"></i>`;
    let titulo_success = '¡Creado!';
    let texto_success = 'El punto se añadió con éxito';

    if (json_editar.length != 0) {
        titulo = 'Editar punto';
        btn_confirmar = `Guardar punto<i class="fas fa-arrow-right ms-2"></i>`
        titulo_success = 'Guardado!';
        texto_success = 'El punto se guardó con éxito';
    }

    let options_padre = '';

    await $.ajax({
        url: '/panel/expedientes/puntos/get_by_ajax',
        dataType: 'JSON',
        type: 'POST',
        success: function (respuesta, text, xhr) {

            if (xhr.status == 204) {
                Swal.fire({
                    title: '¡Hay un problema!',
                    text: 'No se encontraron puntos',
                    icon: 'error',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: "btn bg-gradient-danger me-3",
                        cancelButton: "btn bg-gradient-secondary"
                    }
                });
            } else if (xhr.status == 200) {
                respuesta.forEach(punto => {
                    options_padre += `<option jerarquia="${punto.jerarquia}" value="${punto.id_punto}">${punto.jerarquia} ${punto.nombre_punto}</option>`;
                });

            }
        }
    }); // Fin ajax

    let options_expediente = '';

    await $.ajax({
        url: '/panel/expedientes/get_by_ajax',
        dataType: 'JSON',
        type: 'POST',
        success: function (respuesta, text, xhr) {

            if (xhr.status == 204) {
                Swal.fire({
                    title: '¡Hay un problema!',
                    text: 'No se encontraron puntos',
                    icon: 'error',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: "btn bg-gradient-danger me-3",
                        cancelButton: "btn bg-gradient-secondary"
                    }
                });
            } else if (xhr.status == 200) {
                respuesta.forEach(expediente => {
                    options_expediente += `<option value="${expediente.id_expediente}">Expediente ${expediente.fecha_pago}</option>`;
                });

            }
        }
    }); // Fin ajax

    let options_sesion = '';

    await $.ajax({
        url: '/panel/expedientes/sesiones/get_by_ajax',
        dataType: 'JSON',
        type: 'POST',
        success: function (respuesta, text, xhr) {

            if (xhr.status == 204) {
                Swal.fire({
                    title: '¡Hay un problema!',
                    text: 'No se encontraron puntos',
                    icon: 'error',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: "btn bg-gradient-danger me-3",
                        cancelButton: "btn bg-gradient-secondary"
                    }
                });
            } else if (xhr.status == 200) {
                respuesta.forEach(sesion => {
                    options_sesion += `<option numero_sesion="${sesion.numero_sesion}" value="${sesion.id_sesion}">${sesion.nombre_sesion}</option>`;
                });

            }
        }
    }); // Fin ajax


    Swal.fire({ //Crar una punto nueva
        title: titulo,
        buttonsStyling: false,
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: btn_confirmar,
        cancelButtonText: `Cancelar`,
        customClass: {
            confirmButton: 'btn bg-gradient-danger btn-md mx-2 move-icon-left',
            cancelButton: 'btn btn-gradient-danger btn-md mx-2 move-icon-left',
            loader: 'custom-loader'
        },
        html: `
        <form class="w-100 m-auto row p-2 text-start form_sesion" data-validate="parsley">
            <input type="hidden" class="input_punto form-control" name="id_punto">
            <div class="col-lg-6">
                <div class="form-group">
                    <label class="form-control-label"><i class="fas fa-folder-open"></i> Sesión:</label>
                    <select required name="id_sesion" class="input_punto form-control input-lg p-2 select2_swal">
                        <option value="">Selecciona</option>
                        ${options_sesion}
                    </select>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-calendar-alt"></i> Padre:</label>
                    <select required name="padre_id" class="input_punto form-control input-lg p-2 select2_swal">
                        <option value="">Ninguno</option>
                        ${options_padre}
                    </select>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label class="form-control-label"><i class="fas fa-laptop-house"></i> Jerarquia:</label>
                    <input required class="input_punto form-control" name="jerarquia" placeholder="1.1.1">
                </div>
            </div>
            <div class="col-lg-9">
                <div class="form-group">
                    <label class="form-control-label"><i class="fas fa-laptop-house"></i> Nombre del punto:</label>
                    <input required class="input_punto form-control" name="nombre_punto" placeholder="Escribe el nombre...">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label class="form-control-label"><i class="fas fa-folder-open"></i> Expediente:</label>
                    <select required name="id_expediente" class="input_punto form-control input-lg p-2">
                        <option value="">Selecciona</option>
                        ${options_expediente}
                    </select>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-comment-dots"></i> Observaciones:</label>
                    <textarea name="observaciones" class="input_punto form-control input-lg p-2" placeholder="Describe el Observaciones..."></textarea>
                </div>
            </div>
        </form>
        `,
        focusConfirm: false,
        loaderHtml: '<div class="spinner-border text-info text-gradient"></div>',
        preConfirm: function () {
            Swal.showLoading() //Boton con animación de carga

            //Validar con parsley el formulario
            if (!$(Swal.getPopup().querySelector('.form_sesion')).parsley().isValid()) {
                $(Swal.getPopup().querySelector('.form_sesion')).parsley().validate()
                Swal.showValidationMessage(`Por favor llena correctamente los campos`)
            }

            return {
                id_sesion: Swal.getPopup().querySelector('.input_punto[name="id_sesion"]').value.trim(),
                id_punto: Swal.getPopup().querySelector('.input_punto[name="id_punto"]').value.trim(),
                jerarquia: Swal.getPopup().querySelector('.input_punto[name="jerarquia"]').value.trim(),
                nombre_punto: Swal.getPopup().querySelector('.input_punto[name="nombre_punto"]').value,
                padre_id: Swal.getPopup().querySelector('.input_punto[name="padre_id"]').value,
                id_expediente: Swal.getPopup().querySelector('.input_punto[name="id_expediente"]').value.trim(),
                observaciones: Swal.getPopup().querySelector('.input_punto[name="observaciones"]').value.trim()
            }
        },
        willOpen: (e, ee) => {
            if (json_editar) {

                for (const key of Object.keys(json_editar)) {
                    if (
                        key === 'created_at' ||
                        key === 'created_by' ||
                        key === 'updated_by' ||
                        key === 'updated_at'
                    ) continue;

                    const input = e.querySelector(`[name="${key}"]`);

                    if (input) {
                        input.value = json_editar[key];
                    }
                }
            }
        },
        didOpen: () => {
            //Iniciar select2 para las sesiones
            $('.select2_swal').select2({
                placeholder: "Selecciona una opción",
            });

            $('.input_punto[name="id_sesion"]').change((e) => {
                let valor = $(e.currentTarget).children('option:selected').attr("numero_sesion");
                $('.input_punto[name="jerarquia"]').val(valor+".");
            })

            $('.input_punto[name="padre_id"]').change((e) => {
                let valor = $(e.currentTarget).children('option:selected').attr("jerarquia");
                $('.input_punto[name="jerarquia"]').val(valor+".");
            })
        },
        onDismiss: () => {

        }
    }).then(async (result) => {

        if (result.isConfirmed) { //Validar clic en boton de aceptar
            await $.ajax({
                url: '/panel/expedientes/puntos/post_punto',
                data: {
                    id_punto: result.value.id_punto,
                    jerarquia: result.value.jerarquia,
                    nombre_punto: result.value.nombre_punto,
                    padre_id: result.value.padre_id,
                    id_expediente: result.value.id_expediente,
                    observaciones: result.value.observaciones,
                    id_sesion: result.value.id_sesion
                },
                dataType: 'JSON',
                type: 'POST',
                success: function (respuesta, text, xhr) {

                    if (xhr.status == 200) {
                        Swal.fire({
                            title: titulo_success,
                            text: texto_success,
                            icon: 'success',
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: "btn bg-gradient-danger me-3",
                                cancelButton: "btn bg-gradient-secondary"
                            }
                        });

                        return true;
                    }
                },
                error: (err, texto) => {
                    error_ajax(JSON.parse(err.responseText)['message']);
                }
            }); // Fin ajax

        }
    });

    enableBtn('.btn_nuevo_punto');
};

const editar_punto = async (id_sesion) => {

    await $.ajax({
        url: '/panel/expedientes/sesiones/get_by_ajax',
        data: {
            id_sesion
        },
        dataType: 'JSON',
        type: 'POST',
        success: function (respuesta, text, xhr) {

            if (xhr.status == 204) {
                Swal.fire({
                    title: '¡Hay un problema!',
                    text: 'No se encontraron sesiones',
                    icon: 'error',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: "btn bg-gradient-danger me-3",
                        cancelButton: "btn bg-gradient-secondary"
                    }
                });
            } else if (xhr.status == 200) {
                crear_sesion(respuesta[0]);
            }
        }
    }); // Fin ajax
}

$(() => {

    //Si dan click en el boton de nueva punto
    $('.btn_nuevo_punto').click((e) => {
        crear_punto();
    })

})