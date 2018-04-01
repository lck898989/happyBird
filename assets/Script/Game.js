/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-03-23 08:02:30 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-01 14:17:31
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
        award    : 5,
        //得分音效
        //停止按钮
       pause : {
           default   : null,
           type      : cc.Node,
       }
    },
    editor : {
        executionOrder : 2
    },
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.isPause = false;
        if(!Global.isPause){
            this.pause.active = false;
        }
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
        this.player = this.node.getChildByName('bird').getComponent("Player");
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
     * @param：newNodeArrayName  需要创建的新节点数组名称
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
    /**
     * @param:resource 资源文件路径
     * @param:scoreString 分数的字符串形式
     * @param:新节点数组的名字
     */
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
    /**
     * @param:newNode 新节点
     * @param:score 分数
     */
    renderMedal  : function(newNode,score){
        if(score <= 20){
            //渲染动态资源
            cc.loader.loadRes("atlas/Lv_A",cc.SpriteFrame,function(err,spriteFrame){
                var sprite = newNode.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            });
        }else if(score > 20 && score <= 50){
            //渲染动态资源
            cc.loader.loadRes("atlas/Lv_B",cc.SpriteFrame,function(err,spriteFrame){
                var sprite = newNode.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            });
        }else if(score > 50 && score <= 80){
            //渲染动态资源
            cc.loader.loadRes("atlas/Lv_C",cc.SpriteFrame,function(err,spriteFrame){
                var sprite = newNode.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            });
        }else{
            //渲染动态资源
            cc.loader.loadRes("atlas/Lv_S",cc.SpriteFrame,function(err,spriteFrame){
                var sprite = newNode.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            });
        }
    },
    //游戏结束之后显示最高分的方法
    /**
     * @param:resource 资源文件路径
     * @param:scoreString 分数的字符串形式
     * @param:newNodeX 新节点的x坐标
     * @param:newNodeY 新节点的Y坐标
     * @param:newNodeArrayName 新节点数组的名字
     * @param:whichNode 在哪个节点上添加子节点
     */
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
    /**
     * 调整节点数组中节点的坐标位置
     * @param:newNodeArrayName 新节点数组的名字
     * @param:whichNode 对哪个节点进行调整
     */
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
                this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].x -= this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].width / 2 - 3;
                //再创建一个节点
                var newNodeLocationX = this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].x + this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].width + 3;
                var newNodeLocationY = this.gameOverScoreBoardNodeArray[this.gameOverScoreBoardNodeArray.length - 1].y;
                this.dynamicCreateNode(newNodeLocationX,newNodeLocationY,this.gameOverScoreBoardNodeArray,whichNode);                       
            }
            
        }else if(newNodeArrayName === "bestScoreBoardNodeArray"){
            if(this.bestScoreBoardNodeArray.length >= 1){
                this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].x -= this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].width / 2 + 3;
                //再创建一个节点
                var newNodeLocationX = this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].x + this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].width + 18;
                var newNodeLocationY = this.bestScoreBoardNodeArray[this.bestScoreBoardNodeArray.length - 1].y;
                this.dynamicCreateNode(newNodeLocationX,newNodeLocationY,this.bestScoreBoardNodeArray,whichNode);                       
            }
        }
    },
    
    update (dt) {
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
            var newNode = this.dynamicCreateNode(-83,-10,null,this.gameOverNode);
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
            if(this.score >= this.best){
                cc.sys.localStorage.setItem('bestScore',this.score);
            }
            //将最好成绩显示出来
            this.showScore("atlas/Mnum_",this.best.toString(),60,-30,"bestScoreBoardNodeArray",this.gameOverNode);
            // this.jumpScore("atlas/Mnum_",this.score);
        }
        if(Global.isPause === true){
            //来电的时候显示暂停按钮
            this.pause.active = true;
            console.log("是否暂停游戏：" + Global.isPause);  
            //暂停所有游戏逻辑或者音效
            cc.director.pause();
            //接听电话之后返回游戏
            var self = this;
            if(cc.sys.os === cc.sys.OS_ANDROID){
                self.pause.on('touchstart',function(){
                    //如果是触摸了返回按钮之后自动返回游戏逻辑
                    cc.director.resume();
                    //将该节点隐藏
                    self.pause.active = false;
                })
            }
            self.pause.on('mousedown',function(){
                //恢复游戏
                cc.director.resume();
                //将该节点隐藏
                self.pause.active = false;
            })
        }
    },
    
});
