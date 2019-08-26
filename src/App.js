/**
 * Created by Administrator on 2019/8/26.
 */
/*
应用根组件
 */

import React,{Component} from 'react';
import {Button,message} from 'antd';
import {BrowserRouter,HashRouter,Switch,Route} from "react-router-dom";
import Login from './pages/login/login.js'
import Admin from './pages/admin/admin.js'


class App extends Component{

    handleClick = () =>{
        message.success('成功了！');
    }

    render() {
        return(
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={Login}/>
                    <Route path="/admin" component={Admin}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App;