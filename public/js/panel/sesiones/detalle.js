let botonnn;

const generar_html_punto = (punto) => {

    return `
        <li class="list-group-item border-0 p-0 my-2">
            <div class="row">
                <div class="col-lg-12 d-flex justify-content-between pe-0">
                    <div class="d-flex text-black align-items-center">
                        <i class="fas fa-folder me-2" aria-hidden="true"></i>${punto.jerarquia} ${punto.nombre_punto}
                    </div>
                    <div class="dropdown d-flex">
                        <div class="cursor-pointer my-auto mx-1 btn btn-xs bg-gradient-danger shadow text-center text-white rounded" id="dropdown_punto_${punto.id_punto}" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa fa-ellipsis-h text-white" aria-hidden="true"></i>
                        </div>

                        <ul class="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5" aria-labelledby="dropdown_punto_${punto.id_punto}">
                         
                        </ul>

                    </div>
                </div>

            </div>
        </li>
    `;

}

const card_expediente = async (id_expediente) => {
    let expediente = await $.ajax({
        url: "/panel/sesiones/expedientes/get_by_ajax",
        data: {
            id_expediente
        },
        dataType: "JSON",
        type: "POST",
    });

    expediente = expediente[0];

    console.log(expediente);
    
    if (!expediente) {
        const swalOptions = {
            title: "Upss",
            text: "El expediente no cuenta con suficientes datos",
            icon: "error",
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn bg-gradient-danger me-3",
                cancelButton: "btn bg-gradient-secondary",
            },
        };
        Swal.fire(swalOptions);
        return;
    }

    const $card_expediente = $(".card_expediente");
    $card_expediente.empty();

    const puntos = JSON.parse(expediente.puntos);
    const html_puntos = puntos ? puntos.map((element) => generar_html_punto(element)).join("") : "";

    const li_puntos = puntos ?
        `<li class="list-group-item d-flex justify-content-between align-items-center flex-column accordion p-0">
          <button class="collapsed accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_expendiente_puntos" aria-expanded="false" aria-controls="collapse_expendiente_puntos">
              Puntos
              <div class="collapse-close badge badge-primary badge-pill pt-1 position-absolute end-0 me-3">
                  <i class="fa fa-plus text-xs" aria-hidden="true"></i>
              </div>
              <div class="collapse-open badge badge-primary badge-pill pt-1 position-absolute end-0 me-3">
                  <i class="fa fa-minus text-xs" aria-hidden="true"></i>
              </div>
          </button>
          <div class="collapse p-3 w-100" id="collapse_expendiente_puntos">
              <div class="card card-body">
                  <ul class="list-group border-0">
                      ${html_puntos}
                  </ul>
              </div>
          </div>
      </li>` :
        "";

    const card_body = `
      <div class="card-header pb-0 text-left">
          <div class="d-flex justify-content-between align-items-center">
              <h3 class="font-weight-bolder mb-4 text-info text-gradient">
                  ${expediente.direccion}
              </h3>
                <h3 class="far fa-file-alt mb-4 text-info text-gradient"></h3>
            </div>
            <div class="row px-2">
                <div class="col-lg-6">
                    <p class="text-bold mb-0">
                        <i class="fas fa-calendar-alt text-xs me-1" aria-hidden="true"></i> Proveedor
                    </p>
                    <p>
                        ${expediente.nombre_comercial}
                    </p>
                </div>
                <div class="col-lg-6">
                    <p class="text-bold mb-0">
                        <i class="fas fa-hands text-xs me-1" aria-hidden="true"></i> Programa
                    </p>
                    <p>
                        ${expediente.programa ?? 'No disponible'}
                    </p>
                </div>
            </div>
        </div>
        <div class="card-body">

            <ul class="list-group">
                
                ${li_puntos}    
               
                <li class="list-group-item d-flex justify-content-between align-items-center flex-column accordion p-0">

                    <button class="collapsed accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_expendiente_observaciones_expediente" aria-expanded="false" aria-controls="collapse_expendiente_observaciones_expediente">
                        Observaciones del expediente
                        <div class="collapse-close badge badge-primary badge-pill pt-1 position-absolute end-0 me-3">
                            <i class="fa fa-plus text-xs" aria-hidden="true"></i>
                        </div>
                        <div class="collapse-open badge badge-primary badge-pill pt-1 position-absolute end-0 me-3">
                            <i class="fa fa-minus text-xs" aria-hidden="true"></i>
                        </div>
                    </button>

                    <div class="collapse p-3 w-100" id="collapse_expendiente_observaciones_expediente">
                        <div class="card card-body">
                            ${expediente.observaciones ?? 'Sin observaciones'}
                        </div>
                    </div>
                </li>
                
            </ul>

        </div>

        <div class="card-footer text-center pt-0">
            <div class="row w-100 justify-content-end ">
            </div>
        </div>
    `;

    //Insertar html en el cuerpo del modal
    $('.card_expediente').append(card_body);

}

//Obtener seguimiento
const get_seguimiento = (id_sesion) => {

    $.ajax({
        type: 'post',
        url: '/FiDigital/panel/sesiones/get_seguimiento_by_ajax',
        data: {
            id_sesion
        },
        dataType: 'json',
        success: ((response) => {

            $('.contenedor_chat').empty();

            if (!response) {
                $('.contenedor_chat').append(template({
                    msg: 'Este expediente no cuenta con mensajes',
                    creador: 'Sistema',
                    created_at: '...',
                    alineacion: 'justify-content-end',
                    fondo: 'bg-gray-200'
                }));
                return;
            }

            $('.ult_act_seguimiento').text(response[response.length - 1].created_at);

            response.forEach(element => {

                if (element.id_usuario == id_usuario && element.ruta_archivo != null) { //Mensaje del usuario conectado y con archivo

                    let alineacion = 'justify-content-end';
                    let fondo = 'bg-gray-200';

                    $('.contenedor_chat').append(template_file({
                        msg: element.seguimiento,
                        creador: element.creador,
                        created_at: element.created_at,
                        ruta_archivo: element.ruta_archivo,
                        alineacion: alineacion,
                        fondo: fondo
                    }));

                } else if (element.id_usuario == id_usuario && element.ruta_archivo == null) { //Mensaje del usuario conectado

                    let alineacion = 'justify-content-end';
                    let fondo = 'bg-gray-200';


                    $('.contenedor_chat').append(template({
                        msg: element.seguimiento,
                        creador: element.creador,
                        created_at: element.created_at,
                        alineacion: alineacion,
                        fondo: fondo
                    }));

                } else if (element.id_usuario != id_usuario && element.ruta_archivo != null) { //Mensaje de otro usuario y con archivo

                    let alineacion = 'justify-content-start';
                    let fondo = '';

                    $('.contenedor_chat').append(template_file({
                        msg: element.seguimiento,
                        creador: element.creador,
                        created_at: element.created_at,
                        ruta_archivo: element.ruta_archivo,
                        alineacion: alineacion,
                        alineacion: alineacion,
                        fondo: fondo
                    }));

                } else if (element.id_usuario != id_usuario && element.ruta_archivo == null) { //Mensaje de otro usuario
                    let alineacion = 'justify-content-start';
                    let fondo = '';

                    $('.contenedor_chat').append(template({
                        msg: element.seguimiento,
                        creador: element.creador,
                        created_at: element.created_at,
                        alineacion: alineacion,
                        fondo: fondo
                    }));
                }
            });

            scrollBottom();
            $('.fa-paperclip').removeClass('text-success');

        }),
        error: ((err) => {
            console.log(err);
            $('.fa-paperclip').removeClass('text-success');
        })
    });

};

//Obtener anexos
const get_anexos = () => {

    $.ajax({
        type: 'post',
        url: '/FiDigital/panel/quejas/get_anexos_by_ajax',
        data: {
            id_expediente
        },
        dataType: 'json',
        success: ((response) => {

            $('.anexos_vacios').remove();
            $('.lista_anexos').empty();

            if (!response) {
                $('.lista_anexos').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center p-3 anexos_vacios">
                        Sin anexos
                        <span class="badge badge-primary badge-pill cursor_pointer">
                            <i class="far fa-file-pdf" aria-hidden="true"></i>
                        </span>
                    </li>
                `);
                return;
            }

            response.forEach(element => {

                let ext = element.ruta_anexo.split('.')
                console.log(ext);
                ext = ext[ext.length - 1];
                console.log(ext);

                $('.lista_anexos').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                        <div>
                            <b>${element.nombre_anexo}</b> <br> <small><i class="far fa-calendar-alt me-2" aria-hidden="true"></i>${element.ultima_modificacion}</small>
                        </div>
                        <a download="${element.nombre_anexo}.${ext}" href="/${element.ruta_anexo}" class="badge badge-primary badge-pill cursor_pointer">
                            <i class="fas fa-download" aria-hidden="true"></i>
                        </a>
                    </li>
                `)

            });

        }),
        error: ((err) => {
            console.log(err);
        })
    });

};

const template = ({
    msg,
    creador,
    created_at,
    alineacion,
    fondo
}) => {
    console.log(alineacion);
    return `
    <div class="row ${alineacion} mb-4">
        <div class="col-auto">
            <div class="card ${fondo}">
                <div class="card-body py-2 px-3">
                    <p class="mb-1">
                        ${msg}
                    </p>
                    <div class="d-flex align-items-center ${alineacion} text-sm opacity-6">
                        <p class="text-xs mb-0 me-3">${creador}</p>
                        <small>${created_at}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};

const template_file = ({
    msg,
    nombres,
    ape_paterno,
    created_at,
    foto,
    direccion,
    fondo
}) => {
    return `
    <div class="msg f-14 ${fondo} text-white ${direccion}">
            ${msg}

                <!-- Foto -->
                <div class="row">
                    <div class="col">
                        <div class="avatar">
                            <div class="mt-2 mb-2 rounded-btn w-36 h-36">
                                <a href="{{base_url('uploads/evidencias')}}/${foto}" data-lightbox="image-1"
                                    data-title="Evidencia">
                                    <img src="{{base_url('uploads/evidencias')}}/${foto}">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

        <small class="f-10 d-block mt-2 ${direccion}">
            Creado por: ${nombres} ${ape_paterno} - ${created_at}
       </small>
    </div>
    `
};

const post_seguimiento = (texto) => {

    var formdata = new FormData();
    formdata.append('id_expediente', id_expediente);
    formdata.append('seguimiento', texto);

    $.ajax({
        type: 'post',
        url: '/FiDigital/panel/quejas/seguimiento/post_seguimiento',
        data: formdata,
        cache: false,
        contentType: false,
        processData: false,
        success: ((response) => {
            get_seguimiento();
            $('.texto_seguimiento').val('')
        }),
        error: ((err) => {
            console.log(err);
        })
    });

}

//Scroll de chat abajo
const scrollBottom = () => {
    $('.contenedor_chat').stop().animate({
        scrollTop: 20000
    }, 800);
}

$(document).ready(async () => {

    //Traer el seguimiento del expediente
    get_seguimiento();


    $('.enviar_seguimiento').click((e) => {
        post_seguimiento($('.texto_seguimiento').val());
    })

})