const obtener_nivel = (jerarquia, nivel) => {
    const partes = jerarquia.split(".");
    if (nivel > partes.length || nivel < 1) {
        return "Nivel no válido";
    }
    return partes.slice(0, nivel).join(".");
}

const cargar_puntos = async (id_sesion) => {
    if (id_sesion) {
        await $.ajax({
            url: '/FiDigital/panel/sesiones/puntos/get_by_ajax',
            dataType: 'JSON',
            data: {
                id_sesion
            },
            type: 'POST',
            success: function (respuesta, text, xhr) {
                $('[name="padre_id"]').empty();
                if (xhr.status == 200) {
                    respuesta.forEach(punto => {
                        $('[name="padre_id"]').append(`<option jerarquia="${punto.jerarquia}" siguiente_disponible="${punto.siguiente_disponible}" value="${punto.id_punto}">${punto.jerarquia} ${punto.nombre_punto}</option>`);
                    });
                    $('[name="padre_id"]').append(`<option value="">Ningun punto</option>`);
                } else {
                    $('[name="padre_id"]').empty().append(`<option value="">La sesión no contiene puntos</option>`);
                }
                $('[name="padre_id"]').trigger('change')
            }
        }); // Fin ajax
    } else {
        $('[name="padre_id"]').empty().append(`<option value="">La sesión no contiene puntos</option>`).trigger('change');
    }
};

const cargar_carpetas = async (id_punto, jerarquia) => {
    if (id_punto) {
        await $.ajax({
            url: '/FiDigital/panel/sesiones/puntos/get_by_ajax',
            dataType: 'JSON',
            data: {
                padre_id: id_punto,
                jerarquia: jerarquia
            },
            type: 'POST',
            success: function (respuesta, text, xhr) {
                $('[name="id_carpeta"]').empty();
                if (xhr.status == 200) {
                    respuesta.forEach(punto => {
                        $('[name="id_carpeta"]').append(`<option jerarquia="${punto.jerarquia}" siguiente_disponible="${punto.siguiente_disponible}" value="${punto.id_punto}">${punto.jerarquia} ${punto.nombre_punto}</option>`);
                    });
                    $('[name="id_carpeta"]').append(`<option value="">Ninguna carpeta</option>`);
                } else {
                    $('[name="id_carpeta"]').empty().append(`<option value="">El punto no contiene carpetas</option>`);
                }
                $('[name="id_carpeta"]').trigger('change');
            }
        }); // Fin ajax
    } else {
        $('[name="id_carpeta"]').empty().append(`<option value="">El punto no contiene carpetas</option>`).trigger('change');
    }
};

const crear_punto = async (json_editar = []) => {

    disableBtn('.btn_nuevo_punto');
    let titulo = 'Nuevo punto';
    let btn_confirmar = `Crear punto<i class="fas fa-arrow-right ms-2"></i>`;
    let titulo_success = '¡Creado!';
    let texto_success = 'El punto se añadió con éxito';

    //Declarar variable para almacenar id padre
    let editar_id_padre = '';

    //Declarar variable para almacenar la jerarquia
    let editar_jerarquia = '';

    if (json_editar.length != 0) {
        titulo = 'Editar punto';
        btn_confirmar = `Guardar punto<i class="fas fa-arrow-right ms-2"></i>`
        titulo_success = 'Guardado!';
        texto_success = 'El punto se guardó con éxito';
    }

    let options_sesion = '';

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
            loader: 'custom-loader',
            popup: 'swal-wide'
        },
        html: `
        <form class="w-100 m-auto row p-2 text-start form_sesion" data-validate="parsley">
            <input type="hidden" class="input_punto form-control" name="id_punto">
            <div class="col-lg-4">
                <div class="form-group">
                    <label class="form-control-label"><i class="fas fa-folder-open"></i> Sesión:</label>
                    <select required name="id_sesion" class="input_punto input_sesion form-control input-lg p-2 select2_swal">
                        <option value="">Selecciona</option>
                        ${options_sesion}
                    </select>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-calendar-alt"></i> Punto:</label>
                    <select name="padre_id" class="input_punto id_punto form-control input-lg p-2">
                    </select>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-calendar-alt"></i> Carpeta:</label>
                    <select name="id_carpeta" class="input_punto id_carpeta form-control input-lg p-2">
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
            if (!editar_jerarquia) { //Primero validando que no sea una edición de punto
                let validacion_jerarquia = await $.ajax({
                    url: '/FiDigital/panel/sesiones/puntos/check_jerarquia',
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
            }

            let padre_id = Swal.getPopup().querySelector('.input_punto[name="padre_id"]').value.trim()
            let id_carpeta = Swal.getPopup().querySelector('.input_punto[name="id_carpeta"]').value.trim()

            if (id_carpeta) {
                console.log(id_carpeta);
                padre_id = id_carpeta;
            }

            return {
                id_sesion: Swal.getPopup().querySelector('.input_punto[name="id_sesion"]').value.trim(),
                id_punto: Swal.getPopup().querySelector('.input_punto[name="id_punto"]').value.trim(),
                jerarquia: Swal.getPopup().querySelector('.input_punto[name="jerarquia"]').value.trim(),
                nombre_punto: Swal.getPopup().querySelector('.input_punto[name="nombre_punto"]').value,
                padre_id,
                observaciones: Swal.getPopup().querySelector('.input_punto[name="observaciones"]').value.trim()
            }
        },
        willOpen: async (e, ee) => {
            //Iniciar select2 para las sesiones
            await $('.select2_swal').select2({
                placeholder: "Selecciona una opción",
            });

            await $('.input_sesion').change(async (e) => {
                let id_sesion = $(e.currentTarget).val();
                await cargar_puntos(id_sesion);

                //Obtener el nivel de la jerarquia y autoseleccionar la opción guardada
                let nivel = obtener_nivel(editar_jerarquia, 2);
                let nivel_siguiente = obtener_nivel(editar_jerarquia, 3); //Se valida el nivel siguiente para verificar si este nodo no es el ultimo, en caso de ser el ultimo se descarta la selección
                if (editar_jerarquia && !isNaN(nivel) && !isNaN(nivel_siguiente)) {
                    $(`.id_punto`).find(`option[jerarquia="${nivel}"]`).prop('selected', true).trigger("change");
                } else if (isNaN(nivel_siguiente)) {
                    $(`.id_punto`).val('');
                }

            });

            await $('.id_punto').change(async (e) => {
                let jerarquia = $(e.currentTarget).children('option:selected').attr("jerarquia");
                let id_punto = $(e.currentTarget).val();
                console.log("Punto | id_punto", id_punto, typeof id_punto);

                await cargar_carpetas(id_punto, jerarquia);

                //Obtener el nivel de la jerarquia y autoseleccionar la opción guardada
                let nivel = obtener_nivel(editar_jerarquia, 3);
                if (editar_jerarquia && !isNaN(nivel)) {
                    $(`.id_carpeta`).find(`option[jerarquia="${nivel}"]`).prop('selected', true).trigger("change");
                    console.log(nivel);
                }
            });

            await $('.id_carpeta').change(async (e) => {
                let valor = $(e.currentTarget).children('option:selected').attr("jerarquia");
                let siguiente_disponible = $(e.currentTarget).children('option:selected').attr("siguiente_disponible");
                let id_carpeta = $(e.currentTarget).val();
                console.log("Carpeta | id_carpeta", id_carpeta, typeof id_carpeta);

                if (id_carpeta && !editar_jerarquia) {
                    console.log(valor + "." + siguiente_disponible)
                    $('[name="jerarquia"]').val(valor + "." + siguiente_disponible);
                } else if (!editar_jerarquia) {
                    let jerarquia = $('.id_punto').children('option:selected').attr("jerarquia");
                    let resultado = '';

                    if (jerarquia) {
                        const ultimo_caracter_es_punto = jerarquia.slice(-1) === ".";
                        resultado = ultimo_caracter_es_punto ?
                            jerarquia + "1" :
                            jerarquia + ".1";

                    } else {
                        let sesion = $('.input_sesion').children('option:selected').attr("numero_sesion");
                        resultado = sesion + ".";
                    }
                    console.log(resultado)
                    $('[name="jerarquia"]').val(resultado);
                }

            });

            if (json_editar) {

                for (const key of Object.keys(json_editar)) {

                    if (key === 'padre_id') {
                        editar_id_padre = json_editar[key];
                    }

                    if (key === 'jerarquia') {
                        editar_jerarquia = json_editar[key];
                    }

                    if (
                        key === 'siguiente_disponible' ||
                        key === 'contador_hijos' ||
                        key === 'created_at' ||
                        key === 'created_by' ||
                        key === 'updated_by' ||
                        key === 'updated_at' ||
                        key === 'padre_id' ||
                        key === 'id_expediente'
                    ) continue;

                    const input = e.querySelector(`[name="${key}"]`);
                    console.log(input, key);

                    if (input) {
                        input.value = json_editar[key];
                        console.log(input);
                        // Crear y disparar el evento 'change'
                        const event = new Event('change');
                        input.dispatchEvent(event);
                    }
                }
            }
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
        }

        btn_estatus = `<select class="px-3 py-2 mx-1 cambiar_estatus ${badge} border-0 my-1 shadow text-white rounded" id_expediente="${point.id_expediente}" id_sesion="${point.id_sesion}">
                            <option ${selected_1 ?? ''} class="bg-light text-dark">Completo</li>
                            <option ${selected_2 ?? ''} class="bg-light text-dark">Completo con errores</li>
                            <option ${selected_4 ?? ''} class="bg-light text-dark">Completo sin errores</li>
                            <option ${selected_3 ?? ''} class="bg-light text-dark">Incompleto</li>
                        </select>`;

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
                crear_punto(respuesta[0]);
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