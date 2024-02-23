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

const cargar_opciones_puntos = async (selector_destino, url, parametros) => {
    $(selector_destino).empty().append('<option value="">Cargando...</option>');
    try {
        const respuesta = await $.ajax({
            url,
            type: 'POST',
            data: parametros,
        });

        if (respuesta && respuesta.length > 0) {
            $(selector_destino).empty().append('<option value="">Selecciona una opción</option>');
            respuesta.forEach(({ id_punto, jerarquia, siguiente_disponible, nombre_punto }) => {
                $(selector_destino).append(`<option value="${id_punto}" jerarquia="${jerarquia}" siguiente_disponible="${siguiente_disponible}">${jerarquia ? jerarquia + ' - ' : ''}${nombre_punto}</option>`);
            });
        } else {
            $(selector_destino).empty().append('<option value="">No hay opciones disponibles</option>');
        }
    } catch (error) {
        console.error("Error al cargar opciones: ", error);
        $(selector_destino).empty().append('<option value="">Error al cargar</option>');
    }
};

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
            // Objeto para almacenar los campos relacionados
            const campos_relacionados = {};

            // Obtener el tipo de persona seleccionado
            const tipo_persona = $('#tipo_persona').val();

            // Agregar el tipo de persona al objeto campos_relacionados
            campos_relacionados['tipo_persona'] = tipo_persona;

            // Función para agregar campos relacionados al objeto campos_relacionados
            const agregar_campo_relacionado = (id, nombre_campo) => {
                const valor = $(`#${id}`).val();
                campos_relacionados[nombre_campo] = valor;
            };

            // Función para agregar campos de archivos relacionados al objeto campos_relacionados
            const agregar_campo_archivo = id => {
                const archivo = $(`#${id}`)[0].files[0];
                campos_relacionados[id] = archivo;
            };

            // Verificar el tipo de persona y agregar los campos relacionados al objeto campos_relacionados
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

            // Agregar campos para Agente Capacitador Externo si está seleccionado
            if ($('#es_agente_capacitador').is(':checked')) {
                agregar_campo_archivo('solicitud_registro');
                agregar_campo_archivo('curriculum_empresarial');
            }

            // Agregar campos comunes
            agregar_campo_archivo('identificacion_oficial');
            agregar_campo_archivo('comprobante_domicilio');
            agregar_campo_archivo('constancia_situacion_fiscal');
            agregar_campo_archivo('opinion_cumplimiento');
            agregar_campo_archivo('estado_cuenta_bancario');
            agregar_campo_archivo('documento_datos_contacto');

            // Validaciones antes de enviar los datos
            if (!tipo_persona || (tipo_persona === 'fisica' && (!campos_relacionados['nombre'] || !campos_relacionados['correo'] || !campos_relacionados['telefono'])) ||
                (tipo_persona === 'moral' && (!campos_relacionados['nombre'] || !campos_relacionados['correo'] || !campos_relacionados['telefono'] || !campos_relacionados.hasOwnProperty('nombre_enlace') || !campos_relacionados.hasOwnProperty('nombre_fiscal') || !campos_relacionados.hasOwnProperty('nombre_comercial')))) {
                Swal.showValidationMessage('Por favor, completa todos los campos requeridos.');
                return false;
            }

            // Preparar datos para enviar
            const formulario_datos = new FormData();
            Object.keys(campos_relacionados).forEach(clave => {
                formulario_datos.append(clave, campos_relacionados[clave]);
            });

            // Envío de datos por AJAX
            $.ajax({
                url: '/FiDigital/panel/proveedores/agregar', // Ajusta esto a la URL real del servidor
                type: 'POST',
                data: formulario_datos,
                processData: false, // No procesar los datos
                contentType: false, // No establecer tipo de contenido automáticamente
                success: function (respuesta) {
                    console.log(respuesta);
                    // Aquí manejas la respuesta del servidor
                },
                error: function (xhr, status, error) {
                    console.error(error);
                    // Manejo del error
                }
            });

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