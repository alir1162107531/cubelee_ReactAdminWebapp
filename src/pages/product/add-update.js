import React,{ Component } from "react";
import {Card,Icon,Form,Input,Select,Button,message} from 'antd';
import {reqCategorys,reqUpdateProduct,reqAddUpdateProduct} from '../../api';
// import PicturesWall from './pictures-wall';
import memoryUtils from '../../utils/memoryUtils';
// import RichTextEditor from './rich-text-editor';
import LinkButton from '../../components/link-button'



const Item = Form.Item;
const Option = Select.Option;

class ProductAddUpdate extends Component{

  state = {
    categorys:[]
  }

  constructor(props){
    super(props);
    this.pwRef = React.createRef();
    this.editorRef = React.createRef();
  }

  getCategorys = async () => {
    const result = await reqCategorys();
    if (result.code === 0) {
      const categorys = result.items;
      this.setState({ 
        categorys 
      });
    }
  }

  validatePrice = (rule, value, callback) => {
    if (value==='') {
      callback()
    } else if (value * 1 <=0) {
      callback('价格必须大于0')
    } else {
      callback()
    }
 }

 handleSubmit = (event) => {
  // 阻止事件的默认行为(提交表单)
  event.preventDefault()
  // 进行统一的表单验证
  this.props.form.validateFields(async (err, values) => {
     if (!err) {
       const {name,cpno, description, price, category} = values
       console.log('发送请求', name, description, price, category)

       // 收集上传的图片文件名的数组
      //  const imgs = this.pwRef.current.getImgs()
      //  console.log('imgs', imgs)
      //  // 输入的商品详情的标签字符串
      //  const detail = this.editorRef.current.getDetail()
      //  console.log('detail', detail)

       // 封装product对象
      //  const product = {name, description, price, category, imgs, detail}
       const product = {name,cpno, description, price, category}
       if (this.isUpdate) {
         product.id = this.product.id
       }

       // 发请求添加或修改
       const result = await reqAddUpdateProduct(product)
       if (result.code === 0) {
         message.success(`${this.isUpdate ? '修改' : '添加'}商品成功`)
         this.props.history.replace('/product')
       } else {
         message.error(result.msg);
       }
     } 
   })
}
componentWillMount () {
  const product = this.props.location.state;
  this.product = product || {};
  this.isUpdate = !!this.product.id;
}

 componentDidMount() {
   this.getCategorys();
 }

 render() {
   const { categorys } = this.state;
   const {isUpdate, product} = this;

   const { getFieldDecorator } = this.props.form;
  
   const title = (
     <span>
       <LinkButton onClick={() => this.props.history.goBack()}>
         <Icon type="arrow-left" />
       </LinkButton>
       <span>{isUpdate ? '修改商品' : '添加商品'}</span>
     </span>
   )

   // 指定form中所有item的布局
   const formLayout = {
     labelCol: { span: 2 },
     wrapperCol: { span: 8 }
   }

   return (
     <Card title={title}>
       <Form {...formLayout} onSubmit={this.handleSubmit}>
         <Item label="商品名称">
           {getFieldDecorator('name', {
             initialValue: product.name,
             rules: [
               { required: true, message: '必须输入商品名称!' }
             ],
           })(<Input placeholder="商品名称"/>)}
         </Item>
         <Item label="商品编码">
           {getFieldDecorator('cpno', {
             initialValue: product.cpno,
             rules: [
               { required: true, message: '必须输入商品编码!' }
             ],
           })(<Input placeholder="商品编码"/>)}
         </Item>
         <Item label="商品描述">
           {getFieldDecorator('description', {
             initialValue: product.description,
             rules: [
               { required: true, message: '必须输入商品描述!' }
             ],
           })(<Input placeholder="商品描述"/>)}
         </Item>
         <Item label="商品价格">
           {getFieldDecorator('price', {
             initialValue: product.price,
             rules: [
               { required: true, message: '必须输入价格!' },
               { validator: this.validatePrice }
             ],
           })(<Input type="number" placeholder="商品价格" addonAfter="元"/>)}
         </Item>
         <Item label="商品分类">
           {getFieldDecorator('category', {
             initialValue: product.category || '',
             rules: [
               { required: true, message: '必须输入商品分类!' }
             ],
           })(
             <Select>
               <Option value=''>未选择</Option>
               {
                 categorys.map(c => <Option value={c.id} key={c.id}>{c.name}</Option>)
               }
             </Select>
           )}
         </Item>
         {/* <Item label="商品图片">
           <PicturesWall ref={this.pwRef} imgs={product.imgs}/>
         </Item> */}
         {/* <Item label="商品详情" wrapperCol={{ span: 20 }}>
           <RichTextEditor ref={this.editorRef} detail={product.detail}/>
         </Item> */}
         <Item>
           <Button type="primary" htmlType="submit">提交</Button>
         </Item>
      </Form>
     </Card>
   )
 }

 
}


export default Form.create()(ProductAddUpdate)