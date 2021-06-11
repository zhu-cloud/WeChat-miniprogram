// pages/goodsInfo/goodsInfo.js
var app = getApp();
const db=wx.cloud.database()
const productsCollection=db.collection('goods')
const goodsCollection=db.collection('goods_collect')
const usersCollection=db.collection('user_info')
const commentCollection=db.collection('comment_info')
const orderCollection=db.collection('order')
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [],
    goodsInfo:null,
    comments:null,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    price:null,
    click:0,
    Id:0,
    contentInp:'',
    replyInp:'',
    check:true,
    title:null,
    userImg:null,
    detal:true,
    userName:null,
    number:1,
    num:null,
    replyUserID:null,
    replyName:null,
    comment_openid:[],
    wantReplay:[],
    goodsNumber: 1,
    minusStatus: 'disabled',
    collect:false,
    //遮罩层显示状态
    mask: true,
    //购物车弹窗显示隐藏
    cartBox: true,
    //单规格
    danguige: true,
    //多规格
    duoguige: false,

    openid:null,
    guigelist: [
      {
        id: 1,
        guige: '白色'
      },
      {
        id: 2,
        guige: '红色'
      },
      {
        id: 1,
        guige: '黑色'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('1')
    console.log(options);
    let that = this;
    that.setData({
      Id:options.Id,
      click:options.click
    })
    var cb = app.getopenid(function (cb) {
      that.setData({
        openid:cb.result.openid,
        replyUserID:cb.result.openid
      })
      goodsCollection.where(_.and(
        {
          openID:db.RegExp({
            regexp:that.data.openid
          })
        },
        {
          good_ID:db.RegExp({
            regexp:that.data.Id
          })
        }
      )).get().then(res=>{
        //console.log(res)
        if(res.data[0]!=null)
        {
          that.setData({
            collect:true
          })
        }
      })
      usersCollection.where({openid:that.data.openid}).get().then(res=>{
        console.log(res)
        that.setData({
          userImg:res.data[0].URL,
          userName:res.data[0].nack_name
        })
      })
    })
    that.getComment();
    that.getDetalData();
    //this.num=this.data.background
    
  },
  getDetalData: function(){
    wx.showLoading({
      title: 'loading',
    })//显示加载状态
    let self=this;
    productsCollection.where({_id:self.data.Id}).get().then(res=>{
      //console.log(res.data[0])
      let result=res.data[0];
      self.setData({
        background:result.goodimages,
        detal:result.detal,
        price:result.price,
        title:result.title,
        num:result.goodimages.length
      })
      wx.hideLoading({
       success: (res) => {},
      })
    })
},
getComment:function(){
  let that=this;
  commentCollection.where({good_ID:that.data.Id}).get().then(res=>{
    console.log(res)
        that.setData({
          wantReplay:res.data
        })
      })
},
replyInp(e) {
  this.setData({
    replyInp: e.detail.value
  })
},
onReachBottom: function() {
  this.data.limit = this.data.limit + 4
  this.getWantDetail();
},
//触摸事件切换到回复楼主
touchstar: function() {
  this.setData({
    check: true,
    focus: false,
    contentInp: "",
    replyInp: "",
  })
},
/**评论输入框 */
contentInp(e) {
  this.setData({
    contentInp: e.detail.value
  })
},
/**消息图片点击 */
addWantImg() {
  this.setData({
    focus: true,
  })
},
addWant() {
  if (this.data.contentInp.length > 100) {
    wx.showToast({
      title: '请将字数控制在100字以内哦',
      icon: "none",
      duration: 1000,
      mask: true,
    })
  } else {
    if (this.data.replyUserID ===this.data.openid && this.data.check === true) {
      this.addComment();
    } else {
      this.addReply();
    }
  }
},
getReplyUserID(e) {
  console.log(e)
  let replyID = e.currentTarget.dataset.replyuserid; //获取发表这条评论的用户的标识
  if (replyID === this.data.openid) 
  {
    wx.showToast({
      title: '请不要回复自己哦',
      icon: "none",
      duration: 1000,
      mask: true,
    })
    this.setData({
      replyUserID: e.currentTarget.dataset.replyuserid,
    })
  } else{
    this.setData({
      replyUserID: replyID,
      replyName: e.currentTarget.dataset.replyname,
      focus: true,
      check: false
    })
  }
},
/**回复 */
addReply() {
  usersCollection.where({openid:this.data.replyUserID}).get().then(res=>{
    console.log(res)
    commentCollection.add({
      data:{
        openID:this.data.openid,
        good_ID:this.data.Id,
        reply_ID:this.data.replyUserID,
        comment_detal:this.data.contentInp,
        userName:res.data[0].nack_name,
        URL:res.data[0].URL
      }
    }).then(res=>{
      console.log(res)
    })
    wx.showToast({
      title: '评论成功',
      icon: "none",
      duration: 1000,
      mask: true,
    })
    wx.redirectTo({
      url: '/pages/goodsInfo/goodsInfo?Id='+this.data.Id+'&click='+this.data.click,
    })
  })
},
addComment() {
  console.log(this.data.replyUserID)
  usersCollection.where({openid:this.data.replyUserID}).get().then(res=>{
    console.log(res)
    commentCollection.add({
      data:{
        openID:this.data.openid,
        good_ID:this.data.Id,
        reply_ID:this.data.replyUserID,
        comment_detal:this.data.contentInp,
        userName:res.data[0].nack_name,
        URL:res.data[0].URL
      }
    }).then(res=>{
      console.log(res)
    })
    wx.showToast({
      title: '评论成功',
      icon: "none",
      duration: 1000,
      mask: true,
    })
    wx.redirectTo({
      url: '/pages/goodsInfo/goodsInfo?Id='+this.data.Id+'&click='+this.data.click,
    })
  })
},
//点击幻灯片放大预览
handerpreview(e){
  console.log(this.data.background);
  const current=e.currentTarget.dataset.url;
  const urls=this.data.background;
  wx.previewImage({
    urls,
    current
  })
},
/* 切换事件*/
swiperChange: function(e){
  //console.log("111")
//  console.log(e)
  let currentNum=e.detail.current+1;
  this.setData({
    number:currentNum
  })
},
collect(){
  let that=this
  console.log(that.data.openid)
  if(that.data.collect)
  {
    goodsCollection.where(_.and(
      {
        openID:db.RegExp({
          regexp:that.data.openid
        })
      },
      {
        good_ID:db.RegExp({
          regexp:that.data.Id
        })
      }
    )).remove().then(res=>{
      console.log(res)
    })
    that.setData({
      collect:false
    })
    wx.showToast({  
      title: '已取消收藏！'
    }); 
  }
  else{
    goodsCollection.add({
      data:{
        openID:that.data.openid,
        good_ID:that.data.Id
      }
    })
    that.setData({
      collect:true
    })
    wx.showToast({  
      title: '已收藏！' 
    }); 
  }
},
show_collect() 
{
  let self=this
  wx.navigateTo({
    url: '/pages/collect/collect?Id='+self.data.openid,
  })
},
buy(){
  console.log('e')
  var that=this
  console.log(that.data.Id)
  orderCollection.add({
    data:{
      orderGoodId:that.data.Id,
      orderBuyId:that.data.openid,
      orderBuyUrl:that.data.userImg,
      Orderprice:that.data.price
    },
    succes:function(res){
      console.log(res)
      wx.showToast({
        title: '下单成功！',
      })
    }
  })
},
//点击遮罩层隐藏弹窗
// hideAllBox() {
//   this.setData({
//     //遮罩层隐藏
//     mask: true,
//     //产品参数弹窗隐藏
//     paramsBox: true,
//     //购物车弹窗隐藏
//     cartBox: true,
//     //选择规格弹窗隐藏
//     choice: true,

//   })
// },
// /* 点击减号 */
// reduceNumber: function () {
//   var num = this.data.goodsNumber;
//   // 如果大于1时，才可以减  
//   if (num > 1) {
//     num--;
//   }
//   // 只有大于一件的时候，才能normal状态，否则disable状态  
//   var minusStatus = num <= 1 ? 'disabled' : 'normal';
//   // 将数值与状态写回  
//   this.setData({
//     goodsNumber: num,
//     minusStatus: minusStatus
//   });
// },
// /* 点击加号 */
// addNumber: function () {
//   var num = this.data.goodsNumber;
//   // 不作过多考虑自增1  
//   num++;
//   // 只有大于一件的时候，才能normal状态，否则disable状态  
//   var minusStatus = num < 1 ? 'disabled' : 'normal';
//   // 将数值与状态写回  
//   this.setData({
//     goodsNumber: num,
//     minusStatus: minusStatus
//   });
// },
// /* 输入框事件 */
// inputValueChange: function (e) {
//   var num = e.detail.value;
//   // 将数值与状态写回  
//   this.setData({
//     goodsNumber: num
//   });
// },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShareAppMessage: function () {
 
    let url = encodeURIComponent('/pages/goodsInfo/goodsInfo?Id=' + this.data.Id);
 
    return {
      title: "商品详情",
      path:`/pages/index/index?url=${url}` 
    }
  },
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('2')
    let that=this
    goodsCollection.where({
      openID:that.data.openid
    }).get().then(res=>{
      //console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
})