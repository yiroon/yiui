/*
【使用示例】
<h2>第一组</h2>
<div picture-group >
    <img width="200" src="http://jdtek.hk/images/20220412/a92a8ec9543daaba6d56323dd1416d0f.jpg" picture-view="http://jdtek.hk/images/20220412/a92a8ec9543daaba6d56323dd1416d0f.jpg" >
    <img width="200" src="https://cdn.pixabay.com/photo/2022/05/05/01/11/cormorant-7175037__340.jpg" picture-view="https://cdn.pixabay.com/photo/2022/05/05/01/11/cormorant-7175037_960_720.jpg" >
    <img width="200" src="https://cdn.pixabay.com/photo/2022/05/03/20/12/prague-7172597__340.jpg" picture-view="https://cdn.pixabay.com/photo/2022/05/03/20/12/prague-7172597_960_720.jpg" >
    <img width="200" src="https://cdn.pixabay.com/photo/2022/05/04/02/29/calligraphy-7173006_960_720.jpg" picture-view="https://cdn.pixabay.com/photo/2022/05/04/02/29/calligraphy-7173006_960_720.jpg" >
</div>

<h2>第二组</h2>
<div picture-group >
    <img width="200" src="https://cdn.pixabay.com/photo/2020/02/25/09/57/road-4878453__340.jpg" picture-view="https://cdn.pixabay.com/photo/2020/02/25/09/57/road-4878453_960_720.jpg" >
    <img width="200" src="https://cdn.pixabay.com/photo/2022/05/01/10/49/flower-7167287__340.jpg" picture-view="https://cdn.pixabay.com/photo/2022/05/01/10/49/flower-7167287_960_720.jpg" >
    <img width="200" src="https://cdn.pixabay.com/photo/2022/04/23/20/51/nature-7152461__340.jpg" picture-view="https://cdn.pixabay.com/photo/2022/04/23/20/51/nature-7152461_960_720.jpg" >
    <img width="200" src="https://cdn.pixabay.com/photo/2021/10/28/14/32/jeans-6749852__340.jpg" picture-view="https://cdn.pixabay.com/photo/2021/10/28/14/32/jeans-6749852_960_720.jpg" >
</div>
*/
function yiuiImageView(){
    var globals = {slideAllowLeft:false,slideAllowRight:false,slideMoving:false,dragDowing:false};

    function toMatrix(args) {
        var list = [];
        args.forEach(function (v) {
            list.push(v);
        });
        var matrixStr = list.length > 13 ? 'matrix3d' : 'matrix';
        return matrixStr + '(' + list.join(',') + ')';
    }

    function getTranslate(el) {
        var transform = window.getComputedStyle(el)['transform'];
        if (transform == 'none') {
            return [0, 0];
        }
        var group = transform.match(/\(([^)]+)\)/)[1];
        var args = group.split(',');
        for (var index in args) {
            args[index] = parseInt(args[index]);
        }
        if (args.length > 13) {
            return [args[13], args[14]];
        } else {
            return [args[4], args[5]];
        }
    }

    function setTranslate (el, x, y, scale) {
        var transform = window.getComputedStyle(el)['transform'];
        if (!transform || transform == 'none') {
            transform = 'matrix(1, 0, 0, 1, 0, 0)';
        }
        var group = transform.match(/\(([^)]+)\)/)[1];
        var args = group.split(',');
        for (var index in args) {
            args[index] = parseFloat(args[index]);
        }
        if (args.length > 13) {
            args[9] = typeof scale == 'undefined' ? args[9] : scale;
            args[12] = typeof scale == 'undefined' ? args[12] : scale;
            args[13] = x;
            args[14] = x;
        } else {
            args[0] = typeof scale == 'undefined' ? args[0] : scale;
            args[3] = typeof scale == 'undefined' ? args[3] : scale;
            args[4] = x;
            args[5] = y;
        }
        el.style.transform = toMatrix(args);
    }

    function stopPropagation(event) {
        if (event != null && event.stopPropagation) {
            event.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
    }
    
    function setDrag(opts){

        opts.el.style.cursor = 'grab';
        opts.clickCloseTime = opts.clickCloseTime || 200;
        var parent = opts.el.parentElement;

        var store = {startX:null,startY:null,startTime:null,momentumThreshold:15,translateX:0,translateY:0,momentumTimeThreshold:300,momentumStartX:0,momentumStartY:0,scale:1};

        var stop = function() {
            var translate = getTranslate(opts.el);
            store.translateX = Math.round(translate[0]);
            store.translateY = Math.round(translate[1]);
            opts.el.style.transition = 'none';
            setTranslate(opts.el,store.translateX,store.translateY);
        }

        var calcPoint = function(x,y){
            var pc = opts.el.parentElement.getBoundingClientRect();
            var scaleWidth = opts.el.offsetWidth * store.scale;
            var scaleHeight = opts.el.offsetHeight * store.scale;
            var docWidth = document.documentElement.clientWidth;
            var docHeight = document.documentElement.clientHeight;
            var minX = docWidth < scaleWidth ?  docWidth - scaleWidth - pc.left : 0;
            var maxX = docWidth < scaleWidth ? 0 - pc.left : (opts.el.offsetWidth - scaleWidth)/2;
            var minY = docHeight < scaleHeight ?  docHeight - scaleHeight - pc.top : 0;
            var maxY = docHeight < scaleHeight ? 0 - pc.top : (opts.el.offsetHeight - scaleHeight)/2;

            if(x < minX){x = minX;}
            if(x > maxX){x = maxX;}
            if(y < minY){y = minY;}
            if(y > maxY){y = maxY;}
            return {x:x,y:y};
        }

        var calcTranslate = function(x,y,transition){
            var bc = opts.el.getBoundingClientRect();
            var width = bc.width;
            var height = bc.height;
            var pbc = opts.el.parentElement.getBoundingClientRect();
            var pTop = pbc.top;
            var pLeft = pbc.left;
            var old = getTranslate(opts.el);
            // 获取比例
            var xScale = (x - pLeft - old[0]) / width;
            var yScale = (y - pTop - old[1]) / height;

            if(store.scale < 1){store.scale=1;}
            
            // 放大后的宽高
            var ampWidth =  opts.el.offsetWidth * store.scale;
            var ampHeight = opts.el.offsetHeight * store.scale;
            // 需要重新运算的 translate 坐标
            var moveX = xScale * (ampWidth - width);
            var moveY = yScale * (ampHeight - height);

            // 更新
            var translateX = store.translateX = old[0] - moveX;
            var translateY = store.translateY = old[1] - moveY;

            var translate = calcPoint(translateX,translateY);
            store.translateX =translate.x;
            store.translateY =translate.y;
            opts.el.style.transition = transition || 'none';
            setTranslate(opts.el,store.translateX ,store.translateY,store.scale);
        }

        // 获取坐标之间的举例
        var getDistance = function (start, stop) {
            return Math.hypot(stop.x - start.x, stop.y - start.y);
        };

        var stopParentDrag = function(e){
            if(store.scale > 1){
                var x = store.translateX;
                var pc = opts.el.parentElement.getBoundingClientRect();
                var scaleWidth = opts.el.offsetWidth * store.scale;
                var docWidth = document.documentElement.clientWidth;
                var minX = docWidth < scaleWidth ?  Math.round(docWidth - scaleWidth - pc.left) : 0;
                var maxX = docWidth < scaleWidth ? Math.round(0 - pc.left) : Math.round((opts.el.offsetWidth - scaleWidth)/2);
                if(x > minX+1 && x < maxX-1){
                    stopPropagation(e);
                }
                globals.slideAllowRight = x <= minX + 1;
                globals.slideAllowLeft = x >= maxX - 1;
            }
        }

        var start = function(e){
            var ev = e.touches ? e.touches[0] : e;
            stop();
            store.originScale = store.scale || 1;
            store.startX = ev.screenX;
            store.startY = ev.screenY;
            stopParentDrag(e);
            store.startTime = +new Date();
            store.x = store.translateX;
            store.y = store.translateY;
            store.momentumStartX = store.translateX;
            store.momentumStartY = store.translateY;
            if(e.touches && e.touches[1]){
                store.startX2 = e.touches[1].screenX;
                store.startY2 = e.touches[1].screenY;
            }
        }
        
        var move = function(e){
            if(store.startX === null){return;}
            if(globals.slideMoving){return;}
            e.preventDefault();
            opts.el.style.cursor = 'grabbing';
            var ev = e.touches ? e.touches[0] : e;
            var offsetX = ev.screenX - store.startX;//滑动距离X
            var offsetY = ev.screenY - store.startY;//滑动距离Y
            store.translateX = Math.round(store.x + offsetX);
            store.translateY = Math.round(store.y + offsetY);
            opts.el.style.transition = 'none';

            var events = e.touches ? e.touches[0] : e;
            var events2 = e.touches ? e.touches[1] : null;

            if(offsetX > 5 || offsetY > 5){
                globals.mousemoving = true;
            }
            
            if(events2){//缩放模式
                // 第2个指头坐标在touchmove时候获取
                if (!store.startX2) {
                    store.startX2 = events2.screenX;
                }
                if (!store.startY2) {
                    store.startY2 = events2.screenY;
                }
                
                // 双指缩放比例计算
                var zoom = getDistance({x: events.screenX,y: events.screenY}, {x: events2.screenX,y: events2.screenY}) /
                getDistance({x: store.startX,y: store.startY}, {x: store.startX2,y: store.startY2});
                // 应用在元素上的缩放比例
                var newScale = store.originScale * zoom;
                // 最大缩放比例限制
                if (newScale > 6) {
                    newScale = 6;
                }
                if(newScale < 1){
                    newScale = 1;
                }
                // 记住使用的缩放值
                store.scale =  newScale;
                console.log(store.scale)
                // 中心点
                var centerX = store.translateX = (events.screenX + events2.screenX) / 2;
                var centerY = store.translateY = (events.screenY + events2.screenY) / 2;
                // var translate = calcPoint(centerX,centerY);
                console.log(centerX,centerX,'【center】')
                calcTranslate(centerX,centerY);

            }else{ //拖动模式
                store.drag = true;

                //如果状态为未缩放，并向下拖动
                if(store.scale == 1){
                    if(offsetY > 20){
                        globals.dragDowing = true;
                        store.isDragDown = true;//记录为向下拖动
                        store.closeValue = 1 - offsetY / document.documentElement.clientHeight;
                        var parentWidth = parent.offsetWidth;
                        var tmpTranslateX = (parentWidth - parentWidth * store.closeValue) / 2;
                        setTranslate(opts.el,tmpTranslateX,store.translateY,store.closeValue); 
                        opts.mask.style.transition = 'none';
                        opts.mask.style.backgroundColor = 'rgba(0,0,0,'+store.closeValue+')';

                    }
                }else{
                    var translate = calcPoint(store.translateX,store.translateY);
                    setTranslate(opts.el,translate.x,translate.y);
                    //惯性
                    if (+new Date() - store.startTime > store.momentumTimeThreshold) {
                        store.momentumStartX = store.translateX;
                        store.momentumStartY = store.translateY;
                        store.startTime = +new Date();
                    }
                }
            }
            
        }

        var wheel = function(e){
            var ev = e || event;                        
            var isdown = ev.wheelDelta ? ev.wheelDelta < 0 :  ev.deltaY > 0;
            var step = 0.2;
            store.scale += isdown ? -step : step;
            store.scale = store.scale < step ? step : store.scale;
            store.scale = store.scale > 5 ? 5 : store.scale;

            // 鼠标坐标
            var mouseX = ev.x;
            var mouseY = ev.y;

            calcTranslate(mouseX,mouseY);
        }

        var momentum = function(x, y, duration) {
            // 惯性滑动加速度
            var distanceX = x.current - x.start;
            var distanceY = y.current - y.start;
            var speedX = Math.abs(distanceX) / duration;
            var speedY = Math.abs(distanceY) / duration;
            var offsetX = (1000 - duration) / duration * distanceX;
            var offsetY = (1000 - duration) / duration * distanceY;
            var translate = calcPoint(x.current + offsetX,y.current + offsetY);

            var speedX = Math.abs(distanceX) / duration;
            var speedY = Math.abs(distanceY) / duration;

            durationX = Math.abs(translate.x - x.current) / speedX;
            durationY = Math.abs(translate.y - x.current) / speedY;
            var duration = Math.min(durationX,durationY);
            if(duration < 100){duration = 100;}

            return {
                x:translate.x,
                y:translate.y,
                duration:duration,
                bezier: 'cubic-bezier(.17, .89, .45, 1)',
            };
        }

        var end = function(){
            opts.el.style.cursor = 'grab';

            delete store.startX2;
            delete store.startY2;
            clearTimeout(globals.mouseUpTimer);
            globals.mouseUpTimer = setTimeout(function(){
                globals.mousemoving = false;
            },opts.clickCloseTime);

            if(store.drag){
                //当向下拖动的值小于0.8时，关闭图片浏览器
                if(store.closeValue < 0.8 && store.isDragDown){
                    if(typeof opts.closing == 'function'){
                        destory();
                        opts.closing();
                    }
                    return;
                }

                store.drag = null;
                var momentumTimeThreshold = 300;
                var absDeltaX = Math.abs(store.translateX - store.momentumStartX);
                var absDeltaY = Math.abs(store.translateY - store.momentumStartY);
                var duration = +new Date() - store.startTime;


                // 启动惯性滑动
                if (!globals.slideMoving && !store.isDragDown && duration < momentumTimeThreshold && (absDeltaX > store.momentumThreshold || absDeltaY> store.momentumThreshold)  ) {
                    var res = momentum({current:store.translateX,start:store.momentumStartX},{current:store.translateY,start:store.momentumStartY}, duration);
                    store.translateX = res.x;
                    store.translateY = res.y;
                    store.bezier = 'ease-out'; // res.bezier;
                    opts.el.style.transition = 'all '+res.duration+'ms';
                    setTranslate(opts.el,store.translateX,store.translateY);
                }else if(!globals.slideMoving){
                    var translate = calcPoint(store.translateX,store.translateY);
                    opts.el.style.transition = 'all 0.3s';
                    setTranslate(opts.el,translate.x,translate.y,store.scale);
                    opts.mask.style.transition = 'all 0.3s';
                    opts.mask.style.backgroundColor = 'rgba(0,0,0,1)';
                }
            }
            store.startX = store.startY  = null;
            store.closeValue = null;
            store.isDragDown = false;
            globals.dragDowing = false;
        }

        var autoScale = function(e){
            globals.mousemoving = true;
            clearTimeout(globals.mouseUpTimer);
            globals.mouseUpTimer = setTimeout(function(){
                globals.mousemoving = false;
            },opts.clickCloseTime);
            
            if(store.scale > 1){
                store.scale = 1;
                calcTranslate(0,0,'all 0.3s');
            }else{
                var width =  opts.el.naturalWidth;
                var ev = e.touches ? e.touches[0] : e;
                store.scale =  width / opts.el.width;
                calcTranslate(ev.screenX,ev.screenY,'all 0.3s');
            }
        }

        var destory = function(){
            opts.el.removeEventListener('mousedown',start);
            document.removeEventListener('mousemove',move);
            document.removeEventListener('mouseup',end);
            opts.el.removeEventListener('touchstart',start);
            opts.el.removeEventListener('touchstart',start);
            document.removeEventListener('touchmove',move);
            document.removeEventListener('touchend',end);
            opts.box.removeEventListener('wheel',wheel);
            opts.box.removeEventListener('dblclick',autoScale);
        }

        opts.el.addEventListener('mousedown',start);
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',end);

        opts.el.addEventListener('touchstart',start);
        opts.el.addEventListener('touchstart',start);
        document.addEventListener('touchmove',move);
        document.addEventListener('touchend',end);

        opts.box.addEventListener('wheel',wheel);
        opts.box.addEventListener('dblclick',autoScale);

        return {destory:destory};
    }

    function zoom(opts){
        var fromBC = opts.from.getBoundingClientRect();
        var clone = opts.from.cloneNode(true);
        duration = opts.duration || 300;
        if(!opts.out){
            opts.to.style.visibility = 'hidden';
        }else{
            opts.from.style.visibility = 'hidden';
        }

        var setCss = {
            left: fromBC.left+'px',
            top:fromBC.top+'px',
            width:fromBC.width+'px',
            height:fromBC.height+'px',
            maxWidth:'none',
            maxHeight:'none',
            position:'fixed',
            zIndex:99999,
            transform:'none',
            transition:'all '+duration+'ms',
        };

        for(var key in setCss){
            clone.style[key] = setCss[key];
        }
        document.body.appendChild(clone);
        setTimeout(function(){
            var toBC = opts.to.getBoundingClientRect();
            var setCss = {
                left: toBC.left+'px',
                top:toBC.top+'px',
                width:(toBC.width || fromBC.width)+'px',
                height:(toBC.height||fromBC.height)+'px',
                transition:'all '+duration+'ms',
            };
            
            for(var key in setCss){
                clone.style[key] = setCss[key];
            }
        });

        function over(){
            setTimeout(function(){
                opts.to.style.visibility = 'visible';
                clone.parentElement.removeChild(clone);
                if(opts.after){
                    opts.after();
                }
            },duration);
        }



        if(opts.loaded === false && !opts.to.complete){
            opts.to.onload = over;
        }else{
            over();
        }
        
    }

    function lockScroll() {
        var docEle = document.documentElement;
        docEle.style.marginRight = window.innerWidth - docEle.offsetWidth + 'px';
        docEle.style.overflow = 'hidden';
    }
    function unLockScroll() {
        document.documentElement.removeAttribute('style');
    }

    function initSlideList(group,initIndex){
        var slideList = document.createElement('ul');
        slideList.setAttribute('style','height:100%;margin:0;padding:0;display:flex;flex-wrap:no-wrap;');

        var lightbox = document.createElement('div');
        lightbox.setAttribute('style','touch-action:none; width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0,0,0,0);z-index:9999;');
        lightbox.appendChild(slideList);

        var pages = document.createElement('ul');
        pages.setAttribute('style','z-index:99999;width:100%;margin:0;padding:0;position:absolute;left:0;bottom:1rem;display:flex;align-items:center;flex-wrap:wrap;justify-content:center;');
        lightbox.appendChild(pages);

        lockScroll();

        var slideStore = {
            startX:null,oldX:null,translateX:null,
            currentX:null,
            index:0,
            list:[],
            getItemWidth:function(){return document.documentElement.clientWidth},
            getListWidth:function(){return document.documentElement.clientWidth * pictures.length;},
            isCurrentScaling:function(){
                var currentItem = slideList.children[slideStore.index].querySelector('img');
                var transform = window.getComputedStyle(currentItem)['transform'];
                if (transform == 'none') {
                    return false;
                }
                var argsStr = transform.match(/\(([^)]+)\)/)[1];
                var args = argsStr.split(',');
                for (var index in args) {
                    args[index] = parseInt(args[index]);
                }
                if (args.length > 13) {
                    return args[9] > 1;
                } else {
                    return args[0] > 1;
                }
            }
        };

        var resize = function(){
            slideTo(slideStore.index);
        }

        var closePicBox = function(){
            var image = slideStore.list[slideStore.index].to;
            var item = slideStore.list[slideStore.index].from; 
            lightbox.style.transition = 'all 0.5s';
            lightbox.style.backgroundColor = 'rgba(0,0,0,0)';
            zoom({from:image,to:item,out:true,after:function(){
                (lightbox.parentNode || document.body).removeChild(lightbox);
            }});
            slideList.removeEventListener('touchstart',slideStart);
            document.removeEventListener('touchmove',slideMove);
            document.removeEventListener('touchend',slideEnd);
            document.removeEventListener('touchcancel',slideEnd);

            slideList.removeEventListener('mousedown',slideStart);
            document.removeEventListener('mousemove',slideMove);
            document.removeEventListener('mouseup',slideEnd);
            window.removeEventListener('resize',resize);
            slideStore = null;
            unLockScroll();
        }
    
        var pictures = group.querySelectorAll('[picture-view]');
        [].forEach.call(pictures,function(item){
            var li = document.createElement('li');
            li.setAttribute('style','overflow:hidden;flex:0 0 100%;width:100%;height:100%;display:flex;align-items:center;justify-content:center;');
            slideList.appendChild(li);
            var imgbox = document.createElement('div');
            li.appendChild(imgbox);
            var src = item.getAttribute('picture-view');
            var image = document.createElement('div');
            image.setAttribute('after-src',src);
            image.setAttribute('style','-webkit-user-drag:none;transform-origin:0 0;max-width:100%;max-height:100%;display:block;');
            imgbox.appendChild(image);

            slideStore.list.push({
                from:item,
                to:image,
                box:li,
            });

            var pagenum = document.createElement('li');
            pagenum.setAttribute('style','overflow:hidden;margin:0.3rem;width:5px;height:5px;border-radius:50%;background-color:rgb(128,128,128);');
            pages.appendChild(pagenum);
            
            
        });

        document.body.appendChild(lightbox);

        
        var loadImage = function(index){
            var item = slideStore.list[index];
            var box = item.box;
            var currentImage = item.to;
            var theImage = currentImage;

            if(currentImage && currentImage.getAttribute('after-src')){
                var image = new Image();
                image.src = currentImage.getAttribute('after-src');
                image.setAttribute('style', currentImage.getAttribute('style'));
                theImage = image;
                currentImage.replaceWith(image);
                slideStore.list[index].to = image.parentNode.querySelector('img');

                drag = setDrag({el:slideStore.list[index].to,box:box,mask:lightbox,clickCloseTime:310,closing:closePicBox});
                var click_event = function(){
                    clearTimeout(globals.mouseTimer);
                    var _this = this;
                    globals.mouseTimer = setTimeout(function(){
                        if(!globals.mousemoving){
                            closePicBox();
                            box.removeEventListener('click',click_event);
                        }
                    },300);
                }
                box.addEventListener('click',click_event);

            }

            var imgSizeTimer = setInterval(function(){
                if(theImage.naturalWidth > 0 || theImage.width > 0){
                    clearInterval(imgSizeTimer);
                    var parent = theImage.parentNode;
                    if(box && theImage.naturalHeight > box.offsetHeight && parent){
                        parent.style.height = '100%';
                        parent.style.display = 'flex';
                        parent.style.alignItems = 'center';
                    }else{
                        if(parent){
                          parent.style.height = '';  
                          parent.style.display = '';
                          parent.style.alignItems = '';
                        }
                    }
                    // console.log(box.offsetHeight,theImage.naturalHeight)
                }
            },1);
        }
        var slideTo = function(index,transition){
            slideStore.index = index;
            slideStore.translateX = (-index / slideStore.list.length) * slideStore.getListWidth();
            slideList.style.transition = transition || 'none';
            setTranslate(slideList,slideStore.translateX,0);
            [].forEach.call(pages.querySelectorAll('li'),function(item){
                item.style.backgroundColor = 'rgb(128,128,128)';
            })

            pages.querySelectorAll('li')[index].style.backgroundColor = 'rgb(255,255,255)';

            loadImage(index);
        }

        slideTo(initIndex);


        window.addEventListener('resize',resize)

        var slideStart = function(e){
            var ev = e.touches ? e.touches[0] : e;
            slideStore.startX = ev.screenX;
            slideStore.oldX = slideStore.translateX; 
            slideStore.startTime = +new Date();
        }
        
        var slideMove = function(e){
            if(slideStore.startX == null){return;}
            slideList.style.transition = 'none';
            var ev = e.touches ? e.touches[0] : e;
            slideStore.currentX = ev.screenX;

        
            var offsetX =  ev.screenX - slideStore.startX;
            slideStore.translateX = slideStore.oldX + offsetX;
            var minX = slideStore.getItemWidth() - slideStore.getListWidth();
            var maxX = 0;
            if(slideStore.translateX < minX){slideStore.translateX = minX;}
            if(slideStore.translateX > maxX){slideStore.translateX = maxX;}
            var canMove =!globals.dragDowing && !slideStore.isCurrentScaling() || (
                (globals.slideAllowLeft && offsetX > 0) || (globals.slideAllowRight && offsetX < 0)
            )

            if(canMove && Math.abs(offsetX) > 20 ){
                setTranslate(slideList,slideStore.translateX,0);
                globals.slideMoving = true;
            }

            if(Math.abs(offsetX) > 20){
                globals.mousemoving = true;
                clearTimeout(globals.mouseUpTimer);
                globals.mouseUpTimer = setTimeout(function(){
                    globals.mousemoving = false;
                },310);
            }

            var index = Math.round(slideStore.translateX / slideStore.getItemWidth());
            index = Math.abs(index);
            if(slideStore.index != index){
                loadImage(index);
            }
            
            
            e.preventDefault();
            
        }
        

        var slideEnd = function(e){
            if(slideStore.startX==null){return;}

            // 使劲快速滑动时直接切换,否则滑过一半才切换
            var useTime = +new Date() -  slideStore.startTime;
            var index = slideStore.index;
            var distance = slideStore.currentX  - slideStore.startX;
            var scaling = slideStore.isCurrentScaling();//当前项是否已经放大？是则不快速切换
            
            if(!scaling && slideStore.currentX !=null && useTime < 300 && Math.abs(distance) > 30 ){
                index = Math.round(slideStore.translateX / slideStore.getItemWidth());
                index = Math.abs(index) + (distance > 0?-1:1);
                if(index < 0){index = 0;}
                if(index > slideStore.list.length - 1){index = slideStore.list.length - 1; }
                index = -index;
                slideStore.translateX =  index *  slideStore.getItemWidth();
            }

            index = Math.round(slideStore.translateX / slideStore.getItemWidth());
            slideStore.index = Math.abs(index);
            slideTo(slideStore.index,'all 0.3s');

            globals.slideMoving = false;
            slideStore.startX = null;
            slideStore.currentX = null;
        }

        
        
        slideList.addEventListener('touchstart',slideStart);
        document.addEventListener('touchmove',slideMove);
        document.addEventListener('touchend',slideEnd);
        document.addEventListener('touchcancel',slideEnd);

        slideList.addEventListener('mousedown',slideStart);
        document.addEventListener('mousemove',slideMove);
        document.addEventListener('mouseup',slideEnd);

        return {
            getCurrentImage:function(){
                return slideStore.list[slideStore.index].to;
            },
            mask:lightbox,
        }
    }

    //动态绑定[picture-view]事件
    document.body.addEventListener('click',function(e){
        var target = e.target;
        if(typeof target.getAttribute('picture-view') == 'undefined'){
            return;
        }

        var parents = document.querySelectorAll('[picture-group]');
        var group = null;
        var index = 0;
        [].forEach.call(parents,function(el){
            if(el.contains(target)){
                group = el;
                return;
            }
        });

        if(!group){return;}

        var items = group.querySelectorAll('[picture-view]');
        items = [].slice.call(items);
        index = items.indexOf(target);

        if(index<0){return;}

        var slideList  = initSlideList(group,index);
        var currentImage = slideList.getCurrentImage();
        currentImage.style.visibility = 'hidden';
        var box = currentImage.parentNode ? currentImage.parentNode.parentNode : null;
        var imgSizeTimer = setInterval(function(){
            if(currentImage.naturalWidth > 0 || currentImage.width > 0){
                if(box && currentImage.naturalHeight > box.offsetHeight && currentImage.parentNode){
                    currentImage.parentNode.style.height = '100%';
                }
                clearInterval(imgSizeTimer);
                slideList.mask.style.transition = 'all 0.5s';
                slideList.mask.style.backgroundColor = 'rgba(0,0,0,1)';
                var imgLoaded = false;
                var listenLoad = function(){
                    imgLoaded = true;
                    currentImage.removeEventListener('load',listenLoad);
                }
                currentImage.addEventListener('load',listenLoad);
                setTimeout(function(){
                    zoom({from:target,to:currentImage,loaded:imgLoaded});                            
                },1)
                
            }
            
        },1);
    });
    
}

yiuiImageView();
