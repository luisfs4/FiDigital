Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

const obtener_tiempo_bloqueo = () => {
    let tiempoBloqueo = new Date(localStorage.tiempoBloqueo)
    let horas = tiempoBloqueo.getHours();
    let minutos = tiempoBloqueo.getMinutes();
    let segundos = tiempoBloqueo.getSeconds();
    let ampm = '';

    if (minutos < 10) {
        minutos = '0' + minutos;
    }

    if (horas >= 12) {
        horas = Number(horas) - 12;
        ampm = ' p.m.';
    } else {
        ampm = ' a.m.';
    }

    let texto_tiempo = '';
    let intervalo = Math.round((tiempoBloqueo.getTime() - new Date().getTime()) / 1000);

    if (intervalo < 60) {
        texto_tiempo = 'Por favor espera ' + intervalo +
            ' segundos para poder volver a intentarlo de nuevo'
    } else {
        texto_tiempo = 'No puedes iniciar sesión hasta las: ' + horas + ':' +
            minutos + ampm
    }

    Swal.fire('Excediste el limite de intentos!', texto_tiempo, 'error');
    enableBtn('.btn__acceder', 'Acceder');
}

$('.form-control').keypress(function (e) {
    if (e.which == 13) {
        $('.btn_acceder').click();
        return false;
    }
});

//Form auth
$('.btn_acceder').click((e) => {
    let parsley = $('.login_form').parsley().validate();

    disableBtn('.btn__acceder');

    if (parsley == true) {
        if (online()) {
            let ahora = new Date();

            if (localStorage.intentos >= 3 && ahora > new Date(localStorage.tiempoBloqueo)) {
                localStorage.intentos = 0;
            } 

            if (
                (typeof localStorage.intentos == 'undefined' || Number(localStorage.intentos) < 3) ||
                (typeof localStorage.tiempoBloqueo == 'undefined' || ahora > new Date(
                    localStorage.tiempoBloqueo))
            ) {
                $.ajax({
                    type: 'post',
                    url: '/Cuenta/post_login',
                    data: {
                        correo: $('.correo').val(),
                        contrasena: $('.contrasena').val()
                    },
                    success: async (response) => {

                        if (response == 'autorizado') {
                            localStorage.removeItem('tiempoBloqueo')
                            localStorage.removeItem('intentos')

                            //Setear valor para login

                            Swal.fire({
                                title: 'Acceso autorizado',
                                html: 'Bienvenido, serás redireccionado en unos momentos...',
                                icon: 'success',
                                timer: 3000,
                            }).then(() => {
                                localStorage.setItem('logged_in', true);
                                sessionStorage.setItem('logged_in', true);
                                window.location.reload();
                            });
                        } else {
                            if (typeof localStorage.intentos == 'undefined' ||
                                localStorage.intentos == 0) {
                                localStorage.intentos = 1;
                            } else if (localStorage.intentos == 1) {
                                localStorage.intentos = 2;
                            } else if (localStorage.intentos == 2) {
                                localStorage.intentos = 3;
                                localStorage.tiempoBloqueo = new Date().addHours(0.08)
                                obtener_tiempo_bloqueo();
                            }

                            Swal.fire({
                                title: 'Acceso no autorizado!',
                                html: response,
                                icon: 'error',
                                footer: 'Intento ' + localStorage.intentos + ' de 3'
                            });

                            enableBtn('.btn__acceder', 'Acceder');
                        }
                    },
                    error: (err) => {
                        Swal.fire('Error de conexión',
                            'Ocurrió un problema al tratar de iniciar sesión',
                            'error');
                        enableBtn('.btn__acceder', 'Acceder');
                    }
                });
            } else {
                obtener_tiempo_bloqueo();
            }
        } else {
            enableBtn('.btn__acceder', 'Acceder');
            Swal.fire('Error de conexión',
                'Verifique su conexión a internet e intente nuevamente', 'error');
        }
    }

});