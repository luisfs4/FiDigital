<div class="container-fluid py-4">

    <div class="d-flex flex-row justify-content-end mb-4">

        <a href="/FiDigital/panel/sesiones/formulario" class="btn btn-danger mb-0 py-2 text-xs mx-1 nuevo_expediente" data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar un nuevo expediente"> Nuevo expediente <i class="fas fa-user-plus ms-2"></i></a>

    </div>

    <div class="row">
        <div class="col-xl-8 col-lg-7">

            <div class="card bg-info bg-gradient-info text-white px-4 py-3 d-block text-sm blur opacity-8 mb-3" role="alert"> <!-- Revisa si px-4 y py-2 son necesarios -->
                <strong><i class="fas fa-filter me-2"></i></strong> <span class="texto_filtro">Filtrando todos los expedientes</span></b>
            </div>

            <!-- Card nueva expediente 
            <div class="col-sm-4 mt-sm-0 mt-4">
                <div class="card border h-100">
                    <div class="card-body d-flex flex-column justify-content-center text-center">
                        <a href="javascript:;" class="nueva_expediente">
                            <i class="fa fa-plus text-primary text-sm mb-1" aria-hidden="true"></i>
                            <h6 class="text-primary"> Nueva expediente </h6>
                        </a>
                    </div>
                </div>
            </div>
            -->

            <div class="row contenedor_expedientes gx-xxl-3 gx-xl-2"> </div>

        </div>
        <div class="col-xl-4 col-lg-5 mt-lg-0 mt-4">
            <div class="card overflow-hidden">
                <div class="card-body p-3">
                    <div class="row mx-auto">
                        <div class="col-lg-12">
                            <div class="d-flex align-items-center">
                                <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                    <i class="fas fa-filter text-lg" aria-hidden="true"></i>
                                </div>
                                <div class="ms-3">
                                    <p class="text-sm mb-0 text-capitalize font-weight-bold">Filtrar</p>
                                    <h5 class="font-weight-bolder mb-0">
                                        <span class="cantidad_bitacora"></span>Resultados
                                    </h5>
                                </div>
                            </div>

                            <div class="row my-4">

                                <div class="form-group col-xxl-12 col-lg-3 col-sm-12">
                                    <label class="form-control-label">
                                        <i class="fas fa-user me-2"></i>Proveedor
                                    </label>
                                    <select class="form-control select2_init input_filtro" id="filtro_id_proveedor" multiple>
                                        <option value="">Selecciona una opción</option>
                                    </select>
                                </div>


                                <div class="form-group col-xxl-12 col-lg-3 col-sm-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="checkbox_buscar_archivados">
                                        <label class="form-check-label" for="checkbox_buscar_archivados">
                                            Buscar archivados<i class="fas fa-archive ms-2"></i>
                                        </label>
                                    </div>
                                </div>

                            </div>

                            <div class="row d-flex justify-content-end">
                                <div class="form-group text-end">
                                    <!-- Botón de búsqueda con estilo mejorado y etiqueta de texto -->
                                    <button class="btn me-2 btn-round bg-gradient-info mb-0 py-2 px-4 btn_buscar">
                                        <i class="fas fa-search me-2"></i>Buscar
                                    </button>
                                    <!-- Botón de reset con estilo mejorado y etiqueta de texto -->
                                    <button class="btn btn-round bg-gradient-danger mb-0 py-2 px-4 btn_reset">
                                        <i class="fas fa-eraser"></i>
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>

</div>
</div>

<script>
    window.addEventListener('load', () => {
        get_expedientes();

        $(document).on('click', '.archivar_expediente', (e) => {
            archivar_expediente($(e.currentTarget).attr('id_expediente'));
        });

        $(document).on('click', '.desarchivar_expediente', (e) => {
            desarchivar_expediente($(e.currentTarget).attr('id_expediente'));
        });

        $(document).on('click', '.btn_buscar', (e) => {
            get_expedientes();
        });

        //cargar_proveedores();


    })


    const get_expedientes = async () => {

        let $contenedor_expedientes = $('.contenedor_expedientes');
        $contenedor_expedientes.addClass('is-loading');

        let expedientes = await $.ajax({
            url: '/FiDigital/panel/sesiones/expedientes/get_expedientes',
            type: 'POST',
            data: {
                filtro_archivados: $('#checkbox_buscar_archivados').prop('checked'),
            }
        });

        //generar_texto_filtro();
        $contenedor_expedientes.empty();

        await expedientes.forEach(async (e, i) => {

            let punto = JSON.parse(e.puntos)[0];

            let span_archivada = '';
            let btn_archivar = `
                <button class="btn btn-sm px-3 btn-outline-danger mb-0 ms-2 archivar_expediente" id_expediente="${e.id_expediente}">
                    <i class="fas fa-archive" style="font-size: 0.8rem;"></i>
                </button>`;

            if (e.archivado == 1) {
                span_archivada = `
                    <span class="badge bg-danger ms-1">
                        <i class="fas fa-exclamation-triangle me-2"></i>Archivada
                    </span>
                `;

                btn_archivar = `
                    <button class="btn btn-danger mb-0 desarchivar_expediente"  id_expediente="${e.id_expediente}" data-bs-toggle="tooltip" data-bs-placement="top" title="Desarchivar ruta">
                        <i class="fas fa-trash-restore"></i>
                    </button>`;
            }

            let span_contador_rutas = '';
            if (e.cantidad_rutas > 0) {
                span_contador_rutas = `
                    <span class="badge bg-${e.cantidad_rutas == 0 ? 'light' : 'secondary'} me-1 mb-2 cursor-pointer ver_rutas" id_proveedor="${e.id_proveedor}">${e.cantidad_rutas ?? 'Sin'} rutas</span>
                `;
            }

            let span_contador_archivada = '';
            if (e.cantidad_rutas_archivado > 0) {
                span_contador_archivada = `
                    <span class="badge bg-${e.cantidad_rutas_archivado == 0 ? 'light' : 'danger'} me-1 cursor-pointer ver_rutas" id_proveedor="${e.id_proveedor}">${e.cantidad_rutas_archivado ?? 'Sin'} archivadas</span>
                `;
            }

            await $contenedor_expedientes.append(`
                <div class="col-xxl-4 col-xl-6 col-lg-6 mt-sm-0 mt-4 mb-4">
                    <div class="card overflow-hidden shadow h-100">

                        <div class="card-header p-3 pb-0">
                            <h5 class="font-weight-bolder mb-0 text-dark">
                                <i class="fas fa-folder me-2"></i> ${punto.jerarquia} - ${punto.nombre_punto}
                            </h5>
                        </div>

                        <div class="card-body p-3 pb-0">
                            <div class="mb-3">
                                <span class="badge bg-primary me-1 mb-1">expediente #${e.id_expediente}</span>
                                ${span_contador_rutas}
                                ${span_contador_archivada}
                                ${span_archivada}
                            </div>
                            <p class="text-muted text-xs mb-1">
                                <i class="fas fa-building me-2"></i><b style="white-space: nowrap;">${e.direccion ?? 'No disponible'}</b>
                            </p>
                            <p class="text-muted text-xs mb-2">
                                <i class="fas fa-hands-helping me-1"></i><b style="white-space: nowrap;">${e.programa ?? 'No disponible'}</b>
                            </p>
                            <p class="text-muted text-xs mb-1">
                                Proveedor: <b style="white-space: nowrap;">${e.razon_social ?? 'No disponible'}</b>
                                 <a class="text-danger" href="tel:${e.telefono ?? ''}" style="white-space: nowrap;"><i class="fas fa-phone-alt ms-2 me-1"></i>${e.telefono ?? 'No disponible'}</a>
                            </p>
                            <p class="text-muted text-xs">Ult. modificación: <b style="white-space: nowrap;">${e.updated_at ?? e.created_at}</b></p>
                        </div>

                        <div class="card-footer p-3 pt-0">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <p class="mb-2 text-sm"><i class="fas fa-user me-2"></i> ${e.usuario}</p>
                                </div>
                                <div class="d-flex ms-auto">
                                    <button class="btn btn-sm btn-outline-danger mb-0 ms-auto" hidden>Detalles</button>
                                    ${btn_archivar}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                `);
        })

        await $contenedor_expedientes.append(`
            <div class="col-xxl-4 col-xl-6 col-lg-6 mt-sm-0 mt-4 mb-4">
                <div class="border-dashed bg-gray-100 rounded border-primary d-flex align-items-center h-100 py-5">
                    <div class="card-body d-flex flex-column justify-content-center text-center">
                        <a href="/FiDigital/panel/sesiones/formulario" class="nuevo_expediente">
                            <i class="fa fa-plus text-primary text-sm mb-1" aria-hidden="true"></i>
                            <h6 class="text-primary"> Nuevo expediente </h6>
                        </a>
                    </div>
                </div>
            </div>
            `);

        $contenedor_expedientes.removeClass('is-loading');

    }


    const archivar_expediente = async (id_proveedor_expediente, id_proveedor, id_origen, id_destino, nombre_expediente = '') => {
        await $.ajax({
            url: '/panel/proveedores/expedientes/archivar',
            type: 'POST',
            data: {
                id_expediente
            },
            success: (respuesta) => {
                Swal.fire('¡Archivada!', `La expediente <b>${nombre_expediente}</b> y sus ${respuesta.rutas_archivadas} rutas han sido archivadas con éxito`, 'success').then(() => {
                    get_expedientes();
                })
            },
            error: (error, ee, eee) => {
                console.log(error, ee, eee)
                Swal.showValidationMessage(error.responseJSON.message ?? 'Error desconocido')
                Swal.hideLoading()
            }
        });
    };

    const desarchivar_expediente = async (id_proveedor_expediente, id_proveedor, id_origen, id_destino, nombre_expediente = '') => {
        await $.ajax({
            url: '/panel/proveedores/expedientes/desarchivar',
            type: 'POST',
            data: {
                id_expediente
            },
            success: (respuesta) => {
                Swal.fire('¡Desarchivada!', `La expediente <b>${nombre_expediente}</b> y sus ${respuesta.rutas_desarchivadas} rutas han sido desarchivadas con éxito`, 'success').then(() => {
                    get_expedientes();
                })
            },
            error: (error, ee, eee) => {
                console.log(error, ee, eee)
                Swal.showValidationMessage(error.responseJSON.message ?? 'Error desconocido')
                Swal.hideLoading()
            }
        });
    };
</script>