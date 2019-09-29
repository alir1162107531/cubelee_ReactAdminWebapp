/**
 * Created by Administrator on 2019/8/26.
 */
import React,{Component} from 'react';
import {Redirect,Switch,Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout} from 'antd';
import LeftNav from '../../components/left-nav';
import TopHead from '../../components/top-head';

import Home from '../home/home';
import Category from '../category/category';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';


import './admin.less';
const {Footer,Sider,Content} = Layout;

class Admin extends Component{
    render(){
        let user = null;
        let res = this.props.user;
        console.log(res);
        if(res && res.id !== undefined){
           user = res;
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
                    <Content style={{backgroundColor: 'white',margin:'20px'}}>
                        <Switch>
                            <Route path="/home" component={Home}/>
                            <Route path="/category" component={Category}/>
                            <Route path="/product" component={Product}/>
                            <Route path="/role" component={Role}/>
                            <Route path="/user" component={User}/>
                            <Route path="/charts/bar" component={Bar}/>
                            <Route path="/charts/line" component={Line}/>
                            <Route path="/charts/pie" component={Pie}/>
                            <Redirect to="/home"/>
                        </Switch>      
                    </Content>
                    <Footer className = "footer">
                        <h4>推荐使用Chrome浏览器，可以获得更佳的页面体验</h4>
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(state=>({user:state.user})
,{
  
  }
)(Admin)