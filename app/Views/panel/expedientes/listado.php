<div class="container-fluid pt-2 pb-4">
    <div class="row">

        <div class="btn btn-warning ms-auto me-4 w-auto text-white bg-gradient-danger">
            <a href="/panel/expedientes/formulario" class=" text-white">
                Nuevo registro&nbsp;&nbsp;<div class="fa fa-plus-circle"></div>
            </a>
        </div>

    </div>

    <div class="row mt-4">
        <div class="col-xxl-12 col-xl-12 order-xxl-0 col-12">
            <div class="card">
                <div class="card-header p-3">
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="mb-0">Expedientes</h6>
                        </div>
                        <div class="col-md-6 d-flex justify-content-end align-items-center">
                            <small>Filtrando todos los expedientes</small>
                        </div>
                    </div>
                    <hr class="horizontal dark mb-0">
                </div>
                <div class="card-body p-3 pt-0">
                    <table class="table align-items-center justify-content-center mb-0 tabla_expedientes">
                        <thead>
                            <tr>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Punto</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Sesión</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Últ actualización</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Estatus</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-6">Opciones</th>
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
                            <div class="row mx-auto" >
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
                                            <input type="date" class="form-control fechas_expedientes input_filtro">
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

<div class="modal modal_expediente fade" data-bs-focus="false" tabindex="-1" role="dialog" aria-labelledby="modal-form" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-body p-0">

            </div>
        </div>
    </div>
</div>
</div>

<script>
    window.addEventListener('load', () => {
        var ctx1 = document.getElementById("chart-line").getContext("2d");

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);

        gradientStroke1.addColorStop(1, 'rgba(33,82,255,0.1)');
        gradientStroke1.addColorStop(0.2, 'rgba(33,82,255,0.0)');
        gradientStroke1.addColorStop(0, 'rgba(33,82,255,0)'); //purple colors

        new Chart(ctx1, {
            type: "line",
            data: {
                labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: "Tasks",
                    tension: 0.3,
                    pointRadius: 2,
                    pointBackgroundColor: "#2152ff",
                    borderColor: "#2152ff",
                    borderWidth: 2,
                    backgroundColor: gradientStroke1,
                    data: [40, 45, 42, 41, 40, 43, 40, 42, 39],
                    maxBarThickness: 6,
                    fill: true
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                        },
                        ticks: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                        },
                        ticks: {
                            color: '#252f40',
                            padding: 10
                        }
                    },
                    y: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#9ca2b7'
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#9ca2b7'
                        }
                    },
                },
            },
        });

    })
</script>