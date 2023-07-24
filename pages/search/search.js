// pages/search/search.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:'',
    cinames:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(wx.getStorageSync('searchmovies'))
    this.setData({
      movies:wx.getStorageSync('searchmovies'),
      cinemas:wx.getStorageSync('searchcinemas')
    })
    if(this.data.movies.length>0)
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor:'#8190BB'
      })
    else
     wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor:'#896AEA'
    })
  },
  findPay(e){
    var {mitem} = e.currentTarget.dataset
    // console.log(mitem)
    wx.setStorageSync('mitem',mitem)
    wx.navigateTo({
      url: '../films/tocinema/tocinema',
    })
  },
  toSelect(e){
    var {item} = e.currentTarget.dataset
    wx.setStorageSync('citem',item)
    wx.setStorageSync('fromCinema',true)
    wx.navigateTo({
      url: '../select/select',
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
    console.log('清除搜索内容')
    wx.removeStorageSync('searchmovies')
    wx.removeStorageSync('searchcinemas')
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