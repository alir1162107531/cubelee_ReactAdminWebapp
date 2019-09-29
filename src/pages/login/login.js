/**
 * Created by Administrator on 2019/8/26.
 */
import React,{Component} from 'react';
import { Form, Icon, Input, Button } from 'antd';
import './login.less';
import logo from '../../assets/images/logo.jpg';
// import { reqLogin } from '../../api';
import {Redirect} from 'react-router-dom';
import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';
import {reqRoles } from '../../api';
import CubeUtilitys from '../../utils/CubeUtilitys';
import {login} from '../../redux/actions'
import {connect} from 'react-redux'



const Item = Form.Item;
/**
 * 用户名、密码合法性验证：
 * 1、必须输入
 * 2、必须大于等于4位
 * 3、必须小于等于12位
 * 4、用户名包含字母、数字或下划线
 */
class Login extends Component{

    render(){

        let res = this.props.user;

        if(res && res.id !== undefined){
          return <Redirect to="./home"/>
        }

        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login">
                <div className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>REACT-BETA-SYS</h1>
                </div>
                <div className="login-content">
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {   getFieldDecorator('userno',{
                                    initialValue:'',
                                    rules:[
                                        {required:true,whitespace:true,message:'用户名必填！'},
                                        {min:2,message:'长度大于等于2位！'},
                                        {max:12,message:'长度不得大于12位！'},
                                        {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名包含字母、数字或下划线！'},
                                    ]
                                })( <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />)
                            }
                        </Item>
                        <Item>
                            {   getFieldDecorator('password',{
                                    initialValue:'',
                                    rules:[{validator:this.validatePwd}]
                                })( <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />)
                            }
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </div>
            </div>
        )
    }

    getRoles = async (user)=>{
      const obj = {pageNum:1,pageSize:1000}
      const result = await reqRoles(obj);
      let rolemetas = [];
      if(result.code === 0){
        rolemetas = result.items;
        this.roles = rolemetas;
        this.commonHandle(user);
      }
      localStorage.setItem('roles',JSON.stringify(rolemetas));
    }

    commonHandle(user){
      let role =  null;
      let menus = [];
      if(this.roles.length > 0 ){
        role = this.roles.find(it=>it.id === user.roleid);
      }
      if(!CubeUtilitys.isNull(role) && !CubeUtilitys.isNull(role.menus)){
        menus = role.menus.split(',');
      }
      user['role'] = {roleid:user.roleid,menus:menus}
      storageUtils.saveUser(user);
      //保存到内存中
      memoryUtils.user = user;
    }

    /**react版本的登录处理 */
    // handleSubmit = e => {
    //     //阻止默认行为：提交
    //     e.preventDefault();
    //     this.props.form.validateFields(async (err, {userno,password})=>{
    //         if(!err){
    //           const result = await reqLogin(userno,password);
    //           if(result.status === 0){
    //             this.getRoles(result);
    //           }else{
    //             message.error(result.msg + '请检查用户名和密码！');
    //           }
    //         }else{
    //             message.error('验证失败！');
    //         }
    //     })
    // }

    /**redux版本登录处理 */
    handleSubmit = e => {
      //阻止默认行为：提交
      e.preventDefault();
      this.props.form.validateFields(async (err, {userno,password})=>{
          if(!err){
            this.props.login(userno,password)
          }
      })
  }

    validatePwd = (rule,value,callback)=>{
        value = value.trim();
        if(!value){
            callback('密码必填！');
        }else if(value.length < 2){
            callback('密码大于等于2！');
        }else if(value.length > 12){
            callback('密码小于等于12！');
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('用户名包含字母、数字或下划线！');
        }else {
            callback();
        }
    }
}

const WrapperForm = Form.create()(Login);

export default connect(
  state=>({
    user:state.user
  }),
  {
    login
  }
)(WrapperForm);