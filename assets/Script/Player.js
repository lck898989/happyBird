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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
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
        
    },

    start () {

    },

    update (dt) {
        //加载动画资源
        var anim = this.node.getComponent(cc.Animation);
        anim.play('birdFly');
        cc.log(this.node.x);
        //将背景图所触发的事件结果传过来
        cc.log(this.bg1);
        //获得背景图下的脚本组件
        var backGround = this.bg1.getComponent("BackGround1");
        //打印backGround的属性值
        cc.log(this.BirdUpCastSpeed);
        // cc.log(backGround.g)
        //如果为上升状态
        if(backGround.up){
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
                // //开启一个计时器
                this.scheduleOnce(function(){
                     console.log("delay one second");
                     this.node.y = this.node.y;
                },3);
                // this.BirdUpCastSpeed = -200;
                //如果碰上了马上下落
                this.BirdUpCastSpeed = this.BirdUpCastSpeed + (backGround.g * dt);
                this.node.y = this.node.y + this.BirdUpCastSpeed * dt;
            }
            
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
    onCollisionEnter: function (other, self) {
        //撞墙的时候播放撞墙音效
        this.playCrashSound();
        console.log('on collision enter');
        this.node.color = cc.Color.RED;
        this.isCollision = true;
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
    },
});
