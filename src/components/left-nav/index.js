import React,{Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import {Menu,Icon} from 'antd';
import logo from '../../assets/images/logo.jpg';
import menuList from '../../config/menuConfig';

import './index.less';

const {SubMenu} = Menu;

class LeftNav extends Component{

    //根据基本数据生成目录结构
    //方法一
    getMenuNodes = (menuList)=>{
        return menuList.map(item =>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                       <Link to={item.key}>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                       </Link>
                    </Menu.Item>
                )     
            }else{
                return (
                    <SubMenu key={item.key} 
                        title={
                            <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>}
                    >
                    {
                        this.getMenuNodes(item.children)
                    }
                    </SubMenu>
                )
            }
        });
    }

    //方法二
    getMenuNodes2 = (menuList) =>{

        const Path = this.props.location.pathname;

        return menuList.reduce((preNodes,item)=>{
            if(!item.children){
                preNodes.push(
                    <Menu.Item key={item.key}>
                       <Link to={item.key}>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                       </Link>
                    </Menu.Item>
                )  
            }else{

                // const cItem = item.children.find(citem=>citem.key === Path);
                const cItem = item.children.find(citem=>Path.indexOf(citem.key) === 0);
                if(cItem){
                    this.openKey = item.key;
                }

                preNodes.push(
                    <SubMenu key={item.key} 
                        title={
                            <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>}
                    >
                    {
                        this.getMenuNodes2(item.children)
                    }
                    </SubMenu>
                )
            }
            return preNodes;
        },[])
    }

    /* 
        第一次render之后执行一次
        执行异步：如ajax/启动定时器
    */
    componentDidMount(){

    }

    /**
     * 第一次render之前执行一次
     * 为第一次render做一些同步的准备工作
     */
    componentWillMount(){
        this.menuNodes = this.getMenuNodes2(menuList);
    }

    render(){

        let selectKey = this.props.location.pathname;

        if(selectKey.indexOf('/product')=== 0){
          selectKey = '/product';
        }

        console.log('openKey',this.openKey);

        return (
            <div className="left-nav">
                <Link className="left-nav-link" to="/home">
                    <img src={logo} alt="logo"/>
                    <h1>Cube-SYS</h1>
                </Link>
                {/* defaultSelectedKeys：总是根据第一次指定的key进行显示
                    selectedKeys:总是根据最新指定的key进行显示
                 */}
                <Menu selectedKeys={[selectKey]} defaultOpenKeys={[this.openKey]} mode="inline" theme="dark">
                    {this.menuNodes}
                </Menu> 
            </div>
        )
    }
}


/**
 * 向外暴露，使用高阶组件withRouter()来包装非路由组件
 * 新组件向LeftNav传递：history/match/location
  */
export default withRouter(LeftNav)