//专门负责柱子移动的脚本
cc.Class({
    extends: cc.Component,

    properties: {
       pipeP : {
           default : null,
           type    : cc.Prefab,
       },
       bg1   : {
           default : null,
           type    : cc.Node,
       },
       bg2   : {
           default : null,
           type    : cc.Node,
       },
       stat  : {
           default : null,
           type    : cc.Node,
       },
       moveSpeed   : 19,
       bird  : {
           default : null,
           type    : cc.Node,
       }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //判定鸟是否从柱子缝隙中出去
        this.isIn = false;
        cc.log("isPlayerDeath is " + this.isPlayerDeath);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.init();
        //隐藏该节点，刚开始是隐藏节点信息的
        this.node.active = false;
        var _this = this;
        this.bg1.on('mousedown',function(){
           _this.node.active = true;
        });
        this.bg2.on('mousedown',function(){
            _this.node.active = true;
        });
        this.stat.on('mousedown',function(){
            _this.node.active = true;  
        });
        
    },
    //初始化脚本资源
    init    : function(){
        //利用预制资源生成一个柱子
        this.pipeInstance = this.node.getComponent("PipeInstance");
        this.pipeNode = cc.instantiate(this.pipeP);
        this.node.addChild(this.pipeNode);
        this.pipeNode.setPosition(500,0);
    },
    start () {

    },
    
    update (dt) {
        //当柱子的坐标在一个范围内的时候，判定这个鸟已经穿过缝隙了这时候需要进行加分操作了
        this.maxBorder = this.bird.x + this.bird.width/2 + this.pipeNode.getChildByName("pipe").width/2;
        cc.log("maxBorder is " + this.maxBorder);
        this.minBorder = this.bird.x - this.bird.width/2 - this.pipeNode.getChildByName("pipe").width/2;
        cc.log("minBorder is " + this.minBorder);
        //鸟是否已经死亡的标记
        this.isPlayerDeath = this.bird.getComponent("Player").isCollision;
        //如果鸟碰到柱子柱子不在移动
        if(!this.isPlayerDeath){
            //该节点是pipeParent节点不会移动
            this.pipeNode.x -= this.moveSpeed;
            cc.log("in pipeMove x is " + this.pipeNode.x);
            cc.log("bird's x is " + this.bird.x);
            if(this.pipeNode.x <= -950){
                cc.log("enter the pipeMove");
                //如果到达屏幕的边界就会立即销毁
                this.pipeNode.destroy();
                //重新生成节点
                this.pipeNode = this.pipeInstance.copyPipe();
                cc.log(this.pipeNode.x  + "----> " + this.pipeNode.y);
                //重新设置生成节点的x,y坐标
                this.pipeNode.setPosition(500,this.randomY());
            }
        }
        
    },
    randomY  :  function(){
        var randomy = Math.random(0,1) * 180;
        return randomy; 
    }
});
