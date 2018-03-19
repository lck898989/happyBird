cc.Class({
    extends: cc.Component,

    properties: {
         audioSource : {
             type    : cc.AudioSource,
             default : null,
         }
    },

    // LIFE-CYCLE CALLBACKS:
    play     : function(){
        this.audioSource.play();
    },
    pause    : function(){
        this.audioSource.pause();
    },
    onLoad () {},

    start () {

    },

    update (dt) {},
});
