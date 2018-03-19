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
        
        cc.log("isPlayerDeath is " + this.isPlayerDeath);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //利用预制资源生成一个柱子
        this.pipeInstance = this.node.getComponent("PipeInstance");
        this.pipeNode = cc.instantiate(this.pipeP);
        this.node.addChild(this.pipeNode);
        this.pipeNode.setPosition(400,0);
        //隐藏该节点
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
    start () {

    },
    
    update (dt) {
        //鸟是否已经死亡的笔记
        this.isPlayerDeath = this.bird.getComponent("Player").isCollision;
        //如果鸟碰到柱子柱子不在移动
        if(!this.isPlayerDeath){
            //该节点是pipeParent节点不会移动
            this.pipeNode.x -= this.moveSpeed;
            if(this.pipeNode.x <= -950){
                cc.log("enter the pipeMove");
                //如果到达屏幕的边界就会立即销毁
                this.pipeNode.destroy();
                //重新生成节点
                this.pipeNode = this.pipeInstance.copyPipe();
                cc.log(this.pipeNode.x  + "----> " + this.pipeNode.y);
                //重新设置生成节点的x,y坐标
                this.pipeNode.setPosition(500,this.randomY());
                //设置他的y坐标

            }
        }
        
    },
    randomY  :  function(){
        var randomy = Math.random(0,1) * 180;
        return randomy; 
    }
});
