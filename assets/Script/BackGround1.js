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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.up = false;
        this.g = -1200;
        var bird = this.player.getComponent("Player");
        // this.g  = -1000;
        var _this = this;
        //当一张背景图片被点击的时候将up重置为true
        this.node.on('mousedown',function(event){
            //每次点击背景图的时候他的初始速度为800
            bird.BirdUpCastSpeed = 450;
            _this.up = true;
            //隐藏开始图标
            _this.stat.active = false;
            //当点击按钮的时候开始播放音效
            bird.playJumpSound();
        });
        //当第二种图片被点击的时候
        this.bg2.on('mousedown',function(event){
            bird.BirdUpCastSpeed = 450;
            _this.up = true;
            //隐藏开始图标
            _this.stat.active = false;
            //当点击按钮的时候开始播放音效
            bird.playJumpSound();
        });
        
    },

    start () {

    },
    //当鼠标按下的时候会一直加速直达减速为零
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
});
