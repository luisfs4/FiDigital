<footer class="footer pt-3">
	<div class="container-fluid text-center">
		<div class="row align-items-center justify-content-center">
			<div class="col-lg-3 col-md-4 col-6 mb-3">
				<img class="w-100 opacity-9 px-6" src="<?= base_url('imagenes/logo.png'); ?>" alt="logo">
			</div>
			<div class="col-lg-3 col-md-4 col-6 mb-3">
				<img class="w-100 opacity-9" src="https://servicios.zapopan.gob.mx:8000/wwwportal/publicfiles/inline-images/iniciozapopan2019-1915x215_3_3.png" alt="logo">
			</div>
		</div>
		<div class="row align-items-center justify-content-center">
			<div class="copyright text-center text-sm text-muted mb-5">
				© Zapopan <script>
					document.write(new Date().getFullYear())
				</script>
			</div>
		</div>
	</div>
</footer>
</div>
</main>
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

//Libreria boostrap_lib
echo script_tag(base_url('public/vendors/boostrap_lib/js/dashboard.min.js?v=1.0.6'));

//Libreria Parsley
echo script_tag(base_url('public/vendors/parsley/parsley.min.js'));
echo script_tag(base_url('public/vendors/parsley/es.js'));

//Libreria Datatable
echo script_tag('https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js');
echo script_tag('https://cdn.datatables.net/1.12.1/js/dataTables.bootstrap5.min.js');

//Exportar datatable
echo script_tag('https://cdn.datatables.net/buttons/2.2.3/js/dataTables.buttons.min.js');
echo script_tag('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js');
echo script_tag('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js');
echo script_tag('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js');
echo script_tag('https://cdn.datatables.net/buttons/2.2.3/js/buttons.html5.min.js');
echo script_tag('https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js');
echo script_tag('https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/dropzone.min.js');

// JS general
echo script_tag('public/js/app.js');

if (!empty($scripts)) {
	foreach ($scripts as $key => $script) {
		echo script_tag($script['src']);
	}
}


?>

<script>
	const id_direccion = '<?= $id_direccion ?? '' ?>';
	const id_usuario = '<?= $id_usuario ?? '' ?>';
</script>

<script>
	$(document).ready(() => {

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

<script>
	//Validar cookie de sesión
	function getCookie(name) {
		var dc = document.cookie;
		var prefix = name + "=";
		var begin = dc.indexOf("; " + prefix);
		if (begin == -1) {
			begin = dc.indexOf(prefix);
			if (begin != 0) return null;
		} else {
			begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1) {
				end = dc.length;
			}
		}
		// because unescape has been deprecated, replaced with decodeURI
		//return unescape(dc.substring(begin + prefix.length, end));
		return decodeURI(dc.substring(begin + prefix.length, end));
	}

	//Recargar cada 2 horas
	setTimeout(() => {
		if (getCookie("ci_session") == null) {
			localStorage.setItem('logout', true)
			sessionStorage.removeItem('logged_in');
			localStorage.removeItem('logged_in');
			localStorage.removeItem('logout');
			window.location.reload();
		}
	}, 7200000);
</script>
</body>

</html>