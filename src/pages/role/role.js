import React,{Component} from 'react'
import { Button,Card, Table, Modal,message } from 'antd'
import { PAGE_SIZE } from '../../utils/constant'
import LinkButton from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils'
import {formateNormalDate} from '../../utils/dateUtils'
import { reqAddRole, reqUpdateRole, reqRoles } from '../../api'

import AddForm from './add-form';
import AuthForm from './auth-form';

// import './home.less';

export default class Role extends Component{
    
    state = {
      roles: [],
      isShowAdd: false,
      isShowAuth: false
    }

    constructor(props){
      super(props)
      this.authRef = React.createRef()
    }

    initColumn = () => {
      this.columns = [
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          render: formateNormalDate
        },
        {
          title: '授权时间',
          dataIndex: 'auth_time',
          render: formateNormalDate
        },
        {
          title: '授权人',
          dataIndex: 'auth_name'
        },
        {
          title: '操作',
          render: (role) => <LinkButton onClick={() => this.showAuth(role)}>设置权限</LinkButton> 
        },
      ]
    }

      /* 
  显示权限设置界面
  */
  showAuth = (role) => {
    // 将当前需要设置的角色保存到组件对象上
    this.role = role
    this.setState({
      isShowAuth: true
    })
  }

  /* 
  异步获取角色列表显示
  */
  getRoles = async () => {
    const result = await reqRoles()
    if (result.code === 0) {
      const roles = result.items
      this.setState({
        roles
      })
    }
  }

  /*
  添加角色
   */
  addRole = () => {
    // 进行表单验证, 只能通过了才向下处理
    this.form.validateFields(async (error, values) => {
      if (!error) {
        // 隐藏确认框
        this.setState({
          isShowAdd: false
        })

        const result = await reqAddRole(values.roleName)
        if (result.status===0) {
          message.success('添加角色成功')
          const role = result.data
          this.setState(state => ({
            roles: [...state.roles, role]
          }))
          // this.getRoles()
        } else {
          message.error(result.msg)
        }
      }
    })
  }

  /*
  给角色授权
   */
  updateRole = async () => {
    // 隐藏确认框
    this.setState({
      isShowAuth: false
    })

    const {role} = this
    // 更新role对象相关属性
    role.menus = this.authRef.current.getMenus()
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    // 请求更新角色
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      message.success('角色授权成功')
      this.getRoles()
    } else {
      message.error(result.msg)
    }
  }

  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

    render(){

        const {roles,isShowAdd,isShowAuth} = this.state

        const role = this.role || {}

        const title = (
          <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>
            创建角色
          </Button>
        )

        return (
            // <div className="role">
            //     Role
            // </div>
            <Card title={title}>
              <Table
                bordered
                rowKey= 'id'
                dataSource= {roles}
                columns= {this.columns}
                pagination= {{defaultPageSize:PAGE_SIZE}}
              >
              <Modal
                title= '添加角色'
                visible= {isShowAdd}
                onOk= {this.addRole}
                onCancel={()=>{
                  this.setState({
                    isShowAdd:false
                  })
                  this.form.resetFields()
                }}
              >
                <AddForm setForm={(form)=>this.form = form}/>
              </Modal>

              <Modal
                title='设置角色权限'
                visible={isShowAuth}
                onOk={this.updateRole}
                onCancel={()=>{
                  this.setState({
                    isShowAuth:false
                  })
                }}
              >
                <AuthForm ref={this.authRef} role={role}/>
              </Modal>

              </Table>
            </Card>
        )
    }
}