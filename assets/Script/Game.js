/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-03-21 09:02:26 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-22 18:02:34
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
        //刚开始时候game over等等图标是不会显示的
        this.gameOverNode.active = false;
        this.reBeginNode = cc.find("Canvas/return");
        cc.log(this.reBeginNode);
        //将返回图标重置为false不让其显示
        this.reBeginNode.active = false;
        this.score = 0;
        //加载动态资源
        // this.loadDynamic(0,250);
        this.isAddScore = false;
        this.isAdded    = false;
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
        //游戏结束的时候用于存放新节点的数组
        this.gameOverScoreBoardNodeArray = [];
        //用于存放最好成绩的节点数组
        this.bestScoreBoardNodeArray = [];
        //盛放分数拆分后的数字
        this.scoreNumArray = [];
        this.loadDynamic("atlas/Mnum_",0,250,"newNodeArray",this.node);
    },
    //动态加载资源方法,图片生成的位置信息也穿进去
    /**
     * 
     * @param：resource 需要加载的资源
     * @param：newNodeX 需要生成新节点的X坐标
     * @param：newNodeY 需要生成节点的Y坐标
     * @param：newNodeArray  需要创建的新节点数组
     * @param: whichNode 需要在哪个节点下动态加载渲染
     */
    loadDynamic : function(resource,newNodeX,newNodeY,newNodeArrayName,whichNode){
        var self = this;
        if(this.score <= 9){
             if(newNodeArrayName === 'newNodeArray'){
                    //如果存在了新增节点就不创建节点了加载动态资源
                if(this.newNodeArray.length === 0){
                    //动态生成新节点
                    var newNode = this.dynamicCreateNode(newNodeX,newNodeY,this.newNodeArray,whichNode);
                }else{
                    //弹出最后一个节点
                    newNode = this.newNodeArray[this.newNodeArray.length - 1];
                }
                
             }
             //渲染最后一个节点
             cc.loader.loadRes(resource+this.score,cc.SpriteFrame,function(err,spriteFrame){
                var sprite = newNode.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            });
                
        }else{
            //当分数大于九的时候重新创建一个节点用于容纳分数的第二位
            //如果当前分数的字符串格式的长度 - 前一个分数的字符串格式的长度 == 1的时候说明需要添加一个精灵节点了
            var preScoreString = (this.score - this.award).toString();
            //将分数拆成数项 比如 32 拆成 3 和 2
            var scoreString = this.score.toString();
            //如果是game over之后不用创建一个一个新的数组了用之前的数组就行了
            // if(whichNode.name === 'gameOver'){
            //     newNodeArray = this.newNodeArray;
            // }
            if(scoreString.length - preScoreString.length === 1){
                if(newNodeArrayName === 'newNodeArray'){
                    //创建新节点之前需要将前一个节点的x坐标左移
                    this.newNodeArray[this.newNodeArray.length - 1].x -= this.newNodeArray[this.newNodeArray.length - 1].width / 2 - 3;
                    //再创建一个节点
                    var newNodeLocationX = this.newNodeArray[this.newNodeArray.length - 1].x + this.newNodeArray[this.newNodeArray.length - 1].width + 3;
                    var newNodeLocationY = this.newNodeArray[this.newNodeArray.length - 1].y;
                    
                    this.dynamicCreateNode(newNodeLocationX,newNodeLocationY,this.newNodeArray,whichNode);
                    this.caculateScore(resource,scoreString,'newNodeArray');
                }else if(newNodeArrayName === 'gameOverScoreBoardNodeArray'){
                    this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].x -= this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].width / 2 - 3;
                    //再创建一个节点
                    var newNodeLocationX = this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].x + this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].width + 3;
                    var newNodeLocationY = this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].y;
                    
                    this.dynamicCreateNode(newNodeLocationX,newNodeLocationY,this.gameOverScoreBoardNodeArray,whichNode);
                    this.caculateScore(resource,scoreString,'gameOverScoreBoardNodeArray');
                }
                
            }else{
                if(newNodeArrayName === 'newNodeArray'){
                    this.caculateScore(resource,scoreString,'newNodeArray');
                }else if(newNodeArrayName === 'gameOverScoreBoardNodeArray'){
                    this.caculateScore(resource,scoreString,'gameOverScoreBoardNodeArray');
                }
                 
            }
        }
        
    },
    
    //动态生成新节点，传参的时候规定是在哪个节点下生成新节点
    /**
     * 
     * @param : newNodeX  新节点的生成位置的x坐标
     * @param ：newNodeY  新节点的生成位置的Y坐标
     * @param : nodeArray 需不需要一个node节点数组
     * @param : whichNode 在哪个节点下生成新节点
     * 
     */
    dynamicCreateNode  : function(newNodeX,newNodeY,nodeArray,whichNode){
        var newNode = new cc.Node();
        whichNode.addChild(newNode);
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
    caculateScore : function(resource,scoreString,newNodeArrayName){
        var self = this;
        //将十位数字拆分出来
        this.scoreNumArray = [];
        for(var i = 0; i < scoreString.length;i++){
            this.scoreNumArray[i] = scoreString.charAt(i);
        }
        (function iterator(i){
            if(newNodeArrayName === 'newNodeArray'){
                if(i >= self.newNodeArray.length){
                    return;
                }
            }else if(newNodeArrayName === 'gameOverScoreBoardNodeArray'){
                if(i >= self.gameOverScoreBoardNodeArray.length){
                    return;
                }
            }else if(newNodeArrayName === 'bestScoreBoardNodeArray'){
                if(i >= self.bestScoreBoardNodeArray.length){
                    return;
                }
            }
            if(newNodeArrayName === 'newNodeArray'){
                //异步请求
                cc.loader.loadRes(resource+self.scoreNumArray[i],cc.SpriteFrame,function(err,spriteFrame){
                    var sprite = self.newNodeArray[i].getComponent(cc.Sprite);
                    sprite.spriteFrame = spriteFrame;
                    iterator(i + 1);
                    });
            }else if(newNodeArrayName === 'gameOverScoreBoardNodeArray'){
                if(self.gameOverScoreBoardNodeArray.length != 0){
                        //异步请求
                        cc.loader.loadRes(resource+self.scoreNumArray[i],cc.SpriteFrame,function(err,spriteFrame){
                            var sprite = self.gameOverScoreBoardNodeArray[i].getComponent(cc.Sprite);
                            sprite.spriteFrame = spriteFrame;
                            iterator(i + 1);
                            });
                }
            }else if(newNodeArrayName === 'bestScoreBoardNodeArray'){
                if(self.bestScoreBoardNodeArray.length != 0){
                    //异步请求
                    cc.loader.loadRes(resource+self.scoreNumArray[i],cc.SpriteFrame,function(err,spriteFrame){
                        var sprite = self.bestScoreBoardNodeArray[i].getComponent(cc.Sprite);
                        sprite.spriteFrame = spriteFrame;
                        iterator(i + 1);
                        });
                }
            }
        })(0);
    },
    //根据分数渲染奖牌的方法
    renderMedal  : function(newNode,score){
        if(score <= 20){
            //渲染动态资源
            cc.loader.loadRes("atlas/Lv_B",cc.SpriteFrame,function(err,spriteFrame){
                var sprite = newNode.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            });
        }else if(score > 20 && score <= 80){
            //渲染动态资源
            cc.loader.loadRes("atlas/Lv_S",cc.SpriteFrame,function(err,spriteFrame){
                var sprite = newNode.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            });
        }
    },
    //游戏结束之后显示最高分的方法
    showScore : function(resource,scoreString,newNodeX,newNodeY,newNodeArrayName,whichNode){
        //获取分数字符串的长度
        var scoreStringLength = scoreString.length;
        //如果传递进来的数组是空的话就增加节点并且调整他们的位置
        for(var i = 0;i < scoreStringLength;i++){
                if(newNodeArrayName === 'newNodeArray'){
                    if(this.newNodeArray[i] === undefined){
                        //如果数组中该项为空的话进行创建节点
                        if(i > 0){
                            this.adapterLocation(newNodeArrayName,whichNode);
                        }else{
                            this.dynamicCreateNode(newNodeX,newNodeY,this.newNodeArray,whichNode);
                        }
                    }
                    
                }else if(newNodeArrayName === 'gameOverScoreBoardNodeArray'){
                    if(this.gameOverScoreBoardNodeArray[i] === undefined){
                        if(i > 0){
                            this.adapterLocation(newNodeArrayName,whichNode);
                        }else{
                            this.dynamicCreateNode(newNodeX,newNodeY,this.gameOverScoreBoardNodeArray,whichNode);
                        }
                    }
                   
                }else if(newNodeArrayName === "bestScoreBoardNodeArray"){
                    if(this.bestScoreBoardNodeArray[i] === undefined){
                        if(i > 0){
                            this.adapterLocation(newNodeArrayName,whichNode);
                        }else{
                            this.dynamicCreateNode(newNodeX,newNodeY,this.bestScoreBoardNodeArray,whichNode);
                        }
                    }
                }
        }
       
           this.caculateScore(resource,scoreString,newNodeArrayName);
    },
    //当节点增加时候对其位置进行调整的方法
    adapterLocation : function(newNodeArrayName,whichNode){
        if(newNodeArrayName === 'newNodeArray'){
            //如果数组的长度大于1的时候进行调整
            if(this.newNodeArray.length >= 1){
                //创建新节点之前需要将前一个节点的x坐标左移
                this.newNodeArray[this.newNodeArray.length - 1].x -= this.newNodeArray[this.newNodeArray.length - 1].width / 2 - 3;
                //再创建一个节点
                var newNodeLocationX = this.newNodeArray[this.newNodeArray.length - 1].x + this.newNodeArray[this.newNodeArray.length - 1].width + 3;
                var newNodeLocationY = this.newNodeArray[this.newNodeArray.length - 1].y;
                this.dynamicCreateNode(newNodeLocationX,newNodeLocationY,this.newNodeArray,whichNode);
            }
            
        }else if(newNodeArrayName === 'gameOverScoreBoardNodeArray'){
            //如果数组的长度大于1的时候进行调整
            if(this.gameOverScoreBoardNodeArray.length >= 1){
                this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].x -= this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].width / 2 - 12;
                //再创建一个节点
                var newNodeLocationX = this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].x + this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].width + 12;
                var newNodeLocationY = this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].y;
                this.dynamicCreateNode(newNodeLocationX,newNodeLocationY,this.gameOverScoreBoardNodeArray,whichNode);                       
            }
            
        }else if(newNodeArrayName === "bestScoreBoardNodeArray"){
            if(this.bestScoreBoardNodeArray.length >= 1){
                this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].x -= this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].width / 2 - 15;
                //再创建一个节点
                var newNodeLocationX = this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].x + this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].width + 15;
                var newNodeLocationY = this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].y;
                this.dynamicCreateNode(newNodeLocationX,newNodeLocationY,this.bestScoreBoardNodeArray,whichNode);                       
            }
        }
    },
    //实现跳分的方法
    jumpScore : function(resource,score){
        var self = this;
        var from = 0;
        var x = null;
        this.schedule(function(x,resource,score){
            //根据分数创建
            if(from > score){
                return;
            }
            //将他需要的节点数组获取到 
            self.showScore(resource,from.toString(),60,14,'gameOverScoreBoardNodeArray',self.gameOverNode);
            from += self.award;
        },0.5);
        

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
                //允不允许加分
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
            this.loadDynamic("atlas/Mnum_",0,250,'newNodeArray',this.node);
            //将是否已经加过重置为true
            this.isAdded = true;
        }
        //如果鸟死的话将game over图片显示出来
        if(this.pipeMove.isPlayerDeath){
            //当鸟死亡的时候将this.newNodeArray释放掉因为这时候不需要这个对象了
            //将this.newNodeArray重置，节省内存
            // this.newNodeArray = [];
            this.reBeginNode.active = true;
            //显示game over图片
            this.gameOverNode.active = true;
            //添加等级和相关分数
            /**
             * 添加等级图片
             */
            /**
             * 
             * 以后需要封装的步骤
             */
            var newNode = this.dynamicCreateNode(-83,-5,null,this.gameOverNode);
            this.renderMedal(newNode,this.score);
            /***
             * 
             * 添加分数
             * 
             */
            //创建以及渲染分数节点
            // this.showScore("atlas/Mnum_",this.score.toString(),60,20,'gameOverScoreBoardNodeArray',this.gameOverNode);
            // this.jumpScore("atlas/Mnum_",this.score);   
            //从注册表中获得最好成绩
            this.best = cc.sys.localStorage.getItem('bestScore');
            //如果是刚开始游戏的话将当前分数赋给最好成绩
            if(this.best === undefined){
                this.best = this.score;
                
            }
            if(this.score > this.best){
                cc.sys.localStorage.setItem('bestScore',this.score);
            }
            //将最好成绩显示出来
            this.showScore("atlas/Mnum_",this.best.toString(),60,-30,"bestScoreBoardNodeArray",this.gameOverNode);
            // this.jumpScore("atlas/Mnum_",this.score);
        }


    },
    
});
