<?php
helper('html');

$ruta = '404';
require_once('app/Views/panel/base/head.php');
require_once('app/Views/panel/cuenta/menu.php');



?>



<section class="my-10">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 my-auto">
                <h1 class="display-1 text-bolder text-gradient text-danger">Error 404</h1>
                <h2>Página no disponible</h2>
                <p class="lead">
                    <?php if (ENVIRONMENT !== 'production') : ?>
                        <?= nl2br(esc($message)) ?>
                    <?php else : ?>
                        Lo sentimos, es posible que la pagina que quieres consultar no existe o no está disponible por el momento, por favor vuelve más tarde o intentalo de nuevo.
                    <?php endif ?>
                </p>
                <button type="button" class="btn bg-gradient-dark mt-4 icon-move-left" onclick="window.history.go(-1); return false;">
                    <i class="fas fa-arrow-left text-xs me-2" aria-hidden="true"></i>
                    Ir a la página anterior
                </button>
            </div>
            <div class="col-lg-4 ms-auto my-auto position-relative">
                <img class="w-100 position-relative" src="https://cdn.dribbble.com/users/1138875/screenshots/4669703/404_animation.gif" alt="404-error">
            </div>
        </div>
    </div>
</section>

<?php
require_once(('app/Views/panel/base/footer.php'));

?>