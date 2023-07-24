// pages/edit/edit.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldphone:'',
    oldusername:'',
    oldpassword:'',  // 记录原始数据
    nickname:'',
    phone:'',
    username:'',
    password:'',
    password1:'',
    passwprd2:'',
    uid:'',
    token:''
  },
  onLoad(options) {
    var {uid} = wx.getStorageSync('getLoginInfo')
    var token = wx.getStorageSync('token')
    this.setData({uid,token})
    this.getData()
  },
  changeBase(){
    wx.showLoading({
      title: " 修改中",
      mask: true
    })
    console.log(this.data.nickname);
    var that=this
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/tokenUser',
      method:'PUT',
      header:{
        'token': this.data.token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        'uid':this.data.uid,
        'nickname':this.data.nickname,
        'phone':this.data.phone,
        'username':this.data.username,
        'avatar':wx.getStorageSync('avatarUrl')
      },
      success(res){
        console.log(res)
        wx.hideLoading({})
        if(res.data.state==0){
          Notify({ type: 'primary', message: '修改成功',duration:700})
          that.getData()
        }else
          Notify({ type: 'danger', message: '修改出错了'})
      }
    })
  },
  changePass(){
    if(this.data.password=='' || this.data.password1=='' || this.data.password2=='')
      Notify({ type: 'warning', message: '请检查输入项不为空' ,top:366,duration:700})
    else if(this.data.password1 != this.data.password2) 
      Notify({ type: 'warning', message: '两次输入的密码不一致',top:366, duration:700})
    else
      this.changePassword()
  },
  changePassword(){
    wx.showLoading({
      title: " 修改密码中",
      mask: true
    })
    var that=this
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/user/updatePassword',
      method:'PUT',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        'uid':this.data.uid,
        'oldPassword':this.data.password,
        'password':this.data.password1,
        'nickname':this.data.oldnickname,
        'phone':this.data.oldphone,
        'username':this.data.oldusername,
        'identity':'guest',
      },
      success(res){
        console.log(res)
        wx.hideLoading({})
        if(res.data.state==0){
          Notify({ type: 'primary', message: '密码修改成功,请重新登录',top:366,duration:800})
          setTimeout(() => {
            wx.navigateTo({
              url: '../mine/login/login',
            })
          }, 800);
        }else if(res.data.state==105){
          Notify({ type: 'danger', message: '原密码错误' ,top:366,duration:800})
        }else
          Notify({ type: 'danger', message: '修改出错了',top:366})
      }
    })
  },
  getData(){
    wx.showLoading({
      title: " 加载中",
      mask: true
    })
    var that=this
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/user/userdto/'+this.data.uid,
      method:'GET',
      header:{
        'content-type':'application/json'
      },
      success(res){
        console.log(res)
        wx.hideLoading({})
        if(res.data.state==0){
          that.setData({
            nickname:res.data.data.nickname,
            phone:res.data.data.phone,
            username:res.data.data.username,
            oldnickname:res.data.data.nickname,
            oldphone:res.data.data.phone,
            oldusername:res.data.data.username
          })
        }else
          Notify({ type: 'danger', message: '加载出错了' })
      }
    })
  },
  nickname(e){
    this.setData({
      nickname:e.detail.value
    })
  },
  phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  username(e){
    this.setData({
      username:e.detail.value
    })
  },
  password(e){
    this.setData({
      password:e.detail.value
    })
  },
  password1(e){
    this.setData({
      password1:e.detail.value
    })
  },
  password2(e){
    this.setData({
      password2:e.detail.value
    })
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