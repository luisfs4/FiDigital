<footer class="footer py-5">
    <div class="container">
        <div class="row">
            <div class="col-8 mx-auto text-center mt-1">
                <p class="mb-0 text-secondary">
                    Copyright © 
                    <script>
                        document.write(new Date().getFullYear())
                    </script>
                </p>
            </div>
        </div>
    </div>
</footer>


</div>

<?php
# ------------------------------------------------
# Javascript
# ------------------------------------------------

// Libreria JQUERY 
echo script_tag('https://code.jquery.com/jquery-3.5.1.min.js');

//Libreria JQUERY UI
echo script_tag('https://code.jquery.com/ui/1.13.1/jquery-ui.min.js');

//Dashboard
echo script_tag(base_url('public/vendors/boostrap_lib/js/core/popper.min.js'));
echo script_tag(base_url('public/vendors/boostrap_lib/js/core/bootstrap.min.js'));
echo script_tag(base_url('public/vendors/boostrap_lib/js/plugins/perfect-scrollbar.min.js'));
echo script_tag(base_url('public/vendors/boostrap_lib/js/plugins/smooth-scrollbar.min.js'));
echo script_tag(base_url('public/vendors/boostrap_lib/js/plugins/chartjs.min.js'));

// Libreria SWEET ALERT
echo script_tag('public/js/librerias/sweetalert2.all.min.js');

// Libreria Intro JS
echo script_tag('https://unpkg.com/intro.js/minified/intro.min.js');

// Libreria Select2
echo script_tag('https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js');

// JS general
echo script_tag('public/js/app.js');

//Libreria boostrap_lib
echo script_tag(base_url('public/vendors/boostrap_lib/js/dashboard.min.js?v=1.0.6'));

//Libreria Parsley
echo script_tag(base_url('public/vendors/parsley/parsley.min.js'));
echo script_tag(base_url('public/vendors/parsley/es.js'));
?>

<script src="<?= base_url('public/js/vistas/cuenta.js'); ?>"></script>

<script>
    $(document).ready(() => {

        $('.guia_regulacion').on('click', () => {
            let guia_general = introJs();
            guia_general.setOptions({
                showProgress: true,
                showBullets: false,
                "nextLabel": 'Siguiente',
                "prevLabel": 'Atras',
                "doneLabel": 'Terminar',
                steps: [{
                    element: document.querySelector('#notification'),
                    title: '<small class="bold"> ¡ Hola <?= isset($nombres) ? $nombres : 'Luis' ?>! </small>',
                    intro: "<small> Esta es una guia rápida de cómo llenar un formulario de regulaciones </small>",
                    position: 'bottom',
                    disableInteraction: true
                }, ]
            }).start();

            guia_general.onstart(function() {
                //Codigo para cuando empiece
                $('.introjs-button').addClass('btn bg-gradient-info')
            });

            guia_general.oncomplete(function() {
                //Codigo para cuando termine la guia
            });

            guia_general.onexit(function() {
                //Codigo para cuando abandone la guia
            });
        })

    })
</script>
<script>
    var win = navigator.platform.indexOf('Win') > -1;
    if (win && document.querySelector('#sidenav-scrollbar')) {
        var options = {
            damping: '0.5'
        }
        Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
    }
</script>
</body>

</html>