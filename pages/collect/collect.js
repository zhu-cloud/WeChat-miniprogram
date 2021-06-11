// pages/collect/collect.js
var app = getApp();
const db=wx.cloud.database()
const productsCollection=db.collection('goods')
const goodsCollection=db.collection('goods_collect')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    goods:[],
    goodsdata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.openid=options.Id
    var goodsdata=this.data.goodsdata
    goodsCollection.where({openID:this.data.openid}).get().then(res=>{
      console.log(res)
      this.setData({
        goods:res.data
      })
      var n=this.data.goods.length
      for(var i=0;i<n;i++)
      {
        // console.log(i)
        productsCollection.where({_id:this.data.goods[i].good_ID}).get().then(re=>{
          
          goodsdata=goodsdata.concat(re.data[0])
          // console.log(i)
          if(i==n)
          {
            this.setData({goodsdata})
            console.log(n)
          }
          console.log(this.data.goodsdata)
        })
        // console.log(goodsdata)
      }
     
      // console.log(this.data.goodsdata)
    })
  },
  JumpDetail:function(e){ //跳转到商品详情页
    // console.log(e)
    //点击数据获取商品ID
    //跳转到详情页传递ID参数
    let self=this
    let goodsNo=e.currentTarget.dataset.goodid;
    //console.log(goodsNo)
    productsCollection.where({_id:goodsNo}).get().then(res=>{
      //console.log(res.data[0].click)
      self.setData({
        click:res.data[0].click
      })
      productsCollection.doc(goodsNo).update({
        data:{
          click:self.data.click+1
        },
        success:function(res)
        {
          self.data.click++
          self.setData({
            sign:1
          })
        }
      })
      //console.log(self.data.click)
      wx.navigateTo({
        url: '/pages/goodsInfo/goodsInfo?Id='+goodsNo+'&click='+self.data.click,
      })
    })
     
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function () {

  }
})