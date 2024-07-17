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
            window.location.href = '/FiDigital/panel/visitas';
        })
        return;
    }

    //Validar los datos generales
    let datos_expediente = validatePanelForm($('.multisteps-form__panel').eq(0), 0);
    let archivos_expediente = validatePanelForm($('.multisteps-form__panel').eq(1), 1);
    let datos_proveedor = validatePanelForm($('.multisteps-form__panel').eq(2), 2);

    let expediente_form = new FormData();
    let expediente_form_text = new FormData();

    //Validar 
    if (datos_expediente && archivos_expediente && datos_proveedor) {
        //Si los campos son validos iteramos para guardar
        $('.input_expediente').each(function (index, input) { //Buscar todos los inputs

            //Hacer el append al formdata de los valores
            let valor = $(input).val();
            console.log(valor, typeof valor);
            if (typeof valor === 'string') {
                valor = valor.trim();
            } else if (typeof valor === 'object') {
                if ($(input).attr('name').indexOf('id_') < 0) {
                    valor = JSON.stringify(valor);
                }
            }

            if ($(this).hasClass('filepond')) {
                const pond = FilePond.find(this);

                if(pond && typeof pond.element.dataset.disabled == "undefined"){
                    const name  = this.id;
                    const input = pond.getFile();
                    if(input){ expediente_form.append(name, input.file); }
                }
            } else if ($(this).prop('type') == 'file') {
                console.log($(this).attr('name'), $(this), $(this).val() != null ? $(this)[0].files[0] : 0);
                expediente_form.append($(this).attr('name'), $(this).val() != null ? $(this)[0].files[0] : 0);
            } else if($(this).prop("type") == "checkbox"){
                expediente_form.append($(this).attr('name'), $(this).prop('checked') ? 1 : 0);
            } else {
                console.log($(this).attr('name'), $(this), valor);
                expediente_form.append($(input).attr('name'), valor);
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
                                window.location.href = '/FiDigital/panel/sesiones/';
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

    // $(document).on("FilePond:addfile", async (e) => {
    //     const pond = FilePond.find(e.target);

    //     if(pond){
    //         const input = e.target.id;
    //         const target = `.contenedor_ver_${input}`;
    //         let guardar_pdf = new FormData(); // Inicializar form data
    //         guardar_pdf.append('documento', pond.getFile().file);

    //         await $.ajax({
    //             url: '/FiDigital/panel/sesiones/guardar_documento',
    //             data: guardar_pdf,
    //             processData: false,
    //             contentType: false,
    //             type: 'POST',
    //             success: function (respuesta) {
    //                 respuesta = "/FiDigital/" + respuesta
    //                 $(`[name="${input}"`).val(respuesta).trigger('change');
    //             },
    //             error: (err, texto) => {
    //                 //error_ajax(JSON.parse(err.responseText)['message']);
    //             }
    //         });

    //         if ($(input).val()) {
    //             $(target).addClass('d-flex').show(200);
    //             $(target).children('a').attr('href', "/" + $(input).val());
    //         } else {
    //             $(target).removeClass('d-flex').hide(200);
    //         }
    //     }
    // });

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

$(document).on("click", ".deshabilitar_inputs", (ev)=>{
    const tag = $(ev.currentTarget);
    const props = tag.is(':checked') ? tag.data("on") : tag.data("off");
    const target = $(tag.data('target'));
    const conf = props.split(" ").reduce((acc, elem)=>{ acc[elem] = true; return acc;},{});

    if(target.length){
        filepond = FilePond.find(target[0]);

        if(filepond){
            filepond.setOptions({ disabled: false, required: false, ...conf});
        }else{
            target.setOptions({ disabled: false, required: false, ...conf});
        }
    }
});

$(document).on("change", "#id_proveedor", (ev)=>{
    const tag = $(ev.currentTarget).find(":selected");
    agregar_icono_pdf("opinion_cumplimiento", tag.data("opinion_cumplimiento"));
    agregar_icono_pdf("estado_cuenta_bancario", tag.data("estado_cuenta_bancario"));
});