//index.js
//获取应用实例
var app = getApp();
const db=wx.cloud.database()
const productsCollection=db.collection('goods')
const MAX_LIMIT = 7
Page({
  data: {
    imgUrls: [
      '/img/dong2.jpg',
      '/img/dong3.jpg',
      '/img/dong1.jpg',
      '/img/dong4.jpg'
    ],
    classId:{
        'phone': 1,
        'book':2,
        'computer':3,
      },
      indicatorDots: true,
      vertical: false,
      autoplay: true,
      interval: 2000,
      duration: 500,
      goodsData:[],
      pageNo:1,
      pageSize:7,
      onReachBottomDistance:true,
      enablePullDownRefresh: true,
      newData:[],
      hasmore:true,
      currentItem:0,
      click:0,
      sign:0
  },

  onShow:function(){
    // console.log(2)
    var that = this
    if(that.data.sign==0){
      if(that.data.currentItem==0)
      {
      wx.cloud.callFunction({
        name:'seek',
        data:{
          dbname:'goods',
          pageNo:that.data.pageNo,
          pageSize:that.data.pageSize
        }
      }).then(res=>{
        let result=res.result.data
        that.data.newData=that.data.newData.concat(result);
        that.setData({
          hasmore:res.result.hasmore,
          goodsData: that.data.newData,
          sign:1
        })
        console.log(that.data.newData)
      })
    }else{
      wx.cloud.callFunction({
        name:'seek_click',
        data:{
          dbname:'goods',
          pageNo:that.data.pageNo,
          pageSize:that.data.pageSize
        }
      }).then(res=>{
        //console.log(res.result)
      let result=res.result.data
      that.data.newData=that.data.newData.concat(result);
      that.setData({
        hasmore:res.result.hasmore,
        goodsData: that.data.newData,
        sign:1
      })
      })
    }
  }
  },
  onLoad:function(options){
    // console.log(1)
    let that = this;
    if(options.url){
 
      let url = decodeURIComponent(options.url);
 
      wx.navigateTo({
        url
      })
    }
    var cb = app.getopenid(function (cb) {
      that.setData({
        openid:cb.result.openid
      });
    })
    // app.getopenid(that.cb)
    wx.showToast({
      title: '',
      icon: 'loading',
      duration: 1000
    });
    // if(that.data.currentItem==0)
    // {
    //   that.GetGoodsData_Date();
    // }else{
    //   that.GetGoodsData_Click();
    // }
  },
  GetGoodsData_Date: function(){//获取商品信息
    var result;
    let self=this;
    wx.showLoading({
      title: 'loading',
    })//显示加载状态
    wx.cloud.callFunction({
      name:'seek',
      data:{
        dbname:'goods',
        pageNo:self.data.pageNo,
        pageSize:self.data.pageSize
      }
    }).then(res=>{
      console.log(res)
      result=res.result.data
      self.setData({
        hasmore:res.result.hasmore,
      })
      if(self.data.hasmore)
      {
        self.data.newData=self.data.newData.concat(result);
        self.setData({
        goodsData: self.data.newData
        })
        wx.hideNavigationBarLoading({
           success: (res) => {},
        });
        wx.stopPullDownRefresh({
          success: (res) => {},
        });
      }
    })
    wx.hideLoading({
      success: (res) => {},
      })
    // productsCollection.get().then(res=>{
    //   console.log(res.data)
    //   // self.setData({
    //   //   goodsData: res.data
    //   // })
  },
  GetGoodsData_Click:function(){
    var result;
    let self=this;
    wx.showLoading({
      title: 'loading',
    })//显示加载状态
    wx.cloud.callFunction({
      name:'seek_click',
      data:{
        dbname:'goods',
        pageNo:self.data.pageNo,
        pageSize:self.data.pageSize
      }
    }).then(res=>{
      //console.log(res.result.data)
      result=res.result.data
      self.setData({
        hasmore:res.result.hasmore,
      })
      if(self.data.hasmore)
      {
        self.data.newData=self.data.newData.concat(result);
        self.setData({
        goodsData: self.data.newData
        })
        wx.hideNavigationBarLoading({
           success: (res) => {},
        });
        wx.stopPullDownRefresh({
          success: (res) => {},
        });
      }
    })
    // console.log(self.data.goodsData)
    // console.log(self.data.newData)
    wx.hideLoading({
      success: (res) => {},
      })
  },
  JumpDetail:function(e){ //跳转到商品详情页
    //console.log(e)
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
  //菜单点击事件
  handleItem(e){
    //console.log(e.currentTarget.id)
    let self=this;
    self.setData({
      currentItem:e.currentTarget.id,
      sign:0
    })
    self.data.goodsData=[]
    self.data.newData=[]
    self.data.pageNo=1
    self.onShow()
  },
  onPullDownRefresh: function () {
    this.data.pageNo=1;
    this.data.newData=[]
    if(this.data.currentItem==0)
    {
      this.GetGoodsData_Date();
    }else{
      this.GetGoodsData_Click();
    }
   },
 
   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
     //console.log("11111111");
     wx.showNavigationBarLoading(
     );
     this.data.pageNo++;
     //console.log(this.data.pageNo)
     if(this.data.currentItem==0)
     {
       this.GetGoodsData_Date();
     }else{
       this.GetGoodsData_Click();
     }
     //setTimeout(function () {
      // loadMoreView.loadMore();
    // }, 500)
   }
})