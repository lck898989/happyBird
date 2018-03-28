/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-03-26 13:19:55 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-28 14:22:14
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
    editor: {
        executionOrder: -2
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       
    //   cc.log("是否是安卓系统：" + cc.sys.os === cc.sys.OS_ANDROID);
      
      if(cc.sys.os === cc.sys.OS_ANDROID){
          //如果平台是安卓系统的话获取安卓屏幕的像素大小
          var phoneSizeInPixel = cc.view.getFrameSize();
          console.log("手机屏幕的宽度为" + phoneSizeInPixel.width);
          console.log("手机屏幕的高度为" + phoneSizeInPixel.height);
          //判断设计宽高比和屏幕宽高比然后进行屏幕的调整
          var designSize = cc.view.getDesignResolutionSize();
          //设计分辨率大小
          var designWidth = designSize.width;
          var designHeight = designSize.height;
          //如果是屏幕分辨率宽高比 > 设计分辨率宽高比那么就是拉伸宽度至满屏，高度自动裁减
          if(phoneSizeInPixel.width/phoneSizeInPixel.height >= designWidth/designHeight){
              //宽度拉伸至全屏
              var scaleY = phoneSizeInPixel.height * designWidth/(phoneSizeInPixel.width * designHeight);
              console.log("高度方向的缩放比率是 " + scaleY);
              this.node.setScale(1,scaleY);
          }
        }
    // var fenb = cc.view.getFrameSize();
    //     var ca=cc.director.getWinSize();
    //     var x=fenb.width;
    //     var y=fenb.height;
    //     var x1=ca.width;
    //     var y1=ca.height;
    //     if(x/y!=x1/y1){
    //         this.node.setScale((y1*x)/(x1*y),(x1*y)/(y1*x));
    //     }
        // this.zhuzi1.setScale(2-(y1*x)/(x1*y),2-(x1*y)/(y1*x));
        // this.zhuzi2.setScale(2-(y1*x)/(x1*y),2-(x1*y)/(y1*x));

    },

    start () {
        
    },

    update (dt) {
       
    },
});
