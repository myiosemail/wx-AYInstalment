
const config = require('../../config.js');
var rate = 0; //分辨率转换
var floatTop = 0; //悬浮高度

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'', //页面跳转传输参数ID
    detailModel:{}, // 接收返回数据
    topItems:[],
    infos:[],
    infoSections:[],
    imgArr:[],
    tabs: [
      { id: "progress", isSelect: true, title: "申请进度" },
      { id: "details", isSelect: false, title: "申请信息" }
    ], //tabbar数组
    curTabId: "progress", //当前tabid
    isShowFloatTab: false, //是否显示悬浮tab
    token:{},
  },
  /**
   * 获得滑动导致悬浮开始的高度
   * @return {[type]} [description]
   */
  getScrollTop: function () {
    var that = this;
    if (wx.canIUse('getSystemInfo.success.screenWidth')) {
      wx: wx.getSystemInfo({
        success: function (res) {
          rate = res.screenWidth / 750;
          floatTop = 410 * rate;
          that.setData({
            scrollTop: 410 * res.screenWidth / 750,
            scrollHeight: res.screenHeight / (res.screenWidth / 750) - 128,
          });
        }
      });
    }
  },
  /**
   * 监听页面滚动函数
   */
  onPageScroll: function (event) {
    var scrollTop = event.scrollTop;
    if (scrollTop >= floatTop && !this.data.isShowFloatTab) {
      this.setData({
        isShowFloatTab: true,
      });
    } else if (scrollTop < floatTop && this.data.isShowFloatTab) {
      this.setData({
        isShowFloatTab: false,
      });
    }
  },
  /**
     * 点击tab切换
     * @param  {[type]} event 
     * @return {[type]}       
     */
  clickTab: function (event) {
    var id = event.detail.id;
    this.data.curTabId = id;
    for (var i = 0; i < this.data.tabs.length; i++) {
      if (id == this.data.tabs[i].id) {
        this.data.tabs[i].isSelect = true;
      } else {
        this.data.tabs[i].isSelect = false;
      }
    }
    this.setData({
      tabs: this.data.tabs,
      curTabId: this.data.curTabId,
    });

    //更新数据，第一次点击或者为空的时候加载重新加载数据
    if (this.data.curTabId == 'progress') {
    } else {
    }
  },
  /**
   * 图片九宫格浏览
   */
  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
   * 返回数据格式化处理
   */
  handleSuccessData(data) {
    return [
      {
        title: '贷款金额：',
        content: data.AmountApp
      },
      {
        title: '申请人：',
        content: data.CustomerRealName
      },
      {
        title: '申请日期：',
        content: data.AddTime.split('T')[0]
      },
      {
        title: '申请单号：',
        content: data.OrderNo
      },
    ];
  },
  /**
   * 请求详情接口数据
   */
  requestForApplyDetail: function () {
      var _that = this;
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: config.path.service.applyForDetailUrl,
        data: {
          orderId: _that.data.id
        },
        header: {
          'Content-Type': 'application/json',
          'Authorization': _that.data.token.authorization,
          'Worker': _that.data.token.worker,
          'Hospital': '130670',
          'ChannelId': '1000005' 
        },
        method: 'GET',
        success: function(res) {
          wx.hideLoading();
          console.log(res.data);
          var applyInfos = [
            {
              title:'申请人姓名',
              content: res.data.CustomerRealName,
              detail:''
            },
            {
              title: '申请人电话',
              content: res.data.Mobile,
              detail: ''
            },
            {
              title: '与就诊人关系',
              content: res.data.PatientRelationName,
              detail: ''
            }
          ];
          var loadInfos = [
            {
              title: '就诊人诊所',
              content: res.data.HospitalName,
              detail: ''
            },
            {
              title: '申请产品',
              content: res.data.ProductName,
              detail: ''
            },
            {
              title: '贷款金额',
              content: res.data.AmountTotal,
              detail: ''
            },
            {
              title: '期数',
              content: res.data.InstalmentsNum,
              detail: ''
            },
            {
              title: '手续费',
              content: res.data.CustomerRebate,
              detail: ''
            }
          ];
          var refundPlans = [];
          var titleDic = {
            title: '期数',
            content: '还款金额（元）',
            detail: '最迟还款日'
          };
          refundPlans.push(titleDic);
          res.data.RefundPlanList.map((item,currentIndex) => {
            var dic = {};
            dic.title = currentIndex + 1;
            dic.content = `¥ ${item.Money}`;
            dic.detail = item.Date.split('T')[0];
            refundPlans.push(dic);
          });
          var infoList = [
              {
                title:'申请信息',
                contentList:applyInfos
              },
              {
                title: '贷款信息',
                contentList: loadInfos
              },
              {
                title: '还款计划',
                contentList: refundPlans
              },
          ];
          var imageList =[];
          res.data.Image.map(function(item) {
            imageList.push(item.ImgUrl)
          });
          _that.setData({
            detailModel: res.data,
            topItems: _that.handleSuccessData(res.data),
            infos: infoList,
            imgArr: imageList
          })
        },
      })
  },
  /*********************************************************************************/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    _that.data.id = options.id;
    _that.getScrollTop();
    _that.getRequestToken().then(() => {
      _that.requestForApplyDetail();
    });
    
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
    
  },
  
})