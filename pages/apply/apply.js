
const config = require('../../config.js');
const util_enum = require('../../utils/enumerator.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: {},
    /**
     * 列表的数据源
     */
    itemList:[],
    /**
     * 分页加载
     */
    pageIndex:1,
    pageSize:20,
    totalPage:1,
    tabbarTitles:['全部','申请中','已通过','未通过'],
    /**
     * 默认选中
     */
    currentTab:0,
    /**
     * 屏幕宽高
     */
    winWidth:'',
    winHeight:''
  },
  /*
   * 标签点击事件
   */
  switchNav: function (e) {
    var _that = this;
    if (_that.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      _that.setData({
        currentTab: e.target.dataset.current
      })
    }
    _that.clearData();
    _that.requestForLoadList(_that.data.pageIndex, _that.data.pageSize, function (res) {
      console.log('数据回调成功:' + res);
      if (res.Items.length) {
        _that.setData({
          itemList: _that.handleSuccessData(res.Items),
          totalPage: res.TotalPages
        })
      }
    })
  },
  /**
   * 页面滑动事件
   */
  bindSwipChange:function(e) {
    var _that = this;
    _that.setData({
      currentTab: e.detail.current
    });
    _that.clearData();
    _that.requestForLoadList(_that.data.pageIndex, _that.data.pageSize, function (res) {
      console.log('数据回调成功:' + res);
      if (res.Items.length) {
        _that.setData({
          itemList: _that.handleSuccessData(res.Items),
          totalPage: res.TotalPages
        })
      }
    })
  },
  /**
   * 获取屏幕参数
   */
  getWindowConfig() {
    return new Promise((resolve,reject) => {
      var _that = this;
      wx.getSystemInfo({
        success: function (res) {
          _that.setData({
            winWidth: res.windowWidth,
            winHeight: res.windowHeight
          });
          resolve();
        },
        fail: function () {
          console.log('获取屏幕数据失败');
          reject();
        }
      })
    })
  },
  /**
   * 获取token
   */
  getRequestToken () {
      return new Promise((resolve,reject) => {
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
   * 返回数据格式化处理
   */
  handleSuccessData (data) {
    var list = [];
    if (data instanceof Array) {
       data.map((item) => {
        var itemSections = [
          {
            title:'贷款金额：',
            content: item.AmountApp
          },
          {
            title: '申请人：',
            content: item.CustomerRealName
          },
          {
            title: '申请日期：',
            content: item.AddTime.split('T')[0]
          },
          {
            title: '申请单号：',
            content: item.OrderNo
          },
        ];
        item.DataSource = itemSections;
        item.StatusName = util_enum.getStatusName(item.Status);
        list.push(item);
      });
    }
    return list;
  },
  
  /**
   * 标签切换的时候重置数据
   */
  clearData () {
      var _that = this;
      _that.setData({
        pageIndex: 1,
        totalPage: 1,
        itemList:[]
      })
  },
  /**
   * 请求页面列表数据
   */
  requestForLoadList: function(currentPage,itemsPerPage,callBack) {
      var _that = this;
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: config.path.service.applyForListUrl,
        data: {
          status: _that.data.currentTab,
          pageIndex:currentPage,
          pageSize:itemsPerPage
        },
        header: {
          'Content-Type': 'application/json',
          'Authorization': _that.data.token.authorization,
          'Worker': _that.data.token.worker,
          'Hospital': '130670',
          'ChannelId': '1000005' 
        },
        method:'GET',
        success: function(res) {
          wx.hideLoading();
          console.log(res.data);
          callBack(res.data);
        }
      })
  },
   /**
    * 分期申请详情页面跳转
    */
  itemClick: function (e) {
    wx.navigateTo({
      url: '../applyDetail/applyDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /*******************************************************/

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
     // 链式调用
    _that.getWindowConfig().then(function(){
      return _that.getRequestToken()
    }).then(function(res){
      console.log('_that.data.token' + _that.data.token);
      _that.requestForLoadList(_that.data.pageIndex,_that.data.pageSize,function(res) {
          console.log('数据回调成功:' + res);
          if (res.Items.length) {
            _that.setData({
              itemList: _that.handleSuccessData(res.Items),
              totalPage: res.TotalPages
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
    var _that = this;
    _that.clearData();
    _that.requestForLoadList(_that.data.pageIndex, _that.data.pageSize, function (res) {
      console.log('数据回调成功:' + res);
      if (res.Items.length) {
        _that.setData({
          itemList: _that.handleSuccessData(res.Items),
          totalPage: res.TotalPages
        })
      }
    })
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
    
  },
  lowerToBottom: function () {
    console.log("滚动到底部");
    var _that = this;
    var totalPages = _that.data.totalPage;
    var currentPage = _that.data.pageIndex;
    var dataList = _that.data.itemList;
    if (currentPage <= totalPages) {
      _that.setData({
        pageIndex: currentPage + 1
      });
      _that.requestForLoadList(_that.data.pageIndex, _that.data.pageSize, function (res) {
        console.log('数据回调成功:' + res);
        var list = dataList.concat(res.Items);
        if (res.Items.length) {
          _that.setData({
            itemList: _that.handleSuccessData(list),
            totalPage: res.TotalPages
          })
        }
      })
    }
  }
})