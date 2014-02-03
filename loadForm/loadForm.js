!function($){
    $.fn.extend({
        /*
          把JSON数据填充进表单，兼容easyui渲染过的表单
        * 20140203 reconstructed by p2227
        * 参数：
        * relateTable:关系表，key-value对象，即JSON数据与表单有不对应时的另外对照表
        * data:要填充的JSON数据
        * callBack:填充完数据后的回调函数，一般说来填充完数据要进行表单验证
        *
        * 用法：
        * $('form').loadForm({data:{key,value}});
        * */
        loadForm:function(conf){
            conf = conf || {};
            conf.relateTable = conf.relateTable || {};

            var rt = conf.relateTable;
            var formObj = this;
            var jsonData = conf.data;
            var newData = {};
            function fill1EasyUI(dom,data1){ //填充值到一个easyUI表单对象上
                //目测针对combobox和datebox，其他表单对象 建议调用 easyUI本身的 form.load方法
                var eDom = $("[comboName='" + dom.name + "']",formObj); //找到easyUI起作用的dom元素（不带name）
                if(eDom.length<=0) return;

                var type = eDom[0].className.match(/(\w*?)-f/); //该dom的类上第一个带 "任意字母-f"的类
                if(type && type.length>0){
                    type = type[1];
                    if(/datebox/i.test(type)){
                        data1 = flitDate(data1);
                    }
                    if (eDom[type]("options").multiple){
                        eDom[type]("setValues", data1.replace(/\s*,\s*/g,",").split(","));
                    } else {
                        eDom[type]("setValue", data1);
                    }
                }else{
                    if(eDom.next("span.datebox").length>0){ //for IE7 IE6
                        eDom.datebox("setValue", flitDate(data1));
                    }
                }
            }

            /* 输入：2012-04-04 00:00:00,2012.2.2,2012/4/7
             * 输出：2012-04-04
             * */
            function flitDate(dStr){
                if(dStr){
                    var dreg = /(\d{4})([-\/.])(\d{1,2})\2(\d{1,2})/;
                    var sval = dStr.match(dreg)[0].replace(dreg,"$1-$3-$4");
                    return sval;
                }else{
                    return dStr;
                }
            }

            function fill1Simple(dom,data1){
                if(dom == undefined){ return;}

                if(dom.className.match(/combo-value/i)){
                    fill1EasyUI(dom,data1); //按照easyUI的法则填充数据
                }else{
                    var $dom = $(dom);
                    if($dom.is("span.om-combo>input")){
                        $dom.omCombo('value',data1)
                    }else{
                        dom.value = data1; //普通的html元素赋值
                    }
                }
            }

            //把网页上需要额外对照的数据也加到填充数据中
            $.each(rt,function(key,value){
                if(jsonData[key]){
                    jsonData[value.replace(/\\*/g,'')]=jsonData[key];
                }
            });

            /* 填充数据的主函数
             *
             * 是用表单为主循环还是数据为主循环快？？？要做测试。
             * 测试结果：以表单为主循环，必需将EasyUI和一般表单项分开处理
             *
             * 必须要把radio,checkbox放在同一起处理，因为你也不清楚对照表里面的项目是text还是radio
             * */
            var nameflag="";//name标记  如果找到有name相同的 data，那就设置标记，以便循环只运行一次
            $("input[name],textArea[name],select[name]",formObj).each(function(){
                //在实际项目中，有这样的需要：JSON数据key总是大写，也要填充到页面；按表单中属性为fillBack的去填充，故在此进行扩充
                var filldata1 = jsonData[this.name] || jsonData[this.name.toUpperCase()] || jsonData[this.getAttribute("fillBack")];
                if(jsonData[this.name] === 0 || jsonData[this.name.toUpperCase()] === 0 || jsonData[this.getAttribute("fillBack")] === 0){
                    filldata1 = 0;
                }
                if(filldata1 === undefined || filldata1 === "" || filldata1 === null|| filldata1 === "null"){
                    return;
                }else{
                    if(/radio/i.test(this.getAttribute("type"))){
                        if(this.name==nameflag){ return; }
                        nameflag = this.name;
                        $("input[name='"+ nameflag +"'][value=" + $.trim(filldata1) + "]").prop("checked",true);
                    }else if(/checkbox/i.test(this.getAttribute("type"))){
                        if(this.name==nameflag){ return; }
                        nameflag = this.name;

                        $("input[name='"+ nameflag +"']").prop("checked",false)//首先要清空原有数据
                        $.each(filldata1.split(','),function(k,v){
                            $("input[name='"+ nameflag +"'][value='" + $.trim(v) + "']").prop("checked",true);
                        })
                    }else{
                        this.value = "";//首先要清空原有数据
                        fill1Simple(this,filldata1);
                    }
                }
            });

            if(typeof conf.callBack == "function"){
                conf.callBack(jsonData);
            }
        }
    });
}(jQuery);