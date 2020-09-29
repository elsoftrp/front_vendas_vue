/*!
    * Start Bootstrap - SB Admin v6.0.0 (https://startbootstrap.com/templates/sb-admin)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    (function($) {
        "use strict";
        // Add active state to sidbar nav links
        var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
            $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
                if (this.href === path) {
                    $(this).addClass("active");
                }
            });

        // Toggle the side navigation
        $("#sidebarToggle").on("click", function(e) {
            e.preventDefault();
            $("body").toggleClass("sb-sidenav-toggled");
        });
        })(jQuery);

    // MASK
    var CpfCnpjMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length <= 11 ? '000.000.000-009' : '00.000.000/0000-00';
    },
    cpfCnpjpOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(CpfCnpjMaskBehavior.apply({}, arguments), options);
        }
    };

    $('.mask-cpfcnpj').mask(CpfCnpjMaskBehavior, cpfCnpjpOptions);

    var cellMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    cellOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(cellMaskBehavior.apply({}, arguments), options);
        }
    };

    $('.mask-celular').mask(cellMaskBehavior, cellOptions);
    $('.mask-fone').mask('(00) 0000-0000');
    $(".mask-data").mask('00/00/0000');
    $(".mask-datetime").mask('00/00/0000 00:00');
    $(".mask-month").mask('00/0000', {reverse: true});
    $(".mask-cpf").mask('000.000.000-00', {reverse: true});
    $(".mask-cnpj").mask('00.000.000/0000-00', {reverse: true});
    $(".mask-cep").mask('00000-000', {reverse: true});
    $(".mask-money").mask('R$ 000.000.000.000.000,00', {reverse: true, placeholder: "R$ 0,00"});


    ///// busca no select input

/////// funcoes
    function maiusculo(Campo) {
	    if (Campo.value != '') {
		    Campo.value=Campo.value.toUpperCase();
    	}
    };

    function formataCpfCnpj_onblur(Campo) {
	    if (Campo.value != '') {
		    Campo.value = replaceAll(Campo.value, '.', '');
		    Campo.value = replaceAll(Campo.value, '/', '');
		    Campo.value = replaceAll(Campo.value, '-', '');
		    if (Campo.value.length == 11)  {
			    Campo.value = Campo.value.substring(0,3) + '.' + Campo.value.substring(3,6) + '.' + Campo.value.substring(6,9) + '-' + Campo.value.substring(9,11);
		    }
		    else if (Campo.value.length == 14) {
			    Campo.value = Campo.value.substring(0,2) + '.' + Campo.value.substring(2,5) + '.' + Campo.value.substring(5,8) + '/' + Campo.value.substring(8,12) + '-' + Campo.value.substring(12,14);
		    }
	    }
    };

    function formataCpfCnpj(valor) {
	    if (valor != '') {
		    valor = replaceAll(valor, '.', '');
		    valor = replaceAll(valor, '/', '');
		    valor = replaceAll(valor, '-', '');
		    if (valor.length == 11)  {
			    valor = valor.substring(0,3) + '.' + valor.substring(3,6) + '.' + valor.substring(6,9) + '-' + valor.substring(9,11);
		    }
		    else if (valor.length == 14) {
			    valor = valor.substring(0,2) + '.' + valor.substring(2,5) + '.' + valor.substring(5,8) + '/' + valor.substring(8,12) + '-' + valor.substring(12,14);
            }
            return valor;
	    }
    };

    function replaceAll(str, de, para){
        var pos = str.indexOf(de);
        while (pos > -1){
            str = str.replace(de, para);
            pos = str.indexOf(de);
        }
        return (str);
    };


