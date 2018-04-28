
import WxValidate from '../../utils/WxValidate.js'
import { $wuxToast } from '../../components/wux'
const config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: {},
    releationCaseArray: ['父母','子女','配偶'],
    bankCaseArray:[
      '中国工商银行',
      '中国建设银行',
      '招商银行',
      '中国农业银行',
      '中国交通银行',
      '中国银行',
      '中国民生银行',
      '兴业银行',
      '中国光大银行',
      '中信银行',
      '上海银行',
      '上海浦东发展银行',
      '平安银行'
    ],
    rateTypeNames: [
      {
        name: '诊所承担'
      },
      {
        name: '客户承担'
      },
      {
        name: '诊所客户各承担一半'
      },
    ],
    releationCaseIndex: 0,
    bankCaseIndex: 0,
    // form: {
    applyName: '',
    idCard:'',
    tel:'',
    applyBank:'',
    productId:'',
    bankCode:1,
    insalmentsNum:'',
    treatAmount: '',
    loanAmount: '',
    firstPayAmount:'',
    forImmediateFamily:false,
    visitName:'',
    visitIdCar:'',
    relationCode:'',
    rateCode:'',
    // },//表单提交数据
    typeNames: [],
    loanTypeNames: [],
  },
  /**
   * 申请产品单选事件
   */
  productItemTap:function (e) {
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameterList = this.data.typeNames//获取Json数组
    var selectItems = e.currentTarget.dataset.items;
    var productId = e.currentTarget.dataset.productid;
    for (var i = 0; i < parameterList.length; i++) {
      if (i == this_checked) {
        parameterList[i].checked = true;//当前点击的位置为true即选中
      } else {
        parameterList[i].checked = false;//其他的位置为false
      }
    }
    that.setData({
      typeNames: parameterList,
      loanTypeNames: selectItems,
      productId: productId
    })
  },
  /**
   * 贷款期数单选事件
   */
  loanItemTap: function (e) {
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var instalmentNum = e.currentTarget.dataset.num;
    var assumeType = e.currentTarget.dataset.assumetype;
    var parameterList = this.data.loanTypeNames//获取Json数组
    for (var i = 0; i < parameterList.length; i++) {
      if (i == this_checked) {
        parameterList[i].checked = true;//当前点击的位置为true即选中
      } else {
        parameterList[i].checked = false;//其他的位置为false
      }
    }
    that.data.rateTypeNames.map((item,idx) => {
      if (idx == e.currentTarget.dataset.assumetype) {
          item.checked = true;
        } else {
          item.checked = false;
        }
    });
    that.setData({
      loanTypeNames: parameterList,
      rateTypeNames: that.data.rateTypeNames,
      insalmentsNum: instalmentNum,
      rateCode: assumeType
    })
  },
  /**
   * 手续费承担比例单选事件
   */
  rateItemTap: function (e) {
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameterList = this.data.rateTypeNames//获取Json数组
    for (var i = 0; i < parameterList.length; i++) {
      if (i == this_checked) {
        parameterList[i].checked = true;//当前点击的位置为true即选中
      } else {
        parameterList[i].checked = false;//其他的位置为false
      }
    }
    that.setData({
      rateTypeNames: parameterList
    })
  },
  /**
   * 直系亲属信息展开事件
   */
  switchChange: function(e) {
    this.setData({
      forImmediateFamily:e.detail.value,
      visitName: this.data.visitName,
      visitIdCar: this.data.visitIdCar
    })
  },
  bindBankChange: function(e) {
    this.data.bankCode = parseInt(e.detail.value) + 1
    this.setData({
      bankCaseIndex: e.detail.value
    })
  }, 
  bindReleationChange: function(e) {
    this.data.relationCode = e.detail.value
    this.setData({
      releationCaseIndex: e.detail.value
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
   * 请求产品列表接口
   */
  requestForProductList: function (callBack) {
    var _that = this;
    wx.request({
      url: config.path.service.productListUrl,
      data: {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': _that.data.token.authorization,
        'Worker': _that.data.token.worker,
        'Hospital': '130670',
        'ChannelId': '1000005' 
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data);
        callBack(res.data)
      },    
      fail: function() {},
    })
  },
  /**
   * 提交数据
   */
  requstForSumit: function(callBack){
    var _that = this
    console.log(_that.data);
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: config.path.service.goldLTStepOneUrl,
        data: {
          CustomerRealName: _that.data.applyName,
          IDCard: _that.data.idCard,
          Mobile: _that.data.tel,
          BankCode: _that.data.bankCode,
          BankCard: _that.data.applyBank,
          TotalAmount: _that.data.treatAmount,
          AmountApp: _that.data.loanAmount,
          DownPayments: _that.data.firstPayAmount,
          InstalmentsNum: _that.data.insalmentsNum,
          ForImmediateFamily: _that.data.forImmediateFamily,
          PatientName: _that.data.visitName,
          PatientRelation: _that.data.relationCode,
          PatientIDCard: _that.data.visitIdCar,
          InterestAssumeType: _that.data.rateCode,
          ProductId: _that.data.productId
        },
        header: { 
          'Content-Type': 'application/json',
          'Authorization': _that.data.token.authorization,
          'Worker': _that.data.token.worker,
          'Hospital': '130670',
          'ChannelId': '1000005' 
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading()
          if(res.statusCode == 200) {
            console.log(res.data)
            callBack(res.data.Id)
            console.log('数据提交成功')
          } else {
            $wuxToast.show({
              type: 'text',
              timer: 1500,
              color: '#fff',
              text: res.data,
            });
          }
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
    var _that = this;
    _that.data.productId = options.productId
    _that.getRequestToken().then(() => {
      _that.requestForProductList(function (res) {
        var productList = [];
        var selectItems = [];
        res.map((item, idx) => {
          if (_that.data.productId == item.ProductId) {
            item.checked = true;
            selectItems = item.InstalmentsNum;
          };
          item.ProductName = item.ProductName.replace('分期','')
          productList.push(item);
        });
        _that.setData({
          typeNames: productList,
          loanTypeNames: selectItems
        })
      });
    })
  },

  /**
   * 表单提交(下一步)
   */
  sumitForm: function (e) {
    const params = e.detail.value
    console.log(params)

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0];
      $wuxToast.show({
        type: 'text',
        timer: 1500,
        color: '#fff',
        text: error.msg,
      });
      return false;
    }
    if (this.vaildSepcialText(e)) {
      this.requstForSumit((orderId) => {
        wx.navigateTo({
          url: '../applySecond/applySecond?orderId=' + orderId,
        })
      })
    }
  },
  initValidate() {
    this.WxValidate = new WxValidate({
      applyName: {
        required: true,
      },
      applyIdCard: {
        required: true,
        applyIdCard: true,
        maxlength: 18
      },
      applyTel: {
        required: true,
        applyTel:true
      },
      applyBank: {
        required: true,
        applyBank: true
      },
      treatAmount: {
        required: true,
        min: 1000,
        max: 999999.99
      },
      loanAmount: {
        required: true,
        min: 1000
      },
      visitName: {
        required: true
      },
      visitIdCar: {
        required: true
      }
    }, {
        applyName: {
          required: '申请人姓名不能为空'
        },
        applyIdCard: {
          required: '身份证号不能为空'
        },
        applyTel: {
          required: '银行预留手机号不能为空'
        },
        applyBank: {
          required: '银行卡号不能为空'
        },
        treatAmount: {
          required: '治疗费不能为空'
        },
        loanAmount: {
          required: '贷款金额不能为空'
        },
        visitName: {
          required: '就诊人姓名不能为空'
        },
        visitIdCar: {
          required: '就诊人身份证号不能为空'
        }
    })
    this.WxValidate.addMethod('applyTel', (value, param) => {
      return this.WxValidate.optional(value) || /^1\d{10}$/.test(value)
    }, '请输入正确的手机号')
    this.WxValidate.addMethod('applyIdCard', (value, param) => {
      return this.WxValidate.optional(value) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
    }, '请输入正确的身份证号')
    this.WxValidate.addMethod('applyTel', (value, param) => {
      return this.WxValidate.optional(value) || /^1\d{10}$/.test(value)
    }, '请输入正确的银行卡号')
  },
  /**
   * 特殊校验
   */ 
  vaildSepcialText (e) {
    if (e.detail.value.loanAmount > e.detail.value.treatAmount) {
      $wuxToast.show({
        type: 'text',
        timer: 1500,
        color: '#fff',
        text: '贷款金额不能大于治疗费用',
      });
      return false;
    }
    return true;
  },
  applyNameBlur: function(e) {
    this.data.applyName = e.detail.value
  },
  applyIdCarBlur:function(e) {
    this.data.idCard = e.detail.value
  },
  applyTelBlur: function(e) {
    this.data.tel = e.detail.value
  },
  applyBankBlur: function(e) {
    this.data.applyBank = e.detail.value
  },
  visitNameBlur: function(e) {
    this.data.visitName = e.detail.value
  },
  visitIdCarBlur: function(e) {
    this.data.visitIdCar = e.detail.value
  },
  /**
   * 治疗费用输入监听
   */ 
  treatInputChange: function (event) {
    var _that = this;
    _that.data.treatAmount = event.detail.value
  },
  /**
   * 贷款费用失去焦点监听
   */ 
  loanblurChange: function (event) {
    var _that = this;
    _that.data.loanAmount = event.detail.value;
    if (!_that.data.treatAmount.length || !_that.data.loanAmount) {
      _that.data.firstPayAmount = '';
    } else {
      _that.setData({
          firstPayAmount: Math.round((parseFloat(_that.data.treatAmount) - parseFloat(_that.data.loanAmount)) * 100) / 100,
      })
    }
  }
})