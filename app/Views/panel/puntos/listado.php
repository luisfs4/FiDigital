<div class="container-fluid pt-2 pb-4">
    <div class="row mt-4">
        <div class="col-xxl-9 col-xl-12 order-xxl-0 mb-2">
            <div class="card">
                <div class="card-header p-3">
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="mb-0">Puntos</h6>
                        </div>
                        <div class="col-md-6 d-flex justify-content-end align-items-center">
                            <small class="badge bg-gradient-danger">Filtrando todos los puntos</small>
                        </div>
                    </div>
                    <hr class="horizontal dark mb-0">
                </div>
                <div class="card-body p-3 pt-0">
                    <table class="table align-items-center justify-content-center mb-0 tabla_puntos">
                        <thead>
                            <tr>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Nombre
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Sesion
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Estatus
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Autorizado
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Pagado
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Remanente
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Dirección
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Programas
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-6"></th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                            <tr>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Nombre
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Sesion
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Estatus
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Autorizado
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Pagado
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Remanente
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Dirección
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Programas
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-6"></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-xxl-3 col-xl-12 order-first order-xxl-1 mb-2">
            <div class="card overflow-hidden">
                <div class="card-body p-3">
                    <div class="d-flex mb-4"><!-- Titulo -->
                        <div
                            class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                            <i class="ni ni-ui-04 text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                        <div class="ms-3">
                            <p class="text-sm mb-0 text-capitalize font-weight-bold">Filtrar</p>
                            <h5 class="font-weight-bolder mb-0">
                                N resultados
                            </h5>
                        </div>
                    </div>

                    <div class="row"><!-- Filtros -->
                        <div class="form-group col-xxl-12 col-lg-3 col-md-4 col-sm-6">
                            <label class="form-control-label">Rango de fechas</label>
                            <input type="date" class="form-control fechas_puntos input_filtro">
                        </div>

                        <div class="form-group col-xxl-12 col-lg-3 col-md-4 col-sm-6">
                            <label class="form-control-label">Estatus</label>
                            <select class="form-control select2_init input_filtro" name="id_estatus">
                                <option value="">Selecciona una opción</option>
                            </select>
                        </div>

                        <div class="form-group col-xxl-12 col-lg-3 col-md-4 col-sm-6">
                            <label class="form-control-label">Visitaduria</label>
                            <select class="form-control select2_init input_filtro"
                                name="id_visitaduria">
                                <option value="">Selecciona una opción</option>
                            </select>
                        </div>

                        <div class="form-group col-xxl-12 col-lg-3 col-md-4 col-sm-6">
                            <label class="form-control-label">Abogado</label>
                            <select class="form-control select2_init input_filtro" name="id_abogado">
                                <option value="">Selecciona una opción</option>
                            </select>
                        </div>
                    </div>

                    <div class="row justify-content-end"><!-- Botones -->
                        <div class="col-auto form-group text-end">
                            <button
                                class="btn btn-round bg-gradient-success mb-0 py-2 px-4 btn_buscar">
                                <i class="fas fa-filter"></i>
                                <span class="ms-2 d-none d-sm-inline d-xxl-none">
                                    Aplicar filtros
                                </span>
                            </button>
                        </div>

                        <div class="col-auto form-group text-end">
                            <button
                                class="btn btn-round bg-gradient-danger mb-0 py-2 px-4 btn-borrar">
                                <i class="fas fa-eraser"></i>
                                <span class="ms-2 d-none d-sm-inline d-xxl-none">
                                    Borrar filtros
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>