$(document).ready(async () => {
    let tabla_usuarios = await $('.tabla_usuarios').DataTable({
        dom: 'Blrtip',
        buttons: [
            'excelHtml5',
            'pdfHtml5'
        ],
        language: {
            "url": "https://cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json",
            paginate: {
                next: `
                <li class="page-item">
                    <a class="page-link" href="javascript:;" aria-label="Next">
                    <i class="fa fa-angle-right"></i>
                    <span class="sr-only">Siguiente</span>
                    </a>
                </li>
                `,
                previous: `
                <li class="page-item">
                    <a class="page-link" href="javascript:;" aria-label="Previous">
                        <i class="fa fa-angle-left"></i>
                        <span class="sr-only">Anterior</span>
                    </a>
                </li>
                `
            }
        },
        initComplete: function () {

            //Modificar select de longitud
            //$('#DataTables_Table_0_length label').html(`Mostrar: <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" class="form-select form-select-sm"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select>`);

            //Agregar panel de filtros
            $('#DataTables_Table_0_length').after(`
            <div class="contenedor_filtros">
                <div class="form-group">
                    <label class="form-control-label" for="filtro_dependencia">Dependencia:</label>
                    <div class="input-group">
                        <select class="form-select form-select-sm" id="filtro_dependencia">
                            <option value="">Todos</option>
                        </select>
                    </div>
                </div>
            </div>
            `);

            tabla_usuarios.buttons().container().appendTo('.contenedor_filtros');
            $('.dt-buttons .dt-button').first().addClass('btn btn-icon btn-3 btn-success bg-gradient-success').html(`<span class="btn-inner--icon"><i class="fas fa-file-excel"></i></span>`)
            $('.dt-buttons .dt-button').last().addClass('btn btn-icon btn-3 btn-danger bg-gradient-danger').html(`<span class="btn-inner--icon"><i class="fas fa-file-pdf"></i></span>`)

            //inicializar listener de filtros
            $('#filtro_dependencia').change(function () {
                tabla_usuarios.ajax.reload();
            });

        },
        ajax: {
            url: '/FiDigital/usuarios/get_by_ajax',
            type: 'POST',
            data: function (data) {
                // Append formdata
                data.dependencia = $('#filtro_dependencia').val();
                $('.table').addClass('is-loading');
                $('.table td button').text('');
            },
            dataSrc: ""
        },
        columns: [{
                "mData": "usuario",
                "mRender": function (data, type, row) {
                    return `
                    <div class="d-flex px-4">
                        <div class="my-auto">
                            <h6 class="mb-0 text-sm">${data}</h6>
                        </div>
                    </div>`;
                }
            },
            {
                "mData": "direccion",
                "mRender": function (data, type, row) {
                    return `<span class="text-xs font-weight-bold">${data}</span>`;
                }
            },
            {
                "mData": "logged_at",
                "mRender": function (data, type, row) {
                    return `<span class="text-xs font-weight-bold">${data ?? 'Nunca'}</span>`;
                }
            },
            {
                "mData": "estatus",
                "mRender": function (data, type, row) {
                    return `<span class="text-xs font-weight-bold text-capitalize">${data}</span>`;
                }
            },
            {
                "mData": "id_usuario",
                "mRender": function (data, type, row) {
                    return `Sin permisos`;
                    return `
                    <div class="ms-auto text-center">
                        <button class="btn btn-link text-info text-gradient px-3 mb-0 btn_editar_usuario" id_usuario="${data}">
                            <i class="far fa-edit me-2" aria-hidden="true"></i>Editar
                        </button>
                        <button class="btn btn-link text-danger px-3 mb-0 btn_desactivar_usuario" id_usuario="${data}">
                            <i class="fas fa-ban me-2" aria-hidden="true"></i>Desactivar
                        </button>
                    </div>
                    `;
                }
            }
        ],
    });

    tabla_usuarios.on('preDraw', function () {
            startTime = new Date().getTime();
        })
        .on('draw.dt', function () {
            console.log('La tabla tardó: ' + (new Date().getTime() - startTime) + 'ms en cargar');
            $('.tabla_usuarios').removeClass('is-loading');

            //Cambiar color paginacion
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-danger');

            //Crear listener de los botones
            $('.btn_editar_usuario').off('click')
            $('.btn_editar_usuario').click(function (e) {
                let id_usuario = $(this).attr('id_usuario');

                $.ajax({
                    url: '/FiDigital/usuarios/get_by_id_ajax',
                    data: {
                        id_usuario
                    },
                    dataType: 'JSON',
                    type: 'POST',
                    success: function (respuesta) {
                        for (const entry of Object.entries(respuesta)) {
                            if (entry[0] != 'ruta_documento') { //Input File
                                $(`[name=${entry[0]}]`).val(entry[1]).trigger('change'); //Asignar valor y disparar evento de cambio para select2
                            }
                        }

                    }
                });
            });

            $('.btn_desactivar_ususario').off('click')
            $('.btn_desactivar_ususario').click(async function (e) {
                let id_usuario = $(this).attr('id_usuario');

                await $.ajax({
                    url: '/FiDigital/usuarios/post_disable_by_ajax',
                    data: {
                        id_usuario
                    },
                    dataType: 'JSON',
                    type: 'POST',
                    success: function (respuesta, text, xhr) {

                        if (xhr.status == 204) {
                            Swal.fire({
                                title: '¡Hay un problema!',
                                text: 'No se pudo desactivar el usuario',
                                icon: 'error',
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn bg-gradient-danger me-3",
                                    cancelButton: "btn bg-gradient-secondary"
                                }
                            });
                        } else if (xhr.status == 200) {
                            Swal.fire({
                                title: '¡Desactivado!',
                                text: 'El usuario se desactivó con exito',
                                icon: 'error',
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn bg-gradient-danger me-3",
                                    cancelButton: "btn bg-gradient-secondary"
                                }
                            });
                            tabla_modificaciones.draw();
                        }
                    }
                }); // Fin ajax

            })

        });

    //Inicializar buscador
    $('.busqueda_nav').keyup(function () {
        volver_arriba(); //Regresar a la parte de arriba
        $('#formulario_usuarios').collapse('hide')
        tabla_usuarios.search($(this).val()).draw();
    })

    $('.btn_guardar_usuario').off('click')
    $('.btn_guardar_usuario').click(() => {

        let validar; //Definir validar como global para su uso en el bucle de inputs
        let guardar = 1; //Flag de guardado, si es erronea la validación de algun campo se detiene el guardado
        let datos = new FormData(); // Inicializar form data
        let id_usuario = $('.id_usuario').val();
        let url;

        if (typeof id_modificacion != 'undefined' && id_modificacion != 0) {
            url = '/panel/usuarios/update_usuario';
        } else {
            url = '/panel/usuarios/post_usuario';
        }

        $('.input_usuario').each(function () {
            try {
                validar = $(this).parsley({
                    excluded: "input[type=hidden], [disabled], :hidden"
                }).validate();
                if (validar != true) {
                    throw "Por favor llena el campo: " + $(this).siblings('label').text();
                } else {
                    if (typeof $(this).attr('readonly') == 'undefined') {
                        datos.append($(this).attr('name'), $(this).val() != null ? $(this).val() : 0);
                    }
                }
            } catch (excepcion) {
                Swal.fire({
                    title: 'Error',
                    html: excepcion,
                    icon: 'error',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: "btn bg-gradient-danger me-3",
                        cancelButton: "btn bg-gradient-secondary"
                    }
                });

                guardar = 0;
                return;
            }
        });

        if (guardar == 1) {
            $('#formulario_usuarios').parsley().reset();
            let texto = `<ul class="w-70 m-auto mb-4">`;
            for (var entrada of datos.entries()) {
                if (entrada[0].indexOf('id_') < 0) {
                    texto += "<br><li class='text-start'>" + "<b style='text-transform: capitalize'>" + entrada[0].replace('_', ' ') + "</b>" + ': ' + entrada[1] + "</li>";
                }
            }
            texto += `</ul>`;

            Swal.fire({
                title: "¿Los datos son correctos?",
                html: texto,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'No, cancelar',
                buttonsStyling: false,
                customClass: {
                    confirmButton: "btn bg-gradient-danger me-3",
                    cancelButton: "btn bg-gradient-secondary"
                }
            }).then(function (respuesta) {
                if (respuesta.value) {

                    $.ajax({
                        url: url,
                        data: datos,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (respuesta) {
                            if (respuesta == true) {
                                Swal.fire({
                                    title: '¡Listo!',
                                    html: 'El usuario ha sido guardado con éxito',
                                    icon: 'success',
                                    buttonsStyling: false,
                                    customClass: {
                                        confirmButton: "btn bg-gradient-danger me-3"
                                    }
                                }).then(() => {
                                    window.location.reload();
                                })
                            }
                        }
                    });
                } // Fin if value
            }) // Fin Then SweetAlert

        }
    })

    $('[name="id_direccion"]').change(async function (e) {
        let id_direccion = $(this).attr('id_direccion');

        await $.ajax({
            url: '/FiDigital/usuarios/get_unidad_by_ajax',
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
                            confirmButton: "btn bg-gradient-danger me-3",
                            cancelButton: "btn bg-gradient-secondary"
                        }
                    });
                } else if (xhr.status == 200) {
                    $('[name="id_unidad"]').empty();
                    $('[name="id_unidad"]').append(`<option selected>Selecciona una opción</option>`);
                    respuesta.forEach(unidad => {
                        $('[name="id_unidad"]').append(`<option value="${unidad.id_unidad}">${unidad.unidad}</option>`);
                    });

                }
            }
        }); // Fin ajax

    })


    //Cambiar contraseña
    $('.btn_cambiar_contrasena').click((e) => {

        e.preventDefault();

        if (!$('.form_cambiar_contrasena').parsley().isValid()) {
            $('.form_cambiar_contrasena').parsley().validate();
            return false;
        }

        if ($(".requerimientos_contrasena li.text-danger").length > 0) {
            Swal.fire({
                title: 'Error',
                text: 'Tu contraseña no cumple los requerimientos',
                icon: 'error'
            })
            return false;
        } 

        $.ajax({
            url: '/FiDigital/cuenta/cambiar_contrasena',
            data: {
                cactual: $('.cactual').val(),
                contrasena: $('.contrasena_1').val()
            },
            type: 'POST',
            success: function (respuesta, text, xhr) {
                if (xhr.status == 203) {
                    Swal.fire({
                        title: '¡Hay un problema!',
                        text: text,
                        icon: 'error',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn bg-gradient-danger me-3",
                            cancelButton: "btn bg-gradient-secondary"
                        }
                    });
                } else if (xhr.status == 200) {
                    Swal.fire({
                        title: '¡Contraseña actualizada!',
                        text: `Tu contraseña se actualizó con éxito`,
                        icon: 'success',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn bg-gradient-danger me-3",
                            cancelButton: "btn bg-gradient-secondary"
                        }
                    }).then(()=>{
                        window.location.reload()
                    })

                }

            },
            error: (e, e2, e3) => {
                console.log(e, e2, e3);
            }
        }); // Fin ajax

    })

    var result = $('#password-strength')

    $('.contrasena_1').keyup(async function () {
        let value = $('.contrasena_1').val();

        $(".requerimientos_contrasena li").each(function () {
            var reg = new RegExp($(this).data("val-regex"));

            $(this).removeClass("text-success").removeClass("text-danger");

            if (reg.test(value)) {
                $(this).addClass("text-success");
            } else {
                $(this).addClass("text-danger");
            }
        });

    })


})