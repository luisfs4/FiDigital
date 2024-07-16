const error_ajax = (respuesta) => {
    Swal.fire({
        title: 'Ha ocurrido un problema :(',
        html: '<pre style="white-space: pre-line;">' + respuesta + '</pre>',
        icon: 'error',
        buttonsStyling: false,
        customClass: {
            confirmButton: "btn bg-gradient-danger me-3",
            cancelButton: "btn bg-gradient-secondary"
        }
    })
}

//Btn
const disableBtn = (btn) => {
    $(btn).children('.loading').remove();
    $(btn).append(`
        <div class="loading-4 loading bg-gradient-danger">
            <span class="span1"></span>
            <span class="span2"></span>
            <span class="span3"></span>
        </div>
    `)
}

const enableBtn = (btn) => {
    $(btn).children('.loading').remove();
}

const ordenar_lista = (e) => {
    //Ordenar sí hay cambios
    $(e.target).children('li').each(function (index, value) {
        $(this).attr("orden", index + 1);
        $(this).find('.contador_item_paso').text(index + 1);
    });
    setFormHeight();
    //Crear html sí está vacia la lista
    if ($(e.target).children().length < 1) {
        $(e.target).append(`
        <ul class="list-group lista_vacia">
            <li class="list-group-item">No hay elementos en la lista</li>
        </ul>
      `);
    }
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const array_move = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    let contador_posicion = 1;
    arr.forEach(element => {
        element.posicion = contador_posicion;
        contador_posicion++;
    });
    return arr;
};

const multiDimensionalUnique = (arr) => {
    var uniques = [];
    var itemsFound = {};
    for (var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if (itemsFound[stringified]) {
            continue;
        }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

//Realizar scroll a un elemento
const scrollTo = (elemento) => {

    const navBarHeight = document.querySelector('nav.navbar').offsetHeight;
    const scrollTop = elemento.offsetTop - navBarHeight - 100;
    window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
    });
    return scrollTop;

};

function formatDate(dateVal) {
    var newDate = new Date(dateVal);

    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = padValue(newDate.getMinutes());
    var sAMPM = "a. m. ";

    var iHourCheck = parseInt(sHour);

    if (iHourCheck > 12) {
        sAMPM = "p. m. ";
        sHour = iHourCheck - 12;
    } else if (iHourCheck === 0) {
        sHour = "12";
    }

    sHour = padValue(sHour);

    return sDay + "/" + sMonth + "/" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
}

function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

const volver_arriba = async () => {
    $('.volver_arriba').delay(200).fadeOut();
    $('html, body, main').animate({
        scrollTop: 0
    }, 700);
    return;
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
        popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    icon: 'error'
})
function formatoMoneda(valor) {
    const formatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(valor) + ' MXN';
}

$(document).ready(() => {

    // Listener parallax
    //const elem = $(".parallax");
    //document.addEventListener("mousemove", parallax);
    // Parallax 360 img
    function parallax(e) {
        let _w = window.innerWidth / 2;
        let _h = window.innerHeight / 2;
        let _mouseX = e.clientX / 15;
        let _mouseY = e.clientY / 15;
        let _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`;
        let _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`;
        let _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`;
        let x = `${_depth3}, ${_depth2}, ${_depth1}`;
        Object.keys(elem).forEach(contador => {
            if (contador != 'length') {
                if (typeof elem[contador].style != 'undefined') {
                    elem[contador].style.backgroundPosition = x;
                }
            }
        });
    }

    $(document).on('click', '.btn_crear_proveedor', () => {
        evento_btn_proveedor();
    });

    $(document).on('click', '.btn_editar_proveedor', (e) => {
        evento_btn_proveedor($(e.currentTarget).attr('id_proveedor'));
    });

    //Inicializar FlatPickr
    $('.flatpickr_time').flatpickr({
        enableTime: true,
        noCalendar: true,
        mode: 'multiple',
        dateFormat: "H:i",
        time_24hr: true
    })

    //Inicializar FlatPickr
    $('.flatpickr_datetime').flatpickr({
        enableTime: true,
        mode: 'range',
        time_24hr: true
    })

    /**
     * Solucionar bug PerfectScrollBar con modales de boostrap
     */
    $('.modal').on('shown.bs.modal', function () {
        let height = 0;
        $('.main-content').children().each(function () {
            height += $(this).outerHeight()
        });
        $('.main-content').css('min-height', height + 100 + 'px');
    }).on('hidden.bs.modal', function () {
        $('.main-content').css('min-height', 'unset');
    });

    $('.select2_init').select2({
        placeholder: "Selecciona una opción",
        language: {
            noResults: function () {
                return "Sin resultados";
            }
        },
    });

    $('.select2_tags').select2({
        placeholder: "Selecciona una opción",
        tags: true,
        language: {
            noResults: function () {
                return "Sin resultados";
            }
        },
    }).on('select2:open', function (e) {
        $('.select2-search__field').attr('placeholder', 'Busca o ingresa una nueva opción');
    })

    $('.select2_init').change(async function () {
        //alert($(this).val().length)
        if (typeof $(this).attr('multiple') != 'undefined') {
            if ($(this).val()[0] == '0' && $(this).val().length > 1) {
                //Bloquear el resto de los valores si es "no aplica" una de las selecciones
                await $(this).select2('val', [0])
                $(this).children('option:not(:selected)').attr('disabled', true).trigger('change');
            } else {
                $(this).children('option:not(:selected)').attr('disabled', false);
            }
        }
        $('.select2-search__field').attr('placeholder', 'Busca una opción...');
    }).on('select2:open', function (e) {
        $('.select2-search__field').attr('placeholder', 'Busca una opción...');
    })

    /**
     * Trigger de evento para mostrar otro input en caso de que el select requiera mostrar otro campo
     * El atributo para indicar el objetivo en el input selector es input-target
     * Para el valor verdadero es value-true
     * El attr para buscar el otro input es name
     * 
     * Es importante que el padre tenga una clase "contenedor_ver_otro" para el mostrarlo
     * 
     */

    $('.ver_otro').change((e) => {
        if ($(e.target).val() == $(e.target).attr('value-true')) {
            $(`[name=${$(e.target).attr('input-target')}]`).closest('.contenedor_ver_otro').show(200);
        } else {
            $(`[name=${$(e.target).attr('input-target')}]`).closest('.contenedor_ver_otro').hide(200);
        }
    });

    $('.btn_cerrar_session').click(async function () {
        localStorage.setItem('logout', true)
        sessionStorage.removeItem('logged_in');
        localStorage.removeItem('logged_in');
        localStorage.removeItem('logout');
        window.location.href = '/FiDigital/cerrar_sesion';
    })

    let sortableIn;

    //Sortable
    $(".sortable").sortable({
        start: function (e, ui) {
            $(this).attr('data-previndex', ui.item.index());
            $(this).css('border', '2px dashed red');
        },
        update: function (e, ui) {
            ordenar_lista(e);
            var newIndex = ui.item.index();
            var oldIndex = $(this).attr('data-previndex');

            //Obtener json y convertirlo a arreglo
            let arr
            if ($(this).siblings('.input_tramite').length > 0) {
                input_json = $(this).siblings('.input_tramite')
            } else {
                input_json = $(`[name=${$(this).attr('sortable-target-name')}]`)
            }

            //Obtener y mover elemento de lugar en el arreglo
            arr = JSON.parse($(input_json).val())
            arr = array_move(arr, oldIndex, newIndex);
            //Setear el valor en el texto
            $(input_json).val(JSON.stringify(arr));
        },
        create: function (e, ui) {
            ordenar_lista(e);
        },
        receive: function (e, ui) {
            sortableIn = 1;
            $(ui.item).css('background', 'white')
            $(ui.item).css('border', '0')
        },
        over: function (e, ui) {
            sortableIn = 1;
            $(ui.item).css('background', 'white')
            $(ui.item).css('border', '0')
        },
        in: function (e, ui) {
            sortableIn = 1;
            $(ui.item).css('background', 'white')
            $(ui.item).css('border', '0')
        },
        out: function (e, ui) {
            sortableIn = 0;
        },
        beforeStop: async function (e, ui) {
            $(this).css('border', '0px');
            if (sortableIn == 0) {
                var newIndex = ui.item.index();
                var oldIndex = $(this).attr('data-previndex');

                //Obtener json y convertirlo a arreglo
                let arr
                if ($(this).siblings('.input_tramite').length > 0) {
                    input_json = $(this).siblings('.input_tramite')
                } else {
                    //Cuando es tabla se usa ese attr en el tbody
                    input_json = $(`[name=${$(this).attr('sortable-target-name')}]`)
                }

                //Obtener y mover elemento de lugar en el arreglo
                arr = JSON.parse($(input_json).val())
                arr.splice(oldIndex, 1);
                //Setear el valor en el texto
                $(input_json).val(JSON.stringify(arr)).trigger('change');

                //console.log($(e.target).children('li.list-group-item:visible:visible'));
                /**
                 * 
                if($(e.target).children('li.list-group-item:not(:hidden)').length == 2){
                    Swal.fire('¿Estás seguro?', 'Se eliminará el item', 'question')
                }
                */


                await ui.item.remove();
                ordenar_lista(e);
            } else {
                $(ui.item).css('background', '')
                $(ui.item).css('border', '')

            }
        }
    }).disableSelection();


})

//Cerrar sesion en todas las ventanas
window.addEventListener('storage', (event) => {
    if (event.key == 'logout' && event.newValue) {
        sessionStorage.removeItem('logged_in');
        localStorage.removeItem('logged_in');
        localStorage.removeItem('logout');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    } else {
        if (window.location.pathname.toLocaleLowerCase().indexOf("cuenta") > -1) {
            if (localStorage.getItem('logged_in')) {
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        }
    }
});

const online = () => {
    if (navigator.onLine) {
        return true;
    } else {
        return false;
    }
}

const cargar_opciones_puntos = async (selector_destino, url, parametros, value=null) => {
    $(selector_destino).empty().append('<option value="">Cargando...</option>');
    try {
        const respuesta = await $.ajax({
            url,
            type: 'POST',
            data: parametros,
        });

        if (respuesta && respuesta.length > 0) {
            const opciones = respuesta.map(({ id_punto, jerarquia, siguiente_disponible, nombre_punto, presupuesto_autorizado, monto_restante, direccion, programa }) => {
                console.log(value, id_punto);
                return `
                    <option value="${id_punto}" monto_inicial="${presupuesto_autorizado}" 
                            monto_restante="${monto_restante}" jerarquia="${jerarquia}" 
                            data-direccion="${direccion}" data-programa="${programa}" 
                            siguiente_disponible="${siguiente_disponible}" ${ value == id_punto ? 'selected' : ''}>
                        ${jerarquia ? jerarquia + ' - ' : ''}${nombre_punto}
                    </option>
                `;
            }).join("");

            $(selector_destino).empty().append(`
                <option value="">Selecciona una opción</option>
                ${opciones}
            `);
        } else {
            $(selector_destino).empty().append('<option value="">No hay opciones disponibles</option>');
        }
    } catch (error) {
        console.error("Error al cargar opciones: ", error);
        $(selector_destino).empty().append('<option value="">Error al cargar</option>');
    }
};

const evento_btn_proveedor = (proveedor_id = null) => {
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
                        <input class="form-check-input" type="checkbox" id="es_agente_capacitador" name="es_agente_capacitador">
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
                    <div class="col-md-6 div_contenedor">
                        <label for="acta_constitutiva" class="form-label">Acta Constitutiva <i class="fas fa-file-contract"></i></label>
                        <input type="file" class="filepond" id="acta_constitutiva" name="acta_constitutiva">
                    </div>
                    <div class="col-md-6 div_contenedor">
                        <label for="boleta_registro" class="form-label">Boleta de Registro <i class="fas fa-clipboard-list"></i></label>
                        <input type="file" class="filepond" id="boleta_registro" name="boleta_registro">
                    </div>
                    <div class="col-md-6 div_contenedor">
                        <label for="poder_representante_legal" class="form-label">Poder del Representante Legal <i class="fas fa-gavel"></i></label>
                        <input type="file" class="filepond" id="poder_representante_legal" name="poder_representante_legal">
                    </div>
                </div>
            </div>
            
            <!-- Campos para Agente Capacitador Externo -->
            <div id="campos_agente_capacitador" style="display: none;">
                <hr class="horizontal dark my-3">  
                <div class="row g-3">
                    <div class="col-md-6 div_contenedor">
                        <label for="solicitud_registro" class="form-label">Solicitud de Registro <i class="fas fa-file-signature"></i></label>
                        <input type="file" class="filepond" id="solicitud_registro" name="solicitud_registro">
                    </div>
                    <div class="col-md-6 div_contenedor">
                        <label for="curriculum_empresarial" class="form-label">Currículum Empresarial <i class="fas fa-briefcase"></i></label>
                        <input type="file" class="filepond" id="curriculum_empresarial" name="curriculum_empresarial">
                    </div>
                </div>
            </div>

            <hr class="horizontal dark my-3">  
            
            <div class="row mb-4">
                <!-- Campos de archivos para comunes -->
                <div class="col-md-6 div_contenedor">
                    <label for="identificacion_oficial" class="form-label">Identificación Oficial Vigente <i class="fas fa-id-card"></i></label>
                    <input type="file" class="filepond" id="identificacion_oficial" name="identificacion_oficial">
                </div>
                <div class="col-md-6 div_contenedor">
                    <label for="comprobante_domicilio" class="form-label">Comprobante de Domicilio del Negocio <i class="fas fa-home"></i></label>
                    <input type="file" class="filepond" id="comprobante_domicilio" name="comprobante_domicilio">
                </div>
                <div class="col-md-6 div_contenedor">
                    <label for="constancia_situacion_fiscal" class="form-label">Constancia de Situación Fiscal <i class="fas fa-file-invoice-dollar"></i></label>
                    <input type="file" class="filepond" id="constancia_situacion_fiscal" name="constancia_situacion_fiscal">
                </div>
                <div class="col-md-6 div_contenedor">
                    <label for="opinion_cumplimiento" class="form-label">Opinión de Cumplimiento <i class="fas fa-thumbs-up"></i></label>
                    <input type="file" class="filepond" id="opinion_cumplimiento" name="opinion_cumplimiento">
                </div>
                <div class="col-md-6 div_contenedor">
                    <label for="estado_cuenta_bancario" class="form-label">Estado de Cuenta Bancario <i class="fas fa-university"></i></label>
                    <input type="file" class="filepond" id="estado_cuenta_bancario" name="estado_cuenta_bancario">
                </div>
                <div class="col-md-6 div_contenedor">
                    <label for="documento_datos_contacto" class="form-label">Documento de Datos de Contacto <i class="fas fa-address-book"></i></label>
                    <input type="file" class="filepond" id="documento_datos_contacto" name="documento_datos_contacto">
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
            inicializarFilePond();
            if (proveedor_id) {
                cargarDatosProveedor(proveedor_id);
            }
        },
        preConfirm: async () => {
            const campos_relacionados = {};

            const tipo_persona = $('#tipo_persona').val();
            campos_relacionados['tipo_persona'] = tipo_persona;

            const agregar_campo_relacionado = (id, nombre_campo) => {
                const valor = $(`#${id}`).val();
                campos_relacionados[nombre_campo] = valor;
            };

            const agregar_campo_archivo = id => {
                const archivo = FilePond.find(document.querySelector(`#${id}`)).getFile();
                if (archivo) {
                    campos_relacionados[id] = archivo.file;
                }
            };

            if (tipo_persona === 'fisica') {
                agregar_campo_relacionado('nombre_fisica', 'nombre');
                agregar_campo_relacionado('correo_fisica', 'correo');
                agregar_campo_relacionado('telefono_fisica', 'telefono');
            } else if (tipo_persona === 'moral') {
                agregar_campo_relacionado('nombre_enlace', 'nombre');
                agregar_campo_relacionado('telefono_enlace', 'telefono');
                agregar_campo_relacionado('correo_enlace', 'correo');
                agregar_campo_relacionado('nombre_fiscal_empresa', 'nombre_fiscal');
                agregar_campo_relacionado('nombre_comercial_empresa', 'nombre_comercial');
                agregar_campo_archivo('acta_constitutiva');
                agregar_campo_archivo('boleta_registro');
                agregar_campo_archivo('poder_representante_legal');
            }

            campos_relacionados['es_agente_capacitador'] = $('#es_agente_capacitador').is(':checked') ? '1' : '0';

            if ($('#es_agente_capacitador').is(':checked')) {
                agregar_campo_archivo('solicitud_registro');
                agregar_campo_archivo('curriculum_empresarial');
            }

            agregar_campo_archivo('identificacion_oficial');
            agregar_campo_archivo('comprobante_domicilio');
            agregar_campo_archivo('constancia_situacion_fiscal');
            agregar_campo_archivo('opinion_cumplimiento');
            agregar_campo_archivo('estado_cuenta_bancario');
            agregar_campo_archivo('documento_datos_contacto');

            const formulario_datos = new FormData();
            Object.keys(campos_relacionados).forEach(clave => {
                formulario_datos.append(clave, campos_relacionados[clave]);
            });

            if (proveedor_id) {
                formulario_datos.append('id_proveedor', proveedor_id);
            }

            $.ajax({
                url: '/FiDigital/panel/proveedores/post_proveedor',
                type: 'POST',
                data: formulario_datos,
                processData: false,
                contentType: false,
                success: function (respuesta) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'El proveedor ha sido guardado correctamente.',
                        icon: 'success'
                    });
                    tabla_proveedores.ajax.reload();
                },
                error: function (xhr, status, error) {
                    console.error(error);
                }
            });

        }
    });

    const inicializarFilePond = () => {
        const opcionesFilePond = {
            labelIdle: 'Arrastra y suelta tu archivo o <span class="filepond--label-action">Examinar</span>',
            labelFileProcessingComplete: 'Carga completa',
            labelFileProcessingAborted: 'Carga cancelada',
            labelFileProcessingError: 'Error durante la carga',
            labelTapToCancel: 'toca para cancelar',
            labelTapToRetry: 'toca para reintentar',
            labelTapToUndo: 'toca para deshacer'
        };

        FilePond.create(document.querySelector('#acta_constitutiva'), opcionesFilePond);
        FilePond.create(document.querySelector('#boleta_registro'), opcionesFilePond);
        FilePond.create(document.querySelector('#poder_representante_legal'), opcionesFilePond);
        FilePond.create(document.querySelector('#solicitud_registro'), opcionesFilePond);
        FilePond.create(document.querySelector('#curriculum_empresarial'), opcionesFilePond);
        FilePond.create(document.querySelector('#identificacion_oficial'), opcionesFilePond);
        FilePond.create(document.querySelector('#comprobante_domicilio'), opcionesFilePond);
        FilePond.create(document.querySelector('#constancia_situacion_fiscal'), opcionesFilePond);
        FilePond.create(document.querySelector('#opinion_cumplimiento'), opcionesFilePond);
        FilePond.create(document.querySelector('#estado_cuenta_bancario'), opcionesFilePond);
        FilePond.create(document.querySelector('#documento_datos_contacto'), opcionesFilePond);
    };
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

const agregar_icono_pdf = (tag_id, url) => {
    const div_padre = $(`#${tag_id}`).closest('.div_contenedor');

    if (div_padre.length > 0) {
        let archivo_elemento = div_padre.find(`a.archivo_${tag_id}`);

        if (archivo_elemento.length === 0) {
            archivo_elemento = `
                <a class="archivo_${tag_id} badge bg-gradient-danger" target="_blank" href="${url ?? ''}">
                    <i class="fas fa-file-pdf my-0 px-2 py-1"></i> 
                    Ver Archivo
                </a>
            `;
            div_padre.append(archivo_elemento);
        } else {
            // Si el elemento ya existe, actualizamos su href
            archivo_elemento.attr('href', url ?? '#');
        }
    }
};


const cargarDatosProveedor = (proveedor_id) => {
    // Realiza una petición para obtener los datos del proveedor
    $.ajax({
        url: `/FiDigital/panel/proveedores/get_proveedores_by_ajax`,
        type: 'POST',
        data: {
            id_proveedor: proveedor_id
        },
        success: function (response) {
            const proveedor = response[0];

            // Completa los campos con los datos del proveedor
            $('#tipo_persona').val(proveedor.tipo_persona).trigger('change');
            if (proveedor.tipo_persona === 'fisica') {
                $('#nombre_fisica').val(proveedor.nombre);
                $('#correo_fisica').val(proveedor.correo);
                $('#telefono_fisica').val(proveedor.telefono);
            } else if (proveedor.tipo_persona === 'moral') {
                $('#nombre_enlace').val(proveedor.nombre_enlace ?? proveedor.nombre);
                $('#telefono_enlace').val(proveedor.telefono_enlace ?? proveedor.telefono);
                $('#correo_enlace').val(proveedor.correo_enlace ?? proveedor.correo);
                $('#nombre_fiscal_empresa').val(proveedor.nombre_fiscal);
                $('#nombre_comercial_empresa').val(proveedor.nombre_comercial);

                // Cargar archivos existentes en FilePond
                if (proveedor.acta_constitutiva) {
                    agregar_icono_pdf("acta_constitutiva", proveedor.acta_constitutiva);
                    // FilePond.find(document.querySelector('#acta_constitutiva')).addFile(proveedor.acta_constitutiva);
                }
                if (proveedor.boleta_registro) {
                    agregar_icono_pdf("boleta_registro", proveedor.boleta_registro);
                    // FilePond.find(document.querySelector('#boleta_registro')).addFile(proveedor.boleta_registro);
                }
                if (proveedor.poder_representante_legal) {
                    agregar_icono_pdf("poder_representante_legal", proveedor.poder_representante_legal);
                    // FilePond.find(document.querySelector('#poder_representante_legal')).addFile(proveedor.poder_representante_legal);
                }
            }
            if (proveedor.es_agente_capacitador) {
                $('#es_agente_capacitador').prop('checked', true).trigger('change');
                if (proveedor.solicitud_registro) {
                    agregar_icono_pdf('solicitud_registro', proveedor.solicitud_registro);
                    // FilePond.find(document.querySelector('#solicitud_registro')).addFile(proveedor.solicitud_registro);
                }
                if (proveedor.curriculum_empresarial) {
                    agregar_icono_pdf('curriculum_empresarial', proveedor.curriculum_empresarial);
                    // FilePond.find(document.querySelector('#curriculum_empresarial')).addFile(proveedor.curriculum_empresarial);
                }
            }
            // Cargar archivos comunes
            if (proveedor.identificacion_oficial) {
                agregar_icono_pdf('identificacion_oficial', proveedor.identificacion_oficial);
                // FilePond.find(document.querySelector('#identificacion_oficial')).addFile(proveedor.identificacion_oficial);
            }
            if (proveedor.comprobante_domicilio) {
                agregar_icono_pdf('comprobante_domicilio', proveedor.comprobante_domicilio);
                // FilePond.find(document.querySelector('#comprobante_domicilio')).addFile(proveedor.comprobante_domicilio);
            }
            if (proveedor.constancia_situacion_fiscal) {
                agregar_icono_pdf('constancia_situacion_fiscal', proveedor.constancia_situacion_fiscal);
                // FilePond.find(document.querySelector('#constancia_situacion_fiscal')).addFile(proveedor.constancia_situacion_fiscal);
            }
            if (proveedor.opinion_cumplimiento) {
                agregar_icono_pdf("opinion_cumplimiento", proveedor.opinion_cumplimiento);
                // FilePond.find(document.querySelector('#opinion_cumplimiento')).addFile(proveedor.opinion_cumplimiento);
            }
            if (proveedor.estado_cuenta_bancario) {
                agregar_icono_pdf("estado_cuenta_bancario", proveedor.estado_cuenta_bancario);
                // FilePond.find(document.querySelector('#estado_cuenta_bancario')).addFile(proveedor.estado_cuenta_bancario);
            }
            if (proveedor.documento_datos_contacto) {
                agregar_icono_pdf("documento_datos_contacto", proveedor.documento_datos_contacto);
                // FilePond.find(document.querySelector('#documento_datos_contacto')).addFile(proveedor.documento_datos_contacto);
            }
        },
        error: function (error) {
            console.error('Error al cargar los datos del proveedor:', error);
        }
    });
};
