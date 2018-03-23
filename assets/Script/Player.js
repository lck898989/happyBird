
//鸟的相关属性 
cc.Class({
    extends: cc.Component,

    properties: {
        //鸟上抛的速度
        BirdUpCastSpeed    : 200,
        //鸟的当前位置
        bg1                : {
            default        : null,
            type           : cc.Node,
        },
        bg2                :{
            default        : null,
            type           : cc.Node,
        },
        //跳跃音效资源
        jumpAudio   : {
            default : null,
            url     : cc.AudioClip,
        },
        //撞墙音效
        crashAudio  : {
            default : null,
            url     : cc.AudioClip,
        },
    },
    editor : {
        executionOrder : -1
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    },
    init(){
        var canvas = this.node.parent;
        cc.log(canvas);
        this.gameCom = canvas.getComponent("Game");
        cc.log("Enter the player");
        //开启碰撞检测 cc.director 是一个单列类型不需要调用任何构造函数
        var collisionManager = cc.director.getCollisionManager();
        //开启碰撞系统
        collisionManager.enabled = true;
        //开启debug绘制检测
        collisionManager.enabledDebugDraw = true;
        this.isCollision = false;
        //设置音效大小
        cc.audioEngine.setVolume(0.1);
        //玩家的当前分数为零
        this.playScore = 0;
        this.anim = this.node.getComponent(cc.Animation);
        this.isMove = true;
    },
    start () {
        //获取动画的状态信息
        this.animState = this.anim.play('birdFly');
    },

    update (dt) {
        // this.node.active = false;
        //加载动画资源
        // var anim = this.node.getComponent(cc.Animation);
        
        //改变动画的播放速度时候一定要先获取动画的状态
        // cc.log(animState.speed);
        this.animState.speed = 0.8;
        this.animState.duration = 0.5;
        var backGround = this.bg1.getComponent("BackGround1");
        // cc.log(backGround.g)
        //如果为上升状态
        if(backGround.up && this.isMove){
            //获得上升的标记
            cc.log("backGround.up is " + backGround.up);
            //获得重力加速度
            cc.log("backGround.g is " + backGround.g);
            //获得上抛速度
            cc.log("BirdUpCastSpeed is " + this.BirdUpCastSpeed);
            if(!this.isCollision){
                this.BirdUpCastSpeed = this.BirdUpCastSpeed + (backGround.g * dt);
                this.node.y = this.node.y + this.BirdUpCastSpeed * dt;
                //调用一个回调函数，用于在动作结束时调用我们定义的其他方法
                // var callback = cc.callFunc(this.playJumpSound,this);
                // cc.repeatForever(cc.sequence(callback));
                // this.playJumpSound();
            }else{
                backGround.up = false;
                this.isMove = false;
                
            }
            
       }
       if(!this.isMove){
            this.scheduleOnce(function(){
                cc.log("adasd");
            },2);
            this.BirdUpCastSpeed = -600 + backGround.g * dt;
            this.node.y = this.node.y + this.BirdUpCastSpeed * dt;
       }
      
    },
    //播放音乐方法
    playJumpSound  : function(){
        //调用声音引擎播放声音
        cc.audioEngine.play(this.jumpAudio,false);
    },
    //不播放音乐释放相关资源
    stopJumpSound  : function(){
        //释放相关资源
        cc.audioEngine.uncache(this.jumpAudio);
    },
    //播放撞墙音效
    playCrashSound : function(){
        cc.audioEngine.play(this.crashAudio,false);
    },
    //停止播放撞墙音效
    stopCrashSound : function(){
        cc.audioEngine.uncache(this.crashAudio);
    },
    //当碰撞发生时调用一下函数
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     * 
     */
    //碰撞函数死亡之后显示的东西都放到这里
    onCollisionEnter: function (other, self) {
        //撞墙的时候播放撞墙音效
        this.playCrashSound();
        console.log('on collision enter');
        //将小鸟的颜色重置为红色ss
        this.node.color = cc.Color.GRAY;
        this.isCollision = true;
        //将小鸟的角度调整为90度
        this.node.rotation = 90;
        //将动画关闭
        this.anim.pause("birdFly");
    //     //关闭监听事件
    //     this.bg1.off('mousedown',function(event){
    //         //如果鸟死亡的话点击背景它的坐标不在变化
    //        //每次点击背景图的时候他的初始速度为800
    //            bird.BirdUpCastSpeed = 450;
    //            _this.up = true;
    //            //隐藏开始图标
    //            _this.stat.active = false;
    //            //当点击按钮的时候开始播放音效
    //            bird.playJumpSound();
               
    //    });
    //    //当第二种图片被点击的时候
    //    this.bg2.off('mousedown',function(event){
    //            //如果鸟死亡的话点击背景它的坐标不在变化
    //            bird.BirdUpCastSpeed = 450;
    //            _this.up = true;
    //            //隐藏开始图标
    //            _this.stat.active = false;
    //            //当点击按钮的时候开始播放音效
    //            bird.playJumpSound();
           
    //    });
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;
        cc.log("world is " + world);
        // 碰撞组件的 aabb 碰撞框
        var aabb = world.aabb;
        cc.log("aabb is " + aabb);
        // 上一次计算的碰撞组件的 aabb 碰撞框
        var preAabb = world.preAabb;
        cc.log("preAabb is " + preAabb);
        // 碰撞框的世界矩阵
        var t = world.transform;
        cc.log("t is " + t);
        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;

        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        var ps = world.points;
        cc.log("ps is " + ps);
        cc.log("bird is crashing with " + other.tag === 0 ? "ground" : "pipe");
        //定义这个鸟的死法
        /***
         * 规定鸟如果碰到柱子的话鸟会顺着柱子进行下落
         * 
         */
        if(other.tag == 2){
            //如果碰到柱子的话让它的速度向下
            this.BirdUpCastSpeed = -200;
        }else{
            //如果碰到地面的话就停下来一段时间让后下落
        }
        //在碰撞函数里面调用计时器
        cc.log(this.gameCom.score);
        this.jumpScore('atlas/Mnum_',this.gameCom.score);
    },
    //实现跳分的方法
    jumpScore : function(resource,score){
        this.playScore = score;
        this.resource = resource;
        var self = this.gameCom;
        this.from = 0;
        var x = null;
       
        this.schedule(function(){
            //根据分数创建
            if(this.from > this.playScore){
                return;
            }
            //将他需要的节点数组获取到 
            self.showScore(this.resource,this.from.toString(),60,14,'gameOverScoreBoardNodeArray',self.gameOverNode);
            this.from += self.award;
        },0.1);
        

    },
    afterDeathDown : function(){
        
    }
});
