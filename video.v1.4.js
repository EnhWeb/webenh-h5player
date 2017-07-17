var isFullScreen = function() {
    return document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
};
var ExitFullscreen = null;

$(document).ready(function() {


    function webenh_plusready() {
        $(".volume").hide();
        if (plus.os.name.toLowerCase() != "ios") {
            $(".sound").hide();
        }
    }
    document.addEventListener("plusready", function() {
        webenh_plusready();
    });

    //INITIALIZE
    var video = $('#myVideo');
    var videoContainer = $(".videoContainer");

    //remove default control when JS loaded
    video.removeAttr("controls");
    $('.control').show().css({ 'bottom': -45 });
    $('.caption').show().css({ 'top': -45 });
    $('.loading').fadeIn(500);
    $('.caption').fadeIn(500);

    //before everything get started
    video.on('loadedmetadata', function() {
        //$('.caption').animate({'top':-45},300);
        $('.control').animate({ 'bottom': 0 }, 1000);
        $('.caption').animate({ 'top': 0 }, 1000);

        //set video properties
        $('.current').text(timeFormat(0));
        $('.duration').text(timeFormat(video[0].duration));
        updateVolume(0, 0.7);

        //start to get video buffering data 
        setTimeout(startBuffer, 150);

        //bind video events
        $('.videoContainer')
            .append('<div id="init" class="ios-app-off"></div>')
            .hover(function() {
                //显示
                $('.control').stop().animate({ 'bottom': 0 }, 500);
                $('.caption').stop().animate({ 'top': 0 }, 500);
            }, function() {
                if (!volumeDrag && !timeDrag) {
                    //隐藏
                    if (!video[0].paused) {
                        $('.control').stop().animate({ 'bottom': -45 }, 2000);
                        $('.caption').stop().animate({ 'top': -45 }, 500);
                    }
                }
            })
            .on('click', function() {
                $('#init').remove();
                $('.btnPlay').addClass('paused');
                $(this).unbind('click');
                video[0].play();
                playExec();
            });
        $('#init').fadeIn(200);
    });

    //display video buffering bar
    var startBuffer = function() {
        try {
            var currentBuffer = video[0].buffered.end(0);
            var maxduration = video[0].duration;
            var perc = 100 * currentBuffer / maxduration;
            $('.bufferBar').css('width', perc + '%');

            if (currentBuffer < maxduration) {
                setTimeout(startBuffer, 500);
            }
        } catch (e) {
            console.log(e);
        }
    };

    //display current video play time
    video.on('timeupdate', function() {
        var currentPos = video[0].currentTime;
        var maxduration = video[0].duration;
        var perc = 100 * currentPos / maxduration;
        $('.timeBar').css('width', perc + '%');
        $('.current').text(timeFormat(currentPos));
    });

    //CONTROLS EVENTS
    //video screen and play button clicked
    video.on('click tap', function() {
        if (window.plus) {
            if (plus.os.name.toLowerCase() == "ios") {
                // return true;
            } else {
                playpause();
            }
        } else {
            playpause();
        }
    });
    $('.btnPlay').on('click tap', function() {
        // if (window.plus) {
        //     if (plus.os.name.toLowerCase() == "ios") {
        //         // return true;
        //     } else {
        //         playpause();
        //     }
        // } else {
        //     playpause();
        // }
        playpause();
    });
    video.on("pause", function() {
        //console.log("暂停");
        //ExitFullscreenPlay();
    });

    video.on("dbclick", function() {

    });

    var playExec = function() {

    }
    var EnterFullscreenPlay = function() {
        //播放时自动进入全屏

        //如果是APP添加返回键扩展自定义
        addEventAndroidBlackButton();

        if ($.isFunction(video[0].requestFullscreen)) {
            video[0].requestFullscreen();
        } else if ($.isFunction(video[0].webkitEnterFullscreen)) {
            video[0].webkitEnterFullscreen();
        } else if ($.isFunction(video[0].webkitRequestFullScreen)) {
            video[0].webkitRequestFullScreen();
        } else if ($.isFunction(video[0].mozRequestFullScreen)) {
            video[0].mozRequestFullScreen();
        } else {
            console.log('Your browsers doesn\'t support fullscreen');
        }
    }
    var ExitFullscreenPlay = function() {
        //如果暂停或播放完成，自动退出全屏，主要是H5APP内作用。
        if ($.isFunction(video[0].webkitCancelFullScreen)) {
            console.log("webkitCancelFullScreen");
            video[0].webkitCancelFullScreen();
        } else if ($.isFunction(video[0].webkitExitFullScreen)) {
            console.log("webkitExitFullScreen");
            video[0].webkitExitFullScreen();
        } else if ($.isFunction(video[0].mozCancelFullScreen)) {
            console.log("mozCancelFullScreen");
            video[0].mozCancelFullScreen();
        }
        // exit full-screen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    ExitFullscreen = ExitFullscreenPlay;

    var playpause = function() {
        if (video[0].paused || video[0].ended) {
            $('.btnPlay').addClass('paused');
            video[0].play();
            video[0].pause();
            video[0].play();
            playExec();
        } else {
            $('.btnPlay').removeClass('paused');
            video[0].pause();
        }
    };

    //speed text clicked
    $('.btnx1').on('click tap', function() { fastfowrd(this, 1); });
    $('.btnx12').on('click tap', function() { fastfowrd(this, 1.2); });
    $('.btnx15').on('click tap', function() { fastfowrd(this, 1.5); });
    $('.btnx2').on('click tap', function() { fastfowrd(this, 2); });
    $('.btnx3').on('click tap', function() { fastfowrd(this, 3); });
    var fastfowrd = function(obj, spd) {
        $('.text').removeClass('selected');
        $(obj).addClass('selected');
        video[0].playbackRate = spd;
        video[0].play();
        playExec();
    };

    //stop button clicked
    $('.btnStop').on('click tap', function() {
        $('.btnPlay').removeClass('paused');
        updatebar($('.progress').offset().left);
        video[0].pause();
    });

    //fullscreen button clicked
    $('.btnFS').on('click tap', function() {
        EnterFullscreenPlay();
    });

    //light bulb button clicked
    $('.btnLight').on('click tap', function() {
        $(this).toggleClass('lighton');

        //if lightoff, create an overlay
        if (!$(this).hasClass('lighton')) {
            $('body').append('<div class="overlay"></div>');
            $('.overlay').css({
                'position': 'absolute',
                'width': 100 + '%',
                'height': $(document).height(),
                'background': '#000',
                'opacity': 0.9,
                'top': 0,
                'left': 0,
                'z-index': 999
            });
            $('.videoContainer').css({
                'z-index': 1000
            });
        }
        //if lighton, remove overlay
        else {
            $('.overlay').remove();
        }
    });

    //sound button clicked
    $('.sound').on('click tap', function() {
        video[0].muted = !video[0].muted;
        $(this).toggleClass('muted');
        if (video[0].muted) {
            $('.volumeBar').css('width', 0);
        } else {
            $('.volumeBar').css('width', video[0].volume * 100 + '%');
        }
    });

    //VIDEO EVENTS
    //video canplay event
    video.on('canplay', function() {
        $('.loading').fadeOut(100);
    });

    //video canplaythrough event
    //solve Chrome cache issue
    var completeloaded = false;
    video.on('canplaythrough', function() {
        completeloaded = true;
    });

    //video ended event
    video.on('ended', function() {
        $('.btnPlay').removeClass('paused');
        video[0].pause();
    });

    //video seeking event
    video.on('seeking', function() {
        //if video fully loaded, ignore loading screen
        if (!completeloaded) {
            $('.loading').fadeIn(200);
        }
    });

    //video seeked event
    video.on('seeked', function() {});

    //video waiting for more data event
    video.on('waiting', function() {
        $('.loading').fadeIn(200);
    });

    //VIDEO PROGRESS BAR
    //when video timebar clicked
    var timeDrag = false; /* check for drag event */
    $('.progress').on('mousedown', function(e) {
        timeDrag = true;
        updatebar(e.pageX);
    });
    $(document).on('mouseup', function(e) {
        if (timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
        }
    });
    $(document).on('mousemove', function(e) {
        if (timeDrag) {
            updatebar(e.pageX);
        }
    });
    var updatebar = function(x) {
        var progress = $('.progress');

        //calculate drag position
        //and update video currenttime
        //as well as progress bar
        var maxduration = video[0].duration;
        var position = x - progress.offset().left;
        var percentage = 100 * position / progress.width();
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        $('.timeBar').css('width', percentage + '%');
        video[0].currentTime = maxduration * percentage / 100;
    };

    //VOLUME BAR
    //volume bar event
    var volumeDrag = false;
    $('.volume').on('mousedown', function(e) {
        volumeDrag = true;
        video[0].muted = false;
        $('.sound').removeClass('muted');
        updateVolume(e.pageX);
    });
    $(document).on('mouseup', function(e) {
        if (volumeDrag) {
            volumeDrag = false;
            updateVolume(e.pageX);
        }
    });
    $(document).on('mousemove', function(e) {
        if (volumeDrag) {
            updateVolume(e.pageX);
        }
    });
    var updateVolume = function(x, vol) {
        var volume = $('.volume');
        var percentage;
        //if only volume have specificed
        //then direct update volume
        if (vol) {
            percentage = vol * 100;
        } else {
            var position = x - volume.offset().left;
            percentage = 100 * position / volume.width();
        }

        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }

        //update volume bar and video volume
        $('.volumeBar').css('width', percentage + '%');
        video[0].volume = percentage / 100;

        //change sound icon based on volume
        if (video[0].volume == 0) {
            $('.sound').removeClass('sound2').addClass('muted');
        } else if (video[0].volume > 0.5) {
            $('.sound').removeClass('muted').addClass('sound2');
        } else {
            $('.sound').removeClass('muted').removeClass('sound2');
        }

    };

    //Time format converter - 00:00
    var timeFormat = function(seconds) {
        var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
        var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
        return m + ":" + s;
    };
});