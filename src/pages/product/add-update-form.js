import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
} from 'antd'

const Item = Form.Item

/* 
添加/修改商品的Form组件
*/
class AddUpdateForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    product: PropTypes.object,
  }

  componentWillMount () {
    this.props.setForm(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { productNo,productName,productPrice,productDesc} = this.props.product;

    
    const formItemLayout = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 4}
        },
        wrapperCol: {
          xs: {span: 16},
          sm: {span: 8}
        }
    }

    return (
      <Form {...formItemLayout}>
        <Item label="商品编号">
          {
            getFieldDecorator('productNo', {
              initialValue: productNo || '',
              rules: [
                {required: true, message: '商品编号必须输入'}
              ]
            })(
              <Input type="text" placeholder="请输入商品编号" />
            )
          }
        </Item>
        <Item label="商品名称">
          {
            getFieldDecorator('productName', {
              initialValue: productName || '',
              rules: [
                {required: true, message: '商品名称必须输入'}
              ]
            })(
              <Input type="text" placeholder="请输入商品名称" />
            )
          }
        </Item>
        <Item label="商品价格">
          {
            getFieldDecorator('productPrice', {
              initialValue: productPrice || '',
              rules: [
                {required: true, message: '商品价格必须输入'}
              ]
            })(
              <Input type="text" placeholder="请输入商品价格" />
            )
          }
        </Item>
        <Item label="描述">
          {
            getFieldDecorator('productDesc', {
              initialValue:productDesc || ''
            })(
              <Input type="text" placeholder="请输入商品描述" />
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUpdateForm)
