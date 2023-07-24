// pages/select/select.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0, //记录激活的块
    move:0,
    movies:'',
    dates:'',
    date:'',
    sessions:'',
    mid:'',   //查询session用
    citem:'',
    active_mid:'',  ////变大的电影图片id
    fromCinema:''
  },
  
  onLoad(options) {
    var citem =  wx.getStorageSync('citem')
    var mitem =  wx.getStorageSync('mitem') 
    var active_mid = mitem.mid  //变大的电影图片id
    var fromCinema = wx.getStorageSync('fromCinema')
    console.log(fromCinema);
    wx.setNavigationBarTitle({
      title:mitem.mname,
    })
    this.setData({citem,active_mid,fromCinema})
    var cid = citem.cid
    this.getMoviesByCid(cid)
  },
  getMoviesByCid(cid){
    wx.showLoading({
      title: "加载影院电影中",
      mask: true
    })
    var that=this
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/movie/cid/'+cid,
      method:'GET',
      header:{
          'content-type':'application/json'  //默认值
      },
      success(res){
        wx.hideLoading({})
        if(res.data.state==0){
          console.log(res.data.datas)
          if(res.data.datas==0)
            that.nofilms()
          else{
            that.setData({movies:res.data.datas})
            if(!that.data.fromCinema)
              that.setFirstMove()
            else
              that.getDates(that.data.movies[0].mid)
          } 
        }else{
          Notify({ type: 'danger', message: '出错了',dutarion:2000})
        }
      }
    })
  },
  setFirstMove(){
    this.data.movies.forEach((item,index)=>{
      if(item.mid==this.data.active_mid){
        this.setData({
          move:-220*index,
          type:index
        })
      }
    })
      this.getDates(this.data.active_mid)
  },
  change(e){
    var {index} = e.currentTarget.dataset
    var {item} = e.currentTarget.dataset
    wx.setNavigationBarTitle({
      title:item.mname,
    })
    wx.setStorageSync('seatItem',item)  //用于选座位显示电影
    var temp = 0 
    // console.log(index)
    console.log(item)
    if(index!=this.data.type){
      if(index>this.data.type)
      temp = this.data.move-220
    else
      temp = this.data.move+220
    this.setData({type:index,move:temp})
    }
    //传递cid查找所有日期
    this.getDates(item.mid)
  },
  getDates(mid){
    wx.showLoading({
      title: "加载日期中",
      mask: true
    })
    this.setData({mid})
    var cid = wx.getStorageSync('citem').cid
    var that=this
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/session/'+cid+'/'+mid,
      method:'GET',
      header:{
          'content-type':'application/json'  //默认值
      },
      success(res){
        wx.hideLoading({})
        console.log(res)
        if(res.data.state==0){
          console.log(res.data.stringArray)
          if(res.data.stringArray.length==0){
            Notify({ type: 'primary', message: '该电影暂时没有排片',dutarion:600})
            that.setData({dates:'',sessions:''})
          }else{
            that.setData({dates:res.data.stringArray})
            if(res.data.stringArray.length>0){
              that.setData({date:that.data.dates[0]})
              that.getSessions()
            }
          }
        }else{
          Notify({ type: 'danger', message: '出错了',dutarion:2000})
        }
      }
    })
  },
  onChange(event) {
    var date = event.detail.name
    this.setData({date})
    this.getSessions()
  },
  getSessions(){
    wx.showLoading({
      title: "加载场次中",
      mask: true
    })
    var cid = this.data.citem.cid
    var mid = this.data.mid
    var date = this.data.date
    var url = 'http://www.zhelovechun.top:8081/tpm/session/'+cid+'/'+mid+'/'+date
    console.log(url)
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
          console.log(res.data.datas)
            that.setData({sessions:res.data.datas})
        }else{
          Notify({ type: 'danger', message: '出错了',dutarion:2000})
        }
      }
    })
  },
  
  tip(){
    Notify({ type: 'warning', message: '没有更多了~',dutarion:1000})
  },
  toSeat(e){
    var {sitem} = e.currentTarget.dataset
    wx.setStorageSync('sitem',sitem)
    wx.navigateTo({
      url: '/pages/select/seat/seat',
    })
  },
  nofilms(){
      wx.showModal({
        title: '提示',
        content: '影城暂时没有放映电影,先去别家看看吧~',
        success: function (res) {
          if (res.confirm) {
            console.log('确定')
            wx.navigateBack()
          } else {
            console.log('取消')
            wx.navigateBack()
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