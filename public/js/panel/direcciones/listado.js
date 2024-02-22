let tabla_direcciones;

$(document).ready(async () => {

    $('.btn_crear_proveedor').click(function () {
        evento_btn_proveedor();
    });

    tabla_direcciones = await $('.tabla_direcciones').DataTable({
        dom: 'Blrtip',
        buttons: [{
            extend: 'excelHtml5',
            exportOptions: {
                columns: [0, 1, 2]
            }
        },
        {
            extend: 'pdfHtml5',
            exportOptions: {
                columns: [0, 1, 2]
            }
        }
        ],
        ajax: {
            url: '/FiDigital/panel/direcciones/get_direcciones',
            type: 'POST',
            data: function (data) {
                // Append formdata
                $('.table').addClass('is-loading');
                $('.table td button').text('');
            },
            dataSrc: ""
        },
        order: [
            [1, 'desc']
        ],
        language: {
            "url": "https://cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json",
            paginate: {
                next: `<i class="fa fa-angle-right"></i><span class="sr-only">Next</span>`,
                previous: `<i class="fa fa-angle-left"></i><span class="sr-only">Previous</span>`
            }
        },
        initComplete: function () {

            //Agregar panel de filtros
            $('#DataTables_Table_0_length').after(`<div class="contenedor_filtros"></div>`);

            tabla_direcciones.buttons().container().appendTo('.contenedor_filtros');
            $('.dt-buttons .dt-button').first().addClass('btn btn-icon btn-xs mx-1 my-auto btn-success bg-gradient-success').html(`<span class="btn-inner--icon"><i class="fas fa-file-excel"></i></span>`)
            $('.dt-buttons .dt-button').last().addClass('btn btn-icon btn-xs mx-1 my-auto btn-danger bg-gradient-danger').html(`<span class="btn-inner--icon"><i class="fas fa-file-pdf"></i></span>`)
        },
        columnDefs: [{
            "width": "40%",
            "targets": 0
        },],
        columns: [{
            "mData": "direccion",
            "mRender": function (data, type, row) {
                return `<div class="align-middle cursor-pointer">
                                <span class="fas fa-building text-xs"></span>
                                <span class="font-weight-bold text-xs">${data ?? '---'}</span>
                            </div>`;
            }
        },
        {
            "mData": "created_at",
            "mRender": function (data, type, row) {
                return `<div class="align-middle cursor-pointer btn_historial_borrador" id_modificacion="${row.id_queja}" nombre="${row.id_queja}">
                                <span class="fas fa-clock text-xs"></span>
                                <span class="font-weight-bold text-xs">${data ?? '---'}</span>
                            </div>`;
            }
        },
        {
            "mData": "id_direccion",
            "mRender": function (data, type, row) {

                let btn_archivado = '';

                if (row.activo == 0) {
                    btn_archivado = `
                        <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-success shadow text-white rounded btn_archivar cursor-pointer" activo="1" id_direccion="${row.id_direccion}">
                            <i class="fas fa-check text-white" aria-hidden="true"></i>
                        </div>`;
                } else {
                    btn_archivado = `
                        <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-danger shadow text-white rounded btn_archivar cursor-pointer" activo="0" id_direccion="${row.id_direccion}">
                            <i class="fas fa-archive text-white" aria-hidden="true"></i>
                        </div>`;
                }

                return `<div class="text-center ms-auto">
                            <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-info shadow text-white rounded editar_direccion cursor-pointer" id_direccion="${row.id_direccion}">
                                <i class="fas fa-edit text-white" aria-hidden="true"></i>
                            </div>
                            ${btn_archivado}
                        </div>
                        `;
            }
        }
        ],
    });

    tabla_direcciones.on('preDraw', function () {
        startTime = new Date().getTime();
        $('.btn_get_modificaciones').get()
    })
        .on('draw.dt', function () {
            console.log('La tabla tardó: ' + (new Date().getTime() - startTime) + 'ms en cargar');
            $('.table').removeClass('is-loading');

            //Cambiar color paginacion
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-danger');

            $('.btn_archivar').click((e) => {
                archivar_direccion($(e.currentTarget).attr('id_direccion'), $(e.currentTarget).attr('activo'));
            })
        });

    //Inicializar buscador
    $('.busqueda_nav').keyup(function () {
        tabla_direcciones.search($(this).val()).draw();
        //console.log($(this).val());
    });

    $('.btn_nueva_direccion').on('click', function() {
        mostrar_formulario_direccion();
    });

    // Evento para el botón de editar direccion
    $(document).on('click', '.editar_direccion', function() {
        let id_direccion = $(this).attr('id_direccion');
        mostrar_formulario_direccion(id_direccion);
    });
});

const obtener_detalle_direccion = async (id_direccion) => {
    try {
        const response = await $.ajax({
            url: 'direcciones/get_direcciones', // Asegúrate de que esta URL esté configurada para devolver los detalles de un solo direccion cuando se pase `id_direccion`
            type: 'POST',
            dataType: 'json',
            data: { id_direccion }
        });
        return response;
    } catch (error) {
        console.error("Error al obtener el direccion:", error);
        Swal.fire('Error', 'No se pudo obtener la información del direccion', 'error');
        return null;
    }
};

const mostrar_formulario_direccion = async (id_direccion = null) => {
    let direccion_detalle = null;
    console.log(id_direccion);
    if (id_direccion) {
        direccion_detalle = await obtener_detalle_direccion(id_direccion);
        if (!direccion_detalle) return; // Si no hay detalles, detener ejecución
    }

    console.log(direccion_detalle);

    const titulo = id_direccion ? 'Editar direccion' : 'Nuevo direccion';
    const accion = id_direccion ? 'Actualizar' : 'Crear';

    Swal.fire({
        title: titulo,
        html: `
            <input id="id_direccion" type="hidden" value="${id_direccion || ''}">
            <div class="form-group px-4 mb-2">
                <label for="direccion" class="form-label">Nombre del direccion</label>
                <input id="direccion" class="form-control" placeholder="Nombre del direccion" value="${direccion_detalle ? direccion_detalle.direccion : ''}">
            </div>`,
        confirmButtonText: accion,
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false,
        focusConfirm: false,
        preConfirm: () => {
            const direccion = document.getElementById('direccion').value;
            const id_direccion = document.getElementById('id_direccion').value;
            if (!direccion) {
                Swal.showValidationMessage('Por favor ingresa el nombre del direccion');
                return false;
            }
            return guardar_direccion({ direccion, id_direccion });
        }
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'El direccion ha sido guardado correctamente.',
                icon: 'success'
            });

            tabla_direcciones.ajax.reload();
        }
    });
};

const guardar_direccion = async ({direccion, id_direccion}) => {
    try {
        const datos = { direccion, id_direccion };
        if (id_direccion) datos.id_direccion = id_direccion;

        const response = await $.ajax({
            url: 'direcciones/post_direccion',
            type: 'POST',
            dataType: 'json',
            data: datos
        });

        return response;
    } catch (error) {
        Swal.showValidationMessage(`Error: ${error.responseText}`);
        return false;
    }
};

const archivar_direccion = async (id_direccion, activo) => {
    try {
        const response = await $.ajax({
            url: 'direcciones/post_direccion',
            type: 'POST',
            dataType: 'json',
            data: { id_direccion, activo }
        });

        tabla_direcciones.ajax.reload();
    } catch (error) {
        Swal.showValidationMessage(`Error: ${error.responseText}`);
        return false; ñ
    }
};