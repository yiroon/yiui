/*
将元素固定在顶部
<div fixtop="{parent:$('#main'),offset:10,maxOffset:300}"></div>
parent为参照的对象，表示固定元素位置不能超出参照对象,
offset表示顶部偏移像素,
maxOffset 相对原位置最大偏移,
css 样式(对象方式)
*/
$(function(){
    $$('[fixtop]').each(function(){
        var _this = this;
        var clone = this.cloneNode(true);
        clone.removeAttribute('fixtop');
        var attr = this.getAttribute('fixtop');
        var config = {};
        var isFix = false;
        if(attr){eval('config = '+attr);}
        
        var parent = config.parent || this.parentNode;
        var offset = config.offset || 0;
    
        function scrolling(){
           var mypos = (isFix ? clone : _this).getBoundingClientRect(); 
           var ptpos = parent.getBoundingClientRect();
           var ptBottom = ptpos.top+ptpos.height - mypos.height - offset;

           if(config.maxOffset){
                var mm = mypos.top > 0 || Math.abs(mypos.top) < config.maxOffset;
                if(!mm){
                    ptBottom = config.maxOffset - Math.abs(mypos.top);
                }
           }
           
           if(mypos.top < offset){
                isFix = true;
                _this.css({
                    position:'fixed',
                    top:ptBottom > 0 ? 0 : ptBottom+'px',
                    left:mypos.left+'px',
                    marginLeft:0,
                    marginTop:offset+'px',
                    width:mypos.width+'px'
                });
                if(config.css){
                    _this.css(config.css);
                }
               _this.after(clone);
               $(clone).css({visibility:'hidden'});
           }else if(typeof clone == 'object'){
                isFix = false;
               _this.setAttribute('style', clone.getAttribute('style') )
               $(clone).remove();
               _this.css({visibility:'visible'});
           }
        }
        window.addEventListener('scroll',scrolling)
    });
})
