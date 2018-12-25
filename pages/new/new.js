// pages/new/new.js
import {
  NewRoom
} from '../../utils/http.js';
var newRoom = new NewRoom;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    creating:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  
  newRoom:function(e){
    console.log(e)
    this.setData({
      creating:true
    })
    wx.showLoading({
      title: '创建中',
    })
    newRoom.newRoom(e.detail.value.name,(res)=>{
      newRoom.speakerAdd(res.data.id,(res1)=>{
        this.setData({
          creating: false
        })
        wx.hideLoading();
        wx.showToast({
          title: '创建成功',
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '/pages/room/room?room_id='+res.data.id+'&room_name='+res.data.name,
          })
        },1500)
      })
    })
  }

})