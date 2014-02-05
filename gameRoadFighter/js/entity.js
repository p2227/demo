var selfCar = {
    x:0
    ,y:0
    ,e:null
    ,init:function(){
        u.extend(this,{
            e:app.selfBase.cloneNode(true)
            ,x:app.roadLeft
            ,y:app.areaHeight- u.getHeight(app.selfBase)*2
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
}