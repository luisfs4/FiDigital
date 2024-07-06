let tabla_puntos;
// let fechas_puntos;

$(document).ready(async () => {
    // fechas_puntos = flatpickr('.fechas_puntos', {
    //     minDate: '2023-01-01',
    //     maxDateHasTime: true,
    //     locale: {
    //         firstDayOfWeek: 1,
    //         weekdays: {
    //             shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    //             longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
    //                 'Sábado'
    //             ],
    //         },
    //         months: {
    //             shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct',
    //                 'Nov', 'Dic'
    //             ],
    //             longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
    //                 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    //             ],
    //         },
    //         rangeSeparator: ' al ',
    //     },
    //     mode: "range",
    //     enableTime: true,
    //     dateFormat: 'Y-m-d H:i',
    //     defaultDate: [
    //         new Date(new Date("2023-01-01").setHours(0, 0, 0)), 
    //         new Date(new Date().setHours(23, 59, 59))
    //     ],
    //     altInput: true,
    //     altFormat: "d/m/Y h:i K"
    // });

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
                obtener_filtros(data);
            },
            dataSrc: (result)=>{
                $(".total_registros").html(`<b>${result.length}</b> resultados`);
                return result;
            }
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
            $(document).on("click", ".btn_buscar", ()=>{ tabla_puntos.ajax.reload(); });
            $(document).on("click", ".btn_borrar", ()=>{ $(".input_filtro").val("").change(); });

            //Modificar select de longitud
            //$('#DataTables_Table_0_length label').html(`Mostrar: <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" class="form-select form-select-sm"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select>`);

            //Agregar panel de filtros
            $('#DataTables_Table_0_length').after(`<div class="contenedor_filtros"></div>`);

            tabla_puntos.buttons().container().appendTo('.contenedor_filtros');
            $('.dt-buttons .dt-button').first().addClass('btn btn-icon btn-xs mx-1 my-auto btn-success bg-gradient-success').html(`<span class="btn-inner--icon"><i class="fas fa-file-excel"></i></span>`)
            $('.dt-buttons .dt-button').last().addClass('btn btn-icon btn-xs mx-1 my-auto btn-danger bg-gradient-danger').html(`<span class="btn-inner--icon"><i class="fas fa-file-pdf"></i></span>`)
        },
        preDrawCallback: ()=>{
            startTime = new Date().getTime();
        },
        drawCallback: () => {
            console.log('La tabla tardó: ' + (new Date().getTime() - startTime) + 'ms en cargar');
            $('.table').removeClass('is-loading');
    
            //Cambiar color paginacion
            $('#DataTables_Table_0_paginate .pagination').addClass('pagination-warning');
			$('.texto_filtros').text(mensaje_filtro());
        },
        autoWidth: false,
        columnDefs: [
            {
                className: "text-start",
                targets: 0,
            },
            {
                className: "text-center", 
                targets: [1,2,6],
            },
            {
                className: "text-end", 
                targets: [3,4,5],
            },
            {
                targets: 7,
                width: '200px',
            }
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
                "mData": "programa",
                "mRender": function (data, type, row) {
                    return `
                        <span class="text-xs w-100 font-weight-bold">
                            ${ data ?? '---' }
                        </span>
                    `;
                }
            },
            {//Estatus
                "mData": "estatus",
                "mRender": function (data, type, row) {
                    const padre_id = row.padre_id ?? '';
                    return `
                        <div class="text-center ms-auto form-group">
                            <select class="form-select form-control cambiar_estatus" 
                                    data-id_punto="${row.id_punto}" data-padre_id="${padre_id}"
                                    data-estatus="${data}">
                                <option value="creado" ${ (data ?? "creado") == "creado" ? 'selected' : '' }>
                                    Creado
                                </option>
                                <option value="procesado" ${ data == "procesado" ? 'selected' : '' }>
                                    Procesado
                                </option>
                                <option value="pagado" ${ data == "pagado" ? 'selected' : '' }>
                                    Pagado
                                </option>
                                <option value="completado" ${ data == "completado" ? 'selected' : '' }>
                                    Completado
                                </option>
                            </select>
                        </div>
                    `;
                }
            },
        ],
    });

});

const obtener_filtros = (data = {}) => {
    // ([fecha_inicio, fecha_fin] = fechas_puntos ? fechas_puntos.selectedDates : [null, null]);

    // data["fecha_inicio"] = fecha_inicio ? 
    //         fecha_inicio.toISOString().slice(0, 19).replace('T', ' ') : 
    //         null;

    // data["fecha_fin"] = fecha_fin ?
    //         fecha_fin.toISOString().slice(0, 19).replace('T', ' ') :
    //         null;

    data["estatus"]         = $("#filtro_estatus").val();
    data["id_programa"]     = $("#filtro_programas").val();
    data["id_direccion"]    = $("#filtro_direcciones").val();
    data["numero_sesion"]   = $("#filtro_sesiones").val();
    
    //otros filtros
    return data;
}

const mensaje_filtro = () => {
	let partes_mensaje = [];

	const estatus = $('#filtro_estatus').val();
	if (estatus.length) {
		partes_mensaje.push(`Estatus sea: ${$('#filtro_estatus option:selected').text()}`);
	}

	const programa = $('#filtro_programas').val();
	if (programa.length) {
		partes_mensaje.push(`Programa sea: ${$('#filtro_programas option:selected').text()}`);
	}

	const direccion = $('#filtro_direcciones').val();
	if (direccion.length) {
		partes_mensaje.push(`Dirección sea: ${$('#filtro_direcciones option:selected').text()}`);
	}

	const sesion = $('#filtro_sesiones').val();
	if (sesion.length) {
		partes_mensaje.push(`Sesión sea: ${$('#filtro_sesiones option:selected').text()}`);
	}

	return partes_mensaje.length > 0 ? `Estás filtrando donde ${partes_mensaje.join(', ')}` : "Filtrando todos los registros";
}

$(document).on("change", ".cambiar_estatus", function() {
    const id_punto = $(this).data("id_punto");
    const padre_id = $(this).data("padre_id");
    const estatus = $(this).val();

    const data = { id_punto, estatus, padre_id };

    $.ajax({
        url: "/FiDigital/panel/sesiones/puntos/post_punto",
        type: "POST",
        data: data,
    }).then((response) => {
        Toast.fire({
            title: 'Exito',
            position: 'top-right',
            html: 'Se cambio el estatus correctamente',
            icon: 'success'
        });
    }).catch((error) => {
        console.log(error);
        Toast.fire({
            title: 'Error',
            position: 'top-right',
            html: "Error al cambiar el estatus",
            icon: 'error'
        })
    });
});