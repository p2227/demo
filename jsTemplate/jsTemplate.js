
jsParser = {
    //模板库
    template:{
        /* @a{b}，题目模板中，若a为空，则取数据上属性为b的值；否则取了数据上属性为b的值后，再对照取a子模板中相应的值
         * 若a="f"，则b要这样写  函数名:参数1,参数2,参数3……
         *
         * subjectId 该题目的唯一id,作为提交表单时候的name，如果是分值则加后缀scoreValue
         * scoreValue 该题目的分值，作为题目表中的填空类型的value
         * subjectType 必做/选做
         * td4BizAnsweritemList 题目表中的选择题选项
         *
         * answerValue 表头表尾填空题目的答案
         * pkAnswer 表头跟他中
         * selectType :无星/一星/两星
         */
        //HTML,题目表中
        "JD-SUB-1":'<input class="easyui-numberbox" name="@{subjectId}scoreValue" id="@{subjectId}scoreValue" value="@f{setScore:score,scoreValue}" style="width:90%" @s{subjectType} min="0" @f{boxReadOnly:pkAnswer,reasonableGap} @f{fullScore:score}/>',
        //"JD-SUB-3":'<select name="@{subjectId}" style="width:90%" required="@s{subjectType}" panelHeight="60" selectType="@s{selectType}">@{td4BizAnsweritemList}</select>',
        "JD-SUB-3":'<input type="checkbox" id="@{subjectId}keyCheck" selectType="@s{selectType}" @f{selectYesNo:pkAnswer} @f{boxDisable1:reasonableGap} title="勾选则表示该项达标/有分，不勾选则表示该项不达标/无分"/>\
					<input type="hidden" name="@{subjectId}" value="@{pkAnswer}" chkbox="@{subjectId}keyCheck"/>',
        //HTML,表头表尾
        "JD-SUB-5":'<input class="easyui-datetimebox" name="@{subjectId}quanDate" value="@{quanDate}" @s{subjectType} baseDataType="@{baseDataType}" showSeconds="false"/>\
					<input type="hidden" id="@{subjectId}" name="@{subjectId}" value="@{answerValue}"/>',
        "JD-SUB-6":'<input class="easyui-numberbox" name="@{subjectId}" value="@{answerValue}" style="width:90%" @s{subjectType} min="0" baseDataType="@{baseDataType}"/>',
        "JD-SUB-7":'<input class="easyui-validatebox" name="@{subjectId}" value="@{answerValue}" style="width:90%" @s{subjectType} baseDataType="@{baseDataType}"/>',
        "JD-SUB-8":'<select class="easyui-combobox" name="@{subjectId}" @s{subjectType} panelHeight="120" baseDataType="@{baseDataType}">@{td4BizAnsweritemList}</select>',
        "JD-SUB-9":'<span id="@{subjectId}">@{subjectContent}<span>',
        //合理缺项
        "reaGap":'<input type="checkbox" id="@{subjectId}reaCheck" @f{selectYesNo:reasonableGap} reaGap="1" @f{boxDisable0:pkAnswer} title="勾选则表示该项为合理缺项"/>\
					<input type="hidden" name="@{subjectId}reaGap" value="@{reasonableGap}" chkbox="@{subjectId}reaCheck"/>',
        f:{ //function 函数
            /*
             * 处理题目表中一星两星题选择项
             * 参数:pkAnswer
             * 简要逻辑：勾选则该题有分，不勾选则该题无分
             * */
            selectYesNo:function(v){
                return v=="1" ? 'checked="checked"' : "";
            },
            setScore:function(defaultScore,thisScore){ //分数默认满分
                return thisScore || defaultScore;
            },
            boxDisable0:function(boxVal){  //某值为0时(即不勾选)返回disabled
                return  boxVal=="0" ? 'disabled="disabled"' : "";
            },
            boxDisable1:function(boxVal){ //某值为1时(即勾选)返回disabled
                return  boxVal=="1" ? 'disabled="disabled"' : "";
            },
            boxReadOnly:function(pkAnswer,reasonableGap){
                if((reasonableGap == "0" || reasonableGap == "") && (pkAnswer == "1" || pkAnswer == "")){
                    return "";
                }else{
                    return 'readonly="readonly"';
                }
            },
            fullScore:function(score){
                return score.length>0 ? ['max="',score,'" title="该题满分为',score,'分"'].join("") : 'max="0" readonly="readonly"'
            }
        },
        m:{ //mark 纯HTML标记
            "SUB-AVAIL-1":'<label class="bitian">*</label>',
            "SUB-AVAIL-2":'<label class="bitian">&nbsp;</label>'
        },
        s:{ //subject题目中
            "SUB-AVAIL-1":'eValid="required"',
            "SUB-AVAIL-2":"",
            "WJJDLHFJXZTLB01":"1",
            "WJJDLHFJXZTLB02":"2"
        },
        t:{ //table 题目表中
            "WJJDLHFJXZTLB01":"※",
            "WJJDLHFJXZTLB02":"※※"
        }
    },
    //渲染表单输入项，核心函数
    fillType:function(row){
        var tempItem = this.template[row.subjectAttr];
        if(!tempItem){
            return "";
        }
        return this.template[row.subjectAttr].replace(/@(\w*?)\{(\w*?):?([\w,]*)\}/g,function(str0,idx,func,tag){
            switch(idx){
                case "f":
                    var tempArry = tag.split(',');
                    var argArry = [];
                    if(tempArry.length>0){
                        $.each(tempArry,function(taIdx,taVal){
                            argArry.push(row[taVal]);
                        })
                    }
                    return jsParser.template.f[func].apply(this,argArry);
                    break;
                default:
                    var replaceData = row[tag];
                    if(replaceData){
                        switch(typeof replaceData){
                            case "string": //字符串
                                return jsParser.template[idx] ? jsParser.template[idx][replaceData] : replaceData
                                break;
                            case "object": //选项
                                var repArray = []
                                $.each(replaceData,function(rdIdx,rdVal){ //在选项中判断值
                                    repArray.push('<option value="',rdVal.uniqueID,'"');
                                    if(row.pkAnswer == rdVal.uniqueID){
                                        repArray.push(' selected="selected"')
                                    }
                                    repArray.push('>',rdVal.content,'</option>');
                                })
                                return repArray.join("");
                                break;
                            default:
                                return "";
                                break;
                        }
                    }else{
                        return "";
                    }
                    break;
            }
        });


    },
    //渲染表头表尾
    headAndTail:function(renderTo,jd){
        var rs = jd.rows; //行
        var tg = $(renderTo);//目标
        var myHtml = [];

        if(rs.length<=0 || rs[0]==null) return;

        for(var i=0;i<rs.length;i++){
            myHtml.push("<tr>");
            switch(rs[i].subjectAttr){
                case "JD-SUB-9"://“注”类型的，需要一整行去渲染
                    if(i % 2 ==1){ //如果上一行渲染到一半，则继续填充完一半
                        myHtml.push("<th></th><td></td></tr><tr>");
                    }
                    myHtml.push('<td colspan="4">',this.fillType(rs[i]),'</td>');
                    break;

                default:
                    for (var j=0;j<2;j++){
                        myHtml.push("<th>",rs[i].subjectContent,"</th>");
                        myHtml.push("<td>",this.fillType(rs[i]),"</td>");
                        if(j==0 && ++i == rs.length){
                            myHtml.push("<th></th><td></td>");
                            break;
                        }
                    }
            }
            myHtml.push("</tr>");
        }
        tg.append(myHtml.join(""));
        //$(".easyui-datetimebox",renderTo).datetimebox(this.dtBoxConf);

        $("[baseDataType=WJJDJCSJLB15]",renderTo).datetimebox({
            onHidePanel:function(){
                var subId = (this.getAttribute("comboName") || this.name).substr(0,32);
                var ddStr = $(this).datetimebox("getValue"); //2012-08-28 17:51:23
                var ddRe = ddStr.match(/\d+/g);
                $("#"+subId).val([ddRe[0],"年",ddRe[1],"月",ddRe[2],"日",ddRe[3],"时"].join(""));
            }
        })

        $("th",renderTo).each(function(){ //加入必填标志，红色的*
            var requriedMark = jsParser.template.s["SUB-AVAIL-1"];
            var obj = $(this);
            var tdObj = obj.next("td");
            if(tdObj.length>0){
                if(tdObj.find('input[' + requriedMark + '],select[' + requriedMark + ']').length>0){
                    obj.append(jsParser.template.m["SUB-AVAIL-1"]);
                }else{
                    obj.append(jsParser.template.m["SUB-AVAIL-2"]);
                }
            }
        })

        $.parser.parse(renderTo); //easyUI渲染
        $v.init(renderTo);
    },
    setComboboxOriData:function(cmb){ //设置combobox有A级或无A级
        if(cmb.data("OriData") == undefined && cmb.data("noAData") == undefined){
            var addData = [];
            var noAData = [];
            var od = cmb.combobox("getData");
            addData = od.slice(0);
            noAData = od.slice(1);

            cmb.data("OriData",addData);
            cmb.data("noAData",noAData);
        }
    },
    calScore:function(e){ //计算分数
        var zdfObj = $("[baseDataType=WJJDJCSJLB06]"); //总得分
        var hdzfObj = $("[baseDataType=WJJDJCSJLB07]"); //核定总分
        var bhfObj = $("[baseDataType=WJJDJCSJLB09]"); //标化分
        /*
         * 遍历每一行，累加总分
         * 如果是合理缺项，则不累加对应的总分到核定总分，不累加对应的得分到总得分
         * */
        var zdfVal = 0;
        var hdzfVal = 0;

        $(":text[name$=scoreValue]").each(function(){
            var subId = this.name.substr(0,32);
            if(!$("#"+subId+"reaCheck").prop("checked")){
                zdfVal += (parseFloat(this.value,10) || 0) ;
                hdzfVal += (parseFloat(this.getAttribute("max"),10) || 0) ;
            }
        })

        var zdfPrec = jsGlobal.Util.getNumPrec(zdfVal);
        var hdzfPrec = jsGlobal.Util.getNumPrec(hdzfVal);
        var Prec = zdfPrec > hdzfPrec ? zdfPrec : hdzfPrec ;

        var bhfVal = (zdfVal/hdzfVal*100).toFixed(Prec);

        zdfObj.val(zdfVal);
        hdzfObj.val(hdzfVal);
        bhfObj.val(bhfVal)
    },
    //算不合格关键项，重点项，一般项
    calKeyItem:function(e){
        var gjxObj = $("[baseDataType=WJJDJCSJLB18]"); //关键项
        var zdxObj = $("[baseDataType=WJJDJCSJLB19]"); //重点项
        var ybxObj = $("[baseDataType=WJJDJCSJLB20]"); //一般项

        var gjxVal = 0;
        var zdxVal = 0;
        var ybxVal = 0;
        $(":checkbox[selectType]").each(function(){
            var subId = this.id.substr(0,32);
            if(!$("#"+subId+"reaCheck").prop("checked")){
                if(!this.checked){
                    var selectTypeValue = $("#"+subId+"selectTypeValue").text();
                    if(selectTypeValue =='***') gjxVal +=1;
                    if(selectTypeValue =='**') zdxVal +=1;
                    if(selectTypeValue =='*')  ybxVal +=1;
                }
            }
        })

        gjxObj.val(gjxVal);
        zdxObj.val(zdxVal);
        ybxObj.val(ybxVal);
    },
    specification:function(e){ //现场笔录和监督意见书
        var subId = this.id.substr(0,32); //对应的题目Id
        var valPrep = this.value;
        var val = $(this).attr("max");
        if(parseInt(valPrep) < parseInt(val)){
            $("#"+subId+"suggestionName").removeAttr("disabled");
            $("#"+subId+"specificationName").removeAttr("disabled");
        }else{
            $("#"+subId+"suggestionName").attr("disabled","disabled");
            $("#"+subId+"specificationName").attr("disabled","disabled");
        }
    },
    calLevel:function(){
        //点击checkbox时候计算分级
        //改变分数时计算分类，关联是否合理缺项
        if(this.checked){ //达标，有分
            switch(this.getAttribute("selectType")){
                case "2":
                    if($(":checkbox[selectType=2]:checked").length == $(":checkbox[selectType=2]").length){
                        var jlObj = $("[baseDataType=WJJDJCSJLB10]");//结论
                        jlObj.data("db",1);
                        jlObj.combobox("enable");
                    }
                    break;

                case "1":
                    var myScoreValObj = $("#"+ this.id.substr(0,32) + "scoreValue");
                    myScoreValObj.val(myScoreValObj.attr("max")).removeAttr("disabled");
                    if($(":checkbox[selectType=1]:checked").length == $(":checkbox[selectType=1]").length){
                        var djObj=$("[baseDataType=WJJDJCSJLB11]");//等级
                        djObj.data("db",1); //达标
                        jsParser.setComboboxOriData(djObj);
                        djObj.combobox("clear");
                        djObj.combobox("loadData",djObj.data("OriData"));
                    }
                    break;

                default:
                    break;
            }
        }else{ //不达标，无分
            switch(this.getAttribute("selectType")){
                case "2":
                    var jlObj = $("[baseDataType=WJJDJCSJLB10]");//结论
                    if(jlObj.data("db") == undefined || jlObj.data("db") == 1){ //达标
                        jlObj.data("db",0);
                        var jlPanel = jlObj.data("combo").panel;
                        jlObj.combobox("setValue",jlPanel.find(".combobox-item:last").attr("value")); //取最后一项，认为这项是“差”
                        jlObj.combobox("disable");
                    }
                    break;

                case "1":
                    var djObj=$("[baseDataType=WJJDJCSJLB11]");//等级
                    if(djObj.data("db") == undefined || djObj.data("db") == 1){ //达标
                        djObj.data("db",0); //不达标
                        jsParser.setComboboxOriData(djObj);
                        djObj.combobox("clear");
                        djObj.combobox("loadData",djObj.data("noAData"));
                    }
                    $("#"+ this.id.substr(0,32) + "scoreValue").val(0).attr("disabled","disabled");
                    break;

                default:
                    break;
            }
        }
    },
    dtBoxConf:{
        formatter:function(dObj){ //日期对象格式化成字符串
            return [dObj.getFullYear(),"年",dObj.getMonth()+1,"月",dObj.getDate(),"日",dObj.getHours(),"时"].join("");
        },
        parser:function(dStr){ //日期字符串格式化成日期对象
            var dVal = dStr.match(/(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+/);
            return (dVal && dVal.length>=5) ? new Date(dVal[1],parseInt(dVal[2])-1,dVal[3],dVal[4]) : new Date();
        }
    },
    qGridRowspan:function(grid,jd){ //行合并
        var spanTable={ //合并的关系
            class2:"class2Name",
            class3:"class3Name"
        }

        var rowspan = {}; //存放需要合并的对象的配置

        if(jd.rows.length<=0) return; //无记录则返回
        var rowsAll = jd.rows;
        var jdLen = rowsAll.length;

        $.each(spanTable,function(spKey,spVal){
            for(var i=0;i<jdLen-1;){
                if(rowsAll[i][spKey].length>0 && rowsAll[i][spKey] == rowsAll[i+1][spKey]){
                    if(rowspan[spKey]){
                        rowspan[spKey].rowspan++;
                    }else{
                        rowspan[spKey] = {index:i,field:spVal,rowspan:2}
                    }
                }
                i++;

                if(rowspan[spKey] && (i==jdLen-1 || rowsAll[i][spKey] != rowsAll[i+1][spKey])){
                    grid.datagrid("mergeCells",rowspan[spKey]); //则进行合并
                    rowspan[spKey] = undefined;
                }
            }
        });
    },
    qGridEvent:function(gridDom){//事件
        /*
         * 事件顺序：
         * 先给隐藏域赋值
         * 对应只读或者失效的控制
         * 合理缺项
         * 算分
         * 根据分或者先决项进行等级判断，结论判断
         * 其他事件
         * */

        //给隐藏域赋值:checkbox勾选时对应的隐藏域value=1否则为0
        $("input:checkbox",gridDom).bind("click.step1",function(){
            $("input[chkbox=" + this.id + "]", gridDom).val(this.checked ? 1 : 0);
            var subId = this.id.substr(0,32);

            //对应只读或者失效的控制
        }).bind("click.step2",function(){
                var subId = this.id.substr(0,32); //对应的题目Id
                var reaGap = this.getAttribute("reaGap");
                var selectType = this.getAttribute("selectType");
                if(reaGap && reaGap.length>0){
                    var blyjSlt = "#"+subId+"suggestionName,#"+subId+"specificationName";
                    if(this.checked){ 	//点击合理缺项时，该题的分数不变，只读；关键项为选上，不能修改。
                        $("#"+subId+"keyCheck").prop("checked","checked").attr("disabled","disabled");
                        $("input[chkbox=" + subId + "keyCheck]", gridDom).val(1);
                        $("#"+subId+"scoreValue").addClass("regReadOnly").attr("readonly","readonly");
                    }else{ 				//取消合理缺项时，该题的分数不变，能修改；关键项不变，能修改。
                        $("#"+subId+"keyCheck").removeAttr("disabled");
                        $("#"+subId+"scoreValue").removeClass("regReadOnly").removeAttr("readonly");
                    }
                }
                /* 关键项分好几种：1.双星无分 2.单星无分 3.单星有分
                 * */
                if(selectType && selectType.length>0){
                    if(this.checked){	//点击关键项时  合理缺项不变，能修改  ；若有分，则分数能修改，并且值为原来的状态
                        $("#"+subId+"reaCheck").removeAttr("disabled");
                        var scoreValueObj = $("#"+subId+"scoreValue");
                        if(scoreValueObj.length>0){
                            var max = parseInt(scoreValueObj.attr("max"),10) || 0;
                            scoreValueObj.val( scoreValueObj.data("oriVal")==undefined ? max : ( max>0 ? scoreValueObj.removeClass("regReadOnly").removeAttr("readonly").data("oriVal") : ""));
                        }
                    }else{				//取消关键项时  合理缺项也取消，不能修改  ；若有分，先保存原来的分数，并设值为0，不能修改
                        $("#"+subId+"reaCheck").removeProp("checked").attr("disabled","disabled");
                        $("input[chkbox=" + subId + "reaCheck]", gridDom).val(0);
                        var scoreValueObj = $("#"+subId+"scoreValue");
                        if (scoreValueObj.length > 0) {
                            scoreValueObj.data("oriVal", scoreValueObj.val()).val(0).addClass("regReadOnly").attr("readonly", "readonly");
                        }
                    }
                }
            })

        //合理缺项
        var reaGapTarget = $("[baseDataType=WJJDJCSJLB08]");
        if(reaGapTarget.length>0){
            $("td[field='reaGap']",gridDom).find("input:checkbox").bind("click.reaGap",function(){
                var rgAry = [];
                $("td[field='reaGap']",gridDom).find("input:checked").each(function(){
                    var subId = this.id.substr(0,32); //对应的题目Id
                    rgAry.push($("#" + subId + "showOrder").text())
                })
                reaGapTarget.val(rgAry.length>0 ? rgAry.join(",") : "无");
            })
        }


        //算分
        //$("input",gridDom).bind("click.calScore blur.calScore",jsParser.calScore);
       // $("td[field='scoreValue']",gridDom).find("input").bind("blur.specification",jsParser.specification);


        //根据分或者先决项进行等级判断，结论判断
        //$("[selectType]",gridDom).bind("click.calKeyItem",jsParser.calKeyItem);

        //其他事件
        $("td[field]",gridDom).bind("click mouseenter mouseleave mouseout mouseup",function(e){ //鼠标经过时行不变色
            e.stopPropagation();
        });
    },
    qGridContent:function(val,rowData,rowIndex){
        if(rowData.isEdit == "0"){
            return ['<textArea style="width:99%" wrap="off" rows="4" name="',rowData.subjectId,'content">',val,'</textArea>'].join("");
        }else{
            return val;
        }
    },
    qGridScore:function(val,rowData,rowIndex){ //score
        var r = "";
        switch(rowData.selectType){
            case "WJJDLHFJXZTLB01":
                r = [jsParser.template.t["WJJDLHFJXZTLB01"],val,"　",jsParser.fillType(rowData)].join("");
                break;
            case "WJJDLHFJXZTLB02":
                r = [jsParser.template.t["WJJDLHFJXZTLB02"],"　",jsParser.fillType(rowData)].join("");
                break;
            default:
                r=val;
                break;
        }
        return r
    },
    qGridSelect:function(val,rowData,rowIndex){ //selectType //废弃
        return val.length>0 ? jsParser.fillType(rowData) : "";
    },
    qGridInput:function(val,rowData,rowIndex){ //scoreValue
        var rVal = "";
        switch(rowData.selectType){
            case "WJJDLHFJXZTLB01":
                if(rowData.score && rowData.score.length>0){
                    rVal =  jsParser.fillType($.extend({},rowData,{subjectAttr:"JD-SUB-1"}));
                }
                break;

            case "WJJDLHFJXZTLB02":
                break;

            default:
                rVal = jsParser.fillType(rowData);
                break;
        }
        return rVal;
    },
    qGridReaGap:function(val,rowData,rowIndex){ //合理缺项
        return jsParser.fillType($.extend({},rowData,{subjectAttr:"reaGap"}));
    },
    qGridShowOrder:function(val,rowData,rowIndex){//序号
        return ['<span id="',rowData.subjectId,'showOrder">',val,'</span>'].join("");
    },
    qGridSelectTypeValue:function(val,rowData,rowIndex){//重要性
        return ['<span id="',rowData.subjectId,'selectTypeValue">',val,'</span>'].join("");
    }
};



var jsTempGridConf = {
    url:'subjects.json',
    queryParams:{
        d:(new Date).getTime()
    },
    title:"题目表",
    method:'get',
    columns:
        [[
            {field:"showOrder",title:"序号",width:30,align:"center",formatter:jsParser.qGridShowOrder},
            {field:'class2Name',title:'项目',width:80},
            {field:'subjectContent',title:'题目内容',width:400,formatter:jsParser.qGridContent},
            {field:'selectTypeValue',title:'重要性',width:60,formatter:jsParser.qGridSelectTypeValue},
            {field:'scoreValue',title:"答案",width:140,align:'center',formatter:jsParser.qGridInput},
            {field:'reaGap',title:"合理缺项",width:50,align:'center',formatter:jsParser.qGridReaGap}
        ]],
    height:500,
    width:790,
    nowrap:false,
    rownumbers:false,
    onLoadSuccess:function(jd){
        var grid = $(this);
        var gridDom = grid.datagrid('getPanel');

        jsParser.qGridRowspan(grid,jd); //行合并

        $("[readonly]","td[field=scoreValue]").addClass("regReadOnly");
        $.parser.parse("td[field=scoreValue]");
        jsParser.qGridEvent(gridDom); //表格事件
    }
};