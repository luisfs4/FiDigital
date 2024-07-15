let tabla_proveedores;

$(document).ready(async () => {

    tabla_proveedores = await $('.tabla_proveedores').DataTable({
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
            url: '/FiDigital/panel/proveedores/get_proveedores_by_ajax',
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

            tabla_proveedores.buttons().container().appendTo('.contenedor_filtros');
            $('.dt-buttons .dt-button').first().addClass('btn btn-icon btn-xs mx-1 my-auto btn-success bg-gradient-success').html(`<span class="btn-inner--icon"><i class="fas fa-file-excel"></i></span>`)
            $('.dt-buttons .dt-button').last().addClass('btn btn-icon btn-xs mx-1 my-auto btn-danger bg-gradient-danger').html(`<span class="btn-inner--icon"><i class="fas fa-file-pdf"></i></span>`)
        },
        columnDefs: [{
            "width": "40%",
            "targets": 0
        },],
        columns: [
            {//nombre
                "mData": "nombre_sesion",
                "mRender": function (data, type, row) {
                    const nombre_comercial = row.nombre_comercial ? `<span class="text-xs text-muted">${row.nombre_comercial}</span><br>` : '';

                    return `<div class="d-flex px-2 detalle_sesion cursor-pointer" id_proveedor="${row.id_proveedor}">
                                    <div>
                                        <button class="btn btn-link text-gradient p-0 m-0 text-dark">
                                            <i class="fa fa-address-card text-lg avatar avatar-sm rounded-circle me-2 text-dark"></i>
                                        </button>
                                    </div>
                                    <div class="my-auto">
                                        <h6 class="mb-0 text-sm text-wrap">${row.nombre_fiscal ?? row.nombre}</h6>
                                        ${ nombre_comercial ?? ''}
                                        <span class="font-weight-bold text-xs text-muted text-wrap"><i class="fas fa-list-ol"></i>  ${row.total_expedientes == null ? 'Sin' : row.total_expedientes} expedientes asignados</span>
                                    </div>
                                </div>`;
                }
            },
            {//telefono
                "mData": "telefono",
                "mRender": function (data, type, row) {
                    return `<div class="align-middle cursor-pointer">
                                    <span class="fas fa-building text-xs"></span>
                                    <span class="font-weight-bold text-xs">${data ?? '---'}</span>
                                </div>`;
                }
            },
            {//correo
                "mData": "correo",
                "mRender": function (data, type, row) {

                    const representante = row.nombre ? `<br><span class="text-xxs text-muted">${row.nombre}</span>` : '';
                    return `
                        <div class="align-middle cursor-pointer btn_historial_borrador" id_modificacion="${row.id_queja}" nombre="${row.id_queja}">
                            <span class="fas fa-clock text-xs"></span>
                            <span class="font-weight-bold text-xs">${data ?? '---'}</span>
                            ${representante}
                        </div>
                    `;
                }
            },
            {//estatus
                "mData": "estatus",
                "mRender": function (data, type, row) {
                    return `<div class="align-middle cursor-pointer">
                                <span class="badge badge-${row.color ?? 'secondary'} font-weight-bold text-xs"><i class="${row.icono ?? ''} text-xs me-2"></i>${data ?? '---'}</span>
                            </div>`;
                }
            },
            {//created_at
                "mData": "created_at",
                "mRender": function (data, type, row) {
                    return `<div class="align-middle cursor-pointer">
                                    <span class="fas fa-clock text-xs"></span>
                                    <span class="font-weight-bold text-xs">${data ?? '---'}</span>
                                </div>`;
                }
            },
            {//Botones
                "mData": "id_proveedor",
                "mRender": function (data, type, row) {

                    let btn_archivado = '';

                    if (row.activo == 0) {
                        btn_archivado = `
                            <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-success shadow text-white rounded btn_archivar cursor-pointer" activo="1" id_proveedor="${row.id_proveedor}">
                                <i class="fas fa-box-open text-white" aria-hidden="true"></i>
                            </div>`;
                    } else {
                        btn_archivado = `
                            <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-danger shadow text-white rounded btn_archivar cursor-pointer" activo="0" id_proveedor="${row.id_proveedor}">
                                <i class="fas fa-box text-white" aria-hidden="true"></i>
                            </div>`;
                    }

                    return `<div class="text-center ms-auto">
                                <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-info shadow text-white rounded btn_editar_proveedor cursor-pointer" id_proveedor="${row.id_proveedor}">
                                    <i class="fas fa-edit text-white" aria-hidden="true"></i>
                                </div>
                                ${btn_archivado}
                            </div>`;
                }
            }
        ],
    });

    tabla_proveedores.on('preDraw', function () {
        startTime = new Date().getTime();
        $('.btn_get_modificaciones').get()
    })
        .on('draw.dt', function () {
            console.log('La tabla tardó: ' + (new Date().getTime() - startTime) + 'ms en cargar');
            $('.table').removeClass('is-loading');

            //Cambiar color paginacion
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-danger');

            $('.btn_archivar').click((e) => {
                archivar_proveedor($(e.currentTarget).attr('id_proveedor'), $(e.currentTarget).attr('activo'));
            })

            $('.btn_documentacion').click((e) => {
                documentacion_proveedor($(e.currentTarget).attr('id_proveedor'));
            })

        });


    //Inicializar buscador
    $('.busqueda_nav').keyup(function () {
        tabla_proveedores.search($(this).val()).draw();
        //console.log($(this).val());
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

const obtener_detalle_proveedor = async (id_proveedor) => {
    try {
        const response = await $.ajax({
            url: 'proveedores/get_proveedores', // Asegúrate de que esta URL esté configurada para devolver los detalles de un solo proveedor cuando se pase `id_proveedor`
            type: 'POST',
            dataType: 'json',
            data: { id_proveedor }
        });
        return response;
    } catch (error) {
        console.error("Hay un problema al obtener el proveedor:", error);
        Swal.fire('Aún no disponible', 'Estamos trabjando para que pronto puedas editar los proveedores', 'info');
        return null;
    }
};

const mostrar_formulario_proveedor = async (id_proveedor = null) => {
    let proveedor_detalle = null;
    if (id_proveedor) {
        proveedor_detalle = await obtener_detalle_proveedor(id_proveedor);
        if (!proveedor_detalle) return; // Si no hay detalles, detener ejecución
    }

    const direcciones = await obtener_direcciones();
    if (!direcciones) return;

    const opciones_direcciones = direcciones.map(direccion =>
        `<option value="${direccion.id_direccion}" ${proveedor_detalle && proveedor_detalle.id_direccion === direccion.id_direccion ? 'selected' : ''}>${direccion.direccion}</option>`
    ).join('');

    const titulo = id_proveedor ? 'Editar proveedor' : 'Nuevo proveedor';
    const accion = id_proveedor ? 'Actualizar' : 'Crear';

    Swal.fire({
        title: titulo,
        html: `
            <input id="id_proveedor" type="hidden" value="${id_proveedor || ''}">
            <div class="form-group px-4 mb-2">
                <label for="proveedor" class="form-label">Nombre del proveedor</label>
                <input id="proveedor" class="form-control" placeholder="Nombre del proveedor" value="${proveedor_detalle ? proveedor_detalle.proveedor : ''}">
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
        preConfirm: async () => {
            const proveedor = document.getElementById('proveedor').value;
            const id_direccion = document.getElementById('id_direccion').value;
            if (!proveedor) {
                Swal.showValidationMessage('Por favor ingresa el nombre del proveedor');
                return false;
            }
            const resultado = await guardar_proveedor({ proveedor, id_direccion, id_proveedor });
            if (!resultado) {
                Swal.showValidationMessage('Hubo un error al guardar el proveedor');
            }
            return resultado;
        }
    }).then(result => {
        if (result.isConfirmed && result.value) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'El proveedor ha sido guardado correctamente.',
                icon: 'success'
            });

            tabla_proveedores.ajax.reload();
        }
    });
};

const guardar_proveedor = async ({ proveedor, id_direccion, id_proveedor }) => {
    try {
        const datos = { proveedor, id_direccion };
        if (id_proveedor) datos.id_proveedor = id_proveedor;

        const response = await $.ajax({
            url: 'proveedores/post_proveedor',
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

const archivar_proveedor = async (id_proveedor, activo) => {
    try {
        const response = await $.ajax({
            url: 'proveedores/archivar_proveedor',
            type: 'POST',
            dataType: 'json',
            data: { id_proveedor, activo }
        })
        .then(async (respuesta) => {
            if(!respuesta.success){ throw new Error(respuesta.mensaje); }

            await Swal.fire({
                title: '¡Éxito!',
                text: respuesta.mensaje ?? 'El proveedor ha sido actualizado correctamente',
                icon: 'success'
            });
        })
        .catch(async (error) => {
            await Swal.fire({
                title: 'Error',
                text: error.mensaje ?? 'Ocurrio un error al actualizar el estatus',
                icon: 'error'
            });
        });

        tabla_proveedores.ajax.reload();
    } catch (error) {
        Swal.showValidationMessage(`Error: ${error.responseText}`);
        return false;
    }
};