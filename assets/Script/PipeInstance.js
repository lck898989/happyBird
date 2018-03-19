// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        //获取预制体
        pipeP   : {
            default : null,
            type    : cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // //获取背景图的宽度
        // this.screenWidth = this.node.width;
        // //获取背景图的高度
        // this.screenHeight = this.node.height;
        // // this.childrenPrefab = cc.instantiate(this.pipeP);
        // // //设置他的父节点
        // // childrenPrefab.parent = this.node;
        // //第二个参数是设置层级的，这个参数越高显示的就会覆盖其他的节点
        // //this.node.addChild(this.childrenPrefab,100);
        // cc.log("this is " + this);
        // cc.log(this.pipeP);
        // //设置预制资源的位置,通过这样获取的预制节点是个Node对象s
        // var pipePNode = cc.instantiate(this.pipeP);
        // this.pipeX = this.screenWidth;
        // this.pipeY = 0;
        // this.firstPrefab = this.copyPipe();
        // cc.log(this.firstPrefab);
        // //设置预制资源的位置
        // this.firstPrefab.setPosition(this.pipeX,this.pipeY);
        // cc.log("firstPrefab's x is " + this.firstPrefab.x);
    },

    start () {

    },
    copyPipe : function(){
        cc.log("this is " + this);
        //重新生成一个预制资源，生成的该资源默认是预制资源的坐标
        var childrenPrefab = cc.instantiate(this.pipeP);
        // //设置他的父节点
        // childrenPrefab.parent = this.node;
        //第二个参数是设置层级的，这个参数越高显示的就会覆盖其他的节点
        cc.log("this.node is " + this.node);
        childrenPrefab.parent = this.node;
        return childrenPrefab;
    },
    update (dt) {
    
    },
});
