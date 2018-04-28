
import { $wuxToast } from '../../components/wux'
const config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:{
      authorization:'',
      worker:''
    },
    itemDict1:{
      num:6,
      InterestAssumeType:0,
      PartnerRebateValue:0
    },
    itemDict2:{
      num: 12,
      InterestAssumeType: 0,
      PartnerRebateValue: 0
    },
    caseArray:[
      '诊所承担',
      '客户承担',
      '诊所客户各承担一半'
    ],
    caseIndex1:0,
    caseIndex2:1
  },


  // 设置利息承担比例接口
  requestSetInterestAssume: function (params,selectIndex,caseIndex) {
    var _that = this;
    wx.showLoading({
      title: '保存中...',
    });
      wx.request({
        url: config.path.service.setInterestAssumeSettingUrl,
        data: {
          InterestAssumeList:params
        },
        header: {
          'Content-Type': 'application/json',
          'Authorization': _that.data.token.authorization,
          'Worker': _that.data.token.worker,
          'Hospital': '130670',
          'ChannelId': '1000005' 
        },
        method:'POST',
        success: function (res) {
          wx.hideLoading();
          console.log('设置成功')
          if(res.statusCode == 200) {
            if (selectIndex == 0) {
              _that.setData({
                caseIndex1: caseIndex
              })
            } else {
              _that.setData({
                caseIndex2: caseIndex
              })
            }
          } else {
            $wuxToast.show({
              type: 'text',
              timer: 1500,
              color: '#fff',
              text: res.data,
            });
          }
        },
        fail: function () {
          console.log('设置失败')
        }
      })
  },
  /**
   * 关联第一个item
   */ 
  bindDetailChange: function (e) {
      var parmsArray = [];
      var parmas = {
        PartnerRebateValue: this.data.itemDict1.partnerRebateValue,
        Num: this.data.itemDict1.num,
        InterestAssumeType:e.detail.value,
        rateName: this.data.caseArray[e.detail.value]
      };
      parmsArray.push(parmas);
      this.requestSetInterestAssume(parmsArray, 0, e.detail.value);
  },
  /**
   * 关联第二个item
   */ 
  bindSetChange: function (e) {
    var parmsArray = [];
    var parmas = {
      PartnerRebateValue: this.data.itemDict2.partnerRebateValue,
      Num: this.data.itemDict2.num,
      InterestAssumeType: e.detail.value,
      rateName: this.data.caseArray[e.detail.value]
    };
    parmsArray.push(parmas);
    this.requestSetInterestAssume(parmsArray, 1, e.detail.value);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    // 用Promise的方式包装微信获取存储数据Api
    var requestPromise = new Promise ((resolve,reject) => {
      wx.getStorage({
        key: 'token',
        success: function(res) {
          var tokenDict = {
            authorization: res.data.token.authorization,
            worker: res.data.token.worker
          };
          _that.setData({
              token:{
                authorization: res.data.token.authorization,
                worker: res.data.token.worker
              }
          });
          // 成功数据回调
          resolve(tokenDict);
        },
        fail: function () {
          reject('获取token失败');
        }
      })
    });
    // 链式语法调用
    requestPromise.then(function (res) {
      console.log(res);
      wx.showLoading({
        title: '加载数据中...',
      });
      wx.request({
        url: config.path.service.interestAssumeSettingUrl,
        data:{},
        header:{
          'Content-Type': 'application/json',
          'Authorization': res.authorization,
          'Worker': res.worker,
          'Hospital': '130670',
          'ChannelId': '1000005' 
        },
        method:'GET',
        success: function (res) {
          wx.hideLoading();
          console.log(res.data);
          res.data.forEach(function(item,index){
            if(index == 0) {
              _that.setData({
                itemDict1: {
                  num: item.Num,
                  interestAssumeType: item.InterestAssumeType,
                  partnerRebateValue: item.PartnerRebateValue
                },
                caseIndex1: item.InterestAssumeType
              })
            } else {
              _that.setData({
                itemDict2: {
                  num: item.Num,
                  interestAssumeType: item.InterestAssumeType,
                  partnerRebateValue: item.PartnerRebateValue
                },
                caseIndex2: item.InterestAssumeType
              })
            }
          })
        },
        fail: function () {}
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