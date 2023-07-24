// pages/mine/mine.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 滑动的起始坐标
    startX: 0,
    startY: 0,
    userInfo:{},
    islogin:false,
    hello:'',
    wxname:'',  //微信昵称
    bindwx:false,
    show: false, //弹出层
    fileList:''
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){
    var userInfo = wx.getStorageSync('getLoginInfo')
    var uid = userInfo.uid
    if(userInfo.wxusername!=null)
      this.setData({bindwx:true,wxname:userInfo.wxusername})

    if(wx.getStorageSync('bindwx'))
      this.setData({bindwx:true})
    else
      this.setData({bindwx:false})
      
    console.log(userInfo)
    if(wx.getStorageSync('islogin')){
      this.checkhello()
      this.getData(uid)
      this.setData({
        islogin:true,
        userInfo
      })
    }
  },
  beforeRead(event) {
    const { file, callback } = event.detail
    callback(file.type === 'image')
  },
  afterRead(event) {
    const { file } = event.detail
    console.log(file.url)
    const fileList = []
    fileList.push({ url:file.url,status:'done',message:'上传成功' })
    this.setData({ fileList })
  },
  deletePhoto(){
    this.setData({fileList:[]})
  },
  //点击确定更新头像
  confirmPhoto() {
      if(this.data.fileList=='')
         Notify({ type: 'warning', message: '请先上传头像',duration:800})
      else
        this.uploadToCloud()
  },
  //上传tempUrl到微信云
  uploadToCloud(){
    var that = this
    var timestamp = new Date().getTime()
    wx.cloud.init()
    wx.cloud.uploadFile({
      cloudPath: timestamp+'.png', // 上传至云端的路径
      filePath: this.data.fileList[0].url, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log(res)
        //从微信云获取图片
        wx.cloud.getTempFileURL({
          fileList: [res.fileID], //7天有效期
          success: res => {
            console.log('从微信云获取图片')
            console.log(res.fileList)
            console.log(res.fileList[0].tempFileURL)
            that.updatePhoto(res.fileList[0].tempFileURL)
          },
          fail: err => {
            Notify({ type: 'danger', message: '获取云url出错',duration:800})
          }
        })
      },
      fail: error => {
        console.log('上传tempUrl到微信云失败')
        console.error(error)
        reject(error)
      }
    })
  },
  updatePhoto(tempFileURL){
    var uid = wx.getStorageSync('getLoginInfo').uid
    var that =this
    wx.request({
      url: 'http://www.zhelovechun.top:8081/tpm/user/upAvatar/'+uid,
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        'avatarUrl':tempFileURL
      },
      success: function(res) {
        console.log(res)
        if(res.data.state==0){
          Notify({ type: 'success', message: '头像已修改',duration:800})
          that.setData({fileList:''})
          that.getData(uid)
          wx.setStorageSync('avatarUrl',tempFileURL)
        }
        else
          Notify({ type: 'danger', message: '修改失败',duration:800})
      }
     })
  },
  getData(uid){
    var that=this
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/user/userdto/'+uid,
      method:'GET',
      header:{
        'content-type':'application/json'
      },
      success(res){
        // console.log(res)
        if(res.data.state==0){
          that.setData({userInfo:res.data.data})
          wx.setStorageSync('getLoginInfo',res.data.data)
        }else
          Notify({ type: 'danger', message: '加载出错了' })
      }
    })
  },
  loginOut(){
    if(this.data.islogin){
      wx.clearStorageSync()
      this.setData({
        userInfo:'',
        islogin:false,
        bindwx:false
      })
      Notify({ type: 'success', message: '已退出登录'})
    }else
      Notify({ type: 'danger', message: '您还没有登录',duration:700})
  },

  handleUploadPhoto(){
    if(this.data.islogin)
      this.setData({show:true})
    else
      Notify({ type: 'danger', message: '您还没有登录',duration:700})
  },
  toBindWx(){
    var that = this
    if(this.data.islogin){
      wx.getUserProfile({
        desc: '展示用户信息',
        success: (res) => {
          that.setData({wxname:res.userInfo.nickName})
          that.getCode()
      }
    })
    }
    else
      Notify({ type: 'danger', message: '您还没有登录',duration:700})
  },
  toEdit(){
    if(this.data.islogin)
      wx.navigateTo({url: '/pages/edit/edit',})
    else
      Notify({ type: 'danger', message: '您还没有登录',duration:700 })
  },
  toOrder(){
    if(this.data.islogin)
      wx.navigateTo({url: './order/order',})
    else
     this.show()
  },
  toFavourite(){
    if(this.data.islogin)
      wx.navigateTo({url: './favourite/favourite',})
    else
      this.show()
  },
  toScore(){
    if(this.data.islogin)
      wx.navigateTo({url: './score/score',})
    else
      this.show()
  },
  
  show(){
    Notify({ type: 'warning', message: '登录后才可以查看哦',duration:700})
  },
  toLogin(){
    wx.navigateTo({url: './login/login',})
  },

  // 绑定微信
  getCode(){
    console.log('getCode')
    var that =this
    wx.login({
      //获取code
      success: function(res) {
        console.log(res)
        that.getOpenId(res.code)
      }
     })
  },
  getOpenId(code){
    console.log('getOpenIdByCode>'+code)
    var that =this
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=你自己的【微信小程序appid】&secret=你自己的【微信小程序secret】&js_code='+ code +'&grant_type=authorization_code',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        // console.log(res)
        if(res.statusCode==200)
          that.bindWeixin(res.data.openid)
        else
          Notify({ type: 'danger', message: '获取openID失败，登录终止'})
      }
     })
  },
  bindWeixin(openid){
    var uid = wx.getStorageSync('getLoginInfo').uid
    var that =this
    wx.request({
      url: 'http://www.zhelovechun.top:8081/tpm/user/bindingWxid/'+uid+'/'+openid+'/'+this.data.wxname,
      method:'PUT',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        if(res.data.state==0){
          Notify({ type: 'success', message: '绑定成功',duration:1000})
          that.setData({bindwx:true})
        }
        else if(res.data.state==113 || res.data.state==114){
          Notify({ type: 'danger', message: '该微信已绑定其他账号',duration:2000})
        }
        else{
          Notify({ type: 'danger', message: '绑定出错了',duration:1000})
        }
      }
     })
  },
  getWeiwinName(){
    var that =this
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        console.log(res)
        wx.setStorageSync('userInfo',res.userInfo)
        var userInfo = wx.getStorageSync('userInfo')
        var timestamp = new Date().getTime()  //存登录时的时间戳  超过半个小时后清除
        wx.setStorageSync('timestamp',timestamp)
        wx.setStorageSync('islogin',true)
        console.log(timestamp)
        this.setData({
          userInfo,
          timestamp,
          islogin:true,
        })
        that.check()
      }
    })
  },
  checkhello(){
    var timestamp = new Date().getTime()   //获取系统时间  
    var hour =  this.formatDate(timestamp)     
    var hello = '';
    if(7<=hour&&hour<12){
      hello = '上午好，亲爱的'
    }
    else if(12<=hour&&hour<19)
      hello = '下午好，亲爱的'
    else if(19<=hour&&hour<24)
      hello = '晚上好，亲爱的'
    else
     hello = '该睡觉了，亲爱的'
     this.setData({
       hello
     })
     console.log(hello);
  },
  //解绑微信
  unBindWx(){
    var uid = wx.getStorageSync('getLoginInfo').uid
    var that =this
    wx.request({
      url: 'http://www.zhelovechun.top:8081/tpm/user/unbindingWxid/'+uid,
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        if(res.data.state==0){
          Notify({ type: 'success', message: '解绑成功',duration:1000})
          that.setData({bindwx:false})
          wx.setStorageSync('bindwx', false)
        }
        else{
          Notify({ type: 'danger', message: '解绑失败',duration:1000})
        }
      }
     })
  },

    //格式化时间戳
  formatDate: function (times) {        
    var date = new Date(times);
  
    var hour = function () { //获取⼩时            
      return date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    }        
    return hour()
  },

//   init() {
//     // 设置是否删除为false
//     let { order } = this.data
//     order.map(i => {
//       i.isMove = false
//     })
//     this.setData({
//       order
//     })
//   },

//   // 开始触摸，记录起始点的坐标
//   touchstart(e) {
//     let { order } = this.data
//     // 重置所有删除
//       order.map(i => {
//       i.isMove = false
//     })
    
//     this.setData({
//       startX: e.changedTouches[0].clientX,
//       startY: e.changedTouches[0].clientY,
//       order
//     })
//   },

//   // 开始移动
//   touchmove(e) {
//     let { index } = e.currentTarget.dataset
//     let { startX, startY, order } = this.data
//     let { clientX, clientY } = e.changedTouches[0]
//     //获取滑动角度
//     let angle = this.angle({ X: startX, Y: startY }, { X: clientX, Y: clientY });
//     //滑动超过30度角 return
//     if (Math.abs(angle) > 30) return;
//     order.forEach((i, j)=> {
//       i.isMove = false
//       if (j == index && clientX < startX) {
//         // 左滑删除了
//         i.isMove = true
//       } else {
//         // 右滑没有隐藏删除按钮
//         i.isMove = false
//       }
//     })
//     this.setData({
//       order
//     })
//   },
//   /**
//     * 计算滑动角度
//     * @param {Object} start 起点坐标
//     * @param {Object} end 终点坐标
//   */
//  angle(start, end) {
//   var _X = end.X - start.X,
//   _Y = end.Y - start.Y
//   //返回角度 /Math.atan()返回数字的反正切值
//   return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
//   },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})