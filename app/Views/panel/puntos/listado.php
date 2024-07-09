<div class="container-fluid pt-2 pb-4">
    <div class="row mt-4">
        <div class="col-xl-12 order-first mb-2">
            <div class="card overflow-hidden sticky-top">
                <div class="card-body p-3">
                    <div class="d-flex mb-4"><!-- Titulo -->
                        <div
                            class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                            <i class="ni ni-ui-04 text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                        <div class="ms-3">
                            <p class="text-sm mb-0 text-capitalize font-weight-bold">Filtrar</p>
                            <h5 class="font-weight-bolder mb-0 total_registros">
                                N resultados
                            </h5>
                        </div>
                    </div>

                    <div class="row"><!-- Filtros -->
                        <div class="form-group col-lg-3 col-md-4 col-sm-6">
                            <label class="form-control-label">Estatus</label>
                            <select class="form-control select2_init input_filtro" 
                                    id="filtro_estatus" name="id_estatus">
                                <option value="">Selecciona una opción</option>
                                <option value="creado">Creado</option>
                                <option value="procesado">Procesado</option>
                                <option value="pagado">Pagado</option>
                                <option value="completo">Completo</option>
                                <option value="completo con errores">Completo con errores</option>
                            </select>
                        </div>
                        
                        <div class="form-group col-lg-3 col-md-4 col-sm-6">
                            <label class="form-control-label">Sesiones</label>
                            <select class="form-control select2_init input_filtro" 
                                    id="filtro_sesiones" name="numero_sesion">
                                <option value="">Selecciona una opción</option>
                                <?php foreach ($sesiones as $sesion) : ?>
                                    <option value="<?= $sesion->numero_sesion ?>">
                                        <?= $sesion->numero_sesion ?> - 
                                        <?= $sesion->nombre_sesion ?>
                                    </option>
                                <?php endforeach ?> 
                            </select>
                        </div>
                        
                        <div class="form-group col-lg-3 col-md-4 col-sm-6">
                            <label class="form-control-label">Direcciones</label>
                            <select class="form-control select2_init input_filtro" 
                                    id="filtro_direcciones" name="id_direcciones">
                                <option value="">Selecciona una opción</option>
                                <?php foreach ($direcciones as $direccion) : ?>
                                    <option value="<?= $direccion->id_direccion ?>">
                                        <?= $direccion->direccion ?>
                                    </option>
                                <?php endforeach ?> 
                            </select>
                        </div>
                        
                        <div class="form-group col-lg-3 col-md-4 col-sm-6">
                            <label class="form-control-label">Programas</label>
                            <select class="form-control select2_init input_filtro" 
                                    id="filtro_programas" name="id_programas">
                                <option value="">Selecciona una opción</option>
                                <?php foreach ($programas as $programa) : ?>
                                    <option value="<?= $programa->id_programa ?>">
                                        <?= $programa->programa ?>
                                    </option>
                                <?php endforeach ?> 
                            </select>
                        </div>
                    </div>

                    <div class="row justify-content-end"><!-- Botones -->
                        <div class="col-auto form-group text-end">
                            <button
                                class="btn btn-round bg-gradient-success mb-0 py-2 px-4 btn_buscar">
                                <i class="fas fa-filter"></i>
                                <span class="ms-2 d-none d-sm-inline">
                                    Aplicar filtros
                                </span>
                            </button>
                        </div>

                        <div class="col-auto form-group text-end">
                            <button
                                class="btn btn-round bg-gradient-danger mb-0 py-2 px-4 btn_borrar">
                                <i class="fas fa-eraser"></i>
                                <span class="ms-2 d-none d-sm-inline">
                                    Borrar filtros
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-12 mb-2">
            <div class="card">
                <div class="card-header p-3">
                    <div class="row">
                        <div class="col-md-4">
                            <h6 class="mb-0">Puntos</h6>
                        </div>
                        <div class="col-md-8 d-flex justify-content-end align-items-center">
                            <small class="badge bg-gradient-danger texto_filtros text-wrap">Filtrando todos los puntos</small>
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
                                    Dirección
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Programas
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Remanente
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Estatus
                                </th>
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
                                    Dirección
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Programas
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Remanente
                                </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                    Estatus
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>