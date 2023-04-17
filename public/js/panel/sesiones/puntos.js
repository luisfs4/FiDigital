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

    let options_sesion = '';
    let options_padre = '';

    await $.ajax({
        url: '/FiDigital/panel/sesiones/get_by_ajax',
        dataType: 'JSON',
        type: 'POST',
        success: function (respuesta, text, xhr) {

            if (xhr.status == 200) {
                respuesta.forEach(sesion => {
                    options_sesion += `<option numero_sesion="${sesion.numero_sesion}" value="${sesion.id_sesion}">${sesion.numero_sesion}.- ${sesion.nombre_sesion}</option>`;
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
                    <select name="padre_id" class="input_punto form-control input-lg p-2 select2_swal">
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
        preConfirm: async () => {
            Swal.showLoading() //Boton con animación de carga

            //Validar con parsley el formulario
            if (!$(Swal.getPopup().querySelector('.form_sesion')).parsley().isValid()) {
                $(Swal.getPopup().querySelector('.form_sesion')).parsley().validate()
                Swal.showValidationMessage(`Por favor llena correctamente los campos`)
            }

            // Realizar la solicitud AJAX para verificar la jerarquía duplicada
            let validacion_jerarquia = await $.ajax({
                url: '/fidigital/panel/sesiones/puntos/check_jerarquia',
                type: 'POST',
                data: {
                    jerarquia: Swal.getPopup().querySelector('.input_punto[name="jerarquia"]').value.trim()
                },
                dataType: 'json',
            });

            if (validacion_jerarquia.duplicate) {
                $('[name="jerarquia"]').addClass('parsley-error');
                $('[name="jerarquia"]').removeClass('parsley-success');
                Swal.showValidationMessage(`Este id de jerarquia ya ha sido creado`);
                return false;
            }


            return {
                id_sesion: Swal.getPopup().querySelector('.input_punto[name="id_sesion"]').value.trim(),
                id_punto: Swal.getPopup().querySelector('.input_punto[name="id_punto"]').value.trim(),
                jerarquia: Swal.getPopup().querySelector('.input_punto[name="jerarquia"]').value.trim(),
                nombre_punto: Swal.getPopup().querySelector('.input_punto[name="nombre_punto"]').value,
                padre_id: Swal.getPopup().querySelector('.input_punto[name="padre_id"]').value,
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

            $('.input_punto[name="id_sesion"]').change(async (e) => {
                let valor = $(e.currentTarget).children('option:selected').attr("numero_sesion");
                $('.input_punto[name="jerarquia"]').val(valor + ".");


                options_padre = '';

                await $.ajax({
                    url: '/FiDigital/panel/sesiones/puntos/get_by_ajax',
                    dataType: 'JSON',
                    data: {
                        id_sesion: valor
                    },
                    type: 'POST',
                    success: function (respuesta, text, xhr) {

                        $('.input_punto[name="padre_id"]').empty();

                        if (xhr.status == 200) {
                            $('.input_punto[name="padre_id"]').append(`<option value="">Ninguno</option>`);

                            respuesta.forEach(punto => {
                                $('.input_punto[name="padre_id"]').append(`<option jerarquia="${punto.jerarquia}" value="${punto.id_punto}">${punto.jerarquia} ${punto.nombre_punto}</option>`);
                            });

                            $('.input_punto[name="padre_id"]').trigger("change");
                        }
                    }
                }); // Fin ajax
            })

            $('.input_punto[name="padre_id"]').change((e) => {
                let valor = $(e.currentTarget).children('option:selected').attr("jerarquia");

                if (valor) {
                    $('.input_punto[name="jerarquia"]').val(valor + ".");
                }
            })
        },
        onDismiss: () => {

        }
    }).then(async (result) => {

        if (result.isConfirmed) { //Validar clic en boton de aceptar
            await $.ajax({
                url: '/FiDigital/panel/sesiones/puntos/post_punto',
                data: {
                    id_punto: result.value.id_punto,
                    jerarquia: result.value.jerarquia,
                    nombre_punto: result.value.nombre_punto,
                    padre_id: result.value.padre_id,
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
        url: '/FiDigital/panel/sesionessiones/get_by_ajax',
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

function render_puntos(hierarchy, level = 0) {
    if (hierarchy.length === 0) {
        return '<div class="alert border-danger text-gradient text-danger my-3">No existen puntos registrados.</div>';
    }

    let html = '<ul class="list-group">';
    for (const point of hierarchy) {
        let html_boton = '';
        if (point.id_expediente) {
            html_boton = `
                <a href="/fidigital/panel/sesiones/${point.id_expediente}/detalle" class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-info shadow text-white rounded">
                    <i class="fas fa-folder text-white" aria-hidden="true"></i>
                </a>
            `;
        }

        //Contenedor de lista
        html += `
            <li class="list-group-item">
                <div class="d-flex flex-wrap justify-content-between align-items-center w-100 my-2">
                    <div class="text-start">
                        ${"&nbsp;".repeat(level * 2)}
                        <span>${point.jerarquia} - ${point.nombre_punto}</span>
                    </div>
                    ${html_boton}
                </div>
        `;
        //Imprimir hijo
        if (point.children) {
            html += render_puntos(point.children, level + 1);
        }

        //Cerrar lista
        html += '</li>';
    }
    html += '</ul>';
    return html;
}

const get_puntos = (id_sesion) => {
    $.ajax({
        url: '/FiDigital/panel/puntos',
        data: {
            id_sesion
        },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            Swal.fire({ //Crar una punto nueva
                title: 'Puntos de la sesión',
                buttonsStyling: false,
                reverseButtons: true,
                confirmButtonText: 'Cerrar',
                customClass: {
                    confirmButton: 'btn bg-gradient-danger btn-md mx-2 move-icon-left',
                    loader: 'custom-loader'
                },
                html: render_puntos(response),
                focusConfirm: false,
            })
        },
        error: function (e, ee, eee) {
            console.log(e, ee, eee);
            alert('Error al cargar la jerarquía de puntos');
        }
    });
}

$(() => {

    //Si dan click en el boton de nueva punto
    $('.btn_nuevo_punto').click((e) => {
        crear_punto();
    })

})