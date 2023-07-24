// pages/orederdetail/orderdetail.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seatItem:'', //电影信息
    sitem:'',   //场次信息
    citem:'',
    num:'',
    choose:'',  //已选座位
    total:0
  },
  onLoad(options) {
    this.setData({
      seatItem:wx.getStorageSync('seatItem'),
      sitem:wx.getStorageSync('sitem'),
      citem:wx.getStorageSync('citem'),
      num:wx.getStorageSync('selectNum'),
      choose:wx.getStorageSync('choose')
    })
    var total = (this.data.num*this.data.sitem.tprice).toFixed(1)
    this.setData({total})
  },
  pay(){
    wx.showLoading({
      title: "支付中",
      mask: true
    })
    var that=this
    var sessionSeatsList = []
    this.data.choose.forEach((item,index)=>{
      sessionSeatsList.push(item.sessionseatid)
    })
    console.log(sessionSeatsList)
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/ticket/addTicketByWX/'+wx.getStorageSync('getLoginInfo').uid,
      method:'POST',
      header:{
          'content-type':'application/json'
      },
      data:{
        'sessionSeatsList':JSON.stringify(sessionSeatsList),
      },
      success(res){
        wx.hideLoading({})
        console.log(res)
        if(res.data.state==0){
          Notify({ type: 'success', message: '支付成功',dutarion:1000})
          setTimeout(() => {
            wx.reLaunch({
              url: '../mine/order/order',
            })
          }, 700)
        }else{
          Notify({ type: 'danger', message: '支付出错了',dutarion:1000})
        }  
      }
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