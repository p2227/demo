/**
 * @author gaohuia
 * @site http://www.zeroplace.cn/
 * 使用方式:$("#fm").serializeObject();
 */

(function($){  //把表单序列化成对象
    $.fn.extend({
        serializeObject:function(){
            if(this.length>1){
                return false;
            }
            var arr=this.serializeArray();
            var obj=new Object;
            $.each(arr,function(k,v){
                if(obj[v.name]) {//处理相同名称多个键值的情况,如传递checkbox多选值
                    obj[v.name]=obj[v.name]+','+v.value;
                }
                else {
                    obj[v.name]=v.value;
                }
            });
            return obj;
        },
        extData:function(key,obj){ //扩展Dom节点上绑定的数据
            var dd = this.data(key);
            if(dd){
                this.data(key,$.extend({},dd,obj));
            }else{
                this.data(key,obj);
            }
            return this;
        },
        /*
        * 把form处理成   字符串，为对象或为数组
        * */
        encodeForm:function(type){//type：默认为字符串，1为对象，2为数组
            var aR = [];
            var aO = {};
            $(":input[name]",this).each(function(){
                if(this.value.length>0){
                    var pushVal;
                    switch(type){
                        case 1:
                            aO[this.name]=this.value;
                            break;
                        case 2:
                            aR.push({name:this.name,value:this.value});
                            break;
                        default:
                            aR.push([this.name,this.value].join("="));
                    }
                }
            })
            return (1==type ? aO : (2==type ? aR : aR.join("&")));
        }
    });

    $.extend({
        unParam:function(str,ifdeCode){
            //s_proid=0202&s_unitName=KQY&s_unitAddress=&s_theirArea=&s_theirStreet=&s_contactStaff=&s_legalName=&s_objtype=jywlb_xzxk 转化为对象
            //参数str:需要转化的字符串，ifdeCode:true则表明需要对转化值进行decode处理
            var r = {};
            var units = str.split("&");
            for(var i=0;i<units.length;i++){
                var kv = units[i].split("=");
                var val = kv[1].length>0 ? kv[1] : undefined;
                val = (ifdeCode && val) ? decodeURIComponent(val) : val ;
                if(r[kv[0]]){
                    r[kv[0]] = [r[kv[0]],val].join();
                }else{
                    r[kv[0]]= val;
                }

            }
            return r;
        },
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
    })
})(jQuery);



//所有的combobox都只能选择下拉
if($.fn.combo){
    $.fn.combo.defaults.editable = false;
}
if($.fn.combobox){
    $.fn.combobox.defaults.editable = false;
}
if($.fn.combotree){
    $.fn.combotree.defaults.editable = false;
}
//日期框不可编辑
if($.fn.datebox){
    $.fn.datebox.defaults.editable = false;
}

if($.fn.datetimebox){
    $.fn.datetimebox.defaults.editable = false;
}

if($.fn.datagrid){
    //给datagrid增加鼠标提示，显示其内容
    var oriFunc = $.fn.datagrid.defaults.view.onAfterRender;
    $.fn.datagrid.defaults.view.onAfterRender = function(tgt){
        oriFunc(tgt);
        $(tgt).datagrid("getPanel").find("div.datagrid-body").find("div.datagrid-cell").each(function(){
            var $Obj = $(this)
            $Obj.attr("title",$Obj.text());
        })
    }

    //给datagrid增加一个方法：改变列设置
    /*
     * @param {Object} jq
     * @param {Object} opts:设置，以数组形式提供，[{field:必需，要设置的列；title:给列设置一个新标题，width:给列设置一个新宽度}]
     * width似乎没有效果
     */
    $.extend($.fn.datagrid.methods, {
        setColumnOptions:function(jq, opts){
            return jq.each(function(){
                var grid = $(this);
                var p = grid.datagrid("getPanel");

                $.each(opts,function(optsIdx,optsVal){
                    if(optsVal.field){
                        var td = p.find("div.datagrid-header").find("td[field=" + optsVal.field + "]");
                        var gridOpts = grid.datagrid("getColumnOption",optsVal.field);
                        $.extend(gridOpts,optsVal);
                    }

                    if(td && optsVal.title){
                        var oriText = td.text();
                        var textObj = td.find("span:contains('" + $.trim(oriText) + "')");
                        textObj.text(optsVal.title);
                    }

                    if(td && optsVal.width){
                        var cell =  p.find("td[field=" + optsVal.field + "]").find("div.datagrid-cell");
                        cell.width(optsVal.width);
                    }
                })
            });
        },
        /*
        * 返回特定列的标题
        * */
        getColumnTitles:function(jq,opts){
            var cols = $(jq).data("datagrid").options.columns;
            var reAry = [];
            if(cols.length<=0){
                return reAry;
            }

            for(var i=0;i<cols.length;i++){
                var colsi = cols[i];
                for(var j=0;j<colsi.length;j++){
                    var colsij = colsi[j];
                    reAry.push(/^all$/i.test(opts) ? colsij.title : ( colsij.hidden || colsij.chekcbox ? undefined : colsij.title));
                }
            }
            return reAry;
        }
    });
}
