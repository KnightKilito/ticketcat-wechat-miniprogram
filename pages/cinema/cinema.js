// pages/cinema/canema.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areas: [
      { text: '地区', value:'全部地区' }
    ],
    brands: [
      { text: '品牌', value:'全部品牌' }
    ],
    area:'全部地区',
    brand:'全部品牌',
    movies:'',
    value:'',
    total:'', //search总条数
  },
  onLoad: function (options) {
    this.getAreas()
    this.getData()
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    })
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
      url:'http://www.zhelovechun.top:8081/tpm/cinema/search/'+name,
      method:'GET',
      header:{
        'content-type':'application/json'
      },
      success(res){
        wx.hideLoading({})
        console.log(res.data)
        if(res.data.state==0){
          that.data.total = res.data.datas.length
          wx.setStorageSync('searchcinemas', res.data.datas)
          that.searchOption()
        }else{
          Notify({ type: 'danger', message: '搜索时出错了',dutarion:2000})
        }
      }
    })
  },
  searchOption(){
      if(this.data.total){
        this.setData({value:''})
        Notify({ type: 'success', message: '查找到'+this.data.total+'家影院',dutarion:2000})
        setTimeout(() => {
           wx.navigateTo({
            url: '/pages/search/search',
           })
        }, 400)
      }else{
        Notify({ type: 'warning', message: '暂未找到该影院，换个搜索词试试~',dutarion:1000})
      }
  },
  getAreas(){
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var that=this
    wx.request({
      url:'http://www.zhelovechun.top:8081/tpm/cinema/address',
      method:'GET',
      header:{
        'content-type':'application/json'  //默认值
      },
      success(res){
        console.log(res)
        wx.hideLoading({})
        if(res.data.state==0){
          console.log(res.data.data)
          that.setAreas(res.data.data)
        }else{
          Notify({ type: 'danger', message: '加载地区出错',dutarion:2000})
        }
      }
    })
  },
  getData(){
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      var that=this
      if(this.data.area=='全部地区'){
         if(this.data.brand=='全部品牌')
          var url = 'http://www.zhelovechun.top:8081/tpm/cinema'
        else
          var url = 'http://www.zhelovechun.top:8081/tpm/cinema/brand/'+this.data.brand
      }else
          var url = 'http://www.zhelovechun.top:8081/tpm/cinema/address_brand/'+this.data.area+'/'+this.data.brand
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
            that.setData({
              cinemas:res.data.datas
            })
            //全部时赋值类型
            if(that.data.brand=='全部品牌')
              that.setBrands(res.data.datas)
          }else{
            Notify({ type: 'danger', message: '加载影院出错',dutarion:2000})
          }  
        }
      })
  },
  setAreas(list){
    var temp = []
    var areas = [{ text: '全部地区', value:'全部地区'}] //初始化一条
    var newArea = ''
    list.forEach((item,index) => {
      if(temp.indexOf(item)==-1 && item!=null){  //没有相同再push
        newArea = { text: item, value: item}
        areas.push(newArea)
        temp.push(item)
      }
    })
    this.setData({areas})
    console.log('地址列表↓ ↓ ↓');
    console.log(this.data.areas)
  },
  //读取所有品牌
  setBrands(cinemas){
    var temp = []
    var brands = [{ text: '品牌', value:'全部品牌'}] //初始化一条
    var newBrand = ''
    cinemas.forEach((item,index) => {
      if(temp.indexOf(item.brand)==-1){  //没有相同再push
        newBrand = { text: item.brand, value: item.brand}
        brands.push(newBrand)
        temp.push(item.brand)
      }
    })
    this.setData({brands})
  },
  changeArea({detail}){
    this.setData({ area:detail})
    this.onLoad()
  },
  changeBrand({detail}){
    this.setData({ brand:detail})
    this.onLoad()
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