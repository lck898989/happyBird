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
        bg1   : {
            default :  null,
            type    : cc.Node,
        },
        bird  : {
            default : null,
            type    : cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var player = this.bird.getComponent("Player");
        var _this = this;
        //当点击这个节点的时候对这个节点进行隐藏
        this.node.on('mousedown',function(event){
            //把这个节点给隐藏了
            _this.node.active = false;
            //同时将BackGround1中的属性up重置为true
            var bak = _this.bg1.getComponent("BackGround1");
            cc.log("bak is " + bak);
            bak.up = true;
            player.BirdUpCastSpeed = 400;

        });
    },

    start () {

    },

    update (dt) {

    },
});
