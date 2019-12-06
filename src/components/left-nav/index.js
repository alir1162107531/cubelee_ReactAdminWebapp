import React,{Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import {Menu,Icon} from 'antd';
import logo from '../../assets/images/logo.jpg';
import menuList from '../../config/menuConfig';
import {connect} from 'react-redux';
import {setHeaderTitle} from '../../redux/actions';

import './index.less';
import CubeUtilitys from '../../utils/CubeUtilitys';

const {SubMenu} = Menu;

class LeftNav extends Component{


    rootSubmenuKeys = ['/products','/charts'];

    state = {
      openKeys: ['/home']
    }

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
          if(this.hasAuth(item)){
              if(!item.children){
                 if(item.key === Path || Path.indexOf(item.key) ===0){
                  this.props.setHeaderTitle(item.title)
                 }

                  preNodes.push(
                      <Menu.Item key={item.key}>
                        <Link to={item.key} onClick={()=>
                          {
                            this.props.setHeaderTitle(item.title)
                          }
                          }>
                          <Icon type={item.icon}/>
                          <span>{item.title}</span>
                        </Link>
                      </Menu.Item>
                  )  
              }else{
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
          }
            return preNodes;
        },[])
    }

    hasAuth =(item) => {
      const user = this.props.user
      const menus = user.menus
      if(user.userno === 'lr' || item.public || menus.indexOf(item.key)!==-1){
        return true
      }else if(item.children){
        const chdItem = item.children.find(cItem => menus.indexOf(cItem.key)!==-1)
        return !!chdItem
      }

      return false
    }

    onSelect = selectKey=>{
      const isOpenKey = this.rootSubmenuKeys.find(it=> it=== selectKey.key)
      if(CubeUtilitys.isNull(isOpenKey) && selectKey.item.props.parentMenu.isRootMenu){
        this.setState({
          openKeys:[]
        })
      }
    }

    onOpenChange = openKeys =>{
      const latestOpenKey = openKeys.find(key=> this.state.openKeys.indexOf(key)===-1)
      if(this.rootSubmenuKeys.indexOf(latestOpenKey) === -1){
        this.setState({openKeys})
      }
      this.setState({
        openKeys:latestOpenKey?[latestOpenKey]:[]
      })
    }

    /* 
        第一次render之后执行一次
        执行异步：如ajax/启动定时器
    */
    componentDidMount(){
        this.setState({
          openKeys:[this.openKey]
        })
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
                {/* <Menu mode="inline" selectedKeys={[selectKey]} defaultOpenKeys={[this.openKey]} theme="dark">
                    {this.menuNodes}
                </Menu>  */}
                <Menu mode="inline"  selectedKeys={[selectKey]} openKeys={this.state.openKeys} onOpenChange={this.onOpenChange} onSelect={this.onSelect} theme="dark">
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
export default connect(
  state=>({
    user: state.user
  }),{
    setHeaderTitle,
  }
)(withRouter(LeftNav))