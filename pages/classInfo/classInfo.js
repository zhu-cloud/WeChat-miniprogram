// pages/classInfo/classInfo.js
var app = getApp();
const db=wx.cloud.database()
const productsCollection=db.collection('goods')
const productsDetal=db.collection('goods_detal')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options.class)
    let classs=options.class
    if (classs!="*") {
      productsCollection.where({class:classs}).get().then(res=>{
        console.log(res)
        that.setData({
          goods:res.data
        })
      })
    }
    else{
      productsCollection.get().then(res=>{
        console.log(res)
        that.setData({
          goods:res.data
        })
      })
    }

    // wx.request({
    //   url: app.data.apiUrl +'GoodsDatas/',
    //   success:function(res){
    //     console.log(res.data)
    //     if(res.data.code==0){
    //       that.setData({
    //         goods:res.data.data
    //       })
    //     }
    //   }
    // })
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