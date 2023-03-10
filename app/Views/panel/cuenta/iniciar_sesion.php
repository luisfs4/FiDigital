<main class="main-content  mt-0">
    <section>
        <div class="page-header min-vh-75">
            <div class="container">
                <div class="row">
                    <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                        <div class="card card-plain mt-10">
                            <div class="card-header pb-0 text-left bg-transparent">
                                <h3 class="font-weight-bolder text-warning text-gradient">Bienvenido</h3>
                                <p class="mb-0">Ingresa tu correo y contraseña para iniciar sesión</p>
                            </div>
                            <div class="card-body">
                                <form role="form" class="login_form">
                                    <label>Correo</label>
                                    <div class="mb-3">
                                        <input type="email" required class="form-control correo" placeholder="usuario@zapopan.gob.mx" aria-label="Email" aria-describedby="email-addon">
                                    </div>
                                    <label>Contraseña</label>
                                    <div class="mb-3">
                                        <input type="password" required class="form-control contrasena" placeholder="**********" aria-label="Password" aria-describedby="password-addon">
                                    </div>
                                    <div class="text-center">
                                        <button type="button" class="btn bg-gradient-warning w-100 mt-4 mb-0 btn_acceder">Iniciar sesión</button>
                                    </div>
                                </form>
                            </div>
                            <div class="card-footer text-center pt-0 px-lg-2 px-1">
                                <p class="mb-4 text-sm mx-auto">
                                    ¿Olvistaste tu contraseña?
                                    <a href="javascript:;" class="text-warning text-gradient font-weight-bold">&nbsp;Recupérala aquí</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="oblique position-absolute top-0 h-100 me-n8">
                            <div class="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 d-lg-block d-none z-index-0 ms-n6" style="background-image:url('<?= base_url('imagenes/mariposa_cisz.webp') ?>')"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>