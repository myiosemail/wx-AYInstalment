
import WxValidate from '../../utils/WxValidate.js'
import { $wuxToast } from '../../components/wux'
const config = require('../../config.js');
var pickerCity = require('../../components/picker-city/pickerCity.js')
var picker_companyCity = require('../../components/picker-city/pickerCity.js')
var show = false;
var item = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    token:{},
    Province:'',
    City:'',
    District:'',
    CompanyProvince:'',
    CompanyCity:'',
    CompanyDistrict:'',
    Address:'',
    CompanyName:'',
    CompanyAddres:'',
    CompanyTelephone:'',
    Salary:'',
    KinName:'',
    KinTelephone:'',
    EmergencyContactName:'',
    EmergencyTelephone:'',
    MaritalStatus:0,
    HighestDegree:0,
    HousingProperty:0,
    EmploymentStatus:0,
    KinRelation:0,
    EmergencyRelation:0,
    CompanyIndustry:0,
    MaritalStatusCaseArr:[
      '未婚','已婚','其他'
    ],
    HighestDegreeCaseArr:[
      '初中及以下', '中专', '大专', '本科','研究生或以上'
    ],
    HousingPropertyCaseArr:[
      '自有', '租用', '亲属楼宇', '集体宿舍', '其他'
    ],
    EmploymentStatusCaseArr:[
      '在职', '自雇人士', '自由职业', '家庭主妇', '退休人士', '失业人士'
    ],
    KinRelationCaseArr:[
      '父子（女）', '母子（女）', '配偶', '子女', '其他亲戚', '同事'
    ],//特殊+1
    EmergencyRelationCaseArr: [
      '父子（女）', '母子（女）', '配偶', '子女', '其他亲戚', '同事'
    ],
    CompanyIndustryCaseArr:[
      '服务行业', '批发零售_商业贸易_租赁', '生产_加工_制造业', 'IT网络_计算机_通信', '金融_银行_保险', '工程建筑_装修_园林绿化', '文化科教', '旅游_饭点_娱乐', '政府机关_事业单位_国企', '广告', '运输业'
    ],
    item: {
      show: show
    },
    selectType:0,
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
   * 提交数据
   */
  requstForSumit: function (callBack) {
    var _that = this
    console.log(_that.data);
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: config.path.service.goldLTStepThirdUrl,
      data: {
        OrderId: _that.data.orderId,
        Province: _that.data.Province,
        City: _that.data.City,
        District: _that.data.District,
        CompanyProvince: _that.data.CompanyProvince,
        CompanyCity: _that.data.CompanyCity,
        CompanyDistrict: _that.data.CompanyDistrict,
        Address: _that.data.Address,
        MaritalStatus: _that.data.MaritalStatus,
        HighestDegree: _that.data.HighestDegree,
        HousingProperty: _that.data.HousingProperty,
        EmploymentStatus: _that.data.EmploymentStatus,
        KinName: _that.data.KinName,
        KinRelation: _that.data.KinRelation,
        KinTelephone: _that.data.KinTelephone,
        EmergencyContactName: _that.data.EmergencyContactName,
        EmergencyRelation: _that.data.EmergencyRelation,
        EmergencyTelephone: _that.data.EmergencyTelephone,
        CompanyName: _that.data.CompanyName,
        CompanyAddress: _that.data.CompanyAddress,
        CompanyTelephone: _that.data.CompanyTelephone,
        CompanyDepartment: _that.data.CompanyDepartment,
        Salary: _that.data.Salary,
        CompanyIndustry: _that.data.CompanyIndustry,
        IncomeSource: _that.data.IncomeSource
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
        if (res.statusCode == 200) {
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
   * 点击选择城市按钮显示picker-view
   */
  translate: function (e) {
    this.data.selectType = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.id == 1) {
      picker_companyCity.animationEvents(this, 0, true, 400);
    } else {
      pickerCity.animationEvents(this, 0, true, 400);
    }
  },
  /**
   * 隐藏picker-view
   */
  hiddenFloatView: function (e) {
    if (this.data.selectType == 0) {
      pickerCity.animationEvents(this, 200, false, 400);
    } else {
      picker_companyCity.animationEvents(this, 200, false, 400);
    }
  },
  /**
   * 滑动事件
   */
  bindChange: function (e) {
    if (this.data.selectType == 0) {
      pickerCity.updateAreaData(this, 1, e);
      item = this.data.item;
      this.setData({
        Province: item.provinces[item.value[0]].P,
        City: item.citys[item.value[1]].C,
        District: item.countys[item.value[2]].D
      });
    } else {
      picker_companyCity.updateAreaData(this, 1, e);
      item = this.data.item;
      this.setData({
        CompanyProvince: item.provinces[item.value[0]].P,
        CompanyCity: item.citys[item.value[1]].C,
        CompanyDistrict: item.countys[item.value[2]].D
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this
    _that.data.orderId = options.orderId
    _that.getRequestToken()
    _that.initValidate()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var _that = this;
    /** 请求数据 */
    pickerCity.updateAreaData(_that, 0, e);
    picker_companyCity.updateAreaData(_that, 0, e);
  },
  /**
   *  下一步
   */
  sumitForm: function(e) {
    const params = e.detail.value
    console.log(params)
    /** 表单验证 */
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
          url: '../qrCode/qrCode?orderId=' + orderId + '&from=' + 'StepThird',
        })
      })
    }
  },
  initValidate() {
    this.WxValidate = new WxValidate({
      address: {
        required: true,
        minlength:10
      },
      companyName: {
        required: true,
      },
      companyAddress: {
        required: true,
        minlength: 10
      },
      companyTelephone: {
        required: true,
        companyTelephone: true,
        minlength: 8
      },
      kinName: {
        required: true,
      },
      kinTelephone: {
        required: true,
        kinTelephone: true
      },
      emergencyContactName: {
        required: true,
      },
      emergencyTelephone: {
        required: true,
        emergencyTelephone: true
      },
      companyDepartment: {
        required: true,
      },
      salary: {
        required: true,
      }
    }, {
        address: {
          required: '现居住地址不能为空'
        },
        companyName: {
          required: '单位名称不能为空',
        },
        companyAddress: {
          required: '单位地址不能为空',
        },
        companyTelephone: {
          required: '单位电话不能为空'
        },
        companyDepartment: {
          required: '部门不能为空',
        },
        salary: {
          required: '月收入不能为空',
        },
        kinName: {
          required: '直系亲属姓名不能为空',
        },
        kinTelephone: {
          required: '直系亲属手机号不能为空',
        },
        emergencyContactName: {
          required: '紧急联系人姓名不能为空',
        },
        emergencyTelephone: {
          required: '紧急联系人手机号不能为空'
        }
      })
    this.WxValidate.addMethod('kinTelephone', (value, param) => {
      return this.WxValidate.optional(value) || /^1\d{10}$/.test(value)
    }, '直系亲属手机号格式不正确')
    this.WxValidate.addMethod('emergencyTelephone', (value, param) => {
      return this.WxValidate.optional(value) || /^1\d{10}$/.test(value)
    }, '紧急联系人手机号格式不正确')
    this.WxValidate.addMethod('companyTelephone', (value, param) => {
      return this.WxValidate.optional(value) || /^1\d{10}$/.test(value)
    }, '单位电话格式不正确')
  },
  /**特殊数据校验*/
  vaildSepcialText(e){
    var _that = this,
        errMsg ='';
    if(_that.data.City.length == 0) {
      errMsg = '现居住地地区不能为空'
      $wuxToast.show({
        type: 'text',
        timer: 1500,
        color: '#fff',
        text: errMsg,
      });
      return false
    }
    if (_that.data.CompanyCity.length == 0) {
      errMsg = '单位地区不能为空'
      $wuxToast.show({
        type: 'text',
        timer: 1500,
        color: '#fff',
        text: errMsg,
      });
      return false
    }
    return true
  },
  /**
   *  监听页面文本输入
   */
  addressBlur: function(e) {
    this.data.Address = e.detail.value
  },
  companyNameBlur: function(e){
    this.data.CompanyName = e.detail.value
  },
  companyAddresBlur: function(e) {
    this.data.CompanyAddres = e.detail.value
  },
  CompanyTelBlur: function(e) {
    this.data.CompanyTelephone = e.detail.value
  },
  companyDepartmentBlur: function(e) {
    this.data.CompanyDepartment = e.detail.value
  },
  salaryBlur: function(e) {
    this.data.Salary = e.detail.value
  },
  kinNameBlur: function(e) {
    this.data.KinName = e.detail.value
  },
  kinTelephoneBlur: function(e) {
    this.data.KinTelephone = e.detail.value
  },
  emergencyContactNameBlur: function(e) {
    this.data.EmergencyContactName = e.detail.value
  },
  emergencyTelephoneBlur: function(e) {
    this.data.EmergencyTelephone = e.detail.value
  },
  /**
   * 状态选择
   */
  maritalChange: function(e) {
    this.setData({
      MaritalStatus: e.detail.value
    })
  },
  highestDegreeChange: function(e) {
    this.setData({
      HighestDegree: e.detail.value
    })
  },
  housingPropertyChange: function(e) {
    this.setData({
      HousingProperty: e.detail.value
    })
  },
  employmentStatusChange: function(e) {
    this.setData({
      EmploymentStatus: e.detail.value
    })
  },
  companyIndustryChange: function(e) {
    this.setData({
      CompanyIndustry: e.detail.value
    })
  },
  kinRelationChange: function(e) {
    this.setData({
      KinRelation: e.detail.value
    })
  },
  emergencyRelationChange: function(e) {
    this.setData({
      EmergencyRelation: e.detail.value
    })
  }

})