const obtener_nivel = (jerarquia, nivel) => {
    const partes = jerarquia.split(".");
    if (nivel > partes.length || nivel < 1) {
        return "Nivel no válido";
    }
    return partes.slice(0, nivel).join(".");
}

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

    if(json_editar != []){
        console.log(json_editar);
        editar_jerarquia = json_editar.jerarquia
        id_punto_editar = json_editar.id_punto
    }

    disableBtn('.btn_nuevo_punto');

    console.log(json_editar, typeof json_editar);

    let titulo = json_editar != [] ? 'Editar punto' : 'Nuevo punto';
    let btn_confirmar = json_editar != [] ? 'Guardar punto<i class="fas fa-arrow-right ms-2"></i>' : 'Crear punto<i class="fas fa-arrow-right ms-2"></i>';
    let titulo_success = json_editar != [] ? 'Guardado!' : '¡Creado!';
    let texto_success = json_editar != [] ? 'El punto se guardó con éxito' : 'El punto se añadió con éxito';

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
            <div class="col-lg-4">
                <div class="form-group">
                    <label class="form-control-label"><i class="fas fa-money"></i> Presupuesto autorizado:</label>
                    <input required type="number" class="input_punto form-control" name="presupuesto_autorizado" placeholder="Ingresa el presupuesto...">
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

            let id_sesion = $('.input_punto[name="id_sesion"]').val().trim();
            let jerarquia = $('[name="jerarquia"]').val().trim();
            let id_punto = $('[name="id_punto"]').val().trim();

            // Verificar si estamos en modo de edición y la jerarquía ha cambiado
            let necesita_validacion_jerarquia = true;

            if (id_punto_editar) { // Si estamos editando un punto
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
                    data: { jerarquia: jerarquia, id_sesion: id_sesion }
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
            let presupuesto_autorizado = $('.input_punto[name="presupuesto_autorizado"]').val().trim()

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
                id_sesion: id_sesion,
                jerarquia: jerarquia,
                presupuesto_autorizado: presupuesto_autorizado,
                nombre_punto: $('.input_punto[name="nombre_punto"]').val(),
                padre_id,
                observaciones: $('.input_punto[name="observaciones"]').val().trim()
            }

            if(id_punto_editar){
                datos.id_punto = id_punto_editar;
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

            $('[name="id_sesion"]').on('change', (e) => {
                const id_sesion = $(e.currentTarget).val();
                cargar_opciones_puntos('[name="id_punto"]', '/FiDigital/panel/sesiones/puntos/get_by_ajax', { id_sesion: id_sesion, excluir: id_punto_editar });
                $('[name="id_seccion"], [name="id_carpeta"], [name="id_subcarpeta"]').empty().append('<option value="">Selecciona una opción</option>');
            });

            $('[name="id_punto"], [name="id_seccion"], [name="id_carpeta"], [name="id_subcarpeta"]').on('change', function () {
                let siguienteDisponible = $(this).find('option:selected').attr('siguiente_disponible');
                let jerarquia = $(this).find('option:selected').attr('jerarquia');

                if (siguienteDisponible) {
                    let nuevaJerarquia = jerarquia ? `${jerarquia}.${siguienteDisponible}` : siguienteDisponible;
                    $('[name="jerarquia"]').val(nuevaJerarquia);
                }
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

                $('[name="id_sesion"]').val(json_editar.id_sesion).trigger('change');
                
                $('[name="id_punto"]').val(json_editar.id_nivel_1)
                $('[name="id_seccion"]').val(json_editar.id_seccion).trigger('change');
                $('[name="id_carpeta"]').val(json_editar.id_nivel_3).trigger('change');
                $('[name="id_subcarpeta"]').val(json_editar.id_nivel_4).trigger('change');

                //No dinamicos
                $('[name="jerarquia"]').val(json_editar.jerarquia);
                $('[name="nombre_punto"]').val(json_editar.nombre_punto);
                $('[name="observaciones"]').val(json_editar.observaciones);
                $('[name="presupuesto_autorizado"]').val(json_editar.presupuesto_autorizado);
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

    enableBtn('.btn_nuevo_punto');

    if(typeof tabla_sesiones != 'undefined'){
        tabla_sesiones.ajax.reload();
    }
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
                <a href="/FiDigital/panel/sesiones/expedientes/${point.id_expediente}/detalle" class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-info shadow text-white rounded">
                    <i class="fas fa-folder text-white" aria-hidden="true"></i>
                </a>             
            `;
        }
        let span_restante = ``;
        if (point.monto_restante) {
            span_restante = `<span class="badge badge-info ms-2">${formatoMoneda(point.monto_restante)} restante</span>`;
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

            btn_estatus = `<select class="px-3 py-2 mx-1 rounded cambiar_estatus ${badge} border-0 my-1 shadow text-xs text-white rounded" id_expediente="${point.id_expediente}" id_sesion="${point.id_sesion}">
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
                        ${span_restante}
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