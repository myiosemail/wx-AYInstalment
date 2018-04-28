const config = require('../../config.js');
const util_md5 = require('../../utils/md5.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList:[],
    caseIndex: 0,
    caseArray: ['诊所承担', '客户承担', '诊所客户各承担一半'],
    selectType:0,
    allowSet:false,
    token:{}
  },
  

  /**
   * 诊所二维码点击
   */
  qrcbtnAction: function () {
    wx.navigateTo({
      url: '../qrCode/qrCode',
    })
  },
  pickerAction: function (e) {
    console.log('eeeeeee');
    var _that = this;
    _that.setData({
      selectType: e.detail.value 
    });
    wx.navigateTo({
      url: '../qrCode/qrCode?type='+e.detail.value +'&from=' + 'home',
    })
  },
  /**
   *  ItemClick
   */
  tabItemAction: function () {
    wx.navigateTo({
      url: '../productDetail/productDetail',
    })
  },
  /**
   *  立即申请点击
   */
  applyBtnAction: function (e) {
    var productId = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '../applyFirst/applyFirst?productId='+productId,
      // url: '../applySecond/applySecond'
      // url: '../applyThree/applyThree'
    })
  },
  /**
   * 获取是否开通设置利息权限
   */
  getAllowSetInterestAssume () {
    var _that = this;
    wx.request({
      url: config.path.service.getAllowSetInstrumentUrl,
      data: {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': _that.data.token.authorization,
        'Worker': _that.data.token.worker,
        'Hospital': '130670',
        'ChannelId': '1000005' 
      },
      method:'GET',
      success: function (res) {
        _that.setData({
          allowSet: res.data.Result
        });
        console.log('allowSet:' + _that.data.allowSet);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    var requestPromise = new Promise ((resolve,reject) => {
      var _that = this;
      var pwd_md5 = util_md5.hexMD5('123456');
      wx.request({
        url: config.path.service.loginUrl,
        data: {
          UserName: '13621372137',
          Password: pwd_md5,
        },
        header: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        success: function (res) {
          if (res.statusCode == 200) {
            console.log('用户登录成功');
            console.log(res.data);
            var authorization = res.data.Web.UserCookie.Value;
            var worker = res.data.Web.Cookie.Value;
            console.log('用户authorization:' + authorization);
            console.log('用户worker:' + worker);
            _that.setData({
              token:{
                authorization: authorization,
                worker: worker
              }
            });
            // 登录成功后保存用户Authorization和Worker（模拟web时的cookie）
            wx.setStorage({
              key: 'token',
              data: {
                token: {
                  authorization: authorization,
                  worker: worker,
                }
              },
              success: function (res) {
                console.log('保存数据成功');
              }
            });
            resolve('data');
          }
        },
        fail: function () {
          reject();
        }
      })
    });
    requestPromise.then(function() {
      var authorization = '';
      var worker = '';
      wx.getStorage({
        key: 'token',
        success: function(res) {
          authorization = res.data.token.authorization;
          worker = res.data.token.worker;
          /** 获取首页推荐列表 */
          wx.showLoading({
            title: '加载中...',
          })
          wx.request({
            url: config.path.service.productListPathUrl,
            data:{},
            header:{
              'Content-Type':'application/json',
              'Authorization':authorization,
              'Worker':worker,
              'Hospital': '130670',
              'ChannelId':'1000005'
            },
            method: 'GET',
            success: function (res) {
              wx.hideLoading()
              if(res.statusCode == 200) {
                /** 字符串分割拼接 */
                var list = res.data.List.map(function(item){
                  var instalNumArr = item.InstalmentsNum.split(",");
                  var instalNumStr = `${instalNumArr[0]}/${instalNumArr[instalNumArr.length - 1]}`;
                  item.InstalmentsNum = instalNumStr;
                });
                _that.setData({
                  itemList:res.data.List,
                });
                // 获取是否允许设置利息权限
                _that.getAllowSetInterestAssume();
              }
            },
            fail: function () {

            }
          })
        },
      })
    }).catch(function() {
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    // return {
    //   title: '自定义转发标题ss',
    //   path: '/page/user?id=123',
    //   success: function (res) {
    //     // 转发成功
    //   },
    //   fail: function (res) {
    //     // 转发失败
    //   }
    // }
    // wx.showShareMenu({
    //   withShareTicket: true
    // })

  }
})