var u = {
    g:function(id){
        return document.getElementById(id);
    },
    extend:function(tag){
        for(var i=1; i<arguments.length; i++){
            for( var key in arguments[i]){
                tag[key] = arguments[i][key]
            }
        }
    },
    getFinalStyle: function(elem, css){
        if (window.getComputedStyle) {
            return window.getComputedStyle(elem, null)[css];
        } else if (elem.currentStyle) {
            return elem.currentStyle[css];
        } else {
            return elem.style[css];
        }
    },
    getHeight:function(elem){
        if(elem){
            if (this.getFinalStyle(elem, "display") !== "none") {
                return elem.height || elem.offsetHeight || elem.clientHeight;
            } else {
                //获取隐藏掉的函数的高度，先让它显示，获取到高度之后再隐藏，下同
                elem.style.display = "block";
                var h = elem.height || elem.offsetHeight || elem.clientHeight;
                elem.style.display = "none";
                return h;
            }
        }
    },
    getWidth:function(elem){
            if (elem) {
                if (this.getFinalStyle(elem, "display") !== "none") {
                    return elem.width || elem.offsetWidth || elem.clientWidth;
                }
                else {
                    elem.style.display = "block";
                    var w = elem.width || elem.offsetWidth || elem.clientWidth;
                    elem.style.display = "none";
                    return w;
                }
            }
        }
}