
import ajax from './ajax';

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