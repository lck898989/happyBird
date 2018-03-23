//将全局变量加载进来
cc.Class({
    extends: cc.Component,

    properties: {
        player : {
            default : null,
            type    : cc.Node,
        },
        //第二张背景图片
        bg2    : {
            default : null,
            type    : cc.Node,
        },
        //第一张背景图片
        bg1    : {
            default : null,
            type    : cc.Node,
        },
        //开始图片加载
        stat   : {
            default : null,
            type    : cc.Node,
        },
        //图片的移动速度
        moveSpeed   : 18,

    },
    editor : {
        executionOrder : 1
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.init();
        
    },
    init(){
        this.up = false;
        this.g = -1200;
        this.bird = this.player.getComponent("Player");
        // this.g  = -1000;
        var _this = this;
        this.node.on('mousedown',function(event){
            _this.bird.BirdUpCastSpeed = 450;
            _this.up = true;
            _this.stat.active = false;
            if(!_this.bird.isCollision){
                _this.bird.playJumpSound();
            }
        });
        this.bg2.on('mousedown',function(event){
            _this.bird.BirdUpCastSpeed = 450;
            _this.up = true;
            _this.stat.active = false;
            if(!_this.bird.isCollision){
                _this.bird.playJumpSound();
            }
            
        });
    },
    clickDown : function(){
        //每次点击背景图的时候他的初始速度为800
        var backScript = this.getComponent("BackGround1");
        backScript.bird.BirdUpCastSpeed = 450;
        backScript.up = true;
        //隐藏开始图标
        backScript.stat.active = false;
        //当点击按钮的时候开始播放音效
        backScript.bird.playJumpSound();
    },
    start () {

    },
    //背景图片滚动方法
    update (dt) {
          //父节点的宽度
          var parentWidth = this.node.parent.width;
          cc.log(parentWidth);
          //背景图循环移动
          this.node.x -= this.moveSpeed;
          this.bg2.x -= this.moveSpeed;
          if(this.node.x <= -parentWidth){
                var bg2NodeX = this.bg2.x;
                this.node.x = parentWidth + bg2NodeX;
          }
          if(this.bg2.x <= -parentWidth){
              var nodeX = this.node.x;
              this.bg2.x = parentWidth + nodeX;
          }
    },
    // onEnable  : function(){
    //     var self = this;
    //    this.node.on('mousedown',self.clickDown(self.bird,self));
    // },
    // //关闭相关监听事件
    // onDisable : function(){
    //     var self = this;
    //     this.node.off('mousedown',self.clickDown(self.bird,self));
    // }
});
