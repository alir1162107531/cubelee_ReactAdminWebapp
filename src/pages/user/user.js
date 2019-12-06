import React,{Component} from 'react';
import { Button, Card, Table, Modal ,message, Icon} from 'antd';
import LinkButton from "../../components/link-button/index"
import {formateDate} from "../../utils/dateUtils"
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";
import UserForm from './user-form'

// import './home.less';

export default class User extends Component{

    state = {
      loading:false,
      users: [],
      roles: [],
      isShow: false,
      curCount:0,
      pageNum:parseInt(window.location.hash.slice(1),0)||1,  //起始页码
      pageSize:3, //每页条数
      total: 0,
    }

    initColumns = () => {
      this.columns = [
        {
          title: '用户编码',
          dataIndex: 'userno'
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
  
        {
          title: '电话',
          dataIndex: 'phone'
        },
        {
          title: '注册时间',
          dataIndex: 'create_time',
          render: formateDate
        },
        {
          title: '所属角色',
          dataIndex: 'roleid',
          render: roleid => this.roleNames[roleid]
        },
        {
          title: '操作',
          render: (user) => (
            <span>
              <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
            </span>
          )
        },
      ]
    }

    showAdd = () => {
      this.user = null // 去除前面保存的user
      this.setState({isShow: true})
    }

    showUpdate = (user) => {
      this.user = user // 保存user
      this.setState({
        isShow: true
      })
    }

    addOrUpdateUser = async () => {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          // 如果this有user
          let action = 'add';
          if (this.user) {
            values.id = this.user.id
            action = this.user.id?'update':'add'
          }else{
            action = 'add'
          }

          let actname = action==='update'?'更新':'添加'

          const result = await reqAddOrUpdateUser(values)

          this.setState({isShow: false})

          this.form.resetFields();          

          if (result.code===0) {
            message.success(actname + '成功!')
            if(action === 'add'){
              let num = this.state.pageNum;
              if(this.state.curCount === this.state.pageSize){
                num = num+1;
              }
              this.pageNum = num;
            }
            this.getUsers(this.pageNum)
          } else {
            message.error(result.msg)
          }
        }else{
          message.error('请检查必填项！')
        }
      })
    }

    deleteUser = (user) => {
      Modal.confirm({
        title: `确认删除${user.username}吗?`,
        onOk: async () => {
          const result = await reqDeleteUser(user.id)
          if (result.code === 0) {
            message.success('删除用户成功!')
            let num = this.state.pageNum;
            if(this.state.curCount === 1){
              num = num-1;
            }
            this.pageNum = num>1?num:1;
            this.getUsers(this.pageNum)
          } else {
            message.error(result.msg)
          }
        }
      })
    }

    getUsers = async (pageNum) => {
      this.pageNum = pageNum
      const {pageSize} = this.state
      this.setState({
        loading:true
      })
      const result = await reqUsers({pageNum,pageSize})
      this.setState({
        loading:false
      })
      if (result.code===0) {
          const {items}  = result;
          const {total} = result.pager;
        // 生成一个对象容器(属性名: 角色的ID值, 属性值是角色的名称)
        const roles = JSON.parse(localStorage.getItem('roles'))
        if(roles && roles.length >0)
          this.roleNames = roles.reduce((pre, role) => {
            pre[role.id] = role.name
            return pre
          }, {})

          this.setState({
            users: items,
            roles,
            pageNum,
            curCount: items.length,
            total
            },()=>{
               window.location.hash = `#${pageNum}`
          });
      }
    }

    componentWillMount(){
      this.initColumns()
    }

    componentDidMount(){
      this.pageNum = this.pageNum?this.pageNum:1;
      if(this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.action === 'add'){
        if(this.state.curCount === this.state.pageSize){
          this.pageNum = this.pageNum +1;
        }
      }
      this.getUsers(this.pageNum);
      // this.getUsers(1)
    }

    render(){

      const {users,roles,isShow,total,pageSize,pageNum} = this.state

      const user = this.user||{}

      this.pageNum = pageNum

      const title = <Button type="primary" onClick={
        this.showAdd
      }>
        <Icon type="plus"/>
        创建用户</Button>

      return (
          <Card title={title}>
            <Table
              bordered
              rowKey='id'
              dataSource={users}
              columns={this.columns}
              pagination={{                  
                total,
                defaultPageSize:pageSize,
                showQuickJumper:true,
                onChange:this.getUsers,
                current: this.pageNum
              }}
            />
            <Modal 
              title={user.id?'修改用户':'添加用户'}
              visible={isShow}
              onOk={this.addOrUpdateUser}
              onCancel={
                ()=>{
                  this.form.resetFields()
                  this.setState({
                    isShow:false
                  })
                }
              }
            >
              <UserForm
                setForm={form=>this.form = form}
                roles = {roles}
                user = {user}
              />
            </Modal>
          </Card>
      )
    }
}