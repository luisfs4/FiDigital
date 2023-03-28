<div class="card shadow-lg mx-4 mt-4">
    <div class="card-body p-3">
        <div class="row gx-4">
            <div class="col-auto">
                <div class="icon icon-shape bg-gradient-danger shadow text-center border-radius-md">
                    <i class="ni ni-folder-17 text-lg opacity-10" aria-hidden="true"></i>
                </div>
            </div>
            <div class="col-auto my-auto">
                <div class="h-100">
                    <h5 class="mb-1">
                        Fecha del expediente: <?= $expediente->fecha_pago ?>
                    </h5>
                    <p class="mb-0 font-weight-bold text-sm">
                        Última interacción: <?= $expediente->ultima_modificacion ?>
                    </p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">

            </div>
        </div>
    </div>
</div>
<div class="container-fluid py-4">
    <div class="row">
        <div class="col-xl-5 col-md-5 col-12">
            <div class="card overflow-x-hidden mb-4 card_expediente">

            </div>
        </div>
        <div class="col-xl-7 col-md-7 col-12">
            <div class="card blur shadow-blur max-height-vh-70">
                <div class="card-header shadow-lg">
                    <div class="row">
                        <div class="col-lg-10 col-8">
                            <div class="d-flex align-items-center">
                                <div class="icon icon-shape bg-gradient-danger shadow text-center border-radius-md">
                                    <i class="ni ni-chat-round text-lg opacity-10" aria-hidden="true"></i>
                                </div>
                                <div class="ms-3">
                                    <h6 class="mb-0 d-block">Seguimientos</h6>
                                    <span class="text-sm text-dark opacity-8">Última actividad: </span>
                                    <span class="text-sm text-dark opacity-8 ult_act_seguimiento"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body overflow-auto overflow-x-hidden contenedor_chat">

                </div>
                <div class="card-footer d-block">
                    <div class="align-items-center">
                        <div class="d-flex">
                            <div class="input-group">
                                <input type="text" class="form-control texto_seguimiento" placeholder="Escribe aquí...">
                            </div>
                            <div class="btn bg-gradient-primary mb-0 ms-2 enviar_seguimiento">
                                <i class="ni ni-send"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    const id_expediente = <?= $expediente->id_expediente ?>

    window.addEventListener('load', ()=>{
        card_expediente(id_expediente);
    })
</script>