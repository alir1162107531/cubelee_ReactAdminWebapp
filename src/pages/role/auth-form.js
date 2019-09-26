import React,{PureComponent} from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'
import menuList from '../../config/menuConfig'


const {TreeNode} = Tree;
const Item = Form.Item
export default class AuthFrom extends PureComponent{
  static propTypes = {
    role: PropTypes.object
  }

  state = {
    checkedKeys: []
  }

  getMenus = ()=> this.state.checkedKeys
  
  getTreeNodes = (menuList)=>{
    return menuList.reduce((pre,item)=>{
      pre.push(
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {item.children?this.getTreeNodes(item.children):null}
        </TreeNode>
      )
      return pre
    },[])
  }


  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  handleCheck = (checkedKeys)=>{
    this.setState({checkedKeys})
  }


  componentWillMount(){
    this.treeNodes = this.renderTreeNodes(menuList)
    const menus = this.props.role.menus
    this.setState({checkedKeys:menus})
  }

  componentWillReceiveProps(nextProps){
    const menus = nextProps.role.menus
    this.setState({checkedKeys:menus})
  }

  render(){
    const {role} = this.props
    const {checkedKeys} = this.state
    const formItemLayout= {
      labelCol: {span: 4},
      wrapperCol: {span: 15}
    }
    return(
      <div>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>

        <Tree 
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.handleCheck}
        >
          <TreeNode title="系统权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}