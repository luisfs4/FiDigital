<div class="container-fluid pt-2 pb-4">
    <div class="row">
        
        <div class="btn btn-warning ms-auto me-4 w-auto text-white bg-gradient-danger btn_crear_proveedor">
            <a class="text-white" href="<?= base_url("/panel/solicitudes/formulario"); ?>">
                Nueva solicitud&nbsp;&nbsp;<div class="fa fa-plus-circle"></div>
            </a>
        </div>

    </div>

    <div class="row mt-4">
        <div class="col-xxl-12 col-xl-12 order-xxl-0 col-12">
            <div class="card">
                <div class="card-header p-3">
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="mb-0 ms-4">Solicitudes <span class="nombre_sesion"></span></h6>
                        </div>
                    </div>
                    <hr class="horizontal dark mb-0">
                </div>
                <div class="card-body p-3 pt-0">
                    <table class="table align-items-center justify-content-center mb-0 tabla_solicitudes">
                        <thead>
                            <tr>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Direccíon</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">#</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Admisión/Prevención</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Descripción</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Programa</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tipo de Adquisión</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Proveedor</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Monto</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Presupuesto</th>

                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-xxl-4 col-xl-12 col-12 order-first order-xxl-1 mt-4 mt-xl-0" hidden>
            <div class="row mx-auto">
                <div class="col-xxl-12 col-xl-4">
                    <div class="card overflow-hidden">
                        <div class="card-header p-3 pb-0">
                            <div class="d-flex align-items-center">
                                <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                                    <i class="ni ni-calendar-grid-58 text-lg opacity-10" aria-hidden="true"></i>
                                </div>
                                <div class="ms-3">
                                    <p class="text-sm mb-0 text-capitalize font-weight-bold">Historico</p>
                                    <h5 class="font-weight-bolder mb-0">
                                        3
                                    </h5>
                                </div>
                                <div class="progress-wrapper ms-auto w-25">
                                    <div class="progress-info">
                                        <div class="progress-percentage">
                                            <span class="text-xs font-weight-bold">60%</span>
                                        </div>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar bg-gradient-info w-60" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body mt-3 p-0">
                            <div class="chart">
                                <canvas id="chart-line" class="chart-canvas" style="display: block; box-sizing: border-box; height: 100px; width: 591.3px;" width="529" height="89"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-12 col-xl-8">
                    <div class="card overflow-hidden mt-xxl-4 mt-xl-0 mb-4">
                        <div class="card-body p-3">
                            <div class="row mx-auto">
                                <div class="col-lg-12">
                                    <div class="d-flex">
                                        <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                                            <i class="ni ni-ui-04 text-lg opacity-10" aria-hidden="true"></i>
                                        </div>
                                        <div class="ms-3">
                                            <p class="text-sm mb-0 text-capitalize font-weight-bold">Filtrar</p>
                                            <h5 class="font-weight-bolder mb-0">
                                                N resultados
                                            </h5>
                                        </div>
                                    </div>

                                    <div class="row w-100 mt-4">
                                        <div class="form-group col-lg-12 col-sm-12">
                                            <label class="form-control-label">Rango de fechas</label>
                                            <input type="date" class="form-control fechas_sesionesput_filtro">
                                        </div>

                                        <div class="form-group col-xxl-6 col-lg-4 col-sm-12">
                                            <label class="form-control-label">Estatus</label>
                                            <select class="form-control select2_init input_filtro" name="id_estatus">
                                                <option value="">Selecciona una opción</option>
                                            </select>
                                        </div>

                                        <div class="form-group col-xxl-6 col-lg-4 col-sm-6">
                                            <label class="form-control-label">Visitaduria</label>
                                            <select class="form-control select2_init input_filtro" name="id_visitaduria">
                                                <option value="">Selecciona una opción</option>
                                            </select>
                                        </div>

                                        <div class="form-group col-xxl-6 col-lg-4 col-sm-6">
                                            <label class="form-control-label">Abogado</label>
                                            <select class="form-control select2_init input_filtro" name="id_abogado">
                                                <option value="">Selecciona una opción</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div class="row">
                                        <div class="form-group text-end ms-auto">
                                            <button class="btn btn-round bg-gradient-danger mb-0 py-2 px-4 btn_buscar">Aplicar filtros</button>
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
</div>