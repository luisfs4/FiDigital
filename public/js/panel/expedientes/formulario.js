/**
 * 
 * Recorre el JSON del borrador o tramite para insertarlo en los respectivos campos donde se capturaron
 * 
 */
const editar_visitador = async () => {

    localStorage.setItem('cargando_formulario', 0)

    //Desactivar los botones mientras carga
    $('.js-btn-next').addClass('is-loading')

    let json = JSON.parse($('[name=json_visitador]').val());

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
                    let target = $(input).siblings('.input_visitador_ruta').attr('target');

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

        if (typeof $('[name=id_visitador]').val() != 'undefined') {
            $(`.input_visitador`).change((input_change) => {
                enviar_ajax_onchange(input_change.currentTarget)
            })
        }

    }, 1000);

    localStorage.removeItem('cargando_formulario')
    return true;
}


const enviar_ajax_onchange = (input) => {

    //Validar que no haya cargas en proceso

    if (localStorage.getItem('cargando_formulario') || localStorage.getItem('id_autoridad_responsable') || localStorage.getItem('id_direccion')) {
        return;
    }

    let campo_nombre = $(input).attr('name');
    let campo_valor = $(input).val();

    let cambio_nombre;
    let cambio_valor_a = campo_valor;

    let json = JSON.parse($('[name=json_visitador]').val());
    let cambio_valor_de = json[campo_nombre] ? json[campo_nombre] : '';

    if (!$(input).parsley().isValid()) {
        $(input).parsley().validate();
        return;
    } else {

        //Trimear el string
        if (typeof campo_valor === 'string') {
            campo_valor = campo_valor.trim();
        }

        //FormData de textos
        cambio_nombre = $(input).closest('.form-group').find('label').text()

        //Obtener valores de selects multiples
        if (String(campo_nombre).indexOf('id_') > -1) {
            let texto = '';
            //Generar lista desde
            if (cambio_valor_de && ((input.tagName == 'SELECT'))) {
                if (String(cambio_valor_de).indexOf(',') > -1) {

                    let array = cambio_valor_de.split(',');

                    array.forEach(element => {
                        let li = $('<li></li>').text($(input).children(`option[value=${element}]`).text())[0].outerHTML

                        texto += $(li)[0].outerHTML; //Asignar valor
                    });

                } else {
                    let li = '';

                    if (cambio_valor_de && cambio_valor_de.length > 0) {
                        li = $('<li></li>').text($(input).children(`option[value=${cambio_valor_de}]`).text())[0].outerHTML
                        texto += $(li)[0].outerHTML; //Asignar valor
                    } else {
                        li = ''
                    }

                }
            }

            if (texto) {
                cambio_valor_de = texto;
            }

            //Generar lista para 
            texto = '';
            if (campo_valor && ((input.tagName == 'SELECT'))) {

                if (String(campo_valor).indexOf(',') > -1) {

                    let array = String(campo_valor).split(',');

                    array.forEach(element => {
                        let li = $('<li></li>').text($(input).children(`option[value=${element}]`).text())[0].outerHTML

                        texto += $(li)[0].outerHTML; //Asignar valor
                    });

                } else {
                    let li = '';
                    if (campo_valor && campo_valor.length > 0) {

                        li = $('<li></li>').text($(input).children(`option[value=${campo_valor}]`).text())[0].outerHTML
                    } else {
                        li = ''
                    }

                    texto += li; //Asignar valor
                }
            }

            if (texto) {
                cambio_valor_a = texto;
            }
        }

        if (cambio_valor_a != cambio_valor_de) {

            $.ajax({
                url: '/panel/visitadores/post_editar_visitador',
                data: {
                    cambio_nombre,
                    cambio_valor_a: String(cambio_valor_a),
                    cambio_valor_de,
                    campo_nombre,
                    campo_valor: String(campo_valor),
                    id_visitador: $('[name=id_visitador]').val()
                },
                type: 'POST',
                success: function (respuesta) {
                    if (respuesta == true) {
                        Toast.fire({
                            title: 'Guardado...',
                            html: `El campo <b>${cambio_nombre}</b> se guardó con éxito`,
                            icon: 'success',
                            position: 'bottom-end',
                        })
                    } else {
                        error_ajax(respuesta)
                    }
                },
                error: (err, texto) => {
                    error_ajax(JSON.parse(err.responseText)['message']);
                }
            });

        }
    }
}

$(document).ready(() => {

    $('[name="id_direccion"]').change(async function (e) {

        let id_direccion = $(e.target).val();

        await $.ajax({
            url: '/usuarios/get_unidad_by_ajax',
            data: {
                id_direccion
            },
            dataType: 'JSON',
            type: 'POST',
            success: function (respuesta, text, xhr) {

                if (xhr.status == 204) {
                    Swal.fire({
                        title: '¡Hay un problema!',
                        text: 'Esta dirección no tiene unidades asignadas',
                        icon: 'error',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn bg-gradient-info me-3",
                            cancelButton: "btn bg-gradient-secondary"
                        }
                    });
                } else if (xhr.status == 200) {
                    $('[name="id_unidad"]').empty();
                    $('[name="id_unidad"]').append(`<option value="">Selecciona una opción</option>`);
                    respuesta.forEach(unidad => {
                        $('[name="id_unidad"]').append(`<option value="${unidad.id_unidad}">${unidad.unidad}</option>`);
                    });

                }
            }
        }); // Fin ajax
    })

    $('.input_punto_ruta').change(async (e) => {
        let input = `[name=${$(e.currentTarget).attr('target-input')}]`
        let target = $(e.currentTarget).attr('target');
        
        let guardar_pdf = new FormData(); // Inicializar form data
        guardar_pdf.append('documento', $(e.currentTarget)[0].files[0]);

        await $.ajax({
            url: '/panel/expedientes/guardar_documento',
            data: guardar_pdf,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (respuesta) {
                $(input).val(respuesta).trigger('change');
            },
            error: (err, texto) => {
                //error_ajax(JSON.parse(err.responseText)['message']);
            }
        });

        if ($(input).val()) {
            $(target).addClass('d-flex').show(200);
            $(target).children('a').attr('href', "/"+$(input).val());
        } else {
            $(target).removeClass('d-flex').hide(200);
        }
    })

    /**
     * Si se pasa la variable editar mediante el backend entonces inicializar la funcion de llenado de campos con JSON
     */
    if (typeof editar != 'undefined') {
        editar_visitador();
    }

    $('.crear_visitador').click(function (e) {

        if (typeof editar != 'undefined') {
            Swal.fire({
                title: 'Cambios registrados con éxito',
                text: 'Tus cambios serán validados por un administrador, es posible que los cambios tarden un tiempo en reflejarse',
                icon: 'success'
            }).then(() => {
                window.location.href = '/panel/visitas';
            })
            return;
        }

        //Validar los datos generales
        let datos_visitador = validatePanelForm($('.multisteps-form__panel').eq(0), 0);
        countInputsByPanel($('.multisteps-form__panel').eq(0), 0);

        //Validar los datos de modalidad
        let datos_contacto = validatePanelForm($('.multisteps-form__panel').eq(1), 1);
        countInputsByPanel($('.multisteps-form__panel').eq(1), 1);

        let visitador_form = new FormData();
        let visitador_form_text = new FormData();

        //Validar 
        if (datos_visitador && datos_contacto) {
            //Si los campos son validos iteramos para guardar
            $('.input_visitador').each(function (index, input) { //Buscar todos los inputs

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
                    visitador_form.append($(this).attr('name'), $(this).val() != null ? $(this)[0].files[0] : 0);
                } else {
                    visitador_form.append($(input).attr('name'), valor);
                }

                //FormData de textos
                if ($(input).attr('name').substring(0, 3) == 'id_') {
                    visitador_form_text.append($(input).closest('.form-group').find('label').text(), $(input).children('option:selected').text());
                } else {
                    visitador_form_text.append($(input).closest('.form-group').find('label').text(), $(input).val());
                }
            });

            Swal.fire({
                title: "¿Deseas envíar el visitador?",
                html: 'Recuerda revisar que tus datos estén completos y correctos antes de envíar el formulario.',
                icon: "question",
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: 'Envíar',
                cancelButtonText: 'No, cancelar',
                buttonsStyling: false,
                customClass: {
                    confirmButton: "btn bg-gradient-info ms-3",
                    cancelButton: "btn bg-gradient-secondary"
                }
            }).then(function (respuesta) {
                if (respuesta.value) {

                    $.ajax({
                        url: '/panel/visitadores/post_visitador',
                        data: visitador_form,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (respuesta) {
                            if (respuesta == true) {
                                Swal.fire({
                                    title: 'Visitador envíado con éxito',
                                    html: 'El visitador se envió correctamente.',
                                    icon: 'success',
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: "btn bg-gradient-info me-3",
                                        cancelButton: "btn bg-gradient-secondary"
                                    }
                                }).then(() => {
                                    window.location.href = '/panel/visitadores/';
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
    })

})