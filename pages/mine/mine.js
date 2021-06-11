var app = getApp();
const db=wx.cloud.database()
const productsCollection=db.collection('goods')
import Toast from '../../vant/dist/toast/toast.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    openid:null,
    goodsdata:[],
    hasmore:false,
    dataList:[],
    startX: 0,
    startY: 0,
    click:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.openid=options.Id
    var goodsdata=this.data.goodsdata
    // var dataList=[]
    productsCollection.where({author:this.data.openid}).get().then(res=>{
      //console.log(res.data)
      goodsdata=res.data
      for( var i=0;i<goodsdata.length;i++){
        goodsdata[i].isTouchMove = false
        goodsdata[i].checked = false
        goodsdata[i].id=i
        }
        this.setData({
          goodsdata
        })
        console.log(goodsdata)
    })
    // wx.redirectTo({url:'/pages/add/add'})
    //console.log(this.data.goodsdata)
  },

  // 开始滑动
  touchStart(e) {
    console.log('touchStart=====>', e);
    let dataList = [...this.data.goodsdata]
    dataList.forEach(item => {
      if (item.isTouchMove) {
        item.isTouchMove = !item.isTouchMove;
      }
    });
    this.setData({
      goodsdata: dataList,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },

  touchMove(e) {
    console.log('touchMove=====>', e);
    let moveX = e.changedTouches[0].clientX;
    let moveY = e.changedTouches[0].clientY;
    let indexs = e.currentTarget.dataset.index;
    let dataList = [...this.data.goodsdata]
    let angle = this.angle({
      X: this.data.startX,
      Y: this.data.startY
    }, {
      X: moveX,
      Y: moveY
    });

    dataList.forEach((item, index) => {
      item.isTouchMove = false;
      // 如果滑动的角度大于30° 则直接return；
      if (angle > 30) {
        return
      }

      if (indexs === index) {
        if (moveX > this.data.startX) { // 右滑
          item.isTouchMove = false;
        } else { // 左滑
          item.isTouchMove = true;
        }
      }
    })

    this.setData({
      goodsdata:dataList
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  // 删除
  delItem(e) {
    let id = e.currentTarget.dataset.id;
    let dataList = [...this.data.goodsdata];
    console.log('id--->', id);
    for (var i=0;i < dataList.length; i++) {
      const item = dataList[i];
      item.isTouchMove = false;
      if (item.id === id) {
        productsCollection.where({_id:dataList[i]._id}).remove().then(res=>{
          console.log("111")
        })
        dataList.splice(i, 1);
        break;
      }
    }
    this.setData({
      goodsdata:dataList
    })
  },
  JumpDetail:function(e){ //跳转到商品详情页
    console.log(e)
    //点击数据获取商品ID
    //跳转到详情页传递ID参数
    let self=this
    let goodsNo=e.currentTarget.dataset.goodid;
    console.log(goodsNo)
    productsCollection.where({_id:goodsNo}).get().then(res=>{
      console.log(res.data)
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
})