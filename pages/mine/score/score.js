// pages/mine/score/score.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[]
  },
  onLoad(options) {
    this.getData()
  },
  getData(){
    var uid = wx.getStorageSync('getLoginInfo').uid
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var that=this;
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/ticket/favorite/'+uid,
      method:'GET',
      header:{
          'content-type':'application/json'
      },
      success(res){
        wx.hideLoading({})
        console.log(res)
        if(res.data.state==0){
          const map = res.data.map
          if(map){
            var lists = []
            for(let key in map){
              lists.push({k:key,v:map[key]})
            }
            console.log(lists)
            that.setData({lists})
          }else{
            Notify({ type: 'warning', message: '暂无偏好',dutarion:800})
          }
        }else{
          Notify({ type: 'danger', message: '请求出错了',dutarion:800})
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