import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Menu,Icon} from 'antd';
import logo from '../../assets/images/logo.jpg';

import './index.less';

const {SubMenu} = Menu;

export default class LeftNav extends Component{
    render(){
        return (
            <div className="left-nav">
                <Link className="left-nav-link" to="/home">
                    <img src={logo} alt="logo"/>
                    <h1>Cube-SYS</h1>
                </Link>
                <Menu defaultSelectedKeys={['/home']} mode="inline" theme="dark">
                    <Menu.Item key="/home">
                       <Link to="/home">
                        <Icon type="home"/>
                        <span>欢迎页</span>
                       </Link>
                    </Menu.Item>
                    <SubMenu key="/products" 
                    title={
                        <span>
                            <Icon type="gold"/>
                            <span>商品</span>
                        </span>
                    }>
                       <Menu.Item key="/category">
                        <Link to="/category">
                            <Icon type="folder-open"/>
                            <span>品类管理</span>
                       </Link>
                        </Menu.Item>
                        <Menu.Item key="/product">
                        <Link to="/product">
                            <Icon type="filter"/>
                            <span>商品管理</span>
                        </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user">
                       <Link to="/user">
                        <Icon type="user"/>
                        <span>用户管理</span>
                       </Link>
                    </Menu.Item>
                    <Menu.Item key="/role">
                       <Link to="/role">
                        <Icon type="cluster"/>
                        <span>角色管理</span>
                       </Link>
                    </Menu.Item>
                    <SubMenu key="/charts" 
                    title={
                        <span>
                            <Icon type="area-chart"/>
                            <span>图表</span>
                        </span>
                    }>
                       <Menu.Item key="/charts/bar">
                        <Link to="/charts/bar">
                            <Icon type="bar-chart"/>
                            <span>bar图</span>
                        </Link>
                        </Menu.Item>
                        <Menu.Item key="/chartsline">
                        <Link to="/charts/line">
                            <Icon type="line-chart"/>
                            <span>线图</span>
                        </Link>
                        </Menu.Item>
                        <Menu.Item key="/charts/pie">
                        <Link to="/charts/pie">
                            <Icon type="pie-chart"/>
                            <span>饼图</span>
                        </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu> 
            </div>
        )
    }
}