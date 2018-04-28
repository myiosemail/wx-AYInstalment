
const config = require('../../config.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remainLimit:'', // 剩余额度
    totalLimit:'',  // 总额度
  },

  /**
   * 明细页面跳转
   */ 
  sectionDetailTapAction: function () {
    wx.navigateTo({
      url: '../itemDetail/itemDetail',
    })
  },
  /**
   * 利息承担设置页面跳转
   */ 
  sectionSetTapAction: function () {
      wx.navigateTo({
        url: '../rateset/rateset',
      })
  },
  /**
   * 页面请求数据
   */
  requestHospitalLimit: function () {
    var _that = this;
    var authorization = '';
    var worker = '';
    wx.getStorage({
      key: 'token',
      success: function(res) {
        authorization = res.data.token.authorization;
        worker = res.data.token.worker;
        wx.showLoading({
          title: '加载中...',
        })
        wx.request({
          url: config.path.service.hospitalLimitUrl,
          data: {},
          header: {
            'Content-Type': 'application/json',
            'Authorization': authorization,
            'Worker': worker,
            'Hospital': '130670',
            'ChannelId': '1000005' 
          },
          method: 'GET',
          success: function (res) {
            wx.hideLoading()
            console.log(res.data);
            // 金额千分位格式化显示
            _that.setData({
              remainLimit: utils.fmoney(res.data.RemainLimit, 2),
              totalLimit: utils.fmoney(res.data.TotalLimit, 2)
            })
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestHospitalLimit();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})