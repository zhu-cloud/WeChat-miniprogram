// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 7

// 云函数入口函数
  exports.main = async (event, context) => {
    // 先取出集合记录总数
    var dbname=event.dbname
    var pageNo=event.pageNo ? event.pageNo : 1
    var pageSize=event.pageSize ? event.pageSize : MAX_LIMIT
    const countResult = await db.collection(dbname).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 7)
    // 承载所有读操作的 promise 的数组
    var hasmore;
    const tasks = []
    if(pageNo>batchTimes||pageNo==batchTimes)
    {
      hasmore=false;
    }else{
      hasmore=true;
    }
    return db.collection(dbname).orderBy('click','desc').skip((pageNo-1)*pageSize).limit(pageSize).get().then(res=>{
      res.hasmore=hasmore;
      return res;
    })

}