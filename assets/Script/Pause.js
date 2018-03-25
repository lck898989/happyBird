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
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.clickCount = 0;
    },

    start () {

    },
    update (dt) {
        var self = this;
       
        //如果是安卓平台的话用的是触摸监听
        if(cc.sys.os === cc.sys.OS_ANDROID){
            this.node.on(cc.Node.EventType.TOUCH_START,function(){
                if(self.clickCount % 2 === 0){
                    //暂停游戏
                    cc.game.pause();
                }else{
                    //恢复游戏逻辑主循环
                    cc.game.resume();
                }
                self.clickCount++;
            })
        }else{
             // alert(self.clickCount); 1
            this.node.on('mousedown',function(){
                //如果点击次数是2的倍数进行动态加载暂停图标
                // alert(self.clickCount % 2);
                if(self.clickCount % 2 === 0){
                    //暂停游戏
                    cc.game.pause();
                }else{
                    //恢复游戏逻辑主循环
                    cc.game.resume();
                }
                
                self.clickCount++;
            });
        }
        
    },
});
