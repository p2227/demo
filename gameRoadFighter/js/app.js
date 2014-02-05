//app，全局对象，全局配置
var app = {
    score:0
    ,state:false    //状态：false暂停  true 开始
    ,speed:10        //速度
    ,moveBase:10    //左右移动的基础位移
    ,speedFull:300  //速度上限
    ,speedHandle:0 //加速句柄
    ,speedDownHandle:0 //减速句柄
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

        !function runFunc(){
            app.mainArea.style.backgroundPosition = "0 -" + app.mainPos + "px";
            app.mainPos = app.mainPos > app.areaHeight ? 0 : app.mainPos + 2;
            app.speedElem.innerHTML = Math.round(app.speed);
            speedCount = app.speedFull - app.speed;
            //console.log("" + app.speed + "," + speedCount);
            this.speedUpHandle = setTimeout(runFunc,speedCount + 5);
        }();
    }
    ,pause:function(){
    //清理计时器
        app.stateElem.innerHTML = "开始";
        clearTimeout(this.speedUpHandle);
    }
    ,bindEvent:function(){
        var keyRela = {
            81:"Q",74:"J",65:"A",68:"D",16:"speed",
            37:"left",38:"up",39:"right",40:"down",
            106:"J"
        };


        window.onkeyperss = function(e){
            console.log("onkeypress");
            var keyCode = e.keyCode || e.which;
            switch(keyRela[keyCode]){
                case "J":
                    app.runInState(function(){
                        clearInterval(app.speedDownHandle);
                        app.speed = (app.speed >= app.speedFull ? app.speedFull : app.speed + 2);
                        console.log("speedUp"+app.speed);
                    });
                    break;
            }
        }

//        document.onkeypress = function(e){
//            console.log("onkeypress");
//            var keyCode = e.keyCode || e.which;
//            switch(keyRela[keyCode]){
//                case "J":
//                    app.runInState(function(){
//                        clearInterval(app.speedDownHandle);
//                        app.speed = (app.speed >= app.speedFull ? app.speedFull : app.speed + 2);
//                        console.log("speedUp"+app.speed);
//                    });
//                    break;
//            }
//        };

        document.onkeyup = function(e){
            console.log("onkeyup");
            var keyCode = e.keyCode || e.which;
            switch(keyRela[keyCode]){
                case "speed":
                    app.runInState(function(){
                        //不按J的话，就开始减速
                        clearInterval(app.speedUpHandle);
                        app.speedDownHandle = setInterval(function(){
                            app.speed = (app.speed <= 10 ? 10 : app.speed - 2);
                            console.log("speedDown"+app.speed);
                        },200);
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
                case "speed":
                    app.runInState(function(){
                        clearInterval(app.speedDownHandle);
                        app.speed = (app.speed >= app.speedFull ? app.speedFull : app.speed + 2);
                        console.log("speedUp"+app.speed);
                    });
                    break;
                case "Q":
                    app.state = !app.state;
                    var tmp = app.state ? app.start() :app.pause();
                    break;
                case "A":
                    app.runInState(function(){
                        selfCar.move(-app.moveBase,0);
                    });
                    break;
                case "D":
                    app.runInState(function(){
                        selfCar.move(app.moveBase,0);
                    });
                    break;
                default:
                    break;
            }
        };

    }
};