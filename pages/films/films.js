// pages/films/films.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      { text: '全部影片', value:2},
      { text: '正在热映', value:1},
      { text: '待上映', value:0},
    ],
    types: [
      { text: '类型', value: '全部'},
    ],
    status:2,
    type: '全部',
    movies:'',
    disable:false,  //是否禁用筛选
    value:'',
    total:'', //search总条数
  },
  onLoad: function (options) {
    this.getData()
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch:function(){
    wx.showLoading({
      title: "搜索中",
      mask: true
    })
    var name = this.data.value
    console.log("搜索词>"+name)
    var that=this
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/movie/search/'+name,
      method:'GET',
      header:{
        'content-type':'application/json'
      },
      success(res){
        wx.hideLoading({})
        if(res.data.state==0){
          console.log(res.data.datas)
          that.data.total = res.data.datas.length
          res.data.datas.forEach((item,index)=>{
            item.rtime = item.rtime.substring(0,10)
          })
          wx.setStorageSync('searchmovies',res.data.datas)
          that.searchOption()
        }else{
          Notify({ type: 'warning', message: '搜索时出错了',dutarion:2000})
        }
      }
    })
  },
  searchOption(){
      this.setData({value:''})
      if(this.data.total){
        Notify({ type: 'success', message:'查找到'+this.data.total+'部电影',dutarion:2000})
        setTimeout(() => {
           wx.navigateTo({
            url: '/pages/search/search',
           })
        }, 600)
      }else{
        Notify({ type: 'warning', message: '暂未找到该电影',dutarion:1000})
      }
  },
  
  getData(){
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      var url = ''
      var that=this
      console.log(this.data.status)
      console.log(this.data.type)
      if(this.data.status==2){
         if(this.data.type=='全部')
          url = 'http://www.zhelovechun.top:8081/tpm/movie'
        else
          url = 'http://www.zhelovechun.top:8081/tpm/movie/label/'+this.data.type
      }else if(this.data.status==1){
        if(this.data.type=='全部')
          url = 'http://www.zhelovechun.top:8081/tpm/movie/status/1'
        else
          url = 'http://www.zhelovechun.top:8081/tpm/movie/status_label/1/'+this.data.type
      }else if(this.data.status==0){
          url = 'http://www.zhelovechun.top:8081/tpm/movie/status/0'
      }
        console.log(url)
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
            that.mysubstring(res.data.datas)
            //全部时赋值类型
            if(that.data.type=='全部' && that.data.status==2)
              that.setType()
          }else{
            Notify({ type: 'danger', message: '出错了',dutarion:2000})
          }  
        }
      })
      
  },
  //读取所有类型
  setType(){
    var temp = []
    var types = [{ text: '类型', value: '全部'}] //初始化一条
    var newType = ''
    this.data.movies.forEach((item,index) => {
      if(temp.indexOf(item.label)==-1){  //没有相同再push
        newType = { text: item.label, value: item.label}
        types.push(newType)
        temp.push(item.label)
      }
    })
    this.setData({
      types
    })
    // console.log(this.data.types)
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
  changeStatus({detail}){
    console.log(detail)
    if(detail==0)
      this.setData({ status:detail,disable:true,type:'全部'})
    else
      this.setData({ status:detail,disable:false})
    console.log(this.data.option1[detail].text)
    this.getData()
  },
  //切换类型
  changeType({detail}){
    console.log(detail);
    this.setData({ type:detail})
    this.getData()
  },
  findPay(e){
    var {mitem} = e.currentTarget.dataset
    // console.log(mitem)
    wx.setStorageSync('mitem',mitem)
    wx.navigateTo({
      url: '../films/tocinema/tocinema',
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