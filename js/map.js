$(document).ready(function(){
    $(document).on('click', '.card__close',function() {
        $('.map').removeClass('_card_active');
    });
    $(document).on('click', '.callout__header-info', function(e) {
        var licon = $(loadIcon)
        var cardWrap = $('.map .map__aside-card .card');
        var stationCode = blocks.callout.getCurrentlySelectedId();
        if(!$('.map').hasClass('_card_active') ) {
            $(cardWrap).html("");
        }
        $.ajax({
            type: 'GET',
            url: '/metro-map/get_station_info.php',
            data:  "station_code="+stationCode,
            processData: false,
            contentType: false,
            dataType: "html",
            beforeSend: function(){
                $(cardWrap)
                    //.html("")
                    .append(licon);
                if($(cardWrap).find('.card__header').size() < 1)
                    $(cardWrap).append('<header class="card__header"><div class="card__close"></div></header>');
                $('.map').addClass('_card_active');
            },
            success: function(data) {
                $(licon).fadeOut(function(){
                    $(licon).remove();
                    $(cardWrap).html("").append(data);
                    //$(cardWrap).find('.station-gallery__link').fancybox(); //TODO починить надо
                    blocks.card.init();
                    blocks.callout.hide();
                });
            },
            error: function(data) {
                $(licon).fadeOut(function(){
                    //$(licon).remove();
                    $(cardWrap).html("ERROR");
                });
            }
        });
    });
    $(document).on('change','input[name="map-infrastructure"]',function(){
        $.ajax({
            type: 'GET',
            url: '/metro-map/get_infrastructure.php',
            data:  "type="+$(this).val(),
            processData: false,
            contentType: false,
            dataType: "json",
            beforeSend: function(){
            },
            success: function(data) {
                $('#map-background').css('opacity',0.3);
                $('#map-markers').find('g').attr('class', '_faded');
                blocks.infrastructure.clear_trig = true;
                blocks.fromto.runSearch();
                blocks.infrastructure.clear_trig = false;
                if(data.COUNT > 0){
                    $.map(data.ITEMS,function(v){
                        $('#map-markers').find('g#'+v).attr('class', '_highlighted');
                    });
                }
            },
            error: function(data) {
                console.log("ERROR AJAX");
            }
        });
    });

    blocks.infrastructure.clear = function() {
        //$('.infrastructure__header').on('click', function() {
        //    var block = $(this).parents('.infrastructure');
        //
        //    block.toggleClass('_active');
        //});
        if(!blocks.infrastructure.clear_trig) {
            $('.infrastructure__header').parents('.infrastructure').removeClass('_active');
            $('input[name="map-infrastructure"]').prop("checked", false);
        }
    };
    blocks.infrastructure.clear_trig = false;
});
