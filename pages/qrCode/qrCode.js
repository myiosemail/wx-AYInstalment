
const config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcImageUrl:'',
    token:{},
    status:'0',
    orderInfoId:''
  },
  /**
   * 长按识别二维码
   */
  qrcLongTapAction: function(e){
    wx.scanCode({
      onlyFromCamera: true, // 只允许从相机进行扫码
      success: function(res) {
        console.log(res)
      }
    })
  },
  /**
   * 获取token
   */
  getRequestToken() {
    return new Promise((resolve, reject) => {
      var _that = this;
      wx.getStorage({
        key: 'token',
        success: function (res) {
          console.log(res.data);
          _that.setData({
            token: res.data.token
          });
          resolve(res.data.token);
        },
        fail: function () {
          reject();
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var _that = this;
    _that.data.status = options.type;
    _that.data.OrderInfoId = options.orderId
    var requestUrl = config.path.service.qrCodeUrl
    var dataDic = { type: _that.data.status}
    if (options.from == "StepThird") {
      requestUrl = config.path.service.dimensionalCodeUrl
      dataDic = { OrderInfoId: _that.data.OrderInfoId}
    }
    console.log('status:' + _that.data.status);
    _that.getRequestToken().then((res) => {
      // 请求二维码图片接口
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: requestUrl,
        data: dataDic,
        header: {
          'Content-Type': 'application/json',
          'Authorization': _that.data.token.authorization,
          'Worker': _that.data.token.worker,
          'Hospital': '130670',
          'ChannelId': '1000005' 
        },
        method: 'GET',
        success: function (res) {
          wx.hideLoading();
          console.log(res.data);
          _that.setData({
            qrcImageUrl: res.data.QrUrl
          })
        }
      })
    })
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