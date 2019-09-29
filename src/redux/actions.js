/**包含N个用于创建action对象的工厂函数 */

import {SET_HEADER_TITLE,LOGIN_SUCCESS,LOGIN_FAIL,LOGOUT} from './action-types'

import {reqLogin} from '../api'
import storageUtils from '../utils/storageUtils'

/**设置头部标题 */

export const setHeaderTitle = (headerTitle) => ({
  type: SET_HEADER_TITLE,
  data: headerTitle
})

/**接收登录成功后的action */
export const successUser = (user) => ({
  type: LOGIN_SUCCESS,
  user
})

/**接收登录失败后的action */
export const failMsg = (errorMsg) => ({
  type: LOGIN_FAIL,
  errorMsg
})

/**登录的异步action */
export function login(userno,password){
  return async dispatch => {
    //发送异步ajax请求
    const result = await reqLogin(userno,password)
    //请求结束，分发同步action
    //成功
    if(result.code ===0){
      const user = result.item
      storageUtils.saveUser(user)
      dispatch(successUser(user))
    }else{
      const msg =result.msg
      dispatch(failMsg(msg))
    }
    //失败
  }
}

/**退出登录同步action */

export const logout = ()=>{
  //删除localstorage信息
  storageUtils.removeUser()
  return {type:LOGOUT}
}