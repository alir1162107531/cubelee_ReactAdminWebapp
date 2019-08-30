
import ajax from './ajax';
import jsonp from 'jsonp';
import { resolve } from 'upath';
import { message } from 'antd';

// const BASE_URL = 'http://localhost:4000';
const BASE_URL = '';

//请求登录

export const reqLogin = (userno,password)=>(
  ajax({
    method: 'post',
    url: BASE_URL + '/login',
    data: {
      userno,
      password
    }
  })
)

// const name = 'lr';
// const pwd = 'abc123';
// reqLogin(name,pwd).then(res=>{
//   // const item = res.data;
//   console.log('success!',res);
// },err=>{
//   console.log('failed!',err);
// });

export const reqWeather = (city)=>{
  return new Promise((resolve, reject) => { 
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (error, data) => {
      if (!error && data.error===0) { // 成功的
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else { // 失败的
        message.error('获取天气信息失败')
      }
    })
  })
}