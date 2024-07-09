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
        dom: 'Blr<"w-100 overflow-auto"t>ip',
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
            $(document).on("click", ".btn_buscar",      () => { tabla_puntos.ajax.reload(); });
            $(document).on("click", ".btn_borrar",      () => { $(".input_filtro, .busqueda_nav").val("").change(); });
            $(document).on("keyup", ".busqueda_nav",    (ev) => { 
                ev.key == "Enter" && ev.currentTarget.value.length >= 3 && tabla_puntos.ajax.reload(); 
            });

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
                className: "text-end", 
                targets: [1,2,3,4,5],
            }
        ],
        columns: [
            {//Nombre
                "mData": "nombre_punto",
                "mRender": function (data, type, row) {
                    return `
                        <div class="d-flex px-2 detalle_punto cursor-pointer" 
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
            {//Cantidades
                "mData": "presupuesto_autorizado",
                "mRender": function (data, type, row) {
                    return `
                        <div class="row align-items-center flex-nowrap">
                            <span class="col">
                                ${data ?? '---'}
                            </span>
                            <span class="font-weight-bold text-xs col-auto">
                                <b class="text-success">
                                    <i class="fas fa-money-bill mx-2"></i>
                                </b>
                                AUT
                            </span>
                        </div>
                        <div class="row align-items-center flex-nowrap">
                            <span class="col">
                                ${row.pagado ?? '---'}
                            </span>
                            <span class="font-weight-bold text-xs col-auto">
                                <b class="text-danger">
                                    <i class="fas fa-sort-amount-down mx-2"></i>
                                </b>
                                PAG
                            </span>
                        </div>
                        <div class="row align-items-center flex-nowrap">
                            <span class="col">
                                ${row.monto_restante ?? '---'}
                            </span>
                            <span class="font-weight-bold text-xs col-auto">
                                <b class="text-primary">
                                    <i class="fas fa-equals mx-2"></i>
                                </b>
                                REM 
                            </span>
                        </div>
                    `;
                }
            },
            {//Estatus
                "mData": "estatus",
                "mRender": function (data, type, row) {
                    const padre_id = row.padre_id ?? '';
                    return `
                        <div class="row flex-nowrap">
                            <div class="col-auto">
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
                                    <option value="completo" ${ data == "completo" ? 'selected' : '' }>
                                        Completo
                                    </option>
                                    <option value="completo con errores" ${ data == "completo con errores" ? 'selected' : '' }>
                                        Completo con errores
                                    </option>
                                </select>
                            </div>
                            <div class="col-auto">
                                <button class="btn btn-sm bg-gradient-primary agregar_observacion 
                                        py-2 px-3 fs-6" id_punto="${row.id_punto}">
                                    <i class="fas fa-comment-dots fs-6"></i>
                                </button>
                            </div>
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

	if ($(".busqueda_nav").val().length >= 3)
        data["search"] = { "value": $(".busqueda_nav").val() };

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

const ordenar_puntos = (puntos) => {
    const parsear_jerarquia = (jerarquia) => jerarquia.split('.').map(n => parseInt(n || 0));

    return puntos.sort((a, b) => {
        const niveles_a = parsear_jerarquia(a.jerarquia);
        const niveles_b = parsear_jerarquia(b.jerarquia);

        return niveles_a.reduce((resultado, nivelA, index) => resultado || (nivelA - (niveles_b[index] || 0)), 0);
    });
}

const render_puntos = (hierarchy, level = 0) => {
    if (hierarchy.length === 0) {
        return '<div class="alert border-danger text-gradient text-danger my-3">No existen puntos registrados.</div>';
    }

    hierarchy = ordenar_puntos(hierarchy);
    let html = '<ul class="list-group">';
    for (const point of hierarchy) {
        let btn_detalle = '';

        if (point.id_expediente) {
            btn_detalle = `
                <a href="/FiDigital/panel/sesiones/expedientes/${point.id_expediente}/detalle" class="cursor-pointer px-3 py-2 my-auto mx-1 btn btn-xs bg-gradient-info shadow text-white rounded">
                    <i class="fas fa-folder text-white" aria-hidden="true"></i>
                </a>             
            `;
        }
        let span_restante = ``;
        if (point.monto_restante) {
            span_restante = `<span class="badge badge-info me-2">${formatoMoneda(point.monto_restante)} restante</span>`;
        }

        let btn_estatus = '';
        let badge = '';
        let selected_1 = '';
        let selected_2 = '';
        let selected_3 = '';
        let selected_4 = '';

        if (point.estatus) {
            if (point.estatus == 'Completo') {
                selected_1 = 'selected';
                badge = 'bg-gradient-success'
            } else if (point.estatus == 'Completo con errores') {
                selected_2 = 'selected';
                badge = 'bg-gradient-success'
            } else if (point.estatus == 'Incompleto') {
                selected_3 = 'selected';
                badge = 'bg-gradient-danger'
            } else if (point.estatus == 'Completo sin errores') {
                selected_4 = 'selected';
                badge = 'bg-gradient-success'
            }

            btn_estatus = `<select class="px-3 py-2 mx-1 rounded cambiar_estatus ${badge} border-0 my-1 shadow text-xs text-white rounded" id_expediente="${point.id_expediente}" id_sesion="${point.id_sesion}">
                                <option ${selected_1 ?? ''} class="bg-light text-dark">Completo</li>
                                <option ${selected_2 ?? ''} class="bg-light text-dark">Completo con errores</li>
                                <option ${selected_4 ?? ''} class="bg-light text-dark">Completo sin errores</li>
                                <option ${selected_3 ?? ''} class="bg-light text-dark">Incompleto</li>
                            </select>`;
        }

        // Contenedor de lista
        html += `
            <li class="list-group-item">
                <div class="d-flex flex-wrap justify-content-between align-items-center w-100 my-2">
                    <div class="col-12 col-md-7 text-start text-wrap">
                        ${"&nbsp;".repeat(level * 2)}
                        <span class="text-wrap">${point.jerarquia} - ${point.nombre_punto}</span>
                    </div>
                    <div class="col-12 col-md-5 mt-sm-3 d-flex justify-content-end">
                        ${span_restante}
                        ${btn_estatus}
                        ${btn_detalle}
                    </div>   
                </div >
        `;
        // Imprimir hijo
        if (point.children) {
            html += render_puntos(point.children, level + 1);
        }

        // Cerrar lista
        html += '</li>';
    }
    html += '</ul>';
    return html;
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

$(document).on("click", ".detalle_punto", function(){
    id_punto = $(this).attr("id_punto");
    $.post('/FiDigital/panel/sesiones/puntos/get_by_ajax', {padre_id: id_punto})
        .then((puntos)=>{
            Swal.fire({ //Crar una punto nueva
                title: 'Puntos asignados',
                buttonsStyling: false,
                reverseButtons: true,
                confirmButtonText: 'Cerrar',
                customClass: {
                    confirmButton: 'btn bg-gradient-danger btn-md mx-2 move-icon-left',
                    loader: 'custom-loader',
                    popup: 'swal-wide'
                },
                autofocus: false,
                html: render_puntos(puntos),
                focusConfirm: false,
            })
        })
        .catch(()=>{});
});

$(document).on("click", ".agregar_observacion", function(){
    const id_punto = $(this).attr("id_punto");
    $.get("/FiDigital/panel/Sesiones/puntos/get_observaciones", {id_punto}).then((punto)=>{
        Swal.fire({
            icon: "info",
            title: `<i class="fas fa-comment-dots mx-2"></i> Observaciones`,
            input: "textarea",
            inputValue: punto.observaciones,
            inputAttributes: { autocapitalize: "off" },
            preConfirm: async (observaciones) => {
                await $.post(`/FiDigital/panel/Sesiones/puntos/post_observaciones`, {observaciones, id_punto})
                .then((resultado)=>{
                    if(!resultado.success){ throw new Error(resultado.message); }

                    Toast.fire({
                        title: 'Exito',
                        position: 'top-right',
                        html: 'Se guardaron las observaciones correctamente',
                        icon: 'success'
                    });
                })
                .catch((error)=>{
                    Swal.showValidationMessage(`Ocurrio un error al guardar las observaciones: ${error}`);
                });
              },
        });
    });
});