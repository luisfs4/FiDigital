<div class="container-fluid">
    <div class="page-header min-height-300 border-radius-xl mt-4" style="background-image: url('https://servicios.zapopan.gob.mx:8000/wwwportal/publicfiles/2021-10/foto_cisz_marcosguillen.jpg'); background-position-y: 50%;">
        <span class="mask bg-gradient-warning opacity-6"></span>
    </div>
    <div class="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
        <div class="row gx-4">
            <div class="col-auto">
                <div class="avatar avatar-xl position-relative">
                    <img src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/102015/sello_zapopan.png?itok=RQk-PKf4" alt="profile_image" class="w-100 border-radius-lg shadow-sm">
                </div>
            </div>
            <div class="col-auto my-auto">
                <div class="h-100">
                    <h5 class="mb-1">
                        <?= $_SESSION['nombres'] . " " . $_SESSION['ape_paterno'] . " " . $_SESSION['ape_materno'] ?>
                    </h5>
                    <p class="mb-0 font-weight-bold text-sm">
                        <?= $_SESSION['direccion'] ?>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container-fluid py-4">
    <div class="row px-4">
        <div class="col-12 col-xl-4">
            <div class="card h-100">
                <div class="card-header">
                    <h5>Información</h5>
                </div>
                <div class="card-body p-3">
                    <ul class="list-group">
                        <li class="list-group-item border-0 ps-0 pt-0 text-sm"><strong class="text-dark">Nombre completo:</strong> &nbsp; <?= $_SESSION['nombres'] . " " . $_SESSION['ape_paterno'] . " " . $_SESSION['ape_materno'] ?></li>
                        <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">Teléfono:</strong> &nbsp; <?= $_SESSION['telefono'] ?></li>
                        <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">Email:</strong> &nbsp; <?= $_SESSION['correo'] ?></li>
                    </ul>
                </div>
            </div>

        </div>

        <div class="col-xl-8 col-sm-12">
            <div class="card" id="password">
                <div class="card-header">
                    <h5>Cambiar contraseña</h5>
                </div>
                <form class="card-body pt-0 form_cambiar_contrasena">
                    <label class="form-label">Contraseña actual</label>
                    <div class="form-group">
                        <input class="form-control cactual" type="password" placeholder="Escribe tu contraseña acutal..." required onfocus="focused(this)" onfocusout="defocused(this)">
                    </div>
                    <label class="form-label">Nueva</label>
                    <div class="form-group">
                        <input class="form-control contrasena_1" type="password" placeholder="Escribe tu nueva contraseña..." required onfocus="focused(this)" onfocusout="defocused(this)" data-parsley-maxlength="16" data-parsley-minlength="8" data-parsley-uppercase="1" data-parsley-lowercase="1" data-parsley-number="1" data-parsley-special="1">
                    </div>
                    <label class="form-label">Confirma tu contraseña</label>
                    <div class="form-group">
                        <input class="form-control contrasena_2" type="password" placeholder="Escribe nuevamente tu nueva contraseña..." required onfocus="focused(this)" onfocusout="defocused(this)" data-parsley-maxlength="16" data-parsley-minlength="8" data-parsley-uppercase="1" data-parsley-lowercase="1" data-parsley-number="1" data-parsley-special="1" data-parsley-equalto=".contrasena_1" >
                    </div>
                    <h5 class="mt-5">Requerimientos</h5>
                    <p class="text-muted mb-2">
                        Tu contraseña debe de contener:
                    </p>
                    <ul class="text-muted ps-4 mb-0 float-start requerimientos_contrasena">
                        <li data-val-regex="^.{8,16}$">
                            <span class="text-sm">Debe contener 8-16 caracteres de longitud</span>
                        </li>
                        <li data-val-regex="[A-Z]">
                            <span class="text-sm">Al menos 1 mayuscula</span>
                        </li>
                        <li data-val-regex="[a-z]">
                            <span class="text-sm">Al menos 1 minuscula</span>
                        </li>
                        <li data-val-regex="[0-9]">
                            <span class="text-sm">Al menos 1 número</span>
                        </li>
                        <li data-val-regex="[^A-Za-z0-9_]">
                            <span class="text-sm">Al menos 1 caracter especial</span>
                        </li>
                    </ul>

                    <button class="btn bg-gradient-dark btn-sm float-end mt-7 mb-0 btn_cambiar_contrasena">Actualizar contraseña</button>
                </form>
            </div>
        </div>
    </div>
</div>