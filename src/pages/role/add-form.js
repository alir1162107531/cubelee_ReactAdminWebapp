import React,{ PureComponent } from "react"
import PropTypes from 'prop-types'
import { Form, Input } from "antd"

const Item = Form.Item
class AddForm extends PureComponent{
  static propTypes = {
    setForm: PropTypes.func.isRequired
  }

  render(){
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }

    return(
      <Form>
          <Item label='角色名称' {...formItemLayout}>
            {
              getFieldDecorator('roleName',{
                initialValue: '',
                rules: [
                  {required:true,message:'角色名称必填'}
                ]
              })(<Input type="text" placeholder="请输入角色名称"/>)
            }
          </Item>
      </Form>
    )
  }
}

export default AddForm = Form.create()(AddForm)