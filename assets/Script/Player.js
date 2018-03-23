
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
        
        //游戏结束音效
        endAudio    : {
            default : null,
            url     : cc.AudioClip,
        },
        //得分音效
       getScore : {
            default : null,
            url     : cc.AudioClip,
        },
        //柱子的实例
        pipe        : {
            default : null,
            type    : cc.Node,
        }
    },
    editor : {
        executionOrder : -1
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    },
    init(){
        //初始化柱子
        this.pipeMoveScript = this.pipe.getComponent("PipeMove");
        var canvas = this.node.parent;
        cc.log(canvas);
        this.gameCom = canvas.getComponent("Game");
        cc.log("Enter the player");
        //开启碰撞检测 cc.director 是一个单列类型不需要调用任何构造函数
        this.collisionManager = cc.director.getCollisionManager();
        //开启碰撞系统
        this.collisionManager.enabled = true;
        //开启debug绘制检测
        this.collisionManager.enabledDebugDraw = false;
        this.isCollision = false;
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
        //持续刷新玩家分数
        this.playScore = this.gameCom.score;
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
        cc.audioEngine.play(this.jumpAudio,false,0.1);
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
    //得分音效
    playGetScoreSound : function(){
        cc.log();
        //播放音效
        cc.audioEngine.play(this.getScore,false,0.5);

    },
    //结束音效
    playEndSound     : function(){
        cc.audioEngine.play(this.endAudio,false);
        cc.audioEngine.setVolume(0.1);
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
        //如果撞上了的话将pipeMove里面的想撞重置为true
        console.log('on collision enter');
        //定义这个鸟的死法
        /***
         * 规定鸟如果碰到柱子的话鸟会顺着柱子进行下落
         * 
         */
        if(other.tag == 2){
            //如果碰到柱子的话让它的速度向下
            this.BirdUpCastSpeed = -200;
           this.commonCrashing();
        }else if(other.tag == 0){
            this.commonCrashing()
        }else if(other.tag == 3){
            this.commonCrashing();
        }
       
    },
    commonCrashing  : function(){
        //如果碰到地面的话就停下来一段时间让后下落
        this.collisionManager.enabled = false;
        //撞墙的时候播放撞墙音效
        this.playCrashSound();
        this.node.color = cc.Color.GRAY;
        this.isCollision = true;
        //将小鸟的角度调整为90度
        this.node.rotation = 90;
        //将动画关闭
        this.anim.pause("birdFly");
         //在碰撞函数里面调用计时器
        cc.log(this.gameCom.score);
        this.jumpScore('atlas/Mnum_',this.gameCom.score);
        this.scheduleOnce(function(){
            this.playEndSound();
        },1);
    },
    /**
     * 当碰撞结束后调用,就是小鸟碰撞之后出来之后并且是毫发无损的出来才加分
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        //碰撞出去时候加分
        if(!this.isCollisioin){
            //如果已经碰撞了那么加分
            this.gameCom.score += this.gameCom.award;
            
            //添加得分音效
            this.playGetScoreSound();
        }
        //更新分数
        this.gameCom.loadDynamic("atlas/Mnum_",0,250,'newNodeArray',this.gameCom.node);
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
});
