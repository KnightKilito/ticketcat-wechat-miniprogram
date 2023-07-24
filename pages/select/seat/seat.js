// pages/select/seat/seat.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    settings:'',
    seats:'',
    old:'',//用来取消时判断原来的status=1 OR status=2
    choose:[],
    selectedNum:0,
    seatItem:'',
    sitem:'',
    total:0
  },
  onLoad() {
    this.setData({
      seatItem:wx.getStorageSync('seatItem'),
      sitem:wx.getStorageSync('sitem')
    })
    wx.setNavigationBarTitle({
      title:this.data.seatItem.mname+' '+this.data.sitem.hid+'号厅',
    })
    this.getSeats()
  },
  clickSeat(e){
    var {item} = e.currentTarget.dataset
    var seats = this.data.seats
    var oldSeats = wx.getStorageSync('seats')
    if(this.data.selectedNum>=4)
    Notify({ type: 'warning', message: '同时最多购买4张票',dutarion:800})
    else
      Notify({ type: 'primary', message: '您选择了'+item.rowname+'排'+item.columnname+'座',dutarion:400})
    
    seats.forEach((value,index)=>{
      if(value.sessionseatid==item.sessionseatid && item.status!=9 && this.data.selectedNum<4){
          value.status=9
          this.setData({selectedNum:this.data.selectedNum+1})
          console.log(oldSeats);
        }else if(value.sessionseatid==item.sessionseatid && item.status==9){
          oldSeats.forEach((v,index)=>{
          if(v.sessionseatid==value.sessionseatid)
            value.status=v.status
        })
        this.setData({selectedNum:this.data.selectedNum-1})
      }
    })
    this.havechoosen()
    this.setData({
      total:(this.data.selectedNum*this.data.sitem.tprice).toFixed(1),
      seats
    })
  },
  havechoosen(){
    var choose = []
    this.data.seats.forEach((item,index)=>{
      if(item.status == 9)
        choose.push(item)
    })
    this.setData({
      choose
    })
    console.log(this.data.choose)
  },

  toOrderDetails(){
    if(wx.getStorageSync('islogin')){
      wx.setStorageSync('selectNum',this.data.selectedNum)
    wx.setStorageSync('choose',this.data.choose)
    wx.navigateTo({
      url: '/pages/orederdetail/orderdetail',
    })
    }
    else
      Notify({ type: 'warning', message: '登录后才可以去付款哦',duration:2000})
  },
  getSeats(){
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      var sid = wx.getStorageSync('sitem').sid
      var that=this
      wx.request({
        url:'http://www.zhelovechun.top:8081/tpm/sessionseat/'+sid,
        method:'GET',
        header:{
            'content-type':'application/json'  //默认值
        },
        success(res){
          wx.hideLoading({})
          if(res.data.state==0){
            console.log(res.data.datas)
            that.setData({
              seats:res.data.datas,
            })
            wx.setStorageSync('seats',res.data.datas)
          }else{
            Notify({ type: 'danger', message: '请求出错了',dutarion:1000})
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