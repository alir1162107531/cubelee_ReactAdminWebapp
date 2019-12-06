/**
 * 操作local数据的工具函数模块
 */

const USER_KEY = 'user_key';

 export default{

   saveUser(user){
     sessionStorage.setItem(USER_KEY,JSON.stringify(user));
   },

   getUser(){
     return JSON.parse(sessionStorage.getItem(USER_KEY) || '{}');
   },

   removeUser(){
    sessionStorage.removeItem(USER_KEY);
   }
}