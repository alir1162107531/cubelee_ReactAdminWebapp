/**
 * Created by Administrator on 2019/8/26.
 */
import React,{Component} from 'react';
import {Redirect,Switch,Route} from 'react-router-dom';
import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';
import {Layout} from 'antd';
import LeftNav from '../../components/left-nav';
import TopHead from '../../components/top-head';

import Home from '../home/home';

const {Footer,Sider,Content} = Layout;

export default class Admin extends Component{
    render(){
        let user = null;
        // let kitem = localStorage.getItem('user_key');
        // let res = JSON.parse(kitem);
        // let res = storageUtils.getUser();
        let res = memoryUtils.user;
        console.log(res);
        if(res && res.data !== undefined){
           user = res.data;
        }else{
          user = JSON.parse('{}');
          return <Redirect to="/login" />
        }
        console.log(user);
        return (
            <Layout style={{height:'100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <TopHead /> 
                    <Content style={{backgroundColor: 'white'}}>
                        <Switch>
                            <Route path="/home" component={Home}/>
                            <Redirect to="/home"/>
                        </Switch>      
                    </Content>
                    <Footer style={{textAlign:'center',color:'rgba(0,0,0,0.5)'}}>
                        推荐使用google浏览器，可以获得更佳的页面体验
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}