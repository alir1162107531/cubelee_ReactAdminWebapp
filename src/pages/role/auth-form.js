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
        <TreeNode
          title={item.title}
          key={item.key}
        >
          {item.children?this.getTreeNodes(item.children):null}
        </TreeNode>
      )
      return pre
    },[])
  }


  handleCheck = (checkedKeys)=>{
    this.setState({checkedKeys})
  }


  componentWillMount(){
    this.treeNodes = this.getTreeNodes(menuList)
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
        <Item lable="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>

        <Tree 
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.handleCheck}
        >
          <TreeNode
            title="系统权限" 
            key="all"
          >
            {this.TreeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}