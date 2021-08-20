/*
使用方法
<div class="hv-image-play" style="width:64px;height:64px;" style="background-size:100%(设置宽度100%就会纵向换帧，高度100%横向换帧);" keyframes="图片地址"></div>
<div class="hv-image-play" fps="10(帧率)" loop="true(循环播放)" autoplay(自动播放) style="width:54px;height:80px;background-size: auto 100%;background-position-y: 0px(设置背景的位置);" keyframes="图片地址"></div>
*/

(function(){
    function _playAni(opts,noloop){
        var reverse = opts.reverse;
        var isX = opts.x;
        var el = opts.el;
        opts.index = opts.index || 0;
        clearTimeout(opts.timer);
        var fps = opts.fps || 40;
        var speed = 1000 / parseFloat(fps);


        function _play(){
            var offsetY =  isX ? 0 : 0 - opts.index * opts.step;
            var offsetX = isX ? 0 - opts.index * opts.step : 0;
            if(isX){
                el.style.backgroundPositionX = offsetX + 'px ';
            }else{
                
                el.style.backgroundPositionY = offsetY + 'px ';
            }

            if( (opts.index < opts.count - (opts.loop?0:1)  && !reverse) ||  (opts.index > 0 && reverse ) ){
                
                opts.index = opts.index + (reverse ? -1 : 1) ;
                opts.timer = setTimeout(_play, speed);
            }else{
                if(opts.loop === true && !noloop){
                    opts.index = 0;
                    _playAni(opts)
                }
                opts.reverse = false;
            }
        }

        _play();
    }

    function _setTrigger(opts){
        if(!opts.autoplay){
            opts.el.addEventListener('mouseover',function(){
                opts.index = 0;
                _playAni(opts);
            });
            opts.el.addEventListener('mouseout',function(){
                opts.reverse = true;
                _playAni(opts,true);
            });
        }else{
            _playAni(opts);
        }
    }


    [].forEach.call(document.querySelectorAll('[keyframes]'), function(item){
        var src = item.getAttribute('keyframes');
        item.style.backgroundImage = 'url('+ src +')';
        var tmpImage = new Image();
        tmpImage.src = src;
        var boxWidth = item.offsetWidth;
        var boxHeight = item.offsetHeight;
        var fps = item.getAttribute('fps') || 40;
        var loop = item.getAttribute('loop')!=undefined && item.getAttribute('loop') != 'false' ? true : false;
        var mode = item.getAttribute('mode');
        var autoplay = item.getAttribute('autoplay')!=undefined && item.getAttribute('autoplay') != 'false' ? true : false;

        (function(){
            tmpImage.onload = function(){ //图片加载完时
                var imgWidth = this.naturalWidth;
                var imgHeight = this.naturalHeight;
                var bgSize = getComputedStyle(item).backgroundSize.split(' ');
                var step = boxHeight;//每帧移动多少像素;
                var count = 1;
                var opts = {
                    el:item,
                    loop:loop,
                    fps:fps,
                    autoplay:autoplay,
                    count:1,
                };

                var bgWidth = bgSize[0] ? bgSize[0].replace('px','') : '' || '';
                var bgHeight = bgSize[1] ? bgSize[1].replace('px','') : '' || '';


                if(bgSize[0] == '100%' || bgWidth==boxWidth){ //纵向一列
                    opts.step = boxHeight;
                    opts.count = boxWidth / imgWidth * imgHeight / boxHeight;
                }

                if(bgSize[1] == '100%' || bgHeight==boxHeight){//横向一行
                    opts.step = boxWidth;
                    opts.x = true;
                    opts.count = boxHeight / imgHeight * imgWidth / boxWidth;
                }

                if(bgWidth.indexOf('%')>-1 && bgWidth.replace('%','') != "100" || parseInt(bgWidth) > boxWidth ){
                    opts.step = boxWidth;
                    opts.x = true;
                    opts.count = parseInt(bgWidth.replace('%','')) / 100;
                }

                if(bgHeight != undefined && bgHeight.indexOf('%')>-1 && bgHeight.replace('%','') != "100" || parseInt(bgHeight) > boxHeight){
                    opts.step = boxHeight;
                    opts.count = parseInt(bgHeight.replace('%','')) / 100;
                }

                _setTrigger(opts);
            }
        })(item,fps,loop,mode,autoplay);
    })
})();
