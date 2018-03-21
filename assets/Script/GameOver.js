/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-03-21 13:35:31 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-21 14:49:56
 */
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.game = require("Game");
        this.node.active = false;
        if(this.game.pipeMove.isPlayerDeath){
            this.node.active = true;
        }
        
    },

    start () {
        
    },

    update (dt) {

        //不断获取这个组件下的属性鸟是否死亡
        var isDeath = require("Player").isCollision;
        cc.log("in GameOver.js isDeath is " + isDeath);
        //如果鸟已经死亡了的话将GameOver相关组合图片显示出来
        if(isDeath){
            cc.log("asdfasfasdfasdf");
        }
    },
});
