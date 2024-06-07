let tabla_programas;

$(document).ready(async () => {

    tabla_programas = await $('.tabla_programas').DataTable({
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
            url: '/FiDigital/panel/programas/get_programas',
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

            tabla_programas.buttons().container().appendTo('.contenedor_filtros');
            $('.dt-buttons .dt-button').first().addClass('btn btn-icon btn-xs mx-1 my-auto btn-success bg-gradient-success').html(`<span class="btn-inner--icon"><i class="fas fa-file-excel"></i></span>`)
            $('.dt-buttons .dt-button').last().addClass('btn btn-icon btn-xs mx-1 my-auto btn-danger bg-gradient-danger').html(`<span class="btn-inner--icon"><i class="fas fa-file-pdf"></i></span>`)
        },
        columnDefs: [{
            "width": "40%",
            "targets": 0
        },],
        columns: [{
            "mData": "nombre_sesion",
            "mRender": function (data, type, row) {

                return `<div class="d-flex px-2 detalle_sesion cursor-pointer" id_programa="${row.id_programa}">
                                <div>
                                    <button class="btn btn-link text-gradient p-0 m-0 text-dark">
                                        <i class="fa fa-address-card text-lg avatar avatar-sm rounded-circle me-2 text-dark"></i>
                                    </button>
                                </div>
                                <div class="my-auto">
                                    <h6 class="mb-0 text-sm text-wrap">${row.programa}</h6>
                                    <span class="font-weight-bold text-xs text-muted text-wrap"><i class="fas fa-list-ol"></i>  ${row.expedientes_asignados == '0' ? 'Sin' : row.expedientes_asignados} expedientes asignados</span>
                                </div>
                            </div>`;
            }
        },
        {
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
            "mData": "id_programa",
            "mRender": function (data, type, row) {

                let btn_archivado = '';

                if (row.activo == 0) {
                    btn_archivado = `
                        <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-success shadow text-white rounded btn_archivar cursor-pointer" activo="1" id_programa="${row.id_programa}">
                            <i class="fas fa-check text-white" aria-hidden="true"></i>
                        </div>`;
                } else {
                    btn_archivado = `
                        <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-danger shadow text-white rounded btn_archivar cursor-pointer" activo="0" id_programa="${row.id_programa}">
                            <i class="fas fa-archive text-white" aria-hidden="true"></i>
                        </div>`;
                }

                return `<div class="text-center ms-auto">
                            <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-success shadow text-white rounded btn_documentacion cursor-pointer" id_programa="${row.id_programa}">
                                <i class="fas fa-pdf text-white me-2" aria-hidden="true"></i> Documentación
                            </div>
                            <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-info shadow text-white rounded editar_programa cursor-pointer" id_programa="${row.id_programa}">
                                <i class="fas fa-edit text-white" aria-hidden="true"></i>
                            </div>
                            ${btn_archivado}
                        </div>`;
            }
        }
        ],
    });

    tabla_programas.on('preDraw', function () {
        startTime = new Date().getTime();
        $('.btn_get_modificaciones').get()
    })
        .on('draw.dt', function () {
            console.log('La tabla tardó: ' + (new Date().getTime() - startTime) + 'ms en cargar');
            $('.table').removeClass('is-loading');

            //Cambiar color paginacion
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-danger');

            $('.btn_archivar').click((e) => {
                archivar_programa($(e.currentTarget).attr('id_programa'), $(e.currentTarget).attr('activo'));
            })

            $('.btn_documentacion').click((e) => {
                documentacion_programa($(e.currentTarget).attr('id_programa'));
            })

        });


    //Inicializar buscador
    $('.busqueda_nav').keyup(function () {
        tabla_programas.search($(this).val()).draw();
        //console.log($(this).val());
    });

    $('.nuevo_programa').on('click', function () {
        mostrar_formulario_programa();
    });

    // Evento para el botón de editar programa
    $(document).on('click', '.editar_programa', function () {
        let id_programa = $(this).attr('id_programa');
        mostrar_formulario_programa(id_programa);
    });
});

const obtener_direcciones = async () => {
    try {
        const response = await $.ajax({
            url: 'direcciones/get_direcciones',
            type: 'POST',
            dataType: 'json'
        });
        return response;
    } catch (error) {
        console.error("Error al obtener direcciones:", error);
        Swal.fire('Error', 'No se pudieron obtener las direcciones', 'error');
    }
};

const obtener_detalle_programa = async (id_programa) => {
    try {
        const response = await $.ajax({
            url: 'programas/get_programas', // Asegúrate de que esta URL esté configurada para devolver los detalles de un solo programa cuando se pase `id_programa`
            type: 'POST',
            dataType: 'json',
            data: { id_programa }
        });
        return response;
    } catch (error) {
        console.error("Error al obtener el programa:", error);
        Swal.fire('Error', 'No se pudo obtener la información del programa', 'error');
        return null;
    }
};

const mostrar_formulario_programa = async (id_programa = null) => {
    let programa_detalle = null;
    if (id_programa) {
        programa_detalle = await obtener_detalle_programa(id_programa);
        if (!programa_detalle) return; // Si no hay detalles, detener ejecución
    }

    const direcciones = await obtener_direcciones();
    if (!direcciones) return;

    const opciones_direcciones = direcciones.map(direccion =>
        `<option value="${direccion.id_direccion}" ${programa_detalle && programa_detalle.id_direccion === direccion.id_direccion ? 'selected' : ''}>${direccion.direccion}</option>`
    ).join('');

    const titulo = id_programa ? 'Editar Programa' : 'Nuevo Programa';
    const accion = id_programa ? 'Actualizar' : 'Crear';

    Swal.fire({
        title: titulo,
        html: `
            <input id="id_programa" type="hidden" value="${id_programa || ''}">
            <div class="form-group px-4 mb-2">
                <label for="programa" class="form-label">Nombre del Programa</label>
                <input id="programa" class="form-control" placeholder="Nombre del Programa" value="${programa_detalle ? programa_detalle.programa : ''}">
            </div>
            <div class="form-group px-4 ">
                <label for="id_direccion" class="form-label">Dirección</label>
                <select id="id_direccion" class="form-select">${opciones_direcciones}</select>
            </div>`,
        confirmButtonText: accion,
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false,
        focusConfirm: false,
        preConfirm: () => {
            const programa = document.getElementById('programa').value;
            const id_direccion = document.getElementById('id_direccion').value;
            if (!programa) {
                Swal.showValidationMessage('Por favor ingresa el nombre del programa');
                return false;
            }
            return guardar_programa({ programa, id_direccion, id_programa });
        }
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'El programa ha sido guardado correctamente.',
                icon: 'success'
            });

            tabla_programas.ajax.reload();
        }
    });
};

const guardar_programa = async ({ programa, id_direccion, id_programa }) => {
    try {
        const datos = { programa, id_direccion };
        if (id_programa) datos.id_programa = id_programa;

        const response = await $.ajax({
            url: 'programas/post_programa',
            type: 'POST',
            dataType: 'json',
            data: datos
        });

        return response;
    } catch (error) {
        Swal.showValidationMessage(`Error: ${error.responseText}`);
        return false; ñ
    }
};

const archivar_programa = async (id_programa, activo) => {
    try {
        const response = await $.ajax({
            url: 'programas/post_programa',
            type: 'POST',
            dataType: 'json',
            data: { id_programa, activo }
        });

        tabla_programas.ajax.reload();
    } catch (error) {
        Swal.showValidationMessage(`Error: ${error.responseText}`);
        return false; ñ
    }
};