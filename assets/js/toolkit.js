jQuery(document).ready(function($) {
    if ($('.bon-toolkit-likes').length > 0) {
        $(".bon-toolkit-likes").on("click", null, function() {
            var link = jQuery(this);
            if (link.hasClass("active")) return false;
            var id = jQuery(this).attr("id");
            var nonce_id = id.match(/\d+\.?\d*/g);
            var nonce_field = $(this).siblings('#_likes_nonce' + parseInt(nonce_id)).val();
            $.post(bon_toolkit_ajax.url, {
                action: "bt-likes",
                nonce: nonce_field,
                likes_id: id
            }, function(data) {
                link.html(data).addClass("active").attr("title", "You already like this")
            });
            return false
        })
    }
    if ($('.bon-toolkit-poll').length > 0) {
        $('.bon-toolkit-poll').each(function() {
            $(this).submit(function(e) {
                e.preventDefault();
                var id = $(this).attr("id");
                var nonce_id = id.match(/\d+\.?\d*/g);
                var opt_id = $(this).find('input[type="radio"]:checked').val();
                var parent = $(this).parent();
                var nonce_field = $(this).find('#_poll_nonce' + parseInt(nonce_id)).val();
                $.post(bon_toolkit_ajax.url, {
                    action: "bt-poll",
                    nonce: nonce_field,
                    option_id: opt_id,
                    post_id: id
                }, function(data) {
                    parent.html(data).fadeIn()
                })
            })
        })
    }
    if ($('.bon-toolkit-quiz').length > 0) {
        $('.bon-toolkit-quiz').each(function() {
            var thumb = $(this).data('thumbnail');
            var id = $(this).attr('id');
            var nonce_id = id.match(/\d+\.?\d*/g);
            var nonce_field = $(this).siblings('#_quiz_nonce' + parseInt(nonce_id)).val();
            $.post(bon_toolkit_ajax.url, {
                action: "bt-quiz",
                nonce: nonce_field,
                post_id: id
            }, function(data) {
                $('.bon-toolkit-quiz#' + id).quiz({
                    questions: data.quiz,
                    introThumb: thumb,
                    introTitle: data.quiz_title,
                    introContent: data.quiz_content,
                    resultText: data.quiz_comment
                })
            })
        })
    }
    if ($('.bon-toolkit-map').length > 0) {
        $('.bon-toolkit-map').each(function() {
            var container = $(this);
            var latitude = $(this).data('latitude');
            var longitude = $(this).data('longitude');
            var zoom = $(this).data('zoom');
            var marker = $(this).data('marker');
            mapWidgets.init(container, {
                startZoom: zoom,
                lat: latitude,
                lng: longitude,
                markerImage: marker
            })
        })
    }
    if ($('.bon-toolkit-video-embed').length > 0) {
        if ($.fn.fitVids) {
            $('.bon-toolkit-video-embed').fitVids()
        }
        $("iframe[src^='http://www.youtube.com'], object, embed").each(function() {
            var url = $(this).attr("src");
            if ($(this).attr("src").indexOf("?") > 0) {
                $(this).attr({
                    "src": url + "&wmode=transparent&html5=1",
                    "wmode": "Opaque"
                })
            } else {
                $(this).attr({
                    "src": url + "?wmode=transparent&html5=1",
                    "wmode": "Opaque"
                })
            }
        })
    }
    if ($().jPlayer && $('.bon-toolkit-jplayer').length > 0) {
        jQuery(".bon-toolkit-jplayer").each(function() {
            var m4v_url = $(this).data('m4v');
            var ogv_url = $(this).data('ogv');
            var poster_url = $(this).data('poster');
            var id = $(this).siblings('.jp-video-container').find('.jp-interface').attr('id');
            $(this).jPlayer({
                ready: function() {
                    $(this).jPlayer("setMedia", {
                        m4v: m4v_url,
                        ogv: ogv_url,
                        poster: poster_url
                    });
                    var parentWidth = $(this).siblings('.jp-video-container').outerWidth();
                    var playWidth = $(this).siblings('.jp-video-container').find('.jp-play').outerWidth(true);
                    var muteWidth = $(this).siblings('.jp-video-container').find('.jp-mute').outerWidth(true);
                    var volumeWidth = $(this).siblings('.jp-video-container').find('.jp-volume-bar-container').outerWidth(true);
                    var minusWidth = playWidth + muteWidth + volumeWidth;
                    var progressWidth = parentWidth - minusWidth;
                    $(this).siblings('.jp-video-container').find('.jp-progress').css('width', (progressWidth - 1) + "px")
                },
                size: {
                    width: "100.05%",
                    height: "auto"
                },
                swfPath: "/jplayer",
                cssSelectorAncestor: "#" + id,
                supplied: "m4v,ogv,all"
            })
        })
    }
    $('.bon-toolkit-tabs .tab-nav a').click(function(e) {
        e.preventDefault();
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var target = $(this).attr('href');
        $(this).parent().parent().find('.tab-content').removeClass('active');
        $(this).parent().parent().find(target).addClass('active')
    });
    $('form.bon-builder-contact-forms').submit(function(e) {
        var $t = $(this);
        var error = false;
        $t.find('.sending-result').fadeOut(200);
        $t.find('.required').each(function() {
            if ($.trim($(this).val()) == '') {
                error = true;
                $(this).siblings('.contact-form-error').fadeIn(200)
            } else if ($(this).hasClass('email')) {
                var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                if (!emailReg.test($.trim($(this).val()))) {
                    error = true;
                    $(this).siblings('.contact-form-error').fadeIn(200)
                } else {
                    $(this).siblings('.contact-form-error').fadeOut(200)
                }
            } else {
                $(this).siblings('.contact-form-error').fadeOut(200)
            }
        });
        if (error) {
            return false
        }
        $(this).find('.contact-form-ajax-loader').fadeIn();
        var send_data = $(this).serialize();
        $.post(bon_toolkit_ajax.url, 'action=process_contact_form&' + send_data, function(data) {
            $t.find('.contact-form-ajax-loader').fadeOut();
            if (data.success == '1') {
                $t.find('input[type="text"], textarea').val('');
                $t.find('.sending-result div.bon-toolkit-alert').each(function() {
                    $(this).html(data.value);
                    $(this).removeClass('red').addClass('green');
                    $(this).parent().fadeIn(200)
                })
            } else {
                $t.find('.sending-result div.bon-toolkit-alert').each(function() {
                    $(this).html(data.value);
                    $(this).removeClass('green').addClass('red');
                    $(this).parent().fadeIn(200)
                })
            }
        }, 'json');
        return false
    })
});