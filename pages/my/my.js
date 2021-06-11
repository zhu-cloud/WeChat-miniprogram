var app = getApp();
const db=wx.cloud.database()
const productsCollection=db.collection('goods')
const usersCollection=db.collection('user_info')
Page({
  data: {
    openid:null,
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    image:"../../img/lunbo1.jpg",
    goods:[]
  },
 
 onLoad:function(){
  let that = this;
  var cb = app.getopenid(function (cb) {
    that.setData({
      openid:cb.result.openid
    });
  })
  if (wx.getStorageInfoSync('login')) 
  {
    that.setData({
      canIUseGetUserProfile: true,
      //userInfo:wx.getStorageInfoSync('userInfo')
    })
  }
},
onShow(){
  //console.log(this.data.userInfo)
  // if(this.data.canIUseGetUserProfile){
  //   this.setData({
      //this.data.hasUserInfo=false;
    //   userInfo:wx.getStorageInfoSync("userInfo")
    // })
  //}
  // const userInfo=wx.getStorageInfoSync('userInfo');
  // this.setData({
  //   userInfo
  // })
},
collect(e){
  let self=this
  if(self.data.hasUserInfo)
  {
    wx.navigateTo({
      url: '/pages/collect/collect?Id='+self.data.openid,
    })
  }
  else{
    wx.showToast({  
      title: '请先登录哦！',  
  
    }); 
  }
},
mine(e){
  let self=this
  if(self.data.hasUserInfo)
  {
    wx.navigateTo({
      url: '/pages/mine/mine?Id='+self.data.openid,
    })
  }
  else{
    wx.showToast({  
      title: '请先登录哦！',  
     
    }); 
  }
},
order(e)
{
  let self=this
  if(self.data.hasUserInfo)
  {
    wx.navigateTo({
      url: '/pages/order/order?Id='+self.data.openid,
    })
  }
  else{
    wx.showToast({  
      title: '请先登录哦！',  
     
    }); 
  }
},
getUserProfile(e) {
  // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  wx.getUserProfile({
    desc: '用于完善用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      console.log(res)
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
      wx.setStorage({
        data: res.userInfo,
        key: 'userInfo'
      })
      usersCollection.where({openid:this.data.openid}).get().then(re=>{
        console.log(re.data)
        if(re.data[0]!=null)
        {
          usersCollection.where({openid:this.data.openid}).update({
            data:{
              nack_name:res.userInfo.nickName,
              URL:res.userInfo.avatarUrl
            }
          }) 
        }else{
        usersCollection.add({
          data:{
            openid:this.data.openid,
            nack_name:res.userInfo.nickName,
            URL:res.userInfo.avatarUrl
          }
        }) 
      }
     })
      wx.cloud.callFunction({
        name:'login',
        data:{},
        success:res=>{
          console.log(res)
        }
      })
      wx.setStorageSync("login", true)
    }
  })
},
getUserInfo(e) {
  // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  this.setData({
    userInfo: e.detail.userInfo,
    hasUserInfo: true
  })
}
// login:function(){

//   wx.login({
//   success:function(res){
//   //console.log(res.code)
//   //发送请求
//   console.log(res)
//   wx.request({
//   url: 'http://localhost/Goods/login.php', //接口地址
//   data: {
//     code:res.code
//   },
//   header: {
//   'content-type': 'application/json' //默认值
//   },
//   success: function (res) {
//   }
//   })
//  }
// })
// },
 
})