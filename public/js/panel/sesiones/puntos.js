const obtener_nivel = (jerarquia, nivel) => {
    const partes = jerarquia.split(".");
    if (nivel > partes.length || nivel < 1) {
        return "Nivel no válido";
    }
    return partes.slice(0, nivel).join(".");
}

const cargar_opciones_puntos = async (selector_destino, url, parametros) => {
    $(selector_destino).empty().append('<option value="">Cargando...</option>');
    try {
        const respuesta = await $.ajax({
            url,
            type: 'POST',
            data: parametros,
        });

        if (respuesta && respuesta.length > 0) {
            $(selector_destino).empty().append('<option value="">Selecciona una opción</option>');
            respuesta.forEach(({ id_punto, jerarquia, siguiente_disponible, nombre_punto }) => {
                $(selector_destino).append(`<option value="${id_punto}" jerarquia="${jerarquia}" siguiente_disponible="${siguiente_disponible}">${jerarquia ? jerarquia + ' - ' : ''}${nombre_punto}</option>`);
            });
        } else {
            $(selector_destino).empty().append('<option value="">No hay opciones disponibles</option>');
        }
    } catch (error) {
        console.error("Error al cargar opciones: ", error);
        $(selector_destino).empty().append('<option value="">Error al cargar</option>');
    }
};

// Función para cargar opciones a un select específico
async function cargar_opciones_select(selector, url, tipo, datos = {}) {
    const respuesta = await realizar_peticion_ajax(url, tipo, datos);
    let opciones = '<option value="">Selecciona</option>';
    respuesta.forEach(item => {
        opciones += `<option value="${item.id}" data-siguiente-disponible="${item.siguiente_disponible}" data-jerarquia="${item.jerarquia || ''}">${item.nombre}</option>`;
    });
    $(selector).html(opciones);
}

// Función para cargar opciones de forma dinámica
async function cargar_opciones(url, parametro = {}) {
    let opciones = '';
    try {
        const respuesta = await $.ajax({
            url: url,
            type: 'POST',
            dataType: 'JSON',
            data: parametro,
        });
        respuesta.forEach((item) => {
            opciones += `<option value="${item.id_sesion}" numero_sesion="${item.numero_sesion}" siguiente_disponible="${item.siguiente_disponible}">${item.numero_sesion ? item.numero_sesion + '.- ' : ''}${item.nombre_sesion} ${item.tipo}</option>`;
        });
    } catch (error) {
        console.error("Error al cargar opciones: ", error);
    }
    return opciones;
}

// Función principal para gestionar la jerarquía
async function gestionar_jerarquia(json_editar = []) {
    let editar_jerarquia = '';

    disableBtn('.btn_nuevo_punto');

    let titulo = json_editar.length ? 'Editar punto' : 'Nuevo punto';
    let btn_confirmar = json_editar.length ? 'Guardar punto<i class="fas fa-arrow-right ms-2"></i>' : 'Crear punto<i class="fas fa-arrow-right ms-2"></i>';
    let titulo_success = json_editar.length ? 'Guardado!' : '¡Creado!';
    let texto_success = json_editar.length ? 'El punto se guardó con éxito' : 'El punto se añadió con éxito';

    let opciones_sesion = await cargar_opciones('/FiDigital/panel/sesiones/get_by_ajax');

    Swal.fire({
        title: titulo,
        buttonsStyling: false,
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: btn_confirmar,
        cancelButtonText: `Cancelar`,
        customClass: {
            confirmButton: 'btn bg-gradient-danger btn-md mx-2 move-icon-left',
            cancelButton: 'btn btn-gradient-danger btn-md mx-2 move-icon-left',
            loader: 'custom-loader',
            popup: 'col-lg-9'
        },
        html: `
        <form class="w-100 m-auto row p-2 text-start form_sesion" data-validate="parsley">
            <!-- Campos del formulario -->
            <div class="col-lg-3">
                <div class="form-group">
                <label class="form-control-label">Sesión:</label>
                <select required name="id_sesion" class="input_punto form-control input-lg p-2 select_sesion">
                    <option value="">Selecciona</option>
                    ${opciones_sesion}
                </select>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-calendar-alt"></i> Punto:</label>
                    <select name="id_punto" class="input_punto select_punto id_punto form-control input-lg p-2">
                    </select>
                </div>
            </div>
            <div class="col-lg-2">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-calendar-alt"></i> Sección:</label>
                    <select name="id_seccion" class="input_punto id_seccion form-control input-lg p-2">
                    </select>
                </div>
            </div>
            <div class="col-lg-2">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-calendar-alt"></i> Carpeta:</label>
                    <select name="id_carpeta" class="input_punto id_carpeta form-control input-lg p-2">
                    </select>
                </div>
            </div>
            <div class="col-lg-2">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-calendar-alt"></i> Subcarpeta:</label>
                    <select name="id_subcarpeta" class="input_punto id_subcarpeta form-control input-lg p-2">
                    </select>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label class="form-control-label"><i class="fas fa-laptop-house"></i> Jerarquia:</label>
                    <input required class="input_punto form-control" name="jerarquia" placeholder="1.1.1">
                </div>
            </div>
            <div class="col-lg-5">
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
            // Validación inicial del formulario
            if (!$('.form_sesion').parsley().isValid()) {
                Swal.showValidationMessage("Por favor llena correctamente los campos");
                return false;
            }

            let jerarquia = $('[name="jerarquia"]').val().trim();
            let id_punto = $('[name="id_punto"]').val().trim();

            // Verificar si estamos en modo de edición y la jerarquía ha cambiado
            let necesita_validacion_jerarquia = true;
            if (id_punto) { // Si estamos editando un punto
                if (jerarquia === editar_jerarquia) {
                    necesita_validacion_jerarquia = false; // No necesita validación si la jerarquía no ha cambiado
                }
            }

            // Verificar si la jerarquía ya existe, solo si es necesario
            if (necesita_validacion_jerarquia) {
                let validacion_jerarquia = await $.ajax({
                    url: '/FiDigital/panel/sesiones/puntos/check_jerarquia',
                    type: 'POST',
                    dataType: 'json',
                    data: { jerarquia: jerarquia }
                });

                if (validacion_jerarquia.duplicate) {
                    Swal.showValidationMessage(`Esta jerarquía ya ha sido creada. Por favor, elige otra.`);
                    return false;
                }
            }


            let padre_id = id_punto
            let id_seccion = $('.input_punto[name="id_seccion"]').val().trim()
            let id_carpeta = $('.input_punto[name="id_carpeta"]').val().trim()
            let id_subcarpeta = $('.input_punto[name="id_subcarpeta"]').val().trim()

            if (id_seccion) {
                padre_id = id_seccion;
            }

            if (id_carpeta) {
                padre_id = id_carpeta;
            }

            if (id_subcarpeta) {
                padre_id = id_subcarpeta;
            }

            let datos = {
                id_sesion: $('.input_punto[name="id_sesion"]').val().trim(),
                jerarquia: jerarquia,
                nombre_punto: $('.input_punto[name="nombre_punto"]').val(),
                padre_id,
                observaciones: $('.input_punto[name="observaciones"]').val().trim()
            }

            return $.ajax({
                url: '/FiDigital/panel/sesiones/puntos/post_punto',
                type: 'POST',
                dataType: 'JSON',
                data: datos
            }).fail(function (error) {
                Swal.showValidationMessage(`Request failed: ${error.statusText}`);
            });
        }, willOpen: async () => {
            // Inicialización de Select2 o cualquier otro plugin para mejorar los selectores
            $('.select2_swal').select2({
                placeholder: "Selecciona una opción",
                allowClear: true,
                width: '100%',
            });

            $('[name="id_punto"], [name="id_seccion"], [name="id_carpeta"], [name="id_subcarpeta"]').on('change', function () {
                let siguienteDisponible = $(this).find('option:selected').attr('siguiente_disponible');
                let jerarquia = $(this).find('option:selected').attr('jerarquia');

                if (siguienteDisponible) {
                    let nuevaJerarquia = jerarquia ? `${jerarquia}.${siguienteDisponible}` : siguienteDisponible;
                    $('[name="jerarquia"]').val(nuevaJerarquia);
                }
            });

            $('[name="id_sesion"]').on('change', (e) => {
                const id_sesion = $(e.currentTarget).val();
                cargar_opciones_puntos('[name="id_punto"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', { id_sesion: id_sesion });
                $('[name="id_seccion"], [name="id_carpeta"], [name="id_subcarpeta"]').empty().append('<option value="">Selecciona una opción</option>');
            });

            $('[name="id_punto"]').on('change', (e) => {
                const id_punto = $(e.currentTarget).val();
                cargar_opciones_puntos('[name="id_seccion"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', { padre_id: id_punto });
                $('[name="id_carpeta"], [name="id_subcarpeta"]').empty().append('<option value="">Selecciona una opción</option>');
            });

            $('[name="id_seccion"]').on('change', (e) => {
                const id_punto = $(e.currentTarget).val();
                cargar_opciones_puntos('[name="id_carpeta"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', { padre_id: id_punto });
                $('[name="id_subcarpeta"]').empty().append('<option value="">Selecciona una opción</option>');
            });

            $('[name="id_carpeta"]').on('change', (e) => {
                const id_punto = $(e.currentTarget).val();
                cargar_opciones_puntos('[name="id_subcarpeta"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', { padre_id: id_punto });
            });


            // Configuración inicial en caso de edición
            if (Object.keys(json_editar).length > 0) {

                // await cargar_opciones_puntos('[name="id_punto"]',       '/FiDigital/panel/sesiones/puntos/get_by_ajax', { id_sesion: json_editar.id_sesion });
                // await cargar_opciones_puntos('[name="id_seccion"]',     '/FiDigital/panel/sesiones/puntos/get_by_ajax', { padre_id: json_editar.id_punto });
                // await cargar_opciones_puntos('[name="id_carpeta"]',     '/FiDigital/panel/sesiones/puntos/get_by_ajax', { padre_id: json_editar.id_punto });
                // await cargar_opciones_puntos('[name="id_subcarpeta"]',  '/FiDigital/panel/sesiones/puntos/get_by_ajax', { padre_id: json_editar.id_punto });

                $('[name="id_sesion"]').val(json_editar.id_sesion).trigger('change');

                $('[name="id_seccion"]').val(json_editar.id_seccion).trigger('change');

                $('[name="id_punto"]').val(json_editar.padre_id).trigger('change');

                $('[name="id_carpeta"]').val(json_editar.id_carpeta).trigger('change');

                $('[name="id_subcarpeta"]').val(json_editar.id_subcarpeta).trigger('change');

                //No dinamicos
                $('[name="jerarquia"]').val(json_editar.jerarquia);
                $('[name="nombre_punto"]').val(json_editar.nombre_punto);
                $('[name="observaciones"]').val(json_editar.observaciones);
            }
        },
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            Swal.fire({
                title: titulo_success,
                text: texto_success,
                icon: 'success',
            }).then(() => {
                // Realizar acciones después de cerrar el mensaje de éxito, como recargar la página o actualizar una tabla
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Manejar la cancelación si es necesario
        }
    })

    enableBtn('.btn_nuevo_punto')
}


function render_puntos(hierarchy, level = 0) {
    if (hierarchy.length === 0) {
        return '<div class="alert border-danger text-gradient text-danger my-3">No existen puntos registrados.</div>';
    }

    let html = '<ul class="list-group">';
    for (const point of hierarchy) {
        let btn_detalle = '';
        let btn_editar = `
            <div id_punto="${point.id_punto}" class="editar_punto cursor-pointer px-3 py-2  my-auto mx-1 btn btn-xs bg-gradient-warning shadow text-white rounded">
                <i class="fas fa-edit text-white" aria-hidden="true"></i>
            </div> 
        `;

        if (point.id_expediente) {
            btn_detalle = `
                <a href="/FiDigital/panel/sesiones/${point.id_expediente}/detalle" class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-info shadow text-white rounded">
                    <i class="fas fa-folder text-white" aria-hidden="true"></i>
                </a>             
            `;
        }

        let btn_estatus = '';
        let badge = '';
        let selected_1 = '';
        let selected_2 = '';
        let selected_3 = '';
        let selected_4 = '';

        if (point.estatus) {
            if (point.estatus == 'Completo') {
                selected_1 = 'selected';
                badge = 'bg-gradient-success'
            } else if (point.estatus == 'Completo con errores') {
                selected_2 = 'selected';
                badge = 'bg-gradient-success'
            } else if (point.estatus == 'Incompleto') {
                selected_3 = 'selected';
                badge = 'bg-gradient-danger'
            } else if (point.estatus == 'Completo sin errores') {
                selected_4 = 'selected';
                badge = 'bg-gradient-success'
            }

            btn_estatus = `<select class="px-3 py-2 mx-1 cambiar_estatus ${badge} border-0 my-1 shadow text-white rounded" id_expediente="${point.id_expediente}" id_sesion="${point.id_sesion}">
                                <option ${selected_1 ?? ''} class="bg-light text-dark">Completo</li>
                                <option ${selected_2 ?? ''} class="bg-light text-dark">Completo con errores</li>
                                <option ${selected_4 ?? ''} class="bg-light text-dark">Completo sin errores</li>
                                <option ${selected_3 ?? ''} class="bg-light text-dark">Incompleto</li>
                            </select>`;
        }

        //Contenedor de lista
        html += `
            <li class="list-group-item">
                <div class="d-flex flex-wrap justify-content-between align-items-center w-100 my-2">
                    <div class="text-start">
                        ${"&nbsp;".repeat(level * 2)}
                        <span>${point.jerarquia} - ${point.nombre_punto}</span>
                    </div>
                    <div>
                        ${btn_estatus}
                        ${btn_detalle}
                        ${btn_editar}               
                    </div>   
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
                    loader: 'custom-loader',
                    popup: 'swal-wide'
                },
                autofocus: false,
                html: render_puntos(response),
                focusConfirm: false,
                didOpen: () => {
                    $('.editar_punto').off("click")
                    $('.editar_punto').click((e) => {
                        editar_punto($(e.currentTarget).attr('id_punto'));
                    });

                    $('.cambiar_estatus').off('change');
                    $('.cambiar_estatus').change((e) => {
                        let nuevo_estatus = $(e.currentTarget).val();
                        let id_expediente = $(e.currentTarget).attr('id_expediente');

                        $.ajax({
                            url: "/FiDigital/panel/sesiones/expedientes/cambiar_estatus",
                            type: "POST",
                            data: {
                                nuevo_estatus: nuevo_estatus,
                                id_expediente: id_expediente
                            },
                            success: function (response) {
                                Swal.fire({
                                    title: 'Cambiado exitosamente',
                                    text: 'El expediente cambió a ' + nuevo_estatus,
                                    icon: 'success',
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: "btn bg-gradient-danger me-3",
                                        cancelButton: "btn bg-gradient-secondary"
                                    }
                                }).then(() => {
                                    get_puntos($(e.currentTarget).attr('id_sesion'));
                                });
                            },
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(errorThrown, textStatus);
                                Swal.fire({
                                    title: 'Error',
                                    text: 'El expediente no pudo cambiar a ' + nuevo_estatus,
                                    icon: 'error',
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: "btn bg-gradient-danger me-3",
                                        cancelButton: "btn bg-gradient-secondary"
                                    }
                                })
                            }
                        });
                    })
                },
            })
        },
        error: function (e, ee, eee) {
            console.log(e, ee, eee);
            alert('Error al cargar la jerarquía de puntos');
        }
    });
}

const editar_punto = async (id_punto) => {

    await $.ajax({
        url: '/FiDigital/panel/sesiones/puntos/get_by_ajax',
        data: {
            id_punto
        },
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
                gestionar_jerarquia(respuesta[0]);
            }
        }
    }); // Fin ajax
}

$(() => {

    //Si dan click en el boton de nueva punto
    $('.btn_nuevo_punto').click((e) => {
        gestionar_jerarquia();
    })

})