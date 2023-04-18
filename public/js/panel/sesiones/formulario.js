/**
 * 
 * Recorre el JSON del borrador o tramite para insertarlo en los respectivos campos donde se capturaron
 * 
 */
const editar_expediente = async () => {

    localStorage.setItem('cargando_formulario', 0)

    //Desactivar los botones mientras carga
    $('.js-btn-next').addClass('is-loading')

    let json = JSON.parse($('[name=json_expediente]').val());

    if (json) {
        for (const entry of Object.entries(json)) {

            if (
                //Excluir campos no editables desde este modulo
                entry[0] != 'ultima_modificacion' &&
                entry[0] != 'created_by' &&
                entry[0] != 'created_at' &&
                entry[0] != 'id_estatus' &&
                entry[0] != 'updated_at' &&
                entry[0] != 'updated_by' &&
                entry[0] != 'usuario' &&
                entry[0] != 'vistas' &&
                entry[0] != 'estatus'
            ) {

                let input = $(`[name=${entry[0]}]`)
                if (entry[0].indexOf('ruta') == -1) { //Input File

                    //Si el elemento a iterar es un select multiple
                    if (input.prop('multiple')) {

                        //Si el elemento tiene comas
                        if (String(entry[1]).indexOf(',') > -1) {
                            entry[1] = String(entry[1]).replaceAll(', ', ',').split(',');
                        }

                        if (input.hasClass('select2_tags')) { //Crear las opciones si no están definidas

                            if (typeof entry[1] == 'string') {
                                entry[1] = Array(entry[1]);
                            }

                            entry[1].forEach(element => {
                                input.append(`<option>${element}</option>`);
                            });

                            $(`[name=${entry[0]}]`).val(entry[1]).trigger('change'); //Asignar valor
                        } else {
                            $(`[name=${entry[0]}]`).val(entry[1]).trigger('change'); //Asignar valor
                        }

                        $(`[name=${entry[0]}]`).val(entry[1]).trigger('change'); //Asignar valor

                    } else {
                        $(`[name=${entry[0]}]`).val(entry[1]).trigger('change'); //Asignar valor
                    }

                    //Hacer los renders de las listas desde los JSON
                    if (entry[0].indexOf('fundamentos_') > -1) { //Listas de fundamentos
                        render_fundamentos($(`[name=${entry[0]}]`)); //Fundamentos recibe un elemento

                    } else if (entry[0].indexOf('id_unidad') > -1) { //Obtener el id de autoridad para guardarlo temporalmente en localstorage
                        localStorage.setItem('id_unidad', entry[1]);
                    }

                } else {
                    let target = $(input).siblings('.input_expediente_ruta').attr('target');

                    if (entry[1]) {
                        $(target).addClass('d-flex').show(200);
                        $(target).children('a').attr('href', "/" + entry[1]);
                    } else {
                        $(target).removeClass('d-flex').hide(200);
                    }
                }
            }
        }
    }

    //Restaurar botones al final de la carga
    setTimeout(() => {
        $('.multisteps-form__form, .multisteps-form__progress').removeClass('is-loading');
        $('.guardar_borrador, .js-btn-next').removeClass('is-loading');

        if (typeof $('[name=id_expediente]').val() != 'undefined') {
            $(`.input_expediente`).change((input_change) => {
                enviar_ajax_onchange(input_change.currentTarget)
            })
        }

    }, 1000);

    localStorage.removeItem('cargando_formulario')
    return true;
}

const crear_expediente = () => {

    if (typeof editar != 'undefined') {
        Swal.fire({
            title: 'Cambios registrados con éxito',
            text: 'Tus cambios serán validados por un administrador, es posible que los cambios tarden un tiempo en reflejarse',
            icon: 'success',
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn bg-gradient-danger me-3",
                cancelButton: "btn bg-gradient-secondary"
            }
        }).then(() => {
            window.location.href = '/fidigital/panel/visitas';
        })
        return;
    }

    //Validar los datos generales
    let datos_expediente = validatePanelForm($('.multisteps-form__panel').eq(0), 0);

    let expediente_form = new FormData();
    let expediente_form_text = new FormData();

    //Validar 
    if (datos_expediente) {
        //Si los campos son validos iteramos para guardar
        $('.input_expediente').each(function (index, input) { //Buscar todos los inputs

            //Hacer el append al formdata de los valores
            let valor = $(input).val();
            if (typeof valor === 'string') {
                valor = valor.trim();
            } else if (typeof valor === 'object') {
                if ($(input).attr('name').indexOf('id_') < 0) {
                    valor = JSON.stringify(valor);
                }
            }

            if ($(this).prop('type') == 'file') {
                expediente_form.append($(this).attr('name'), $(this).val() != null ? $(this)[0].files[0] : 0);
            } else {
                expediente_form.append($(input).attr('name'), valor);
            }

            //FormData de textos
            if ($(input).attr('name').substring(0, 3) == 'id_') {
                expediente_form_text.append($(input).closest('.form-group').find('label').text(), $(input).children('option:selected').text());
            } else {
                expediente_form_text.append($(input).closest('.form-group').find('label').text(), $(input).val());
            }
        });

        Swal.fire({
            title: "¿Deseas envíar el expediente?",
            html: 'Recuerda revisar que tus datos estén completos y correctos antes de envíar el formulario.',
            icon: "question",
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: 'Envíar',
            cancelButtonText: 'No, cancelar',
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn bg-gradient-danger ms-3",
                cancelButton: "btn bg-gradient-secondary"
            }
        }).then(function (respuesta) {
            if (respuesta.value) {

                $.ajax({
                    url: '/FiDigital/panel/sesiones/expedientes/post_expediente',
                    data: expediente_form,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (respuesta) {
                        if (respuesta == true) {
                            Swal.fire({
                                title: 'Expediente envíado con éxito',
                                html: 'El expediente se envió correctamente.',
                                icon: 'success',
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn bg-gradient-danger me-3",
                                    cancelButton: "btn bg-gradient-secondary"
                                }
                            }).then(() => {
                                window.location.href = '/fidigital/panel/sesiones/';
                            })
                        } else {
                            error_ajax(respuesta)
                        }
                    },
                    error: (err, texto) => {
                        error_ajax(JSON.parse(err.responseText)['message']);
                    }
                });
            } // Fin if value
        }) // Fin Then SweetAlert
    }
}

$(document).ready(async () => {

    $('.input_expediente_ruta').change(async (e) => {
        let input = `[name=${$(e.currentTarget).attr('target-input')}]`
        let target = $(e.currentTarget).attr('target');

        let guardar_pdf = new FormData(); // Inicializar form data
        guardar_pdf.append('documento', $(e.currentTarget)[0].files[0]);

        await $.ajax({
            url: '/FiDigital/panel/sesiones/guardar_documento',
            data: guardar_pdf,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (respuesta) {
                respuesta = "/FiDigital/"+respuesta
                $(input).val(respuesta).trigger('change');
            },
            error: (err, texto) => {
                //error_ajax(JSON.parse(err.responseText)['message']);
            }
        });

        if ($(input).val()) {
            $(target).addClass('d-flex').show(200);
            $(target).children('a').attr('href', "/" + $(input).val());
        } else {
            $(target).removeClass('d-flex').hide(200);
        }
    });

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

                $('.input_sesion').append(options_sesion).trigger("change");
            }
        }
    }); // Fin ajax

    $('.input_sesion').change(async (e) => {
        let valor = $(e.currentTarget).children('option:selected').attr("numero_sesion");
        $('.input_expediente[name="jerarquia"]').val(valor + ".");

        if (valor) {

            await $.ajax({
                url: '/FiDigital/panel/sesiones/puntos/get_by_ajax',
                dataType: 'JSON',
                data: {
                    id_sesion: valor
                },
                type: 'POST',
                success: function (respuesta, text, xhr) {

                    $('.input_expediente[name="id_punto"]').empty();

                    if (xhr.status == 200) {
                        respuesta.forEach(punto => {
                            $('.input_expediente[name="id_punto"]').append(`<option jerarquia="${punto.jerarquia}" value="${punto.id_punto}">${punto.jerarquia} ${punto.nombre_punto}</option>`);
                        });

                    } else {
                        $('.input_expediente[name="id_punto"]').empty().append(`<option value="">La sesión no contiene puntos</option>`);
                    }

                    $('.input_expediente[name="id_punto"]').trigger("change");
                }
            }); // Fin ajax
        }else {
            $('.input_expediente[name="id_punto"]').empty().append(`<option value="">La sesión no contiene puntos</option>`);
        }
    });

    $('.input_punto').change(async (e) => {
        let valor = $(e.currentTarget).children('option:selected').attr("jerarquia");
        let id_punto = $(e.currentTarget).val();
        $('.input_expediente[name="jerarquia"]').val(valor + ".");

        if (id_punto) {

            await $.ajax({
                url: '/FiDigital/panel/sesiones/puntos/get_by_ajax',
                dataType: 'JSON',
                data: {
                    padre_id: id_punto,
                    jerarquia: valor
                },
                type: 'POST',
                success: function (respuesta, text, xhr) {

                    $('.input_expediente[name="id_carpeta"]').empty();

                    if (xhr.status == 200) {
                        respuesta.forEach(punto => {
                            $('.input_expediente[name="id_carpeta"]').append(`<option jerarquia="${punto.jerarquia}" value="${punto.id_punto}">${punto.jerarquia} ${punto.nombre_punto}</option>`);
                        });

                    } else {
                        $('.input_expediente[name="id_carpeta"]').empty().append(`<option value="">El punto no contiene carpetas</option>`);
                    }

                    $('.input_expediente[name="id_carpeta"]').trigger("change");
                }
            }); // Fin ajax
        } else {
            $('.input_expediente[name="id_carpeta"]').empty().append(`<option value="">El punto no contiene carpetas</option>`).trigger("change");
        }

    });

    $('.input_carpeta').change(async (e) => {
        let valor = $(e.currentTarget).children('option:selected').attr("jerarquia");
        let id_punto = $(e.currentTarget).val();

        if (id_punto) {
            $('.input_expediente[name="jerarquia"]').val(valor + ".");

            await $.ajax({
                url: '/FiDigital/panel/sesiones/puntos/get_by_ajax',
                dataType: 'JSON',
                data: {
                    padre_id: id_punto
                },
                type: 'POST',
                success: function (respuesta, text, xhr) {

                    $('.input_expediente[name="id_subcarpeta"]').empty();

                    if (xhr.status == 200) {
                        respuesta.forEach(punto => {
                            $('.input_expediente[name="id_subcarpeta"]').append(`<option jerarquia="${punto.jerarquia}" value="${punto.id_punto}">${punto.jerarquia} ${punto.nombre_punto}</option>`);
                        });

                    } else {
                        $('.input_expediente[name="id_subcarpeta"]').empty().append(`<option value="">La carpeta no contiene subcarpetas</option>`);
                    }

                    $('.input_expediente[name="id_subcarpeta"]').trigger("change");
                }
            }); // Fin ajax
        } else {
            $('.input_expediente[name="id_subcarpeta"]').empty().append(`<option value="">La carpeta no contiene subcarpetas</option>`).trigger("change");
        }

    });

    /**
     * Si se pasa la variable editar mediante el backend entonces inicializar la funcion de llenado de campos con JSON
     */
    if (typeof editar != 'undefined') {
        editar_expediente();
    }

    $('.crear_expediente').click(function (e) {
        crear_expediente();
    })

})