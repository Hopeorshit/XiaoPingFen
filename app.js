//app.js
import { Token } from 'utils/token.js';
App({
  onLaunch: function () { 
    var token = new Token();
    token.verify();
  },
  globalData: {
    loginStatus:wx.getStorageSync('userInfo')?true:false,
    bindStatus: wx.getStorageSync('userInfo').student_id?true:false
  }
})