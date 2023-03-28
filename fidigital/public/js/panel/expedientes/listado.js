$(document).ready(async () => {

    let tabla_quejas = await $('.tabla_expedientes').DataTable({
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
            url: '/panel/expedientes/get_by_ajax',
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


            tabla_quejas.buttons().container().appendTo('.contenedor_filtros');
            $('.dt-buttons .dt-button').first().addClass('btn btn-icon btn-xs mx-1 my-auto btn-success bg-gradient-success').html(`<span class="btn-inner--icon"><i class="fas fa-file-excel"></i></span>`)
            $('.dt-buttons .dt-button').last().addClass('btn btn-icon btn-xs mx-1 my-auto btn-danger bg-gradient-danger').html(`<span class="btn-inner--icon"><i class="fas fa-file-pdf"></i></span>`)
        },
        columnDefs: [{
            "width": "40%",
            "targets": 0
        }, ],
        columns: [{
                "mData": "fecha_pago",
                "mRender": function (data, type, row) {
                    
                    return `<div class="d-flex px-2">
                                <div>
                                    <button class="btn btn-link text-gradient p-0 m-0 text-dark">
                                        <i class="fa fa-address-card text-lg avatar avatar-sm rounded-circle me-2 text-dark"></i>
                                    </button>
                                </div>
                                <div class="my-auto">
                                    <h6 class="mb-0 text-sm text-wrap">Expediente ${data}</h6>
                                    <span class="font-weight-bold text-xs text-muted text-wrap"><i class="fas fa-list-ol detalle_expediente" id_expediente="${row.id_expediente}"></i>  ${row.contador_puntos ?? '0'} puntos asignados</span>
                                </div>
                            </div>`;
                }
            },
            {
                "mData": "direccion",
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
                "mData": "id_expediente",
                "mRender": function (data, type, row) {

                    return `<div class="text-center ms-auto">
                                <a href="/panel/expedientes/${row.id_expediente}/detalle" class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-success shadow text-white rounded">
                                    <i class="fa fa-arrow-right text-white" aria-hidden="true"></i>
                                </a>
                            </div>
                            `;
                }
            }
        ],
    });

    tabla_quejas.on('preDraw', function () {
            startTime = new Date().getTime();
            $('.btn_get_modificaciones').get()
        })
        .on('draw.dt', function () {
            console.log('La tabla tardó: ' + (new Date().getTime() - startTime) + 'ms en cargar');
            $('.table').removeClass('is-loading');

            //Cambiar color paginacion
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-warning');

            //evento_btn_()

        });


    //Inicializar buscador
    $('.busqueda_nav').keyup(function () {
        tabla_quejas.search($(this).val()).draw();
        //console.log($(this).val());
    });

    let fechas_expedientes = flatpickr('.fechas_expedientes', {
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

    console.log(fechas_expedientes);

});