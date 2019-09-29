/**redux核心管理对象 */

import {createStore,applyMiddleware} from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))