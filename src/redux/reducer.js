/**管理状态数据的reducer函数 */
import {combineReducers} from 'redux'
import storageUtils from '../utils/storageUtils'
import {SET_HEADER_TITLE,LOGIN_SUCCESS,LOGIN_FAIL, LOGOUT} from './action-types'

/**头部标题reducer */
const initHeaderTitle = '首页'
function headerTitle(state = initHeaderTitle,action){
  switch (action.type){
    case SET_HEADER_TITLE:
      return action.data
    default:
      return state
  }
}

/**用户登录reducer */
const initUser = storageUtils.getUser()
function user(state = initUser,action){
  switch (action.type){
    case LOGIN_SUCCESS:
      return action.user
    case LOGOUT:
      return {}
    case LOGIN_FAIL:
      return {errorMsg:action.errorMsg}
    default:
      return state
  }
}

/**返回一个新的总reducer函数暴露给store */

export default combineReducers({
  headerTitle,
  user
})