/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-03-26 13:19:55 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-26 17:56:58
 */
/**
 * 
 * 屏幕自适应脚本
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      if(cc.sys.os === cc.sys.OS_ANDROID){
          //如果平台是安卓系统的话获取安卓屏幕的像素大小
          var phoneSizeInPixel = cc.view.getFrameSize();
          //判断设计宽高比和屏幕宽高比然后进行屏幕的调整
          var designSize = cc.view.getDesignResolutionSize();
          var designWidth = designSize.width;
          var designHeight = designSize.height;
          //如果设计分辨率宽高比大于屏幕分辨率的宽高比
          if(designWidth/designHeight > phoneSizeInPixel.width/phoneSizeInPixel.height){
            //这时候需要适配高度
            var scale = phoneSizeInPixel.height / designHeight
            cc.scene.setScale(1,scale);
          }else if(designWidth/designHeight < phoneSizeInPixel.width/phoneSizeInPixel.height){
            //这时候需要适配宽度
            var scale = phoneSizeInPixel.width/designWidth;
            cc.scene.setScale(scale,1);

          }
      }
    },

    start () {
        
    },

    update (dt) {
       
    },
});
