let tabla_usuarios;
const mostrar_modal_editar_permisos = async (id_usuario, nombre) => {
    try {
        // Realizar petición AJAX para obtener los permisos actuales
        const respuesta = await $.ajax({
            url: '/FiDigital/panel/usuarios/get_permisos',
            type: 'POST',
            dataType: 'JSON',
            data: { id_usuario }
        });

        if (respuesta) {
            const { value: permisos } = await Swal.fire({
                title: nombre,
                html: construir_html_permisos(respuesta),
                focusConfirm: false,
                preConfirm: () => recoger_permisos(),
                buttonsStyling: false,
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: 'Actualizar',
                cancelButtonText: 'Salir',
                customClass: {
                    confirmButton: "btn bg-gradient-info",
                    cancelButton: "btn bg-gradient-secondary me-3",
                    popup: 'col-lg-4'
                }
            });

            if (permisos) {
                actualizar_permisos(id_usuario, permisos);
            }
        } else {
            console.error('No se pudieron obtener los permisos');
        }
    } catch (error) {
        console.error('Error al obtener permisos:', error);
    }
};

const construir_html_permisos = (permisos) => {
    let html = '<form id="form_permisos" class="form_permisos_estilo py-3">';

    Object.entries(permisos).forEach(([permiso, valor]) => {
        const is_checked = valor === '1';
        if (permiso.indexOf('_json') < 0) {
            const permiso_nombre = permiso.replace('_', ' ').replace('_', ' ').toUpperCase();
            const icono = 'fas fa-lock';

            html += `
            <div class="form-check ps-2 form-switch d-flex justify-content-between align-items-center mb-3">
                <label class="form-check-label d-flex align-items-center" for="${permiso}">
                    <i class="${icono} me-2"></i>${permiso_nombre}
                </label>
                <input class="form-check-input" type="checkbox" id="${permiso}" ${is_checked ? 'checked' : ''}>
            </div>`;

        }
    });

    html += '</form>';
    return html;
};


const recoger_permisos = () => {
    const permisos = {};
    $('#form_permisos input').each(function () {
        permisos[this.id] = $(this).is(':checked') ? 1 : 0;
    });
    return permisos;
};

const actualizar_permisos = (id_usuario, permisos) => {
    // Aquí, realiza una petición AJAX para actualizar los permisos en el servidor
    $.ajax({
        url: '/FiDigital/panel/usuarios/update_permisos',
        method: 'POST',
        data: { id_usuario, permisos },
        success: function (response) {
            // Manejar la respuesta del servidor
            Swal.fire('Exito', 'Permisos actualizados', 'success');
            tabla_usuarios.ajax.reload();
        }
    });
};

const son_todos_ceros = (objeto) => {
    for (let clave in objeto) {
        if (objeto.hasOwnProperty(clave)) {
            if (objeto[clave] !== "0") {
                return false;
            }
        }
    }
    return true;
}

$(document).ready(async () => {
    tabla_usuarios = await $('.tabla_usuarios').DataTable({
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
            url: '/FiDigital/panel/usuarios/get_by_ajax',
            type: 'POST',
            data: function (data) {
                // Append formdata
                data.dependencia = $('#filtro_dependencia').val();
                $('.table').addClass('is-loading');
                $('.table td button').text('');
            },
            dataSrc: ""
        },
        order: [2, 'desc'],
        columns: [{
            "mData": "nombre_usuario",
            "mRender": function (data, type, row) {
                let tiene_permisos = son_todos_ceros(row.permisos);
                console.log(row.nombre_usuario, row.permisos);
                return `
                    <div class="d-flex px-4">
                        <div class="my-auto">
                            <h6 class="mb-0 text-sm ${tiene_permisos ? 'text-danger' : ''}">${data} ${tiene_permisos ? '<span class="badge badge-danger ms-2">Sin permisos</span>' : ''}</h6>
                        </div>
                    </div>`;
            }
        },
        {
            "mData": "created_at",
            "mRender": function (data, type, row) {
                if (type === 'display') {
                    return `<span class="text-xs font-weight-bold">${data ?? 'Sin datos'}</span>`;
                } else {
                    return row.id_usuario;
                }
            }
        },
        {
            "mData": "logged_at",
            "mRender": function (data, type, row) {
                if (type === 'display') {
                    return `<span class="text-xs font-weight-bold">${data ?? 'Sin datos'}</span>`;
                } else {
                    return data;
                }
            }
        },
        {
            "mData": "estatus",
            "mRender": function (data, type, row) {
                let tiene_permisos = son_todos_ceros(row.permisos);
                return `<span class="text-sm font-weight-bold text-capitalize ${tiene_permisos ? 'text-danger' : ''}">${tiene_permisos ? '<span class="badge badge-danger ms-2">Sin permisos</span>' : `<span class="badge badge-info ms-2">${data}</span>`}</span>`;
            }
        },
        {
            "mData": "id_usuario",
            "mRender": function (data, type, row) {
                let btn_desactivar = '';
                if (row.estatus == 'activo') {
                    btn_desactivar = `
                    <button class="btn bg-gradient-danger px-3 mb-0 btn_desactivar_usuario" id_usuario="${data}">
                        <i class="fas fa-ban me-2" aria-hidden="true"></i>Desactivar
                    </button>
                    `;
                } else {
                    btn_desactivar = `
                    <button class="btn bg-gradient-success px-3 mb-0 btn_activar_usuario" id_usuario="${data}">
                        <i class="fas fa-check me-2" aria-hidden="true"></i>Activar
                    </button>
                    `;
                }

                return `
                <div class="ms-auto text-center">
                    <button hidden class="btn bg-gradient-info text-gradient px-3 mb-0 btn_editar_usuario" id_usuario="${data}">
                        <i class="far fa-edit me-2" aria-hidden="true"></i>Editar
                    </button>
                    <button class="btn bg-gradient-warning text-gradient px-3 mb-0 btn_editar_permisos" nombre="${row.nombre_usuario}" id_usuario="${data}">
                        <i class="fas fa-user-shield me-2" aria-hidden="true"></i>Permisos
                    </button>
                    ${btn_desactivar}
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
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-info');

            //Crear listener de los botones
            $('.btn_editar_usuario').off('click')
            $('.btn_editar_usuario').click(function (e) {
                let id_usuario = $(this).attr('id_usuario');

                $.ajax({
                    url: '/FiDigital/panel/usuarios/get_by_id_ajax',
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

            $('.btn_editar_permisos').off('click');
            $('.btn_editar_permisos').on('click', function () {
                const id_usuario = $(this).attr('id_usuario');
                const nombre = $(this).attr('nombre');
                mostrar_modal_editar_permisos(id_usuario, nombre);
            });

            $('.btn_desactivar_usuario').off('click')
            $('.btn_desactivar_usuario').click(async function (e) {
                let id_usuario = $(this).attr('id_usuario');

                await $.ajax({
                    url: '/FiDigital/panel/usuarios/post_disable_by_ajax',
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
                                    confirmButton: "btn bg-gradient-info me-3",
                                    cancelButton: "btn bg-gradient-secondary"
                                }
                            });
                        } else if (xhr.status == 200) {
                            Swal.fire({
                                title: '¡Desactivado!',
                                text: 'El usuario se desactivó con exito',
                                icon: 'success',
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn bg-gradient-info me-3",
                                    cancelButton: "btn bg-gradient-secondary"
                                }
                            });
                        }
                        tabla_usuarios.ajax.reload();
                    }
                }); // Fin ajax

            })

            $('.btn_activar_usuario').off('click')
            $('.btn_activar_usuario').click(async function (e) {
                let id_usuario = $(this).attr('id_usuario');

                await $.ajax({
                    url: '/FiDigital/panel/usuarios/post_enable_by_ajax',
                    data: {
                        id_usuario
                    },
                    dataType: 'JSON',
                    type: 'POST',
                    success: function (respuesta, text, xhr) {

                        if (xhr.status == 204) {
                            Swal.fire({
                                title: '¡Hay un problema!',
                                text: 'No se pudo activar el usuario',
                                icon: 'error',
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn bg-gradient-info me-3",
                                    cancelButton: "btn bg-gradient-secondary"
                                }
                            });
                        } else if (xhr.status == 200) {
                            Swal.fire({
                                title: '¡Activado!',
                                text: 'El usuario se activó con exito',
                                icon: 'success',
                                buttonsStyling: false,
                                customClass: {
                                    confirmButton: "btn bg-gradient-info me-3",
                                    cancelButton: "btn bg-gradient-secondary"
                                }
                            });
                            tabla_usuarios.ajax.reload();
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

    $('.btn_crear_usuario').off('click')
    $('.btn_crear_usuario').click(() => {
        crear_usuario();
    })

    $('.btn_guardar_usuario').off('click')
    $('.btn_guardar_usuario').click(() => {

        let validar; //Definir validar como global para su uso en el bucle de inputs
        let guardar = 1; //Flag de guardado, si es erronea la validación de algun campo se detiene el guardado
        let datos = new FormData(); // Inicializar form data
        let id_usuario = $('.id_usuario').val();
        let url;

        if (typeof id_modificacion != 'undefined' && id_modificacion != 0) {
            url = '/FiDigital/panel/usuarios/update_usuario';
        } else {
            url = '/FiDigital/panel/usuarios/post_usuario';
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
                        confirmButton: "btn bg-gradient-info me-3",
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
                    confirmButton: "btn bg-gradient-info me-3",
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
                                        confirmButton: "btn bg-gradient-info me-3"
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
                            confirmButton: "btn bg-gradient-info me-3",
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
                            confirmButton: "btn bg-gradient-info me-3",
                            cancelButton: "btn bg-gradient-secondary"
                        }
                    }).then(() => {
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

const crear_usuario = async (json_editar = []) => {

    disableBtn('.btn_nuevo_usuario');

    let titulo = 'Nuevo usuario';
    let btn_confirmar = `Crear usuario<i class="fas fa-arrow-right ms-2"></i>`;
    let titulo_success = '¡Creado!';
    let texto_success = 'El usuario se añadió con éxito';

    if (json_editar.length != 0) {
        titulo = 'Editar usuario';
        btn_confirmar = `Guardar usuario<i class="fas fa-arrow-right ms-2"></i>`;
        titulo_success = 'Guardado!';
        texto_success = 'El usuario se guardó con éxito';
    }

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
            loader: 'custom-loader'
        },
        html: `
        <form class="w-100 m-auto row p-2 text-start form_usuario" data-validate="parsley">
            <div class="col-lg-6">
                <div class="form-group">
                    <label class="form-control-label">Nombres:</label>
                    <input required class="input_usuario form-control" name="nombres" placeholder="Escribe los nombres...">
                    <input type="hidden" class="input_usuario form-control" name="id_usuario">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label class="form-control-label">Apellido Paterno:</label>
                    <input required class="input_usuario form-control" name="ape_paterno" placeholder="Escribe el apellido paterno...">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label class="form-control-label">Apellido Materno:</label>
                    <input required class="input_usuario form-control" name="ape_materno" placeholder="Escribe el apellido materno...">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label class="form-control-label">Correo:</label>
                    <input required type="email" class="input_usuario form-control" name="correo" placeholder="Escribe el correo...">
                </div>
            </div>
        </form>
        `,
        focusConfirm: false,
        loaderHtml: '<div class="spinner-border text-info text-gradient"></div>',
        preConfirm: function () {
            Swal.showLoading();

            if (!$(Swal.getPopup().querySelector('.form_usuario')).parsley().isValid()) {
                $(Swal.getPopup().querySelector('.form_usuario')).parsley().validate();
                Swal.showValidationMessage(`Por favor llena correctamente los campos`);
            }

            return {
                id_usuario: Swal.getPopup().querySelector('.input_usuario[name="id_usuario"]').value.trim(),
                nombres: Swal.getPopup().querySelector('.input_usuario[name="nombres"]').value.trim(),
                ape_paterno: Swal.getPopup().querySelector('.input_usuario[name="ape_paterno"]').value.trim(),
                ape_materno: Swal.getPopup().querySelector('.input_usuario[name="ape_materno"]').value.trim(),
                correo: Swal.getPopup().querySelector('.input_usuario[name="correo"]').value.trim()
            };
        },
        willOpen: (e, ee) => {
            if (json_editar) {
                for (const key of Object.keys(json_editar)) {
                    const input = e.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = json_editar[key];
                    }
                }
            }
        },
        didOpen: () => {
            $('.select2_swal').select2({
                placeholder: "Selecciona una opción",
            });
        },
        onDismiss: () => { }
    }).then(async (result) => {

        if (result.isConfirmed) {
            await $.ajax({
                url: '/FiDigital/panel/usuarios/post_usuario',
                data: {
                    id_usuario: result.value.id_usuario,
                    nombres: result.value.nombres,
                    ape_paterno: result.value.ape_paterno,
                    ape_materno: result.value.ape_materno,
                    correo: result.value.correo
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

                        if (tabla_usuarios) {
                            tabla_usuarios.ajax.reload();
                        }

                        return true;
                    }
                },
                error: (err, texto) => {
                    error_ajax(JSON.parse(err.responseText)['message']);
                }
            });
        }
    });

    enableBtn('.btn_nuevo_usuario');
};
