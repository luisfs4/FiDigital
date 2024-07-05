let tabla_puntos;
let fechas_puntos;

$(document).ready(async () => {

    tabla_puntos = await $('.tabla_puntos').DataTable({
        dom: 'Blr<"overflow-auto"t>ip',
        buttons: [
            {//Excel
                extend: 'excelHtml5',
                exportOptions: {
                columns: [0, 1, 2]
                }
            },
            {//PDF
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [0, 1, 2]
                }
            }
        ],
        ajax: {
            url: '/FiDigital/panel/sesiones/puntos/get_by_ajax',
            type: 'POST',
            data: function (data) {
                // Append formdata
                $('.table').addClass('is-loading');
                $('.table td button').text('');

                data["datos_sesion"] = true;
            },
            dataSrc: ""
        },
        order: [
            [1, 'desc']
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
            $('#DataTables_Table_0_length').after(`<div class="contenedor_filtros"></div>`);

            tabla_puntos.buttons().container().appendTo('.contenedor_filtros');
            $('.dt-buttons .dt-button').first().addClass('btn btn-icon btn-xs mx-1 my-auto btn-success bg-gradient-success').html(`<span class="btn-inner--icon"><i class="fas fa-file-excel"></i></span>`)
            $('.dt-buttons .dt-button').last().addClass('btn btn-icon btn-xs mx-1 my-auto btn-danger bg-gradient-danger').html(`<span class="btn-inner--icon"><i class="fas fa-file-pdf"></i></span>`)

            fechas_puntos = flatpickr('.fechas_puntos', {
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
                defaultDate: [
                    new Date(new Date("2023-01-01").setHours(0, 0, 0)), 
                    new Date(new Date().setHours(23, 59, 59))
                ],
                altInput: true,
                altFormat: "d/m/Y h:i K"
            });
        },
        preDrawCallback: ()=>{
            startTime = new Date().getTime();
        },
        drawCallback: () => {
            console.log('La tabla tardó: ' + (new Date().getTime() - startTime) + 'ms en cargar');
            $('.table').removeClass('is-loading');
    
            //Cambiar color paginacion
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-warning');
        },
        columnDefs: [
            {
                className: "text-start", 
                width: "40%",
                targets: 0,
            },
            {
                className: "text-center", 
                targets: [1,2,6,7,8],
            },
            {
                className: "text-end", 
                targets: [3,4,5],
            },
        ],
        columns: [
            {//Nombre
                "mData": "nombre_punto",
                "mRender": function (data, type, row) {
                    return `
                        <div class="d-flex px-2 detalle_sesion cursor-pointer" 
                                id_punto="${row.id_punto}">
                            <div>
                                <button class="btn btn-link text-gradient p-0 m-0 text-dark">
                                    <i class="fa fa-address-card text-lg avatar avatar-sm rounded-circle me-2 text-dark"
                                            title="${row.id_punto}"></i>
                                </button>
                            </div>
                            <div class="my-auto">
                                <h6 class="mb-0 text-sm text-wrap">
                                    ${row.jerarquia}. ${data}
                                </h6>
                                <span class="font-weight-bold text-xs text-muted text-nowrap">
                                    <i class="fas fa-list-ol"></i>  
                                    ${row.contador_hijos == '0' ? 'Sin' : row.contador_hijos} puntos asignados
                                </span>
                            </div>
                        </div>
                    `;
                }
            },
            {//Sesión
                "mData": "numero_sesion",
                "mRender": function (data, type, row) {
                    return `
                        <td class="align-middle text-start">
                            <span class="text-xs w-100 text-start font-weight-bold">
                                ${data}
                            </span>
                        </td>
                    `;
                }
            },
            {//Estatus
                "mData": "estatus",
                "mRender": function (data, type, row) {
                    return `
                        <td class="align-middle text-start">
                            <span class="text-xs w-100 text-start font-weight-bold">
                                ${data ?? "Sin estatus"}
                            </span>
                        </td>
                    `;
                }
            },
            {//Autorizado
                "mData": "presupuesto_autorizado",
                "mRender": function (data, type, row) {
                    return `
                        <div class="align-middle cursor-pointer btn_historial_borrador" 
                                id_modificacion="${row.id_queja}" nombre="${row.id_queja}">
                            <span class="badge bg-gradient-danger font-weight-bold text-xs">
                                <i class="fas fa-receipt me-2"></i>
                                ${data ?? '---'}
                            </span>
                        </div>
                    `;
                }
            },
            {//Pagado
                "mData": "pagado",
                "mRender": function (data, type, row) {
                    return `
                        <div class="align-middle cursor-pointer btn_historial_borrador" 
                                id_punto="${row.id_punto}" nombre="${row.id_punto}">
                            <span class="badge bg-gradient-success font-weight-bold text-xs">
                                <i class="fas fa-receipt me-2"></i>
                                ${data ?? '---'}
                            </span>
                        </div>
                    `;
                }
            },
            {//Remanente
                "mData": "monto_restante",
                "mRender": function (data, type, row) {
                    return `
                        <div class="align-middle cursor-pointer btn_historial_borrador" 
                                id_punto="${row.id_punto}" nombre="${row.id_punto}">
                            <span class="badge bg-gradient-primary font-weight-bold text-xs">
                                <i class="fas fa-receipt me-2"></i>
                                ${data ?? '---'}
                            </span>
                        </div>
                    `;
                }
            },
            {//direccion
                "mData": "direccion",
                "mRender": function (data, type, row) {
                    return `
                        <span class="text-xs w-100 text-start font-weight-bold">
                            ${ data ?? '---' }
                        </span>
                    `;
                }
            },
            {//programas
                "mData": "programas",
                "mRender": function (data, type, row) {
                    return `
                        <span class="text-xs w-100 font-weight-bold">
                            ${ data ?? '---' }
                        </span>
                    `;
                }
            },
            {//botones
                "mData": "id_punto",
                "mRender": function (data, type, row) {
                    return `
                        <div class="text-center ms-auto">
                            <button class="px-3 py-2 my-auto mx-1 btn bg-gradient-danger shadow detalle_sesion" 
                                    type="button" id_punto="${data}">
                                <i class="fas fa-list-ol text-white" aria-hidden="true"></i>
                            </button>
                            <button class="px-3 py-2 my-auto mx-1 btn bg-gradient-info shadow editar_sesion" 
                                    type="button" id_punto="${data}">
                                <i class="fas fa-edit text-white" aria-hidden="true"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
    });

});