var selfCar = {
    x:0
    ,y:0
    ,e:null
    ,init:function(){
        u.extend(this,{
            e:app.selfBase.cloneNode(true)
            ,x:app.roadLeft
            ,y:app.areaHeight - u.getHeight(app.selfBase)*2
        });

        //是否可以实现观察者模式？
        u.extend(this.e.style,{
            left:this.x + "px",
            top:this.y + "px"
        });

        app.mainArea.appendChild(this.e);
    }
    ,move:function(moveX,moveY){
        var x = this.x + moveX;
        var y = this.y + moveY;

        if(( x < app.roadLeft || x > app.roadRight - u.getWidth(this.e)) || ( y < 0 || y>app.areaHeight- u.getHeight(app.selfBase)*2 )){
            return ;
        }

        this.x=x;
        this.y=y;

        this.e.style.left=this.x+"px";
        this.e.style.top=this.y+"px";
    }
};

//敌车的类
var enemyCar=function(conf){
    u.extend(this,conf,{
        e:app.enemyBase.cloneNode(true)
    });

    this.e.id += Math.round(100 + Math.random() * 800);

    u.extend(this.e.style,{
        left:conf.x + "px"
        ,top:conf.y + "px"
    });

    app.mainArea.appendChild(this.e);
};

//prototype:原型
u.extend(enemyCar.prototype,{
    move:function(moveX,moveY){
        this.x += moveX;
        this.y += moveY;
        this.e.style.left = this.x+"px";
        this.e.style.top = this.y+"px";
        return this;
    },
    die:function(){
        this.isDied = true;
        enemyCarFactory.xArray.push(this.x);
        return this;
    },
    restore:function(){
        u.extend(this,enemyCarFactory.initParams());

        u.extend(this.e.style,{
            left:this.x + "px"
            ,top:this.y + "px"
        });
        return this;
    }
});


var enemyCarFactory={
    enemys:[],
    xArray:[],
    createEnemyCar:function(n){
        for(var i=app.roadLeft;i<app.roadRight-u.getWidth(app.enemyBase);i+= u.getWidth(app.enemyBase)){
            this.xArray.push(i);
        }

        for(var i=0; i<n; i++){
            var ep = new enemyCar(enemyCarFactory.initParams());
            this.enemys.push(ep);
        }
    },
    initParams:function(){
        return {
            //x:app.roadLeft + Math.round( Math.random() * (app.roadRight - app.roadLeft - u.getHeight(app.enemyBase)))
            x:parseInt(this.xArray.splice(Math.floor(Math.random() * this.xArray.length),1),10)
            ,y:-u.getHeight(app.enemyBase) - (Math.random() * app.areaHeight)
            ,speed: 2 + Math.random() * 4
            ,isDied: false
        }
    }
}