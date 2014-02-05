var u = {
    g:function(id){
        return document.getElementById(id);
    },
    extend:function(tag,src){
        for(var key in src){
            tag[key]=src[key];
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
                return elem.offsetHeight || elem.clientHeight || elem.height;
            } else {
                //获取隐藏掉的函数的高度，先让它显示，获取到高度之后再隐藏，下同
                elem.style.display = "block";
                var h = elem.offsetHeight || elem.clientHeight || elem.height;
                elem.style.display = "none";
                return h;
            }
        }
    },
    getWidth:function(elem){
            if (elem) {
                if (this.getFinalStyle(elem, "display") !== "none") {
                    return elem.offsetWidth || elem.clientWidth || elem.width;
                }
                else {
                    elem.style.display = "block";
                    var w = elem.offsetWidth || elem.clientWidth || elem.width;
                    elem.style.display = "none";
                    return w;
                }
            }
        }
}