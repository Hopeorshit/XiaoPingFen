// pages/free/free.js
var app = getApp();
var bgArr = [
  '/images/bg2.png',
  '/images/bg3.png',
  '/images/bg4.png',
  '/images/bg5.png',
  '/images/bg6.png',
  '/images/bg7.png',
]
import {
  Index
} from '../../utils/http.js';
var index = new Index;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notFirstLoad: true, //暂时为true,建立Http请求之后为false
    bgArr: bgArr
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.bindStatus)
  },

  room: function(e) {
    console.log(e.currentTarget.dataset.room_name)
    wx.navigateTo({
      url: '/pages/room/room?room_id=' + e.currentTarget.dataset.room_id + '&room_name=' + e.currentTarget.dataset.room_name,
    })
  },

  onPullDownRefresh: function() {
    this.roomAllHttp();
  },

  onShow() {
    this.checkLogin(() => {
      this.roomAllHttp();
    });
  },

  // 检测登陆状态，未登录就去登陆
  checkLogin: function(callBack) {
    this.setData({
      loginStatus: app.globalData.loginStatus,
      bindStatus: app.globalData.bindStatus
    })
    if (!app.globalData.bindStatus) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      callBack && callBack()
    }
  },
  //创建新的房间
  newRoom: function() {
    wx.navigateTo({
      url: '/pages/new/new',
    })
  },
  //获取所有房间类表的Http请求
  roomAllHttp: function() {
    index.roomAll((res) => {
      var rooms = this.addBg(res.data);
      this.setData({
        rooms: rooms
      })
    })
  },
  //为所有的房间添加对应的背景颜色
  addBg: function(rooms) {
    var array = this.data.bgArr;
    var that = this;
    rooms.forEach(function(value, index) {
      var start = index % (array.length);
      var end = (index + 1) % (array.length);
      if (end == 0) {
        value.bg = array[array.length-1];
      } else {
        value.bg = array.slice(start, end)[0];
      }
    })
    return rooms;
  },

  onShareAppMessage: function() {

  }

})