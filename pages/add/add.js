// pages/add/add.js
var util = require('../../utils/util.js');
var app = getApp();
const db=wx.cloud.database()
const productsCollection=db.collection('goods')
const productsDetal=db.collection('goods_detal')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbox: [],//选择图片
    fileIDs: [],//上传云存储后的返回值
    index:0,
    openid:null,
    objectArray: [
      {
        id: 0,
        name: '生活用品'
      },
      {
        id: 1,
        name: '衣服'
      },
      {
        id: 2,
        name: '裤子'
      },
      {
        id: 3,
        name: '书籍'
      },
      {
        id: 4,
        name: '运动'
      },
      {
        id: 5,
        name: '电子产品'
      },
      {
        id: 6,
        name: '其他'
      }
    ],
    img:[],
    imgList:[],
    classId:false,
    classification: null,
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    var cb = app.getopenid(function (cb) {
      that.setData({
        openid:cb.result.openid
      });
    })
    // wx.request({
    //   url: app.data.apiUrl + '/goods/class',
    //   success: function (res) {
    //     that.setData({
    //       classification: res.data.data
    //     })
    //   }
    // })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res) 
      },
      fail: function ()
      {
        wx.showToast({  
          title: '请先登录哦！',  
          duration: 5000,
          //duration:8000,
          success: function (res) {
            console.log(res) 
          }
        }); 
        wx.switchTab({
          url:'/pages/my/my'
        })
      }
    })
    var userInfo=wx.getStorageSync('userInfo')
    // console.log(userInfo)
     that.setData({
       userInfo
     })
    console.log(that.data.userInfo)
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

  onClickLeft:function(){
    wx.switchTab({url:'/pages/index/index'})
  },
  updataimg:function(){
    var that = this
    // wx.chooseImage({
    //   count: 1,
    //   success(res){
    //     console.log(res);
    //     wx.cloud.uploadFile({
    //       cloudPath:'image/' + Math.floor(Math.random()*1000000),
    //       filePath:res.tempFilePaths[0],
    //       success(res){
    //         console.log("成功",res);
    //         wx.cloud.getTempFileURL({
    //           fileList:[res.fileID],
    //           success(res){
    //             console.log(res);
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
    wx.chooseImage({
      sourceType: ['album', 'camera'], 
      success: function (res) {
         var tempFilePaths = res.tempFilePaths
         that.setData({
           imgbox: tempFilePaths
         })
         //console.log(that.data.img)
      }
    })
  },
  formSubmit:function(e){
    var that = this
    var value = e.detail.value
    console.log(e)
    if(value.name==""){
      wx.showToast({
        title: '商品标题不能为空',
        icon:"none"
      })
    }else if(value.describle==""){
      wx.showToast({
        title: '商品描述不能为空',
        icon:"none"
      })
    } else if (value.price < 0 || value.price=="" || value.price>99999999){
      wx.showToast({
        title: '价格不能小于零',
        icon:"none"
      })
    }else if(that.data.imgbox==null){
      wx.showToast({
        title: '你最好能添加几张图片',
        icon: "none"
      })
    } else if (that.data.classId==null){
      wx.showToast({
        title: '记得为您的商品选择分类哦！',
        icon: "none"
      })
    }else{
      console.log(that.data.imgbox)
      //这里添加一个延迟 以免用户多次添加
      if (!that.data.imgbox.length) {
        wx.showToast({
         icon: 'none',
         title: '图片内容为空！'
        });
       } else {
         //上传图片到云存储
         wx.showLoading({
          title: '上传中',
         })
         var imgList=that.data.imgList
         let promiseArr = [];
        let num=that.data.imgbox.length
         for (let i = 0; i < num; i++) {
           let item = that.data.imgbox[i];
           let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
           wx.cloud.uploadFile({
            cloudPath: 'image/'+new Date().getTime() +Math.floor(Math.random()*1000000)+ suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              console.log('1',res)
              wx.cloud.getTempFileURL({
                fileList:[res.fileID],
                success(res){
                  console.log('2',res)
                  imgList = imgList.concat(res.fileList[0].tempFileURL)
                  that.setData({
                    imgList
                   });
                   console.log("eeeeee1")
                   console.log(i)
                   console.log(num)
                   if(i==num-1)
                   {
                     console.log("eeeeee")
                    console.log(that.data.imgList)
                    let Time=new Date().getTime()
                    console.log(imgList)
                    productsCollection.add({
                      data:{
                        title:value.title,
                        price:value.price,
                        desc:value.desc,
                        detal:value.detail,
                        goodimage:that.data.imgList[0],
                        class:that.data.objectArray[that.data.classId].name,
                        author:that.data.openid,
                        click:0,
                        goodimages:that.data.imgList,
                        _createTime:Time
                      },
                      success:res=>{
                        console.log(res)
                        wx.showToast({  
                          title: '已提交发布！',  
                          duration: 3000  
                        }); 
                        wx.switchTab({
                        url: '/pages/index/index',
                        })
                      },
                      fail: function () {
                      wx.showToast({
                        icon:'none',
                        title: '上传失败',
                      })
                      }
                    })
                  }
                }
              })
             reslove();
             wx.hideLoading();
             wx.showToast({
              title: "上传成功",
             })
             //console.log(imgList)
            },
            fail: res=>{
             wx.hideLoading();
             wx.showToast({
              title: "上传失败",
             })
            }
           })
         }
         //console.log("1213",imgList)
        //  Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        //   console.log("图片上传完成后再执行")
        //   that.setData({
        //    imgbox:[]
        //   })
        //  })
        }
        // console.log("232",imgList)
      wx.showLoading({
        title:'发布中ing...',
        mask:true
      });
      //console.log(that.data.imgList)
      wx.hideLoading()
    }
  },
  bindPickerChange: function (e) {
    var that = this
    console.log('携带值为', e.detail.value)
    that.setData({
      index:that.data.objectArray[e.detail.value].id,
      classId:e.detail.value
    })
    // console.log('classId', this.data.classId)
    // console.log(this.data.userInfo)
  },
 // 删除照片 &&
 imgDelete1: function (e) {
  let that = this;
  let index = e.currentTarget.dataset.deindex;
  let imgbox = this.data.imgbox;
  imgbox.splice(index, 1)
  that.setData({
   imgbox: imgbox
  });
 },
 // 选择图片 &&&
 addPic: function (e) {
  var imgbox = this.data.imgbox;
  //console.log(imgbox)
  var that = this;
  var n = 5;
  if (5 > imgbox.length > 0) {
   n = 5 - imgbox.length;
  } else if (imgbox.length == 5) {
   n = 1;
  }
  wx.chooseImage({
   count: n, // 默认9，设置图片张数
   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
   success: function (res) {
    // console.log(res.tempFilePaths)
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePaths = res.tempFilePaths
    if (imgbox.length == 0) {
     imgbox = tempFilePaths
    } else if (5 > imgbox.length) {
     imgbox = imgbox.concat(tempFilePaths);
    }
    that.setData({
     imgbox: imgbox
    });
   }
  })
 },
 //图片
 imgbox: function (e) {
  this.setData({
   imgbox: e.detail.value
  })
 },
 //发布按钮
 fb: function (e) {
  if (!this.data.imgbox.length) {
   wx.showToast({
    icon: 'none',
    title: '图片类容为空'
   });
  } else {
    //上传图片到云存储
    wx.showLoading({
     title: '上传中',
    })
    let promiseArr = [];
    for (let i = 0; i < this.data.imgbox.length; i++) {
     promiseArr.push(new Promise((reslove, reject) => {
      let item = this.data.imgbox[i];
      let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
      wx.cloud.uploadFile({
       cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
       filePath: item, // 小程序临时文件路径
       success: res => {
        this.setData({
         fileIDs: this.data.fileIDs.concat(res.fileID)
        });
        console.log(res.fileID)//输出上传后图片的返回地址
        reslove();
        wx.hideLoading();
        wx.showToast({
         title: "上传成功",
        })
       },
       fail: res=>{
        wx.hideLoading();
        wx.showToast({
         title: "上传失败",
        })
       }
 
      })
     }));
    }
    Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
     console.log("图片上传完成后再执行")
     this.setData({
      imgbox:[]
     })
    })
 
   }
 }
})