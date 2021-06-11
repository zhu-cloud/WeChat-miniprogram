// pages/order/order.js
const db=wx.cloud.database()
const productsCollection=db.collection('goods')
const orderCollection=db.collection('order')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:[],
    goods:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goods=this.data.goods
    var order=[]
    orderCollection.where({orderBuyId:options.Id}).get().then(res=>{
      console.log(res)
      order=res.data
      this.setData({
        order
      })
      console.log(order[0])
      let num=order.length
      console.log(num)
      for(var i=0;i<num;i++)
      {
        productsCollection.where({_id:order[i].orderGoodId}).get().then(re=>{
          goods=goods.concat(re.data)
        })
        this.setData(goods)
        // console.log(goods)
        if(i=num-1)
        {

        }
      }
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