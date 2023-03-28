
const crear_sesion = async (json_editar = []) => {

    disableBtn('.btn_nueva_sesion');

    let titulo = 'Nueva sesión';
    let btn_confirmar = `Crear sesión<i class="fas fa-arrow-right ms-2"></i>`;
    let titulo_success = '¡Creada!';
    let texto_success = 'La sesión se añadió con éxito';

    if (json_editar.length != 0) {
        titulo = 'Editar sesión';
        btn_confirmar = `Guardar sesión<i class="fas fa-arrow-right ms-2"></i>`
        titulo_success = 'Guardada!';
        texto_success = 'La sesión se guardó con éxito';
    }

    Swal.fire({ //Crar una sesión nueva
        title: titulo,
        buttonsStyling: false,
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: btn_confirmar,
        cancelButtonText: `Cancelar`,
        customClass: {
            confirmButton: 'btn bg-gradient-danger btn-md mx-2 move-icon-left',
            cancelButton: 'btn btn-gradient-danger btn-md mx-2 move-icon-left',
            loader: 'custom-loader'
        },
        html: `
        <form class="w-100 m-auto row p-2 text-start form_sesion" data-validate="parsley">
            <div class="col-lg-4">
                <div class="form-group">
                    <label class="form-control-label"># Sesión:</label>
                    <input required class="input_sesion form-control" name="numero_sesion" type="number" placeholder="43">
                    <input type="hidden" class="input_sesion form-control" name="id_sesion">
                </div>
            </div>
            <div class="col-lg-8">
                <div class="form-group">
                    <label class="form-control-label"><i class="fas fa-laptop-house"></i> Nombre de la sesión:</label>
                    <input required class="input_sesion form-control" name="nombre_sesion" placeholder="Escribe el nombre...">
                    <input type="hidden" class="input_sesion form-control" name="id_sesion">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-calendar-alt"></i> Fecha de la sesión:</label>
                    <input type="date" name="fecha_sesion" class="input_sesion form-control input-lg p-2">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label class="form-control-label"><i class="fas fa-folder-open"></i> Tipo:</label>
                    <select required name="tipo" class="input_sesion form-control input-lg p-2">
                        <option>Ordinaria</option>
                        <option>Extraordinaria</option>
                    </select>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="form-group">
                    <label class="form-control-label"><i class="far fa-comment-dots"></i> Observaciones:</label>
                    <textarea name="observaciones" class="input_sesion form-control input-lg p-2" placeholder="Describe tus observaciones..."></textarea>
                </div>
            </div>
        </form>
        `,
        focusConfirm: false,
        loaderHtml: '<div class="spinner-border text-info text-gradient"></div>',
        preConfirm: function () {
            Swal.showLoading() //Boton con animación de carga

            //Validar con parsley el formulario
            if (!$(Swal.getPopup().querySelector('.form_sesion')).parsley().isValid()) {
                $(Swal.getPopup().querySelector('.form_sesion')).parsley().validate()
                Swal.showValidationMessage(`Por favor llena correctamente los campos`)
            }

            return {
                id_sesion: Swal.getPopup().querySelector('.input_sesion[name="id_sesion"]').value.trim(),
                numero_sesion: Swal.getPopup().querySelector('.input_sesion[name="numero_sesion"]').value.trim(),
                nombre_sesion: Swal.getPopup().querySelector('.input_sesion[name="nombre_sesion"]').value.trim(),
                fecha_sesion: Swal.getPopup().querySelector('.input_sesion[name="fecha_sesion"]').value,
                tipo: Swal.getPopup().querySelector('.input_sesion[name="tipo"]').value,
                observaciones: Swal.getPopup().querySelector('.input_sesion[name="observaciones"]').value.trim()
            }
        },
        willOpen: (e, ee) => {
            if (json_editar) {

                for (const key of Object.keys(json_editar)) {
                    if (
                        key === 'created_at' ||
                        key === 'created_by' ||
                        key === 'updated_by' ||
                        key === 'updated_at'
                    ) continue;

                    const input = e.querySelector(`[name="${key}"]`);
                    
                    if (input) {
                        input.value = json_editar[key];
                    }
                }
            }
        },
        didOpen: () => {
            //Iniciar select2 para las sesiones
            $('.select2_swal').select2({
                placeholder: "Selecciona una opción",
            });
        },
        onDismiss: () => {

        }
    }).then(async (result) => {

        if (result.isConfirmed) { //Validar clic en boton de aceptar
            await $.ajax({
                url: '/panel/sesiones/post_sesion',
                data: {
                    id_sesion: result.value.id_sesion,
                    numero_sesion: result.value.numero_sesion,
                    nombre_sesion: result.value.nombre_sesion,
                    fecha_sesion: result.value.fecha_sesion,
                    tipo: result.value.tipo,
                    observaciones: result.value.observaciones
                },
                dataType: 'JSON',
                type: 'POST',
                success: function (respuesta, text, xhr) {

                    if (xhr.status == 200) {
                        Swal.fire({
                            title: titulo_success,
                            text: texto_success,
                            icon: 'success',
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: "btn bg-gradient-danger me-3",
                                cancelButton: "btn bg-gradient-secondary"
                            }
                        });

                        return true;
                    }
                },
                error: (err, texto) => {
                    error_ajax(JSON.parse(err.responseText)['message']);
                }
            }); // Fin ajax

        }
    });

    enableBtn('.btn_nueva_sesion');
};

const editar_sesion = async (id_sesion) => {

    await $.ajax({
        url: '/panel/sesiones/sesiones/get_by_ajax',
        data: {
            id_sesion
        },
        dataType: 'JSON',
        type: 'POST',
        success: function (respuesta, text, xhr) {

            if (xhr.status == 204) {
                Swal.fire({
                    title: '¡Hay un problema!',
                    text: 'No se encontraron sesiones',
                    icon: 'error',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: "btn bg-gradient-danger me-3",
                        cancelButton: "btn bg-gradient-secondary"
                    }
                });
            } else if (xhr.status == 200) {
                crear_sesion(respuesta[0]);
            }
        }
    }); // Fin ajax
}

$(()=>{

    //Si dan click en el boton de nueva sesión
    $('.btn_nueva_sesion').click((e)=>{
        crear_sesion();
    })
    
})