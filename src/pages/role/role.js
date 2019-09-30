import React,{PureComponent} from 'react'
import { Button,Card, Table, Modal,message,Icon} from 'antd'
import LinkButton from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils'
import {formateNormalDate} from '../../utils/dateUtils'
import { reqAddRole, reqUpdateRole, reqRoles } from '../../api'

import AddForm from './add-form';
import AuthForm from './auth-form';

// import './home.less';

export default class Role extends PureComponent{
    
    state = {
      loading:false,
      roles: [],
      isShowAdd: false,
      isShowAuth: false,
      curCount:0,
      pageNum:parseInt(window.location.hash.slice(1),0)||1,  //起始页码
      pageSize:3, //每页条数
      total: 0,
    }

    constructor(props){
      super(props)
      this.authRef = React.createRef()
    }

    initColumn = () => {
      this.columns = [
        {title: '角色名称',dataIndex: 'name'},        
        {title: '授权人',dataIndex: 'auth_user'},
        {title: '描述',dataIndex: 'description'},
        {title: '创建时间',dataIndex: 'create_time',render: formateNormalDate},
        {title: '授权时间',dataIndex: 'auth_time',render: formateNormalDate},
        {title: '操作',
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
  getRoles = async (pageNum) => {
    this.pageNum = pageNum;
    const {pageSize} = this.state;
    this.setState({
      loading:true
    });
    const result = await reqRoles({pageNum,pageSize});
    this.setState({
      loading:false
    });
    // const result = await reqRoles()
    if (result.code === 0) {
      const {items}  = result;
      const {total} = result.pager;
      this.setState({
        roles: items,
        pageNum,
        curCount: items.length,
        total
      },()=>{
        window.location.hash = `#${pageNum}`
      });
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
        const result = await reqAddRole({name:values.roleName,description:values.roleDesc})
        if (result.code===0) {
          this.form.resetFields();
          message.success('添加角色成功')
          const role = result.item
          this.setState(state => ({
            roles: [...state.roles, role]
          }))
          let num = this.state.pageNum;
          if(this.state.curCount === this.state.pageSize){
            num = num+1;
          }
          this.pageNum = num;
          this.getRoles(this.pageNum)
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
    role.auth_time = formateNormalDate(Date.now())
    role.auth_user = memoryUtils.user.id
    // 请求更新角色
    const result = await reqUpdateRole(role)
    if (result.code === 0) {
      let roles = JSON.parse(localStorage.getItem('roles'));
      if(roles.length > 0 ){
        roles.find(it=>it.id === result.item.id).menus = result.item.menus;
      }
      localStorage.setItem('roles',JSON.stringify(roles));
      console.log(result.item);
      message.success('角色授权成功')
      this.getRoles(this.pageNum)
    } else {
      message.error(result.msg)
    }
  }

  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles(1)
  }

    render(){
        console.log('add role render()');
        const {loading,roles,isShowAdd,isShowAuth,total,pageSize} = this.state

        const role = this.role || {}

        if(role && role.menus && typeof(role.menus) === 'string'){
          role.menus = role.menus.split(',');
         }

        const title = (
          <Button type='primary' onClick={() =>{
            this.role = {};
            this.setState({ isShowAdd: true })
          } 
          }>
            <Icon type="plus" />
            创建角色
          </Button>
        )

        return (

            <Card title={title}>
              <Table
                rowKey= 'id'
                loading = {loading}
                bordered= {true}
                dataSource= {roles}
                columns= {this.columns}
                pagination = {{
                  total,
                  defaultPageSize:pageSize,
                  showQuickJumper:true,
                  onChange:this.getRoles,
                  current: this.pageNum
                }}/>
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
            </Card>
        )
    }
}