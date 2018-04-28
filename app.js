//app.js



App({

  onLaunch: function () {
    var loginStatus = true;
    if(!loginStatus) {
      wx.openSetting({
        success: function (res) {
          if(res) {
            if (res.authSetting["scope.userInfo"]) {
              loginStatus = true;
              wx.getUserInfo({
                withCredentials:false,
                success: function (res) {
                  console.log(res.userInfo);
                },
                fail: function () {
                  console.log('授权收据失败')
                }
              })
            }
          }
        },
        fail: function () {
          console.log('设置数据失败')
        }
      })
    } else {
      wx.login({
        success: function (res) {
          if(res.code) {
            wx.getUserInfo({
              withCredentials:false,
              success: function (res) {
                // 获取到本地数据后存储
                console.log(res.userInfo);
                wx.setStorage({
                  key: 'userInfo',
                  data: {
                    userInfo: res.userInfo, 
                  },
                  success: function() {
                    console.log('用户信息存储成功')
                  }
                })
              },
              fail: function () {
                console.log('授权收据失败');
                loginStatus = false;
                wx.showModal({
                  title: '警告',
                  content: '您点击了拒绝授权，将无法正常使用爱牙分期的功能体验，请再次点击授权，或者删除小程序重新进入',
                  success: function (res) {
                    if(res.confirm) {
                      console.log('确定')
                    } else (
                      wx.openSetting({
                        success: function (res) {
                          if (res) {
                            if (res.authSetting["scope.userInfo"]) {
                              loginStatus = true;
                              wx.getUserInfo({
                                withCredentials: false,
                                success: function (res) {
                                  // 获取到本地数据后存储
                                  console.log(res.userInfo);
                                  wx.setStorage({
                                    key: 'userInfo',
                                    data: {
                                      userInfo: res.userInfo,
                                    },
                                    success: function () {
                                      console.log('用户信息存储成功')
                                    }
                                  })
                                },
                                fail: function () {
                                  console.log('授权失败返回数据')
                                }
                              })
                            }
                          }
                        },
                        fail: function () {
                          console.log('设置失败返回数据')
                        }
                      })
                    )
                  }
                })
              }
            })
          }
        },
        fail: function () {
          console.log('登录失败返回数据')
        }
      })
    }
  },
})