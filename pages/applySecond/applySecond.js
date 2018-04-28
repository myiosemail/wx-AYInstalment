
import { $wuxToast } from '../../components/wux'
const config = require('../../config.js');
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:{},
    totalPhotoItems:[],
    dataUrls:[],
    orderId:'',
    first_images:[
      {
        title: '身份证正面照',
        key:'IDCardPic_Front',
        placeImg: '../../images/IDCard_front.png',
        relImage:'../../images/IDCard_front.png'
      },
      {
        title: '身份证背面照',
        key: 'IDCardPic_Back',
        placeImg: '../../images/IDCard_back.png',
        relImage: '../../images/IDCard_back.png'
      },
      {
        title: '手持身份证照',
        key: 'IDCardPic_InHand',
        placeImg: '../../images/GQZ_QRCode.png',
        relImage: '../../images/GQZ_QRCode.png'
      }
    ],
    second_images: [
      {
        title: '医疗确认照',
        key: 'MedicaltPhoto',
        placeImg: '../../images/GQZ_QRCode.png',
        relImage: '../../images/GQZ_QRCode.png'
      }
    ],
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
   * 图片删除
   */
  deleteImageAction: function(e){
    var _that = this
    var chooseType = parseInt(e.currentTarget.dataset.type)
    var selctItem = e.currentTarget.dataset.item
    var images = chooseType ? _that.data.second_images : _that.data.first_images
    images.map((item,idx) => {
      if(item.title == selctItem.title){
        item.relImage = item.placeImg
        item.selected = false
      }
    })
    if (!chooseType) {
      _that.setData({
        first_images: images
      });
    } else {
      _that.setData({
        second_images: images
      });
    }
  },
   /**
    * 图片预览
    */
  previewImage: function(e){
    var relImagePath = e.target.dataset.src
    wx.previewImage({
      urls: [relImagePath],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this
    _that.data.orderId = options.orderId
    _that.getRequestToken()
  },
  /**
   * 选择图片
   */
  chooseImg: function(e) {
    var _that = this
    var selectIndex = e.currentTarget.dataset.id
    var chooseType = parseInt(e.currentTarget.dataset.type)
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],      // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        var images = chooseType ? _that.data.second_images : _that.data.first_images
        images.map((item,idx) => {
          if (idx == selectIndex) {
            item.relImage = tempFilePaths[0]
            item.selected = true
          }
        })
        if (!chooseType) {
          _that.setData({
            first_images: images
          });
        } else {
          _that.setData({
            second_images: images
          });
        }
        /** 两个数组合并 */
        var contactArr = []
        var totals = contactArr.concat(_that.data.first_images, _that.data.second_images) 
        _that.data.totalPhotoItems = totals
      },
    })
  },
  /**
   * 图片上传获取url
   */
  uploadImages: function(data){
      var _that = this,
          i = data.i?data.i:0,
          success = data.success?data.success:0,
          fail = data.fail?data.fail:0;    
      wx.showLoading({
        title: `上传第${i+1}张`,
      })
      wx.uploadFile({
        url: config.path.service.uploadImgeUrl,
        filePath: data.path[i].relImage,
        name: 'Attachment',
        header: { 
          'Accept':'*/*',
          'Content-Type': 'multipart/form-data',
          'Authorization': _that.data.token.authorization,
          'Worker': _that.data.token.worker,
          'Hospital': '130670',
          'ChannelId': '1000005'  
        },
        formData: {
          ServiceType: '1'
        },
        method: 'POST',
        success: function(res) {
          var dataDic = JSON.parse(res.data)
          console.log(dataDic.Url)
          wx.hideLoading()
          success ++;
          var urlDic = {}
          urlDic.key = data.path[i].key
          urlDic.value = dataDic.Url
          data.urls.push(urlDic)
          console.log(urlDic)
        },
        fail: function() {
          wx.hideLoading()
          fail ++;
        },
        complete: function() {
          console.log(i)
          i ++;
          if(i == data.path.length) {
            console.log('上传完成')
            console.log('data.urls:' + data.urls)
            _that.data.dataUrls = data.urls
            /** 执行上传图片Urls */
            _that.submitImageUrls(_that.data.dataUrls, (orderId) => {
              wx.navigateTo({
                url: '../applyThree/applyThree?orderId=' + _that.data.orderId,
              })
            })
          } else {
            data.i = i;
            data.success = success;
            data.fail = fail;
            _that.uploadImages(data)
          }
        }
      })
  },
  /**
   * 上传图片的Url
   */
  submitImageUrls:function(dataUrls,callBack) {
    var _that = this
    wx.showLoading({
      title: '',
    })
    var dataDic = {}
    _that.data.dataUrls.map((item) => {
      var itemKey = item.key
      var itemValue = item.value
      dataDic[itemKey] = itemValue
    })
    dataDic.OrderId = _that.data.orderId
    wx.request({
      url: config.path.service.goldLTStepTwoUrl,
      data: dataDic,
      header: {
        'Content-Type': 'application/json',
        'Authorization': _that.data.token.authorization,
        'Worker': _that.data.token.worker,
        'Hospital': '130670',
        'ChannelId': '1000005' 
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()
        if(res.statusCode == 200){
          console.log('orderId:' + res.data.Id)
          callBack(res.data.Id)
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
   * 下一步
   */
  nextStepClick: function(e) {
    var _that = this
    if (_that.validateSumit()) {
      var data = {
        path: _that.data.totalPhotoItems,
        urls:[]
      }  
      _that.uploadImages(data)
    }
  },
  validateSumit: function () {
    var valids = true
    if (!this.data.totalPhotoItems.length) {
      $wuxToast.show({
        type: 'text',
        timer: 1500,
        color: '#fff',
        text: '请选择身份证正面照',
      });
      valids = false
    } else {
      for (var i = 0; i < this.data.totalPhotoItems.length; i ++) {
        var item = this.data.totalPhotoItems[i]
        if (!item.selected) {
          var errorMsg = `请选择${item.title}`
          $wuxToast.show({
            type: 'text',
            timer: 1500,
            color: '#fff',
            text: errorMsg,
          });
          valids = false
          break
        }
      }
    }
    return valids
  }
})