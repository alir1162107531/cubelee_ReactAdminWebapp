
import ajax from './ajax';
import jsonp from 'jsonp';
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
  return new Promise((resolve) => { 
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (error, data) => {
      if (!error && data.error===0) { // 成功的
        const {dayPictureUrl, weather} = data.results[0].weather_data[0];
        resolve({dayPictureUrl, weather});
      } else { // 失败的
        message.error('获取天气信息失败!');
      }
    })
  })
}

export const reqCategory = (categoryId)=>ajax('/manage/category/info',{
  params:{
    categoryId
  }
})
//获取分类列表

export const reqCategorys = ()=>ajax('/manage/category/list')

// 添加分类
export const reqAddCategory = ({categoryNo,categoryName,categoryDesc}) => ajax.post('/manage/category/add',{
  categoryNo,
  categoryName,
  categoryDesc
})

// 更新分类
export const reqUpdateCategory = ({categoryId,categoryNo,categoryName,categoryDesc}) => ajax.post('/manage/category/update',{
  categoryId,
  categoryNo,
  categoryName,
  categoryDesc
})

export const reqDelCategory = ({categoryId}) => ajax.post('/manage/category/delete',{
  categoryId
})

// 获取商品列表

// export const reqProducts =(pageNum,pageSize) =>ajax.post('/manage/product/list',{
//   params:{//包含所有query参数的对象
//     pageNum,
//     pageSize
//   }
// })

export const reqProduct = (productId) => ajax('/manage/product/info', {
  params: { 
    productId
  }
})

export const reqProducts =({pageNum,pageSize,conditions}) =>ajax.post('/manage/product/list',{
  params:{//包含所有query参数的对象
    pageNum,
    pageSize,
    conditions:conditions
  }
})

export const reqAddProduct =({productName,productNo,productPrice,productDesc}) =>ajax.post('/manage/product/add',{
  productName,
  productNo,
  productPrice,
  productDesc
})

export const reqUpdateProduct = (item) => ajax.post('/manage/product/update',{
    item
})

export const reqAddUpdateProduct =(item)=>ajax.post('/manage/product/'+(item.id?'update':'add'),item)

export const reqDelProduct = ({productId}) => ajax.post('/manage/product/delete',{
  productId
})

export const reqDeleteImg = (name) =>ajax.post('/manage/img/delete',{name})

// 获取所有角色的列表
export const reqRoles = () => ajax('/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax.post('/manage/role/add', {
  roleName
})
// 更新角色
export const reqUpdateRole = (role) => ajax.post('/manage/role/update', role)