// pages/room/room.js
import {
  Room
} from '../../utils/http.js';
var room = new Room;
var numberArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      [0, 1], numberArr, numberArr
    ],
    multiIndex: [0, 0, 0],
    pickerSelected: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var is_invite = false;
    if (options.is_invite) {
      is_invite = true;
    }
    if (options.room_name) {
      wx.setNavigationBarTitle({
        title: options.room_name,
      })
      this.setData({
        room_id: options.room_id,
        is_invite: is_invite,
        userInfo: wx.getStorageSync('userInfo'),
        room_name: options.room_name
      })
    }
  },

  onShow: function() {
    this.checkLogin(() => {
      this.getOwner();
      this.scoreAllHttp();
    });
  },

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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getOwner();
    this.scoreAllHttp();
  },

  /**
   * 加载owner的HTTP请求
   */
  getOwner: function() {
    room.owner(this.data.room_id, (res) => {
      this.setData({
        is_owner: res.data.is_owner,
        owners: res.data.owners,
        room_status: res.data.owners[0].room.status,
        judged: res.data.judged
      })
    })
  },
  /**
   *加入一起演讲 
   */
  signUp: function() {
    room.speakerAdd(this.data.room_id, (res) => {
      wx.showToast({
        title: '加入成功',
      })
      this.getOwner();
    })
  },
  /**
   * 开始讲演
   */
  start: function() {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '开始讲演之后，房间就会处于公开状态哦',
      confirmText: "确认",
      cancelText: "取消",
      confirmColor: "#ff6263",
      cancelColor: "#a9aaac",
      success: function(res) {
        if (res.confirm) {
          that.startHttp()
        } else {

        }
      }
    })
  },

  startHttp: function() {
    room.start(this.data.room_id, (res) => {
      this.getOwner();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      return {
        title: this.data.userInfo.name + '邀您一起主讲',
        path: '/pages/room/room?room_id=' + this.data.room_id + '&is_invite=' + true + '&room_name=' + this.data.room_name
      }
    } else {
      var title = "邀您一起主讲"
      var is_invite = true;
      if (this.data.room_status == 1) {
        title = '邀您评分',
          is_invite = false;
      }
      return {
        title: this.data.userInfo.name + title,
        path: '/pages/room/room?room_id=' + this.data.room_id + '&is_invite=' + is_invite + '&room_name=' + this.data.room_name
      }
    }
  },

  pingFen: function() {
    if (this.data.pickerSelected) {
      var that = this;
      wx.showModal({
        title: '温馨提示',
        content: '确认评分之后将无法修改，是否确认',
        confirmText: "确认",
        cancelText: "取消",
        confirmColor: "#ff6263",
        cancelColor: "#a9aaac",
        success: function(res) {
          if (res.confirm) {
            room.scoreNew(that.data.room_id, that.data.score, (res) => {
              that.getOwner();
              that.scoreAllHttp();
            })
          } else {

          }
        }
      })
    } else {
      wx.showToast({
        title: '请评分',
        icon: 'none'
      })
    }
  },

  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var valueArr = e.detail.value;
    var multiArray = this.data.multiArray;
    this.setData({
      multiIndex: valueArr,
      score: multiArray[0][valueArr[0]] * 100 + multiArray[1][valueArr[1]] * 10 + multiArray[2][valueArr[2]],
      pickerSelected: true
    })
  },

  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0: //修改第一列
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = numberArr;
            data.multiArray[2] = numberArr;
            break;
          case 1:
            data.multiArray[1] = [0];
            data.multiArray[2] = [0];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1: //修改第二列
        switch (data.multiIndex[0]) {
          case 0: //在第一列是0的情况加下
            data.multiArray[2] = numberArr;
            break;
          case 1: //在第一列是1的情况下
            data.multiArray[2] = [0]
            break;
        }
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
  },
  /**
   * 获取到所有的分数
   */
  scoreAllHttp: function() {
    room.scoreAll(this.data.room_id, (res) => {
      this.setData({
        scores: res.data
      })
    })
  }


})