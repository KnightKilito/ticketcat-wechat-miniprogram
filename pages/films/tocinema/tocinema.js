// pages/films/tocanema/tocanema.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cinemas:'',
    mitem:'',
    islike:false
  },
  toSelect(e){
    var {item} = e.currentTarget.dataset
    wx.setStorageSync('citem',item)
    wx.setStorageSync('fromCinema',false)
    wx.navigateTo({
      url: '/pages/select/select',
    })
  },
  onLoad: function (options) {
    var mitem= wx.getStorageSync('mitem')
    wx.setNavigationBarTitle({
      title:mitem.mname,
    })
    this.setData({
      mitem
    })
    this.getData(mitem.mid)
    this.checkLike()  //检查是否被收藏
  },
  getData(mid){
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var that=this;
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/cinema/cinema_movie/'+mid,
      method:'GET',
      header:{
          'content-type':'application/json'
      },
      success(res){
        wx.hideLoading({})
        if(res.data.state==0){
          console.log(res.data.datas);
          that.setData({cinemas:res.data.datas})
        }else{
          Notify({ type: 'danger', message: '请求出错了',dutarion:3000})
        }
      }
    })
  },
  checkLike(){
    var uid = wx.getStorageSync('getLoginInfo').uid
    if(wx.getStorageSync('islogin')){
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      var that=this;
      wx.request({
        url:'http://www.zhelovechun.top:8081/tpm/collection/'+uid+'/'+this.data.mitem.mid,
        method:'GET',
        header:{
            'content-type':'application/json'
        },
        success(res){
          console.log(res.data)
          wx.hideLoading({})
          that.setData({islike:res.data})
        }
      })
    }
  },
  like(){
    var uid = wx.getStorageSync('getLoginInfo').uid
    if(wx.getStorageSync('islogin')){
      var that=this;
      wx.request({
        url:'http://www.zhelovechun.top:8081/tpm/collection/add/'+uid+'/'+this.data.mitem.mid,
        method:'POST',
        header:{
            'content-type':'application/json'
        },
        success(res){
          console.log(res)
          if(res.data.state==0){
            that.checkLike()
          }else{
            Notify({ type: 'danger', message: '添加想看出错了',dutarion:1000})
          }
        }
      })
    }else
      Notify({ type: 'primary', message: '登录后才可以添加想看哦' })
  },
  cancelLike(){
    var uid = wx.getStorageSync('getLoginInfo').uid
    if(wx.getStorageSync('islogin')){
      var that=this;
      wx.request({
        url:'http://www.zhelovechun.top:8081/tpm/collection/remove/'+uid+'/'+this.data.mitem.mid,
        method:'DELETE',
        header:{
            'content-type':'application/json'
        },
        success(res){
          console.log(res)
          if(res.data.state==0){
            that.checkLike()
          }else
            Notify({ type: 'danger', message: '取消想看出错了',dutarion:1000})
        }
      })
    }else
      Notify({ type: 'primary', message: '登录后才可以移除想看哦' })
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