let tabla_solicitudes;

$(document).ready(async () => {

    tabla_solicitudes = await $('.tabla_solicitudes').DataTable({
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
            url: '/FiDigital/panel/solicitudes/get_solicitudes',
            type: 'POST',
            data: function (data) {
                // Append formdata
                $('.table').addClass('is-loading');
                $('.table td button').text('');

                data.id_sesion = $('.input_sesion').val()
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
                <div class="form-group mx-4">
                    <label class="form-control-label">Sesión:</label>
                    <select name="id_sesion" class="input_punto form-control input-lg p-2 select_sesion input_sesion">
                        <option value="">Selecciona una opción</option>
                    </select>
                </div>
            </div>
            `);


            tabla_solicitudes.buttons().container().appendTo('.contenedor_filtros');
            $('.dt-buttons .dt-button').first().addClass('btn btn-icon btn-xs mx-1 my-auto btn-success bg-gradient-success').html(`<span class="btn-inner--icon"><i class="fas fa-file-excel"></i></span>`)
            $('.dt-buttons .dt-button').last().addClass('btn btn-icon btn-xs mx-1 my-auto btn-danger bg-gradient-danger').html(`<span class="btn-inner--icon"><i class="fas fa-file-pdf"></i></span>`)

            let options_sesion = '';

            $.ajax({
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
        },
        columnDefs: [{
            "width": "40%",
            "targets": 0
        },],
        columns: [{
            "mData": "direccion",
            "mRender": function (data, type, row) {

                return `<div class="d-flex px-2 detalle_sesion cursor-pointer">
                                <div>
                                    <button class="btn btn-link text-gradient p-0 m-0 text-dark">
                                        <i class="fa fa-address-card text-lg avatar avatar-sm rounded-circle me-2 text-dark"></i>
                                    </button>
                                </div>
                                <div class="my-auto">
                                    <h6 class="mb-0 text-sm text-wrap">${data}</h6>
                                </div>
                            </div>`;
            }
        },
        {
            "mData": "id_solicitud",
            "mRender": function (data, type, row) {
                return `<td class="align-middle text-start">
                                <span class="text-xs w-100 text-start font-weight-bold">${data}</span>
                            </td>`;

            }
        },
        {
            "mData": "admision_prevencion",
            "mRender": function (data, type, row) {
                return `<div class="form-check pe-none">
                    <input class="form-check-input" type="checkbox" ${data == 1 ? 'checked' : ''} ${data}>
                    <label class="form-check-label text-xs font-weight-bold">
                        ${data ? 'Si' : 'No'}
                    </label>
                </div>`;

            }
        },
        {
            "mData": "descripcion",
            "mRender": function (data, type, row) {
                return `<td class="align-middle text-start">
                                <span class="text-xs w-100 text-start font-weight-bold pe-2">${data ?? 'Sin descripción'}</span>
                            </td>`;

            }
        },
        {
            "mData": "programa",
            "mRender": function (data, type, row) {
                return `<td class="align-middle text-start">
                                <span class="text-xs w-100 text-start font-weight-bold">${data}</span>
                            </td>`;

            }
        },
        {
            "mData": "tipo_adquisicion",
            "mRender": function (data, type, row) {
                return `<td class="align-middle text-start">
                                <span class="badge badge-info text-xs w-100 text-start font-weight-bold"><i class="fa fa-file-pdf me-2"></i>${data}</span>
                            </td>`;

            }
        },
        {
            "mData": "nombre",
            "mRender": function (data, type, row) {
                return `<td class="align-middle text-start">
                                <span class="text-xs w-100 text-start font-weight-bold">${data}</span>
                            </td>`;

            }
        },
        {
            "mData": "monto",
            "mRender": function (data, type, row) {
                // Formatea el número a dos decimales
                var monto_formateado = parseFloat(data).toFixed(2);
                // Retorna el HTML con el badge de Bootstrap y el icono de Font Awesome
                return `<td class="align-middle text-start">
                            <span class="badge bg-primary">
                                <i class="fa fa-dollar-sign"></i> ${monto_formateado}
                            </span>
                        </td>`;
            }
        },
        {
            "mData": "presupuesto",
            "mRender": function (data, type, row) {
                // Formatea el número a dos decimales
                var presupuesto_formateado = parseFloat(data).toFixed(2);
                // Retorna el HTML con el badge de Bootstrap y el icono de Font Awesome
                return `<td class="align-middle text-start">
                            <span class="badge bg-success">
                                <i class="fa fa-dollar-sign"></i> ${presupuesto_formateado}
                            </span>
                        </td>`;
            }
        },

        ],
    });

    tabla_solicitudes.on('preDraw', function () {
        startTime = new Date().getTime();
        $('.btn_get_modificaciones').get()
    })
        .on('draw.dt', function () {
            console.log('La tabla tardó: ' + (new Date().getTime() - startTime) + 'ms en cargar');
            $('.table').removeClass('is-loading');

            //Cambiar color paginacion
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-danger');

        });


    //Inicializar buscador
    $('.busqueda_nav').keyup(function () {
        tabla_solicitudes.search($(this).val()).draw();
        //console.log($(this).val());
    });

    $(document).on('change', '.input_sesion', (e) => {
        tabla_solicitudes.ajax.reload();
        let id_sesion = $(e.currentTarget).val()
        let sesion = $(e.currentTarget).children('option:selected').text()

        if(id_sesion){
            $('.nombre_sesion').text(` de la ${sesion}`);
        }else{
            $('.nombre_sesion').text(``);
        }
    });

});