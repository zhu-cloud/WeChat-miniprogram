//app.js
App({
  globalData:{
    openid:""
  },
  data:{
      apiUrl:'http://localhost/Goods/',
      // appId = "wx13594e6184548499",
      // appSecret = "158fcf84e383a0c3758eebf74669cd81"
      openid:""
  },
  onLaunch: function (e) {
    var that=this
    wx.cloud.init({
      env:"cloud1-2gqrpf4fa30d0696"
    })
    var cb = that.getopenid(function (cb) {
      console.log(cb);
    
    });
  },
  getopenid: function(cb) {  // 获取用户的唯一标识
    let that=this
    // if (this.globalData.openid) {
    //   typeof cb == "function" && cb(this.globalData.openid)
    // } else {
      wx.cloud.callFunction({
        name:'Getopenid'
      }).then(res=>{
        //console.log(res)
        that.globalData.openid = res.result.event.userInfo.openid
        cb(res);
        return cb;
        // typeof cb == "function" && cb(that.globalData.openid)
      })
    // }
  }
})

