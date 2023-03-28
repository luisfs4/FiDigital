<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>404 | Error</title>

    <style id="" media="all">
        
#sin_resultados {
    position: relative;
    height: 100vh
}

#sin_resultados .sin_resultados {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%)
}

.sin_resultados {
    max-width: 560px;
    width: 100%;
    padding-left: 160px;
    line-height: 1.1
}

.sin_resultados .sin_resultados-404 {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 140px;
    height: 140px;
    background-image: url(../img/emoji.png);
    background-size: cover
}

.sin_resultados .sin_resultados-404:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-transform: scale(2.4);
    -ms-transform: scale(2.4);
    transform: scale(2.4);
    border-radius: 50%;
    background-color: #f2f5f8;
    z-index: -1
}

.sin_resultados h1 {
    font-family: nunito, sans-serif;
    font-size: 65px;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 10px;
    color: #151723;
    text-transform: uppercase
}

.sin_resultados h2 {
    font-family: nunito, sans-serif;
    font-size: 21px;
    font-weight: 400;
    margin: 0;
    text-transform: uppercase;
    color: #151723
}

.sin_resultados p {
    font-family: nunito, sans-serif;
    color: #999fa5;
    font-weight: 400
}

.sin_resultados a {
    font-family: nunito, sans-serif;
    display: inline-block;
    font-weight: 700;
    border-radius: 40px;
    text-decoration: none;
    color: #388dbc
}

@media only screen and (max-width:767px) {
    .sin_resultados .sin_resultados-404 {
        width: 110px;
        height: 110px
    }

    .sin_resultados {
        padding-left: 15px;
        padding-right: 15px;
    padding-top: 110px
    }
    }
        /* cyrillic-ext */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 400;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXV3I6Li01BKofIOOaBXso.woff2) format('woff2');
            unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 400;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXV3I6Li01BKofIMeaBXso.woff2) format('woff2');
            unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* vietnamese */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 400;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXV3I6Li01BKofIOuaBXso.woff2) format('woff2');
            unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
        }

        /* latin-ext */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 400;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXV3I6Li01BKofIO-aBXso.woff2) format('woff2');
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 400;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXV3I6Li01BKofINeaB.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 700;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXW3I6Li01BKofAjsOUbOvISTs.woff2) format('woff2');
            unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 700;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXW3I6Li01BKofAjsOUZevISTs.woff2) format('woff2');
            unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* vietnamese */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 700;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXW3I6Li01BKofAjsOUbuvISTs.woff2) format('woff2');
            unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
        }

        /* latin-ext */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 700;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXW3I6Li01BKofAjsOUb-vISTs.woff2) format('woff2');
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 700;
            src: url(/fonts.gstatic.com/s/nunito/v16/XRXW3I6Li01BKofAjsOUYevI.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
    </style>

    <meta name="robots" content="noindex, follow">
</head>

<body>
    <div id="sin_resultados">
        <div class="sin_resultados">
            <div class="sin_resultados-404"></div>
            <h1>404</h1>
            <h2>Uups! Pagina no disponible</h2>
            <p>Lo sentimos, es posible que la pagina que quieres consultar no existe o no está disponible por el momento, por favor vuelve más tarde o intentalo de nuevo</p>
            <a href="#">Ir al inicio de la encuesta</a>
        </div>
    </div>
</body>

</html>