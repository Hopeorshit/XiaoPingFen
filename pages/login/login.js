// pages/login/login.js
var app = getApp();
import {
  Login
} from '../../utils/http.js';
import {
  Data
} from "../../utils/data.js"
var login = new Login();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: Data.id_name,
    loginStatus: app.globalData.loginStatus,
    bindStatus: app.globalData.bindStatus
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (this.data.loginStatus && !this.data.bindStatus){
      wx.setNavigationBarTitle({
        title: '绑定学号',
      })
    }
  },

  // 绑定picker改变事件
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      pickerSelected: true
    })
  },
  // 登陆按钮
  login: function(e) {
    var that = this;
    that.wxGetUserInfo(e, (res) => {
      wx.showToast({
        title: '登陆成功',
      })
      setTimeout(function() {
        that.setData({
          loginStatus:true
        })
        app.globalData.loginStatus = true;
        wx.setStorageSync('userInfo', res.data);
        that.checkBind(res.data, () => { //如果说绑定过账号就直接返回
          app.globalData.bindStatus = true
          wx.navigateBack();
        })
      }, 1500)
    })
  },

  checkBind: function(userInfo, callBack) {
    if (!userInfo.student_id) {
      this.setData({
        bindStatus: false //没有绑定过账号
      })
      wx.setNavigationBarTitle({
        title: '绑定学号',
      })
    } else {
      callBack && callBack()
    }
  },

  wxGetUserInfo: function(event, callBack) {
    if (!event.detail.userInfo) {
      wx.showModal({
        title: '提示',
        content: '取消授权，部分功能无法正常使用，是否重新授权',
        cancelText: "否",
        confirmText: "是",
        confirmColor: '#ff6263',
        cancelColor: "#a99aac",
        success: function(res) {
          if (res.confirm) {
            wx.openSetting({})
          }
        }
      })
    } else {
      login.encrypt(event.detail.encryptedData, event.detail.iv,
        (res) => {
          callBack && callBack(res);
        },
      )
    }
  },

  // 点击绑定
  bindID: function() {
    if (this.data.pickerSelected) {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '绑定之后将无法修改，是否确认',
        cancelText: "否",
        confirmText: "是",
        confirmColor:'#ff6263',
        cancelColor:"#a99aac",
        success: function(res) {
          if (res.confirm) {
            that.bindIDHttp((res) => {
              wx.setStorageSync('userInfo', res.data);
              app.globalData.bindStatus = true
              wx.showToast({
                  title: '绑定成功',
                }),
                setTimeout(function() {
                  wx.navigateBack()
                }, 1500)
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请选择姓名',
        icon: 'none'
      })
    }
  },

  //发送绑定的HTTP请求
  bindIDHttp: function(callBack) {
    var category = this.data.category;
    var index = this.data.index;
    login.bindID(category[index].name, category[index].id, (res) => {
      callBack && callBack(res)
    })
  }
})