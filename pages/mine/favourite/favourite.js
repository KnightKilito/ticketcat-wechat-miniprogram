// pages/mine/favourite/favourite.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likes:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){
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
      url:'http://www.zhelovechun.top:8081/tpm/collection/'+uid,
      method:'GET',
      header:{
          'content-type':'application/json'
      },
      success(res){
        wx.hideLoading({})
        console.log(res)
        if(res.data.state==0){
          if(res.data.datas.length>0)
            that.setData({likes:res.data.datas})
          else{
            that.setData({likes:res.data.datas})
          }
          
        }else{
          Notify({ type: 'danger', message: '请求出错了',dutarion:800})
        }
      }
    })
  },
  cancelLike(e){
    var {mid} = e.currentTarget.dataset
    var uid = wx.getStorageSync('getLoginInfo').uid
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      var that=this;
      wx.request({
        url:'http://www.zhelovechun.top:8081/tpm/collection/remove/'+uid+'/'+mid,
        method:'DELETE',
        header:{
            'content-type':'application/json'
        },
        success(res){
          wx.hideLoading({})
          console.log(res)
          if(res.data.state==0){
            Notify({ type: 'success', message: '已移除想看',dutarion:800})
            that.onLoad()
          }else
            Notify({ type: 'danger', message: '移除想看出错了',dutarion:800})
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