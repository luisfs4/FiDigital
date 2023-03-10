const error_ajax = (respuesta) => {
    Swal.fire('Ha ocurrido un problema :(', '<pre style="white-space: pre-line;">' + respuesta + '</pre>', 'error')
}

/**
 * 
 * @param {*} e 
 */

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

/**
 * 
 */
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
        window.location.href = '/cerrar_sesion';
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