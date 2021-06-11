// pages/search_output/search_output.js
const db=wx.cloud.database()
const productsCollection=db.collection('goods')
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsData:[],
    onReachBottomDistance:true,
    enablePullDownRefresh: true,
    newData:[],
    isComplete:false,
    currentItem:0,
    str:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    var that=this
    //console.log(options)
    that.setData({
      str:options.string
    })
    //console.log(that.data.str)
    this.getSearchData();
  },
  getSearchData:function(){
    wx.showLoading({
      title: 'loading',
    })//显示加载状态
    let self=this;
    productsCollection.where(_.or([
      {
        title:db.RegExp({
          regexp:'.*'+self.data.str+'.*',
          options:'i'
        })
      },
      {
        desc:db.RegExp({
          regexp:'.*'+self.data.str+'.*',
          options:'i'
        })
      },
      {
        detal:db.RegExp({
          regexp:'.*'+self.data.str+'.*',
          options:'i'
        })
      }
     ])
    ).get({
      success: function(res) {
        console.log(res.data[0])
        wx.hideNavigationBarLoading({
          success: (res) => {},
        });
        wx.stopPullDownRefresh({
          success: (res) => {},
        });
        wx.hideLoading({
          success: (res) => {},
        })
        let result=res.data[0];
        if(result._id.length>0)
        {
          self.data.newData=self.data.newData.concat(result);
          self.setData({
          goodsData: self.data.newData
          })
          console.log(self.data.goodsData)
        }
        else{
          self.setData({
            isComplete:true
            })
            }
      }
  })
  //  wx.request({
  //   url: 'http://localhost/Goods/SearchDatas.php',
  //   method: 'GET',
  //   data: {
  //     tit:self.data.str
  //   },
  //   header: {
  //   'content-type':'application/json'},
  //   success(res){
  //     wx.hideNavigationBarLoading({
  //       success: (res) => {},
  //     });
  //     wx.stopPullDownRefresh({
  //       success: (res) => {},
  //     });
  //     wx.hideLoading({
  //       success: (res) => {},
  //     })
  //     console.log(self.data.str)
  //     console.log(res.data);
     
  //     let result=res.data;
  //     if(result.data.length>0)
  //     {
  //       self.data.newData=self.data.newData.concat(result.data);
  //       self.setData({
  //         goodsData: self.data.newData
  //       })
  //     }
  //     else{
  //       self.setData({
  //         isComplete:true
  //          })
  //         }
  //       },
  //    })
   },
  JumpDetail:function(e){ //跳转到商品详情页
    console.log(e)
    //点击数据获取商品ID
    //跳转到详情页传递ID参数
    let goodsNo=e.currentTarget.dataset.goodid;
    //console.log(goodsNo)
     wx.navigateTo({
       url: '/pages/goodsInfo/goodsInfo?Id='+goodsNo,
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