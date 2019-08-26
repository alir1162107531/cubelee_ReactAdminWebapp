/**
 * Created by Administrator on 2019/8/26.
 */
import React,{Component} from 'react';
import { Form, Icon, Input, Button } from 'antd';
import './login.less';
import logo from '../../assets/images/logo.jpg';

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
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login">
                <div className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>REACT-BETA系统</h1>
                </div>
                <div className="login-content">
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {   getFieldDecorator('username',{
                                    initialValue:'',
                                    rules:[
                                        {required:true,whitespace:true,message:'用户名必填！'},
                                        {min:4,message:'长度大于等于4位！'},
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

    handleSubmit = e => {
        //阻止默认行为：提交
        e.preventDefault();
/*        const form =  this.props.form;
        const props = form.getFieldsValue();
        const username = form.getFieldValue('username');
        const password = form.getFieldValue('password');
        console.error(username,password);*/

        this.props.form.validateFields((err,{username,password})=>{
            if(!err){
                alert(`发送ajax请求，username=${username},password=${password}`);
            }else{
                alert(`验证失败！`);
            }
        })
    }

    validatePwd = (rule,value,callback)=>{
        value = value.trim();
        if(!value){
            callback('密码必填！');
        }else if(value.length <4){
            callback('密码大于等于4！');
        }else if(value.length >12){
            callback('密码小于等于12！');
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('用户名包含字母、数字或下划线！');
        }else {
            callback();
        }
    }
}

const WrapperForm = Form.create()(Login);

export default WrapperForm;