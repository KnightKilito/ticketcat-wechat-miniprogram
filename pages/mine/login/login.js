// pages/mine/login/login.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showlogin:true,
    showpassword:false,
    show: false, //下面弹出层
    loginUsername:'',
    loginPassword:'',
    username:'',
    phone:'',
    password:'',
    password2:'',
    wxname:''
  },
  checkeLogin(){
    if(this.data.loginUsername=='' && this.data.loginPassword=='')
      Notify({ type: 'warning', message: '请输入用户名和密码',duration:700})
    else if(this.data.loginUsername=='')
      Notify({ type: 'warning', message: '请输入用户名' ,duration:700})
    else if(this.data.loginPassword=='')
      Notify({ type: 'warning', message: '请输入密码',duration:700 })
    else
      this.login()
  },
  checkeRegister(){
    if(this.data.username=='' || this.data.phone=='' || this.data.password=='' || this.data.password2=='')
      Notify({ type: 'warning', message: '请检查输入项不为空' ,duration:700})
    else if(this.data.password != this.data.password2) 
      Notify({ type: 'warning', message: '两次输入的密码不一致' ,duration:700})
    else
      this.register()
  },
  handleWxLogin() {
    this.setData({ show: true })
  },
  cancel(){
    this.setData({ show: false })
  },
  agree(){
    this.setData({ show: false })
    var that = this
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        this.setData({wxname:res.userInfo.nickName})
        that.toWxLogin()
      }
    })
},
  toWxLogin(){
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
          that.wxLogin(res.data.openid)
        else
          Notify({ type: 'danger', message: '获取openID失败，登录终止'})
      }
     })
  },
  wxLogin(openid){
    console.log(this.data.wxname)
    wx.showLoading({
      title: "微信登录中",
      mask: true
    })
    wx.request({
      url:'https://tpm.zhelovechun.top/tpm/wxUser/wxxcxLogin/'+openid+'/'+this.data.wxname,
      method:'POST',
      header:{
        "content-type": "application/x-www-form-urlencoded"
      },
      success(res){
        console.log(res)
        // console.log(res.data.data)
        wx.hideLoading({})
        if(res.data.state==200){
          Notify({ type: 'success', message: '微信登录成功'})
          wx.setStorageSync('getLoginInfo',res.data.data)
          wx.setStorageSync('islogin',true)
          wx.setStorageSync('bindwx',true)
          
          setTimeout(() => {wx.switchTab({url: '/pages/index/index',})},1000)

        }else if(res.data.state==210){
          
          wx.setStorageSync('getLoginInfo',res.data.data)
          wx.setStorageSync('token',res.data.data.token)
          wx.setStorageSync('islogin',true)
          wx.setStorageSync('bindwx',true)
          Notify({ type: 'success', message: '检测到该微信第一次登录，已为您注册账号'})
          setTimeout(() => {wx.switchTab({url: '/pages/index/index',})},2000)
        }
        else
          Notify({ type: 'danger', message: '微信登录出错了' })
      }
    })
  },
  login(){
    wx.showLoading({
      title: "登录中",
      mask: true
    })
    var that=this
    wx.request({
      url:'https://tpm.zhelovechun.top/tpm/user/login',
      method:'POST',
      header:{
        'content-type':'application/json'
      },
      data:{
        'username':this.data.loginUsername,
        'password':this.data.loginPassword
      },
      success(res){
        console.log(res)
        wx.hideLoading({})
        if(res.data.state==200){
          Notify({ type: 'success', message: '登录成功'})
          wx.setStorageSync('getLoginInfo',res.data.data)
          wx.setStorageSync('token',res.data.data.token)
          wx.setStorageSync('islogin',true)
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index',
            })
          },800)
        }
        else if(res.data.state==106)
          Notify({ type: 'danger', message: '账号不存在' ,duration:1000})
        else if(res.data.state==105)
          Notify({ type: 'danger', message: '密码错误' ,duration:1000})
        else
          Notify({ type: 'danger', message: '请求出错了',duration:1000 })
      }
    })
  },
  register(){
    wx.showLoading({
      title: "正在注册",
      mask: true
    })
    console.log(this.data.username)
    console.log(this.data.phone)
    console.log(this.data.password)
    var that=this
    wx.request({
      url:'https://tpm.zhelovechun.top/tpm/user/register',
      method:'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        'username':this.data.username,
        'phone':this.data.phone,
        'password':this.data.password,
        'identity':'guest'
      },
      success(res){
        console.log(res)
        wx.hideLoading({})
        if(res.data.state==0){
           Notify({ type: 'success', message: '注册成功',duration:2000 })
          setTimeout(() => {
            that.setData({
              showlogin:true,
            }) 
          }, 600)
        }
        else if(res.data.state==107)
          Notify({ type: 'danger', message: '该账号已被注册',duration:1000 })
        else if(res.data.state==-1)
          Notify({ type: 'danger', message: '注册出错了' ,duration:1000})
      }
    })
  },
  loginUsername(e){
    this.setData({
      loginUsername:e.detail.value
    })
  },
  loginPassword(e){
    this.setData({
      loginPassword:e.detail.value
    })
  },
  username(e){
    this.setData({
      username:e.detail.value
    })
  },
  phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  password(e){
    this.setData({
      password:e.detail.value
    })
  },
  password2(e){
    this.setData({
      password2:e.detail.value
    })
  },
  change(){
    if(this.data.showlogin){
      this.setData({showlogin:false})
      wx.setNavigationBarTitle({title:'注册',})
    }
    else{
      this.setData({showlogin:true}) 
      wx.setNavigationBarTitle({title:'登录',})
    }
  },
  changeEye(){
    if(this.data.showpassword)
      this.setData({showpassword:false})
    else 
      this.setData({showpassword:true}) 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})