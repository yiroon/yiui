/*
示例
$alert({
    // text:'出错啦，这是一段文字的描述，非常多的文字,文字排序\nsdfsdfdsfsdf',
    text:'出错了',//文字或dom对象
    padding:null,
    maxWidth:'auto',
    icon:'failed',//图标类型 failed|succeed|warning|confirm|loading
    // showClose:true,//显示X关闭按钮
    mode:'mini',//模式：mini|input|full
    clickMaskClose:true,//点击遮罩关闭
    autoClose:5000,// boolean|number
    displayAutoClose:true,//显示倒计时
    displayMask:true,//显示遮罩
    // escKey:false,//禁用esc键
    input:function(val){},//input模式获取值
    placement:'top center', // 出现位置 left right top bottom center middle
    transitionName:'fade', //指定过渡类名，例如定义好的 .fade-in(出现时),.fade-out(消失时),但填写transitionName不用写后面的-in,或-out
    btns:[
        {
            caption:'确定',
            autoFocus:true,//默认焦点
            fn:function(){
                alert('ok');
            }
        },
        {caption:'OK',fn(){alert('yes')}},
        {caption:'取消',}
    ]
});
*/

var dialogIconList = {
    failed:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="16" height="16" viewBox="0 0 16 16"><g><path d="M8.57882,8L11.1755,5.40235C11.3331,5.24197,11.3331,4.98486,11.1755,4.82447C11.015,4.66624,10.7572,4.66624,10.5967,4.82447L8,7.42212L5.40235,4.82447C5.24197,4.66686,4.98486,4.66686,4.82447,4.82447C4.66624,4.98497,4.66624,5.24279,4.82447,5.40329L7.42212,8L4.82447,10.5976C4.66686,10.758,4.66686,11.0151,4.82447,11.1755C4.98497,11.3338,5.24279,11.3338,5.40329,11.1755L8,8.57788L10.5976,11.1755C10.758,11.3331,11.0151,11.3331,11.1755,11.1755C11.3338,11.015,11.3338,10.7572,11.1755,10.5967L8.57788,8L8.57882,8ZM8,16C3.58172,16,0,12.4183,0,8C0,3.58172,3.58172,0,8,0C12.4183,0,16,3.58172,16,8C16,12.4183,12.4183,16,8,16Z" fill="#E84335" fill-opacity="1"/></g></svg>',
    succeed:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="16" height="16" viewBox="0 0 16 16"><g><path d="M8,16C3.58172,16,0,12.4183,0,8C0,3.58172,3.58172,0,8,0C12.4183,0,16,3.58172,16,8C16,12.4183,12.4183,16,8,16ZM6.88565,10.3529C7.00504,10.3533,7.11984,10.307,7.20565,10.224L12.1035,5.45882C12.2806,5.2885,12.2806,5.00515,12.1035,4.83482C11.9245,4.66199,11.6407,4.66199,11.4616,4.83482L6.88753,9.28659L4.53835,7.00235C4.3593,6.82952,4.07553,6.82952,3.89647,7.00235C3.71877,7.17277,3.71877,7.45688,3.89647,7.62729L6.56376,10.2231C6.64974,10.3064,6.76497,10.3527,6.88471,10.352L6.88565,10.3529Z" fill="#33A954" fill-opacity="1"/></g></svg>',
    warning:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="16" height="16" viewBox="0 0 16 16"><g><path d="M8,0C3.58179,0,0,3.58179,0,8C0,12.4182,3.58179,16,8,16C12.4182,16,16,12.4182,16,8C16,3.58179,12.4182,0,8,0ZM8,13.4286C7.64496,13.4286,7.35714,13.1408,7.35714,12.7857C7.35714,12.4307,7.64496,12.1429,8,12.1429C8.35504,12.1429,8.64286,12.4307,8.64286,12.7857C8.64286,13.1408,8.35504,13.4286,8,13.4286ZM8.92554,3.57232L8.64286,10.2143C8.64286,10.5693,8.35504,10.8571,8,10.8571C7.64496,10.8571,7.35714,10.5693,7.35714,10.2143L7.07446,3.57232C7.07268,3.54857,7.07143,3.52446,7.07143,3.5C7.07143,2.98716,7.48716,2.57143,8,2.57143C8.51284,2.57143,8.92857,2.98716,8.92857,3.5C8.92857,3.52446,8.92732,3.54857,8.92554,3.57232Z" fill="#FF8F1F" fill-opacity="1"/></g></svg>',
    confirm:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="34" height="34" viewBox="0 0 34 34"><g><path d="M18.9564,19.2982C18.9311,18.8931,19.1843,18.4626,19.7162,18.0067C20.248,17.5509,20.8432,17.0444,21.5017,16.4871C22.1602,15.9299,22.7679,15.3032,23.3251,14.6068C23.8823,13.9103,24.1861,13.1062,24.2368,12.1945C24.2874,11.2067,24.1861,10.2824,23.9329,9.42116C23.6797,8.56014,23.2618,7.81945,22.6794,7.19901C22.0968,6.57852,21.3433,6.08456,20.419,5.71727C19.4947,5.35022,18.412,5.1666,17.171,5.1666C15.626,5.1666,14.3408,5.4389,13.315,5.98329C12.2894,6.52773,11.4599,7.18622,10.8268,7.9588C10.1937,8.73114,9.7504,9.52897,9.4972,10.352C9.24401,11.175,9.12996,11.8652,9.15537,12.4225C9.18059,13.0808,9.38963,13.5621,9.78213,13.866C10.1746,14.1698,10.5988,14.3282,11.0548,14.3408C11.5105,14.3535,11.9284,14.227,12.3083,13.961C12.6882,13.6949,12.8781,13.3088,12.8781,12.8024C12.8781,12.4983,12.9731,12.1248,13.163,11.6816C13.353,11.2385,13.6127,10.8143,13.942,10.409C14.2712,10.0039,14.67,9.66181,15.1386,9.38343C15.6071,9.10478,16.1326,8.96551,16.7151,8.96551C17.8547,8.96551,18.7664,9.25044,19.4504,9.82025C20.1341,10.3901,20.4507,11.1055,20.4001,11.9666C20.4001,12.3971,20.2734,12.7959,20.0202,13.1632C19.7668,13.5305,19.4439,13.8849,19.0514,14.227C18.6589,14.5688,18.241,14.9107,17.7978,15.2525C17.3545,15.5944,16.9368,15.9491,16.5441,16.3163C16.1516,16.6834,15.8223,17.0824,15.5565,17.513C15.2905,17.9435,15.1449,18.412,15.1195,18.9184L15.1575,20.3621C15.1575,20.742,15.3349,21.1028,15.6893,21.4449C16.044,21.7867,16.5125,21.9703,17.095,21.9956C17.6775,21.9703,18.1397,21.7804,18.4816,21.4258C18.8234,21.0713,18.9819,20.666,18.9564,20.2102L18.9564,19.2982L18.9564,19.2982ZM17.0189,28.6435C17.6774,28.6435,18.2283,28.422,18.6715,27.9787C19.1148,27.5356,19.3363,26.9974,19.3363,26.3642C19.3363,25.7057,19.1148,25.1549,18.6715,24.7116C18.2283,24.2685,17.6774,24.0468,17.0189,24.0468C16.3606,24.0468,15.8097,24.2685,15.3666,24.7116C14.9232,25.1549,14.7018,25.7057,14.7018,26.3642C14.7018,26.9974,14.9232,27.5356,15.3666,27.9787C15.8097,28.422,16.3606,28.6435,17.0189,28.6435ZM16.9811,0C19.3363,0,21.546,0.449451,23.61,1.34851C25.6742,2.2476,27.4787,3.46335,29.0234,4.99549C30.5684,6.52766,31.7839,8.32581,32.6704,10.39C33.5569,12.454,34,14.6637,34,17.0189C34,19.3743,33.5569,21.5776,32.6704,23.6292C31.7839,25.6805,30.5684,27.4787,29.0234,29.0234C27.4787,30.5684,25.6742,31.7839,23.61,32.6704C21.546,33.5569,19.3363,34,16.9811,34C14.6257,34,12.4224,33.5569,10.3708,32.6704C8.3195,31.7839,6.52134,30.5684,4.97658,29.0234C3.43163,27.4787,2.21607,25.6805,1.3296,23.6292C0.443136,21.5775,0,19.3743,0,17.0189C0,14.6637,0.443136,12.454,1.3296,10.39C2.21607,8.32581,3.43163,6.52765,4.97658,4.99548C6.52134,3.46335,8.3195,2.2476,10.3708,1.34851C12.4224,0.449451,14.6257,0,16.9811,0Z" fill="#FF8F1F" fill-opacity="1"/></g></svg>',
    loading:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="16" height="16" viewBox="0 0 16 16"><g><path d="M8,3.33333C7.6,3.33333,7.33333,3.06667,7.33333,2.66667L7.33333,0.666667C7.33333,0.266667,7.6,0,8,0C8.4,0,8.66667,0.266667,8.66667,0.666667L8.66667,2.66667C8.66667,3.06667,8.4,3.33333,8,3.33333ZM8,16C7.6,16,7.33333,15.7333,7.33333,15.3333L7.33333,13.3333C7.33333,12.9333,7.6,12.6667,8,12.6667C8.4,12.6667,8.66667,12.9333,8.66667,13.3333L8.66667,15.3333C8.66667,15.7333,8.4,16,8,16ZM2.66667,8.66667L0.666667,8.66667C0.266667,8.66667,0,8.4,0,8C0,7.6,0.266667,7.33333,0.666667,7.33333L2.66667,7.33333C3.06667,7.33333,3.33333,7.6,3.33333,8C3.33333,8.4,3.06667,8.66667,2.66667,8.66667ZM15.3333,8.66667L13.3333,8.66667C12.9333,8.66667,12.6667,8.4,12.6667,8C12.6667,7.6,12.9333,7.33333,13.3333,7.33333L15.3333,7.33333C15.7333,7.33333,16,7.6,16,8C16,8.4,15.7333,8.66667,15.3333,8.66667ZM12.6,6C12.4,6,12.1333,5.86667,12,5.66667C11.8,5.33333,11.9333,4.93333,12.2667,4.73333L14,3.73333C14.3333,3.53333,14.7333,3.66667,14.9333,4C15.1333,4.33333,15,4.73333,14.6667,4.93333L12.9333,5.93333C12.8667,6,12.7333,6,12.6,6ZM1.66667,12.3333C1.46667,12.3333,1.2,12.2,1.06667,12C0.866667,11.6667,1,11.2667,1.33333,11.0667L3.06667,10.0667C3.4,9.86667,3.8,10,4,10.3333C4.2,10.6667,4.06667,11.0667,3.73333,11.2667L2,12.2667C1.86667,12.3333,1.73333,12.3333,1.66667,12.3333ZM10.6667,4.06667C10.5333,4.06667,10.4667,4.06667,10.3333,4C10,3.8,9.93333,3.4,10.0667,3.06667L11.0667,1.33333C11.2667,1,11.6667,0.933333,12,1.06667C12.3333,1.26667,12.4,1.66667,12.2667,2L11.2667,3.73333C11.1333,3.93333,10.8667,4.06667,10.6667,4.06667ZM4.33333,15C4.2,15,4.13333,15,4,14.9333C3.66667,14.7333,3.6,14.3333,3.73333,14L4.73333,12.2667C4.93333,12,5.33333,11.8667,5.66667,12.0667C6,12.2667,6.06667,12.6667,5.93333,13L4.93333,14.6667C4.8,14.8667,4.53333,15,4.33333,15ZM3.4,6C3.26667,6,3.13333,6,3.06667,5.93333L1.33333,4.93333C1,4.73333,0.866667,4.33333,1.06667,4C1.26667,3.66667,1.66667,3.6,2,3.73333L3.73333,4.73333C4.06667,4.93333,4.13333,5.33333,3.93333,5.66667C3.86667,5.86667,3.6,6,3.4,6ZM14.3333,12.3333C14.2,12.3333,14.1333,12.3333,14,12.2667L12.2667,11.2667C11.9333,11.0667,11.8667,10.6667,12,10.3333C12.2,10,12.6,9.93333,12.9333,10.0667L14.6667,11.0667C15,11.2667,15.0667,11.6667,14.9333,12C14.8,12.2,14.6,12.3333,14.3333,12.3333ZM5.33333,4.06667C5.13333,4.06667,4.86667,3.93333,4.73333,3.73333L3.73333,2C3.6,1.66667,3.66667,1.26667,4,1.06667C4.33333,0.866667,4.73333,1,4.93333,1.33333L5.93333,3.06667C6.06667,3.4,6,3.8,5.66667,3.93333C5.53333,4,5.46667,4.06667,5.33333,4.06667ZM11.6667,15C11.4667,15,11.2,14.8667,11.0667,14.6667L10.0667,12.9333C9.86667,12.6,10,12.2,10.3333,12C10.6667,11.8,11.0667,11.9333,11.2667,12.2667L12.2667,14C12.4667,14.3333,12.3333,14.7333,12,14.9333C11.8667,15,11.8,15,11.6667,15Z" fill="#3D3D3D" fill-opacity="1"/><animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 8 8" to="360 8 8" dur="3s" repeatCount="indefinite" /> </g></svg>'
};

function $alert(opts,rightOpts){
    if(typeof opts == 'string'){
        var text = opts;
        opts = typeof rightOpts == 'object' ? rightOpts : {};
        opts.text = text;
    }

    var app = {
        data:{
            scrollbarWidth:window.innerWidth - document.documentElement.clientWidth,
            getTopZIndex:function(){
                var  max = 0;
                [].forEach.call(document.querySelectorAll('body *'),function(el){
                    var zIndex = getComputedStyle(el).zIndex;
                    var beforeZIndex =  getComputedStyle(el,'::before').zIndex;
                    var afterZIndex =  getComputedStyle(el,'::after').zIndex;
                    zIndex = /[0-9]+/.test(zIndex) ? zIndex : 0;
                    beforeZIndex = /[0-9]+/.test(beforeZIndex) ? beforeZIndex : 0;
                    afterZIndex = /[0-9]+/.test(afterZIndex) ? afterZIndex : 0;
                    max = Math.max(max,zIndex,beforeZIndex,afterZIndex);
                });
                return max+1;
            }
        },
        style:null,
        frame:null,
        mainContainer:null,
        box:null,
        autoFocusEle:null,
        holder:null,
        initStyle:function(){
            if(!this.style){
                this.style = document.createElement('style');
                this.style.innerHTML = '@keyframes alert-default-in{0%{opacity:0;transform:scale3d(4,4,1)}100%{opacity:1}}@keyframes alert-default-out{0%{opacity:1}100%{opacity:0;transform:scale3d(4,4,1)}}@keyframes alert-mini-in{0%{opacity:0;transform:scale(.1)}100%{opacity:1;transform:scale(1)}}@keyframes alert-mini-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.1)}}.alert-default-in{animation:alert-default-in .3s ease-out}.alert-default-out{animation:alert-default-out .3s ease-out}.alert-mini-in{animation:alert-mini-in .3s ease-out}.alert-mini-out{animation:alert-mini-out .3s ease-out}.msgicon-ani-fade-zoom-out{animation:fade-zoom-out .1s ease-out}.alert-btn:focus{color:#00a0e9}.lock-scroll{overflow:hidden;margin-right:'+this.data.scrollbarWidth+'px}.yi-alert-box{position:relative;margin:1rem;background-color:#fff;border-radius:.5rem;overflow:hidden;box-shadow:0 0 .8rem rgba(0,0,0,0.1);pointer-events:all}.yi-alert-full .yi-alert-box{width:100%;height:100%;margin:0;border-radius:0;overflow:hidden;overflow-y:auto;}.yi-alert-frame{position:fixed;width:100%;height:100%;left:0;top:0;font-size:14px}.yi-alert-mask{position:fixed;width:100%;height:100%;left:0;top:0;background-color:rgba(0,0,0,0.4);opacity:0;transition:all .3s}.yi-alert-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center}.yi-alert-container{display:flex;flex-wrap:wrap;align-items:center;padding:2rem;position:relative;flex-wrap:nowrap}.yi-alert-icon{display:block;width:2rem;height:2rem;animation:alert-mini-in .6s ease-out;margin-right:1rem}.yi-alert-icon>svg{width:100%;height:100%}.yi-alert-text{min-width:100px;max-width:300px;text-align:center;word-break:break-all}.yi-alert-close{margin-left:.5rem;cursor:pointer;right:.5rem;top:.5rem;position:absolute}.yi-alert-btn{background-color:transparent;border:none;outline:0;cursor:pointer;flex:1;padding:.5rem;transition:all .2s;white-space:nowrap}.yi-alert-btn:focus{text-shadow:0 4px 3px rgba(0,0,0,0.3);}.yi-alert-btn:active{box-shadow:inset 0 0 .5rem rgba(0,0,0,0.2);text-shadow:0 -1px 3px rgba(0,0,0,0.3);}.yi-alert-btn:not(:first-child){border-left:1px solid #e5e5e5}.yi-alert-btns{display:flex;border-top:1px solid #e5e5e5}.yi-alert-autoclose{color:#888;margin-left:.5rem;font-size:12px}.yi-alert-inputcontainer{display:block;padding:1rem}.yi-alert-input{border:1px solid #e5e5e5;width:100%;padding:.5rem;box-sizing:border-box;outline:0;border-radius:.3rem;font:inherit}.yi-alert-mini .yi-alert-box{pointer-events:all;padding:.3rem .5rem}.yi-alert-mini .yi-alert-icon{width:1rem;height:1rem}.yi-alert-mini .yi-alert-text{min-width:auto}.yi-alert-mini .yi-alert-container{padding:.5rem}.yi-alert-mini .yi-alert-btns{border-top:0;border-left:1px solid #e5e5e5;margin-left:1rem}.yi-alert-mini .yi-alert-btn{padding:0 .5rem}.yi-alert-mini .yi-alert-close{position:static}.yi-alert-nomask .yi-alert-mask{pointer-events:none;background-color:transparent}.yi-alert-nomask{pointer-events:none;background-color:transparent}';
                document.querySelector('head').appendChild(this.style);
            }
        },
        init:function(){
            this.frame = document.createElement('div');
            this.frame.classList.add('yi-alert-frame');
            this.frame.style.zIndex = this.data.getTopZIndex();
            this.frame.innerHTML = '<div class="yi-alert-mask"></div><div class="yi-alert-wrap"><div class="yi-alert-box"><div class="yi-alert-container"></div></div></div>';
            (
                (typeof opts.displayMask != 'undefined' && opts.displayMask !==true) 
                || opts.displayMask == false
                || (typeof opts.displayMask == 'undefined' && opts.mode=='mini')//mini模式默认无遮罩
            ) && this.frame.classList.add('yi-alert-nomask');
            this.mainContainer = this.frame.querySelector('.yi-alert-container');
            if(typeof opts.padding !='undefined'){
                this.mainContainer.style.padding = opts.padding;
            }
            if(opts.clickMaskClose && this.frame.querySelector('.yi-alert-mask') ){
                this.frame.querySelector('.yi-alert-mask').onclick = function(){
                    app.alertClose();
                }
            }
            if(opts.mode == 'full'){
                this.frame.classList.add('yi-alert-full');
            }
            this.box = this.frame.querySelector('.yi-alert-box');
            if(typeof opts.maxWidth != 'undefined'){
                this.box.style.maxWidth = opts.maxWidth;
            }
            this.setPlacement();
            this.setIcon();
            this.setText();
            this.holder = document.createElement('div');
            this.mainContainer.appendChild(this.holder);
            this.setInput();
            this.setCloseBtn();
            this.setButtons();
            opts.mode == 'mini' && this.frame.classList.add('yi-alert-mini');
            document.body.appendChild(this.frame);
            this.alertShow();
            
        },
        setInput:function(){//input模式
            if(opts.mode == 'input'){
                var input = document.createElement('input');
                input.classList.add('yi-alert-input');
                input.style.marginTop = '0.5rem';
                this.mainContainer.classList.add('yi-alert-inputcontainer');
                this.mainContainer.appendChild(input);
                this.autoFocusEle = input;
                opts.btns = [
                    {caption:'确定',fn:function(){
                        if(typeof opts.input == 'function'){
                            opts.input(input.value);
                        }
                    }},
                    {caption:'取消'}
                ];
                var _this = this;
                input.addEventListener('keydown',function(e){
                    if(e.keyCode == 13){
                        opts.btns[0].fn();
                        _this.alertClose();
                    }
                })
            }
        },
        setText:function(){
            if(typeof opts.text == 'undefined') return;

            var textEle = document.createElement('div');
            this.mainContainer.appendChild(textEle);

            if(typeof opts.text == 'object'){
                textEle.appendChild(opts.text);
            }else{
                textEle.classList.add('yi-alert-text');
                textEle.innerText = opts.text;
            }
        },
        setIcon:function(){
            //图标
            if(opts.icon && opts.mode != 'input'){
                var icon = document.createElement('div');
                icon.innerHTML = dialogIconList[opts.icon];
                icon.classList.add('yi-alert-icon');
                this.mainContainer.appendChild(icon);
                !opts.text && (icon.style.marginRight = 0);
            }
        },
        setCloseBtn:function(){//关闭图标
            if(opts.showClose){
                var closeEle = document.createElement('div');
                closeEle.classList.add('yi-alert-close');
                closeEle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="10" height="10" viewBox="0 0 10 10"><g><g><path d="M5.62254,5.00032L9.87077,0.751686C10.0429,0.579854,10.043,0.3011,9.87092,0.129182C9.69888,-0.042735,9.41992,-0.0426672,9.24796,0.129334L5.00018,4.37797L0.751949,0.128893C0.579965,-0.0429644,0.301124,-0.0429644,0.12914,0.128893C-0.0428437,0.300751,-0.0428439,0.579388,0.12914,0.751246L4.37737,4.99988L0.12914,9.24851C-0.0429873,9.42035,-0.0430554,9.6991,0.128988,9.87102C0.301031,10.0429,0.579989,10.0429,0.751949,9.87087L5.00018,5.62223L9.24796,9.87087C9.41991,10.043,9.69893,10.0431,9.87101,9.87111C10.0431,9.69916,10.043,9.42033,9.87077,9.24851L5.62254,5.00032Z" fill="#A2A2A2" fill-opacity="1"/></g></g></svg>';
                this.mainContainer.appendChild(closeEle);
                closeEle.addEventListener('click',this.alertClose.bind(this));
            }
        },
        setPlacement:function(){//出现位置
            var _this = this;
            if(opts.placement){
                var placementList = {
                    left:{justifyContent:'flex-start'},
                    right:{justifyContent:'flex-end'},
                    top:{alignItems:'flex-start'},
                    bottom:{alignItems:'flex-end'},
                    middle:{alignItems:'center'},
                    center:{justifyContent:'center'},
                };
                opts.placement += ' center';
                var placement = opts.placement.match(/[^\s]+/g);
                placement = placement.slice(0,2);
                placement.forEach(function(key){
                    if(placementList[key]){
                        var css = placementList[key];
                        for(var attr in css){
                            _this.frame.querySelector('.yi-alert-wrap').style[attr] = css[attr];
                        }
                    }
                })
            }
        },
        setButtons:function(){//遍历按钮
            var _this = this;
            if(typeof opts.mode == 'undefined' && !opts.btns){
                opts.btns  = [{caption:'确定',autoFocus:true}];
            }
            if(typeof opts.btns == 'object'){
                var btnsContainer = document.createElement('div');
                btnsContainer.classList.add('yi-alert-btns');
                opts.btns.forEach(function(item,index){
                    var btn = document.createElement(item.type||'button');
                    btn.innerHTML = item.caption;
                    btn.classList.add('yi-alert-btn');
                    btnsContainer.appendChild(btn);
                    if(item.autoFocus){
                        _this.autoFocusEle = btn;
                    }
                    btn.addEventListener('click',item.fn && item.fn);
                    !item.noClose && btn.addEventListener('click',_this.alertClose.bind(_this));
                });
                if(opts.btns.length > 0){
                    if(opts.mode == 'mini'){
                        _this.holder.appendChild(btnsContainer);
                    }else{
                        _this.box.appendChild(btnsContainer);
                    }
                    
                }
            }
        },
        setAutoClose: function(){//自动关闭
            var _this = this;
            var sleep = typeof opts.autoClose == 'number' ? opts.autoClose :3000;
            setTimeout(this.alertClose.bind(this),sleep);
            if(opts.autoClose && opts.displayAutoClose){
                var autoCloseEle = document.createElement('div');
                autoCloseEle.classList.add('yi-alert-autoclose');
                var second = Math.floor(sleep / 1000);
                autoCloseEle.innerText = second+'s';
                this.holder.appendChild(autoCloseEle);
                var autoCloseTimer = setInterval(function(){
                    second --;
                    second <= 0 && clearInterval(autoCloseTimer);
                    autoCloseEle.innerText = second+'s';
                },1000);
            }
        },
        keyDownClose:function(e){
            if(e.keyCode == 27){
                app.alertClose();
            }
        },
        alertTransition:{
            in:function(){
                var name = 'alert-default-in';
                if(opts.transitionName){
                    name = opts.transitionName+'-in';
                }else if(opts.mode == 'mini' || opts.mode == 'full'){
                    name = 'alert-mini-in';
                }
                app.box.classList.add(name);
            },
            out:function(){
                var name = 'alert-default-out';
                if(opts.transitionName){
                    name = opts.transitionName+'-out';
                }else if(opts.mode == 'mini' || opts.mode == 'full'){
                    name = 'alert-mini-out';
                }
                app.box.classList.add(name);
            }
        },
        alertClose:function(){
            var _this = this;
            this.alertTransition.out();
            window.removeEventListener('keydown',this.keyDownClose);
            opts.mode != 'mini' && document.querySelector('html').classList.remove('lock-scroll');
            setTimeout(function(){
                document.querySelector('body').removeChild(_this.frame);
                document.querySelector('head').removeChild(_this.style);
            },280);
            this.frame.querySelector('.yi-alert-mask').style.opacity = '0';
        },
        alertShow:function(){
            var _this = this;
            this.frame.querySelector('.yi-alert-mask').style.opacity = '1';
            opts.mode != 'mini' && document.querySelector('html').classList.add('lock-scroll');
            opts.autoClose && this.setAutoClose(); //自动关闭
            if(typeof input == 'object'){input.focus(); }//input模式时，自动设置焦点
            this.alertTransition.in();
            this.autoFocusEle &&  setTimeout(function(){ _this.autoFocusEle.focus() },100);//设置按钮焦点
        },
        bindEscKey:function(){
            opts.escKey = typeof opts.escKey == 'undefined' ? true : false;
            opts.escKey && window.addEventListener('keydown',this.keyDownClose);
        },
    };
    app.initStyle();
    app.init();
    app.bindEscKey();
    
    
    return {
        close:app.alertClose.bind(app)
    }
}
