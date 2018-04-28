
const config = require('../../config.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:{},
    pageIndex:1,
    pageSize:20,
    totalPage:1,
  },
  itemList:[],

  /**
   * 请求列表数据接口
   */
  requestForLoadList:function(pageIndex,pageSize,callBack) {
    var _that = this;
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: config.path.service.detailListUrl,
        data:{
          pageIndex:pageIndex,
          pageSize:pageSize
        },
        header:{
          'Content-Type': 'application/json',
          'Authorization': _that.data.token.authorization,
          'Worker': _that.data.token.worker,
          'Hospital': '130670',
          'ChannelId': '1000005' 
        },
        method:'GET',
        success: function (res) {
          wx.hideLoading();
          console.log(res.data);
          // 数据回调
          callBack(res.data);
        },
        fail: function () {

        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    var requsetPromise = new Promise((resolve,reject) => {
      wx.getStorage({
        key: 'token',
        success: function(res) {
          _that.setData({
            token:res.data.token
          });
          resolve(res.data.token);
        },
        fail: function () {

        }
      })
    });
    requsetPromise.then(function() {
      
      // 调用接口请求数据
      _that.requestForLoadList(1,20,function(res){
        var titleList = [];
        var sectionDic = {};
        res.Items.forEach(item => {
          var keyStr = item.AddTime.split("T")[0];
          if (titleList.indexOf(keyStr) > -1) {
            var list = sectionDic.keyStr;
            list.push(item.List);
          } else {
            titleList.push(keyStr);
            var itemList = item.List;
            sectionDic[keyStr] = itemList;
          }
        });
        console.log("sectionDict:"+sectionDic);
        var tempTotalList = [];
        if(titleList.length) {
          titleList.forEach(item => {
            var tempList = sectionDic[item];
            var list = [];
            tempList.map(function (obj, idx) {
              // item.HospitalMoney = utils.fmoney(item.HospitalMoney, 2);
              if (idx == tempList.length - 1) {
                obj.isLast = true
              }
              list.push(obj)
            });
            var tempTitle = item;
            console.log(list);
            var arrItem = {
              keyStr: tempTitle,
              itemList: list
            };
            tempTotalList.push(arrItem);
          });
          console.log('TotalList:'+tempTotalList);
        };
        // 页面数据渲染
        _that.setData({
          itemList:tempTotalList
        })
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