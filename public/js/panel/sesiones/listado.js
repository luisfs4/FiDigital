let tabla_sesiones;

$(document).ready(async () => {

    $('.btn_crear_proveedor').click(function () {
        evento_btn_proveedor();
    });

    manejarSeleccionTipoPersona();

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
        },],
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

});

const evento_btn_proveedor = () => {
    Swal.fire({
        title: 'Proveedor',
        html: `
            <form id="formularioProveedor" class="px-2">
                <div class="container mt-3">
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label for="tipo_persona" class="form-label">Tipo de Persona <i class="fas fa-users"></i></label>
                            <select class="form-select" id="tipo_persona">
                                <option value="">Selecciona un tipo</option>
                                <option value="fisica">Persona Física</option>
                                <option value="moral">Persona Moral</option>
                            </select>
                        </div>
                
                        <div class="col-6 mb-3">
                            <div class="form-check pt-1 mt-4 d-flex">
                                <input class="form-check-input" type="checkbox" id="es_agente_capacitador">
                                <label class="form-check-label mb-0 ms-2 mt-1" for="es_agente_capacitador">
                                    ¿Es Agente Capacitador Externo? <i class="fas fa-chalkboard-teacher"></i>
                                </label>
                            </div>
                        </div>

                    </div>

                    <div id="campos_persona_fisica" style="display: none;">
                        <hr class="horizontal dark my-3">
                        <!-- Campos Persona Física -->
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="nombre_fisica" class="form-label">Nombre <i class="fas fa-user"></i></label>
                                <input type="text" class="form-control" id="nombre_fisica" placeholder="Nombre Completo">
                            </div>
                            <div class="col-md-4">
                                <label for="correo_fisica" class="form-label">Correo <i class="fas fa-envelope"></i></label>
                                <input type="email" class="form-control" id="correo_fisica" placeholder="correo@ejemplo.com">
                            </div>
                            <div class="col-md-4">
                                <label for="telefono_fisica" class="form-label">Teléfono <i class="fas fa-phone"></i></label>
                                <input type="text" class="form-control" id="telefono_fisica" placeholder="3333333333">
                            </div>
                            
                        </div>
                    </div>
                
                    <div id="campos_persona_moral" style="display: none;">
                        <hr class="horizontal dark my-3">  
                        <!-- Campos Persona Moral -->
                        <div class="row g-3">
                            <!-- Repite los campos de persona física aquí para archivos -->
                            <div class="col-md-4">
                                <label for="nombre_enlace" class="form-label">Nombre del Enlace <i class="fas fa-user-tie"></i></label>
                                <input type="text" class="form-control" id="nombre_enlace" placeholder="Nombre del Enlace">
                            </div>
                            <div class="col-md-4">
                                <label for="telefono_enlace" class="form-label">Teléfono <i class="fas fa-phone"></i></label>
                                <input type="text" class="form-control" id="telefono_enlace" placeholder="+52 123 456 7890">
                            </div>
                            <div class="col-md-4">
                                <label for="correo_enlace" class="form-label">Correo <i class="fas fa-envelope"></i></label>
                                <input type="email" class="form-control" id="correo_enlace" placeholder="correo@ejemplo.com">
                            </div>
                            <div class="col-md-4">
                                <label for="nombre_fiscal_empresa" class="form-label">Nombre Fiscal de la Empresa <i class="fas fa-building"></i></label>
                                <input type="text" class="form-control" id="nombre_fiscal_empresa" placeholder="Nombre Fiscal">
                            </div>
                            <div class="col-md-4">
                                <label for="nombre_comercial_empresa" class="form-label">Nombre Comercial de la Empresa <i class="fas fa-store"></i></label>
                                <input type="text" class="form-control" id="nombre_comercial_empresa" placeholder="Nombre Comercial">
                            </div>
                            <!-- Campos exclusivos de archivos para Persona Moral -->
                            <div class="col-md-6">
                                <label for="acta_constitutiva" class="form-label">Acta Constitutiva <i class="fas fa-file-contract"></i></label>
                                <input type="file" class="form-control" id="acta_constitutiva">
                            </div>
                            <div class="col-md-6">
                                <label for="boleta_registro" class="form-label">Boleta de Registro <i class="fas fa-clipboard-list"></i></label>
                                <input type="file" class="form-control" id="boleta_registro">
                            </div>
                            <div class="col-md-6">
                                <label for="poder_representante_legal" class="form-label">Poder del Representante Legal <i class="fas fa-gavel"></i></label>
                                <input type="file" class="form-control" id="poder_representante_legal">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Campos para Agente Capacitador Externo -->
                    <div id="campos_agente_capacitador" style="display: none;">
                        <hr class="horizontal dark my-3">  
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="solicitud_registro" class="form-label">Solicitud de Registro <i class="fas fa-file-signature"></i></label>
                                <input type="file" class="form-control" id="solicitud_registro">
                            </div>
                            <div class="col-md-6">
                                <label for="curriculum_empresarial" class="form-label">Currículum Empresarial <i class="fas fa-briefcase"></i></label>
                                <input type="file" class="form-control" id="curriculum_empresarial">
                            </div>
                        </div>
                    </div>

                    <hr class="horizontal dark my-3">  
                    
                    <div class="row mb-4">
                        <!-- Campos de archivos para comunes -->
                        <div class="col-md-6">
                            <label for="identificacion_oficial" class="form-label">Identificación Oficial Vigente <i class="fas fa-id-card"></i></label>
                            <input type="file" class="form-control" id="identificacion_oficial">
                        </div>
                        <div class="col-md-6">
                            <label for="comprobante_domicilio" class="form-label">Comprobante de Domicilio del Negocio <i class="fas fa-home"></i></label>
                            <input type="file" class="form-control" id="comprobante_domicilio">
                        </div>
                        <div class="col-md-6">
                            <label for="constancia_situacion_fiscal" class="form-label">Constancia de Situación Fiscal <i class="fas fa-file-invoice-dollar"></i></label>
                            <input type="file" class="form-control" id="constancia_situacion_fiscal">
                        </div>
                        <div class="col-md-6">
                            <label for="opinion_cumplimiento" class="form-label">Opinión de Cumplimiento <i class="fas fa-thumbs-up"></i></label>
                            <input type="file" class="form-control" id="opinion_cumplimiento">
                        </div>
                        <div class="col-md-6">
                            <label for="estado_cuenta_bancario" class="form-label">Estado de Cuenta Bancario <i class="fas fa-university"></i></label>
                            <input type="file" class="form-control" id="estado_cuenta_bancario">
                        </div>
                        <div class="col-md-6">
                            <label for="documento_datos_contacto" class="form-label">Documento de Datos de Contacto <i class="fas fa-address-book"></i></label>
                            <input type="file" class="form-control" id="documento_datos_contacto">
                        </div>
                    </div>
                </div>
            
            </form>
        `,
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonText: `Guardar <i class="fas fa-arrow-right ms-2"></i>`,
        cancelButtonText: 'No, cancelar',
        customClass: {
            confirmButton: 'btn bg-gradient-danger btn-md mx-2 move-icon-left',
            cancelButton: 'btn btn-gradient-danger btn-md mx-2 move-icon-left',
            loader: 'custom-loader',
            popup: 'col-lg-8'
        },
        didOpen: () => {
            manejarSeleccionTipoPersona();
        },
        preConfirm: async () => {
            const tipo_persona = document.getElementById('tipo_persona').value;
            const nombre = document.getElementById('nombre') ? document.getElementById('nombre').value : '';
            const correo = document.getElementById('correo') ? document.getElementById('correo').value : '';
            const telefono = document.getElementById('telefono') ? document.getElementById('telefono').value : '';
            const nombre_enlace = document.getElementById('nombre_enlace') ? document.getElementById('nombre_enlace').value : '';
            const nombre_fiscal_empresa = document.getElementById('nombre_fiscal_empresa') ? document.getElementById('nombre_fiscal_empresa').value : '';
            const nombre_comercial_empresa = document.getElementById('nombre_comercial_empresa') ? document.getElementById('nombre_comercial_empresa').value : '';

            // Aquí deberías agregar tus propias validaciones
            if (!tipo_persona || (tipo_persona === 'fisica' && (!nombre || !correo || !telefono)) ||
                (tipo_persona === 'moral' && (!nombre || !correo || !telefono || !nombre_enlace || !nombre_fiscal_empresa || !nombre_comercial_empresa))) {
                Swal.showValidationMessage('Por favor, completa todos los campos requeridos.');
                return false;
            }

            const formData = new FormData();
            formData.append('tipo_persona', tipo_persona);
            formData.append('nombre', nombre);
            formData.append('correo', correo);
            formData.append('telefono', telefono);
            formData.append('nombre_enlace', nombre_enlace);
            formData.append('nombre_fiscal_empresa', nombre_fiscal_empresa);
            formData.append('nombre_comercial_empresa', nombre_comercial_empresa);

            try {
                const response = await fetch('/FiDigital/panel/proveedores/agregar', {
                    method: 'POST',
                    body: formData, // Asegúrate de enviar formData si manejas archivos
                });

                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }

                const data = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Proveedor agregado',
                    text: data.message,
                    confirmButtonText: 'Aceptar',

                    showCancelButton: true,
                    reverseButtons: true,
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: "btn bg-gradient-danger ms-3",
                        cancelButton: "btn bg-gradient-secondary",
                        popup: "col-lg-8"
                    }
                });
            } catch (error) {
                Swal.showValidationMessage(`Request failed: ${error}`);
            }
        }
    })
};

const manejarSeleccionTipoPersona = () => {
    $(document).on('change', '#tipo_persona', function () {
        const tipo = $(this).val();
        $('#campos_persona_fisica, #campos_persona_moral, #campos_agente_capacitador').hide();
        if (tipo === 'fisica') {
            $('#campos_persona_fisica').show();
        } else if (tipo === 'moral') {
            $('#campos_persona_moral').show();
        }
    });

    $(document).on('change', '#es_agente_capacitador', function () {
        document.getElementById('campos_agente_capacitador').style.display = this.checked ? 'block' : 'none';
    });
};