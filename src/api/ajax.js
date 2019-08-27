/**封装ajax请求行数 */

import axios from 'axios';
// import qs from 'qs';

import {message} from 'antd';

// axios.defaults.headers.post['Content-Type'] = 'application/json';

//请求拦截:使得post请求格式为urlencoded格式：userno=lr&password=abc123
//请求前执行
// axios.interceptors.request.use(function(config){
//   const {method,data} = config;
//   if(method.toLowerCase() === 'post' && typeof data==='object'){
//     config.data = qs.stringify(data);
//   }
//   return config;
// },function(error){
//   return Promise.reject(error);  
// });

//响应拦截：
//使得返回简单易用
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response.data;
}, function (error) {
  // Do something with response error
  console.log('response error');
  // return Promise.reject(error);
  //中断失败，返回一个pending状态的promise
  message.error('请求出错'+error.message);
  return new Promise(()=>{});
});

export default axios; 
