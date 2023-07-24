// pages/mine/order/order.js
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    orders:'',
    hadpay:'',
    needscore:'',
    done:'',
    show:false,
    showscore:false,
    item:'',
    value:0
  },
  detail(e){
    var {item} = e.currentTarget.dataset
    console.log(item)
    item.ordertime = item.ordertime.replace('T',' ')
    item.ordertime = item.ordertime.substring(0,19)
    this.setData({show:true,item})
  },
  score(){
    this.setData({showscore:true})
  },
  // 评分变化
  changeValue(e){
    var value = e.detail*2
    this.setData({value})
    console.log(e.detail*2)
  },
  confireScore(e){
    console.log(this.data.value)
    var {item} = e.currentTarget.dataset
    console.log(item)
    var that = this
    wx.request({
    url:'http://www.zhelovechun.top:8081/tpm/moviecomment/'+item.tid+'/'+item.mid+'/'+this.data.value,
    method:'POST',
    success(res){
      wx.hideLoading({})
      console.log(res)
      if(res.data.state==0){
        Notify({ type: 'success', message: '评分成功',dutarion:1000})
        that.setData({show:false})
        that.getData()
      }else{
        Notify({ type: 'danger', message: '评分失败',dutarion:1000})
      } 
    }
  })
  },
  cancelScore(){
    this.setData({value:0})
  },
  delete(e){
    var {tid} = e.currentTarget.dataset
    wx.showLoading({
      title: "加载订单记录中",
      mask: true
    })
    var that = this
      wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/ticket/'+tid,
      method:'DELETE',
      success(res){
        wx.hideLoading({})
        console.log(res)
        if(res.data.state==0){
          Notify({ type: 'success', message: '删除订单成功',dutarion:1000})
          that.setData({show:false})
          that.getData()
        }else{
          Notify({ type: 'danger', message: '删除失败',dutarion:1000})
        }  
        that.getData()
      }
    })
  },
  onLoad(options) {
    this.getData()
  },
  getData(){
    wx.showLoading({
      title: "加载订单记录中",
      mask: true
    })
    var that = this
    var uid = wx.getStorageSync('getLoginInfo').uid
    console.log(uid);
      wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/ticket/getTicket/'+uid,
      method:'GET',
      header:{
          'content-type':'application/json'
      },
      success(res){
        wx.hideLoading({})
        console.log(res)
        
        if(res.data.state==0){
          var orders = res.data.datas
          that.setData({orders})
        }else{
          Notify({ type: 'danger', message: '加载出错了',dutarion:1000})
        }  
        that.select()
      }
    })
  },
  select(){
    var hadpay = []
    var needscore = []
    var done = []
    if(this.data.orders.length>0){
      this.data.orders.forEach((item)=>{
        if(item.status==1)
          hadpay.push(item)
        else if(item.status==2)
          needscore.push(item)
        else
          done.push(item)
      })
      this.setData({
        hadpay,needscore,done
      })
    }
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