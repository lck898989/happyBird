/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-03-21 09:02:26 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-21 14:50:26
 */
cc.Class({
    extends: cc.Component,
    properties: {
        pipeStatus : {
            default  : null,
            type     : cc.Node,
        },
        //加载预置资源
        // NumPrefat : {
        //     default  : null,
        //     type     : cc.Prefab,
        // }
        award    : 5
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameOverNode = cc.find("Canvas/gameOver");
        this.gameOverNode.active = false;
        this.score = 0;
        //加载动态资源
        // this.loadDynamic(0,250);
        this.isAddScore = false;
        this.isAdded    = false;
        //历史最好分数
        this.best = 0;
        // //加载一个Prefab实例出来
        // this.numPrefabNode = cc.instantiate(this.NumPrefat);
        // //设置它的父节点
        // this.node.addChild(this.numPrefabNode);
        // //设置它的坐标
        // this.numPrefabNode.setPosition(0,250);
        // this.score = 1;
        // this.loadDynamic();
    },
    
    start () {
        //这时候所有脚本的onLoad方法已经加载完毕可以获取pipeMove
        //获取PipeMove脚本组件
        this.pipeMove = this.pipeStatus.getComponent("PipeMove");
        // this.pipeMove.init();
        //容纳新节点的数组用于容纳分数
        this.newNodeArray = [];
        //盛放分数拆分后的数字
        this.scoreNumArray = [];
        this.loadDynamic(0,250);
    },
    //动态加载资源方法,图片生成的位置信息也穿进去
    loadDynamic : function(newNodeX,newNodeY){
        var self = this;
        var childrenNum = self.childrenCount;
        if(this.score <= 9){
                //如果存在了新增节点就不创建节点了加载动态资源
                if(this.newNodeArray.length === 0){
                    //动态生成新节点
                    var newNode = this.dynamicCreateNode(newNodeX,newNodeY,this.newNodeArray);
                }else{
                    //弹出最后一个节点
                    newNode = this.newNodeArray[this.newNodeArray.length - 1];
                }
                //渲染最后一个节点
                cc.loader.loadRes("atlas/Mnum_"+this.score,cc.SpriteFrame,function(err,spriteFrame){
                    var sprite = newNode.getComponent(cc.Sprite);
                    sprite.spriteFrame = spriteFrame;
                });
        }else{
            //当分数大于九的时候重新创建一个节点用于容纳分数的第二位
            //如果当前分数的字符串格式的长度 - 前一个分数的字符串格式的长度 == 1的时候说明需要添加一个精灵节点了
            var preScoreString = (this.score - this.award).toString();
            //将分数拆成数项 比如 32 拆成 3 和 2
            var scoreString = this.score.toString();
            if(scoreString.length - preScoreString.length === 1){
                //创建新节点之前需要将前一个节点的x坐标左移
                this.newNodeArray[this.newNodeArray.length - 1].x -= this.newNodeArray[this.newNodeArray.length - 1].width / 2;
                //再创建一个节点
                var newNodeLocationX = this.newNodeArray[this.newNodeArray.length - 1].x + this.newNodeArray[this.newNodeArray.length - 1].width;
                var newNodeLocationY = this.newNodeArray[this.newNodeArray.length - 1].y;
                this.dynamicCreateNode(newNodeLocationX,newNodeLocationY,this.newNodeArray);
                this.caculateScore(scoreString);
            }else{
                 this.caculateScore(scoreString);
            }
        }
        
    },
    //动态生成新节点，传参的时候
    dynamicCreateNode  : function(newNodeX,newNodeY,nodeArray){
        var self = this;
        var newNode = new cc.Node();
        self.node.addChild(newNode);
        newNode.x = newNodeX;
        newNode.y = newNodeY;
        //动态添加一个Sprite组件
        newNode.addComponent(cc.Sprite);
        //添加到新增节点数组中
        if(nodeArray != null){
            nodeArray.push(newNode);
        }
        return newNode;
    },
    //计算二位数以上的数字分数方法
    caculateScore : function(scoreString){
        var self = this;
        //将十位数字拆分出来
        this.scoreNumArray = [];
        for(var i = 0; i < scoreString.length;i++){
            this.scoreNumArray[i] = scoreString.charAt(i);
        }
        (function iterator(i){
            if(i > self.newNodeArray.length){
                return;
            }
            //异步请求
            cc.loader.loadRes("atlas/Mnum_"+self.scoreNumArray[i],cc.SpriteFrame,function(err,spriteFrame){
                var sprite = self.newNodeArray[i].getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
                iterator(i + 1);
            });
        })(0);
    },
    update (dt) {
        // cc.log(this.pipeMove);
        cc.log(this.pipeStatus.getComponent("PipeMove").isIn);
        cc.log(this.pipeMove);
        cc.log(this.pipeMove.pipeNode);
        //鸟活着进来活着出去时候进行加分
        if((this.pipeMove.pipeNode.x >= this.pipeMove.minBorder) && (this.pipeMove.pipeNode.x <= this.pipeMove.maxBorder) && (!this.pipeMove.isPlayerDeath)){
            //如果是否加过分为false或者是分数为零的时候,将是否允许加分设置为true
            if(!this.isAdded){
                this.isAddScore = true;
            }
        }
        if(this.pipeMove.pipeNode.x <= -450 && !this.pipeMove.isPlayerDeath){
            //如果超出柱子的右边范围那么将是否可以加分重置为false
            this.isAddScore = false;
            //如果超出柱子的右边范围那么将是否已经加过分重置为false
            this.isAdded = false;
        }
        //如果鸟死了的话不进行加分
        if(this.isAddScore && !this.pipeMove.isPlayerDeath && !this.isAdded){
            //每次刷新的时候不让它再加
            this.score += this.award;
            //将标记为重置为false
            this.isAddScore = false;
            //动态的加载图片资源
            this.loadDynamic(0,250);
            //将是否已经加过重置为true
            this.isAdded = true;
        }
        //如果鸟死的话将game over图片显示出来
        if(this.pipeMove.isPlayerDeath){
            //显示game over图片
            // this.gameOverNode.active = true;
            //添加等级和相关分数
            /**
             * 添加等级图片
             */
            /**
             * 
             * 以后需要封装的步骤
             */
            var newNode = new cc.Node();
            newNode.parent = this.gameOverNode;
            newNode.x = -83;
            newNode.y = -8;
            newNode.addComponent(cc.Sprite);
            if(this.score <= 20){
                //渲染动态资源
                cc.loader.loadRes("atlas/Lv_B",cc.SpriteFrame,function(err,spriteFrame){
                    var sprite = newNode.getComponent(cc.Sprite);
                    sprite.spriteFrame = spriteFrame;
                });
            }else if(this.score > 20 && this.score <= 80){
                //渲染动态资源
                cc.loader.loadRes("atlas/Lv_S",cc.SpriteFrame,function(err,spriteFrame){
                    var sprite = newNode.getComponent(cc.Sprite);
                    sprite.spriteFrame = spriteFrame;
                });
            }
            /***
             * 
             * 添加分数
             * 
             */

            
        }


    },
});
