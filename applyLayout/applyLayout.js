!function($){
    $.extend({
        /*
         * 登记表布局的实现，
         * 以body为底，一个计算大小的滚动center区域(id为center-layout)，一个固定高度为30的底部区域(id为south-layout)
         * 参数为真时检测适用条件
         */
        applyLayout:function(ifDetect){
            var scrollDom = $("#center-layout")
            var southLayout = $("#south-layout");
            if(ifDetect && (scrollDom.length<=0 ||southLayout.length<=0)){
                return;//不适用于该布局
            }
            $("html").css({height: "100%",overflow: "hidden"});

            scrollDom.height($('body').parent().innerHeight() - southLayout.outerHeight()-5);

            $('tr.list_colspan').bind('click.layout',function(){
                $(this).nextUntil('tr.list_colspan').toggle(100);//点击分栏目的行会收缩/展开后面的行
            }).filter("[close='true']").click()
        }
    });
}(jQuery)