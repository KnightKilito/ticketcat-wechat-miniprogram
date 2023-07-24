// pages/index/index/js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:'',
    active: 0,
  },
  onChange(event) {
    console.log(event.detail.index)
    this.setData({
      active:event.detail.index
    })
    this.getData()
  },
  swiperFindPay(e){
    var {mid} = e.currentTarget.dataset
    console.log(mid);
    var flag=0
    this.data.movies.forEach((item,index)=>{
      if(item.mid == mid){
        wx.setStorageSync('mitem',item)
        flag++
      }    
    })
    if(flag==0)
      Notify({ type: 'danger', message: '轮播图已失效',dutarion:1000})
    wx.navigateTo({
      url: '../films/tocinema/tocinema',
    })
  },
  findPay(e){
    var {mitem} = e.currentTarget.dataset
    console.log(mitem)
    wx.setStorageSync('mitem',mitem)
    wx.navigateTo({
      url: '../films/tocinema/tocinema',
    })
  },
  swiperToCinemas(){
    wx.switchTab({
      url: '../cinema/cinema',
    })
  },
  onLoad: function (options) {
    this.getData()
  },
  getData(){
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var url = ''
    if(this.data.active==0)
      url = 'http://www.zhelovechun.top:8081/tpm/movie/status/1'
    else
      url = 'http://www.zhelovechun.top:8081/tpm/movie/status/0'
    var that=this
    wx.request({
      url,
      method:'GET',
      header:{
          'content-type':'application/json'  //默认值
      },
      success(res){
        wx.hideLoading({})
        if(res.data.state==0){
          that.mysubstring(res.data.datas)
        }else{
          Notify({ type: 'danger', message: '出错了',dutarion:1000})
        }
      }
    })
  },
  mysubstring(movies){
    console.log(movies)
    movies.forEach((item,index)=>{
      item.rtime = item.rtime.substring(0,10)
    })
    this.setData({
      movies
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