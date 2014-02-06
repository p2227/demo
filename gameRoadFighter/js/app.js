//app，全局对象，全局配置
var app = {
    score:0
    ,state:false    //状态：false暂停  true 开始
    ,speed:10        //速度
    ,moveBase:10    //移动的基础位移
    ,speedFull:300  //速度上限
    ,appHandle:false //应用句柄
    ,keyState:{}
    ,speedHandle:false //速度句柄
    ,enemyNum:4      //敌人数量
    ,roadLeft:135   //公路的左边界
    ,roadRight:360   //公路的右边界
    ,areaWidth:480
    ,areaHeight:500
    ,stateElem: u.g("myState")
    ,speedElem: u.g("mySpeed")
    ,selfBase: u.g("selfCar")
    ,enemyBase: u.g("enemyCar")
    ,mainArea: u.g("mainArea")
    ,mainPos: 0    //背景的初始位置
    ,init:function(){
        //渲染元素
        selfCar.init();
        //绑定事件
        app.bindEvent();
    }
    ,runInState:function(func){ //引入暂停机制，游戏操作类型的函数都要在这里运行
        if(app.state && "function" === typeof func){
            func()
        }
    }
    ,start:function(){
        var speedCount = app.speedFull - app.speed;
        app.stateElem.innerHTML = "暂停";

        var keyFuncRela = {
            "speedUp":function(){
                app.speed = (app.speed >= app.speedFull ? app.speedFull : app.speed + app.moveBase);
            },
            "speedDown":function(){
                app.speed = (app.speed <= 10 ? 10 :app.speed - app.moveBase);
            },
            "left":function(){
                selfCar.move(-app.moveBase,0)
            },
            "right":function(){
                selfCar.move(app.moveBase,0);
            }
        }

        !function runFunc(){
            for(var key in keyFuncRela){
                if(app.keyState[key] && keyFuncRela[key]){
                    keyFuncRela[key]();
                }
            }

            app.mainArea.style.backgroundPosition = "0 -" + app.mainPos + "px";
            app.mainPos = app.mainPos > app.areaHeight ? 0 : app.mainPos + 2;

            app.speedElem.innerHTML = Math.round(app.speed);
            speedCount = 5*app.speedFull/app.speed;
            console.log([app.speed , speedCount,app.speedHandle ]);
            app.appHandle = setTimeout(runFunc,speedCount);
        }();
    }
    ,pause:function(){
    //清理计时器
        app.stateElem.innerHTML = "开始";
        clearTimeout(app.appHandle);
    }
    ,bindEvent:function(){
        var keyRela = {
             81:"start"//Q
            ,74:"acce"//J
            ,65:"left" //A
            ,68:"right" //D
            ,16:"speed", //ctrl
            37:"left",38:"up",39:"right",40:"down",
            106:"J"  //大写的J
        };

        document.onkeyup = function(e){
            var keyCode = e.keyCode || e.which;
            switch(keyRela[keyCode]){
                case "acce":
                    app.runInState(function(){
                        //不按J的话，就开始减速
                        app.keyState["speedUp"] = false;
                        app.keyState["speedDown"] = true;
                    });
                    break;
                case "left":
                    app.runInState(function(){
                        app.keyState["left"] = false;
                    });
                    break;
                case "right":
                    app.runInState(function(){
                        app.keyState["right"] = false;
                    });
                    break;
                default:
                    break;
            }
        };

        document.onkeydown  = function(e){
            var keyCode = e.keyCode || e.which;
            console.log(keyCode);
            switch(keyRela[keyCode]){
                case "start":
                    app.state = !app.state;
                    var tmp = app.state ? app.start() :app.pause();
                    break;
                case "acce":
                    app.runInState(function(){
                        app.keyState["speedUp"] = true;
                        app.keyState["speedDown"] = false;
                        //app.speedHandle = true;
                    });
                    break;
                case "left":
                    app.runInState(function(){
                        //app.keyState["left"] = true;
                        selfCar.move(-app.moveBase,0); //移动也要改造成按住就一直移动
                    });
                    break;
                case "right":
                    app.runInState(function(){
                        //app.keyState["right"] = true;
                        selfCar.move(app.moveBase,0);
                    });
                    break;
                default:
                    break;
            }
        };

    }
};