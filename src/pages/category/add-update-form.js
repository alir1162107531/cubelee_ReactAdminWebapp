import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
} from 'antd'

const Item = Form.Item

/* 
添加/修改分类的Form组件
*/
class AddUpdateForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    category: PropTypes.object,
  }

  componentWillMount () {
    this.props.setForm(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { categoryNo,categoryName} = this.props.category;
    // const { categoryName } = this.props;

    
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
        <Item label="分类编号">
          {
            getFieldDecorator('categoryNo', {
              initialValue: categoryNo || '',
              rules: [
                {required: true, message: '分类编号必须输入'}
              ]
            })(
              <Input type="text" placeholder="请输入分类编号" />
            )
          }
        </Item>
        <Item label="分类名称">
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName || '',
              rules: [
                {required: true, message: '分类名称必须输入'}
              ]
            })(
              <Input type="text" placeholder="请输入分类名称" />
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUpdateForm)
