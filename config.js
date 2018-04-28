
/**
 *  小程序配置文件
 */
// 主机域名
var host = 'http://clinicapi.qiezzitest.info';
var path = {
  service: {
    host,
    loginUrl: `${host}/api/User/Login`,
    hospitalLimitUrl: `${host}/api/GoldEggplant/GetHospitalLimit`,
    getAllowSetInstrumentUrl: `${host}/api/GoldEggplant/AllowSetInterestAssume`,
    interestAssumeSettingUrl: `${host}/api/GoldEggplant/GetInterestAssumeSetting`,
    setInterestAssumeSettingUrl: `${host}/api/GoldEggplant/SetInterestAssumeSetting`,
    detailListUrl: `${host}/api/GoldEggplant/DetailList`,
    applyForListUrl: `${host}/api/GoldEggplant/ApplyforList`,
    qrCodeUrl: `${host}/api/GoldEggplant/GetQrCodeWithInterestAssumeType`,
    applyForDetailUrl: `${host}/api/GoldEggplant/ApplyforDetail`,
    productListUrl: `${host}/api/LoveTeeth/ProductList`,
    goldLTStepOneUrl: `${host}/api/LoveTeeth/LoveTeethStepsOne`,
    uploadImgeUrl: `${host}/api/SysConfig/UploadImage`,
    goldLTStepTwoUrl: `${host}/api/LoveTeeth/LoveTeethStepsTwo`,
    goldLTStepThirdUrl: `${host}/api/LoveTeeth/LoveTeethStepsThree`,
    dimensionalCodeUrl: `${host}/api/GoldEggplant/GetTwoDimensionalCode`,
    productDetailUrl: `${host}/api/GoldEggplant/ProductDetail`,
    productListPathUrl: `${host}/api/GoldEggplant/RecommendProductList`,
  }
}
module.exports = {
  path: path,
  appTitle: '爱牙分期',
}
