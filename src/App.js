/**
 * Created by Administrator on 2019/8/26.
 */
/*
应用根组件
 */

import React,{Component} from 'react';
import {message} from 'antd';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import Login from './pages/login/login.js'
import Admin from './pages/admin/admin.js'


class App extends Component{

    handleClick = () =>{
        message.success('成功了！');
    }

    render() {
        //模糊匹配，‘/’必须写在最后
        return(
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/" component={Admin}/> 
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App;