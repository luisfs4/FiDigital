let tabla_sesiones;

$(document).ready(async () => {

    tabla_sesiones = await $('.tabla_sesiones').DataTable({
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
            url: '/FiDigital/panel/sesiones/get_by_ajax',
            type: 'POST',
            data: function (data) {
                // Append formdata
                $('.table').addClass('is-loading');
                $('.table td button').text('');
            },
            dataSrc: ""
        },
        order: [
            [3, 'desc']
        ],
        language: {
            "url": "https://cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json",
            paginate: {
                next: `
                <li class="page-item">
                    <a class="page-link" href="javascript:;" aria-label="Next">
                    <i class="fa fa-angle-right"></i>
                    <span class="sr-only">Next</span>
                    </a>
                </li>
                `,
                previous: `
                <li class="page-item">
                    <a class="page-link" href="javascript:;" aria-label="Previous">
                        <i class="fa fa-angle-left"></i>
                        <span class="sr-only">Previous</span>
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


            tabla_sesiones.buttons().container().appendTo('.contenedor_filtros');
            $('.dt-buttons .dt-button').first().addClass('btn btn-icon btn-xs mx-1 my-auto btn-success bg-gradient-success').html(`<span class="btn-inner--icon"><i class="fas fa-file-excel"></i></span>`)
            $('.dt-buttons .dt-button').last().addClass('btn btn-icon btn-xs mx-1 my-auto btn-danger bg-gradient-danger').html(`<span class="btn-inner--icon"><i class="fas fa-file-pdf"></i></span>`)
        },
        columnDefs: [{
            "width": "40%",
            "targets": 0
        }, ],
        columns: [{
                "mData": "nombre_sesion",
                "mRender": function (data, type, row) {

                    return `<div class="d-flex px-2 detalle_sesion cursor-pointer" id_sesion="${row.id_sesion}">
                                <div>
                                    <button class="btn btn-link text-gradient p-0 m-0 text-dark">
                                        <i class="fa fa-address-card text-lg avatar avatar-sm rounded-circle me-2 text-dark"></i>
                                    </button>
                                </div>
                                <div class="my-auto">
                                    <h6 class="mb-0 text-sm text-wrap">${row.numero_sesion}. ${data}</h6>
                                    <span class="font-weight-bold text-xs text-muted text-wrap"><i class="fas fa-list-ol"></i>  ${row.contador_puntos == '0' ? 'Sin' : row.contador_puntos} puntos asignados</span>
                                </div>
                            </div>`;
                }
            },
            {
                "mData": "fecha_sesion",
                "mRender": function (data, type, row) {
                    return `<td class="align-middle text-start">
                                <span class="text-xs w-100 text-start font-weight-bold">${data}</span>
                            </td>`;

                }
            },
            {
                "mData": "tipo",
                "mRender": function (data, type, row) {
                    return `<td class="align-middle text-start">
                                <span class="text-xs w-100 text-start font-weight-bold">${data}</span>
                            </td>`;

                }
            },
            {
                "mData": "ultima_modificacion",
                "mRender": function (data, type, row) {
                    return `<div class="align-middle cursor-pointer btn_historial_borrador" id_modificacion="${row.id_queja}" nombre="${row.id_queja}">
                                <span class="fas fa-clock text-xs"></span>
                                <span class="font-weight-bold text-xs">${data ?? '---'}</span>
                            </div>`;
                }
            },
            {
                "mData": "estatus",
                "mRender": function (data, type, row) {
                    return `<div class="align-middle">
                                <span class="font-weight-bold text-wrap text-xs">${data ?? '---'}</span>
                            </div>`;
                }
            },
            {
                "mData": "id_sesion",
                "mRender": function (data, type, row) {

                    return `<div class="text-center ms-auto">
                                <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-danger shadow text-white rounded detalle_sesion cursor-pointer" id_sesion="${row.id_sesion}">
                                    <i class="fas fa-list-ol text-white" aria-hidden="true"></i>
                                </div>
                                <div class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-info shadow text-white rounded editar_sesion cursor-pointer" id_sesion="${row.id_sesion}">
                                    <i class="fas fa-edit text-white" aria-hidden="true"></i>
                                </div>
                            </div>
                            `;
                }
            }
        ],
    });

    tabla_sesiones.on('preDraw', function () {
            startTime = new Date().getTime();
            $('.btn_get_modificaciones').get()
        })
        .on('draw.dt', function () {
            console.log('La tabla tardó: ' + (new Date().getTime() - startTime) + 'ms en cargar');
            $('.table').removeClass('is-loading');

            //Cambiar color paginacion
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-warning');

            $('.detalle_sesion').click((e) => {
                get_puntos($(e.currentTarget).attr('id_sesion'));
            })

            $('.editar_sesion').click((e) => {
                editar_sesion($(e.currentTarget).attr('id_sesion'));
            })

        });


    //Inicializar buscador
    $('.busqueda_nav').keyup(function () {
        tabla_sesiones.search($(this).val()).draw();
        //console.log($(this).val());
    });

    let fechas_sesiones = flatpickr('.fechas_sesiones', {
        minDate: '2023-01-01',
        maxDateHasTime: true,
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
                    'Sábado'
                ],
            },
            months: {
                shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct',
                    'Nov', 'Dic'
                ],
                longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
                    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ],
            },
            rangeSeparator: ' al ',
        },
        mode: "range",
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        defaultDate: [new Date(new Date("2023-01-01").setHours(0, 0, 0)), new Date(new Date().setHours(23, 59, 59))],
        altInput: true,
        altFormat: "d/m/Y h:i K"
    });

    $('.btn_crear_proveedor').click(function () {
        evento_btn_proveedor();
    });

});

const evento_btn_proveedor = () => {
    console.log('se ejecuta');
    Swal.fire({
        title: 'Agregar proveedor',
        html: `
            <form id="formularioProveedor" class="px-2">
                <div class="mb-3">
                <label for="nombre_comercial" class="form-label">Nombre comercial</label>
                <input placeholder="Escribe el nombre" type="text" class="form-control" id="nombre_comercial" name="nombre_comercial" required>
                </div>
                <div class="mb-3">
                <label for="razon_social" class="form-label">Razón social</label>
                <input type="text" class="form-control" placeholder="Escribe la razón social" id="razon_social" name="razon_social" required>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        reverseButtons: true,
        buttonsStyling: false,
        customClass: {
            confirmButton: "btn bg-gradient-danger ms-3",
            cancelButton: "btn bg-gradient-secondary"
        },
        preConfirm: () => {
            const nombre_comercial = Swal.getPopup().querySelector('#nombre_comercial');
            const razon_social = Swal.getPopup().querySelector('#razon_social');

            if (!$(nombre_comercial).parsley().isValid()) {
                $(nombre_comercial).parsley().validate();
            }

            if (!$(razon_social).parsley().isValid()) {
                $(razon_social).parsley().validate();
            }

            if (!nombre_comercial.value || !razon_social.value) {
                Swal.showValidationMessage('Completa todos los campos');
            }

            return {
                nombre_comercial: nombre_comercial.value,
                razon_social: razon_social.value
            }
        }

    }).then((result) => {
        if (result.isConfirmed) {
            // Llamada Ajax para agregar proveedor
            $.ajax({
                type: 'POST',
                url: '/fidigital/panel/proveedores/agregar',
                data: {
                    nombre_comercial: result.value.nombre_comercial,
                    razon_social: result.value.razon_social
                },
                success: function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Proveedor agregado',
                        text: response.message,
                        confirmButtonText: 'Aceptar',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn bg-gradient-danger ms-3",
                            cancelButton: "btn bg-gradient-secondary"
                        }
                    });
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: xhr.responseText,
                        confirmButtonText: 'Aceptar',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn bg-gradient-danger ms-3",
                            cancelButton: "btn bg-gradient-secondary"
                        }
                    });
                }
            });
        }
    });
}