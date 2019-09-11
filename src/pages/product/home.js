import React, { Component } from 'react'
import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message,
  Modal
} from 'antd'
import throttle from 'lodash.throttle';
import LinkButton from '../../components/link-button';
import {reqAddProduct,reqProducts,reqUpdateProduct,reqDelProduct} from '../../api';
import memoryUtils from '../../utils/memoryUtils';


const Option = Select.Option;

export default class ProductHome extends Component{
  state = {
    loading:false,
    products:[],
    showStatus:0,//0:不显示，1:显示添加，2：显示修改
    curCount:0,
    pageNum:parseInt(window.location.hash.slice(1),0)||1,  //起始页码
    pageSize:3, //每页条数
    total: 0,
    searchKey:'name',
    searchValue:'',
  }

  initColumns = () =>{
    this.columns = [
      {
        title:'商品名称',
        dataIndex: 'name'
      },{
        title:'商品编码',
        dataIndex: 'cpno'
      },{
        title:'商品价格',
        dataIndex: 'price',
        render:(price)=>'￥'+ price
      },{
        title:'描述',
        dataIndex: 'description'
      },{
        title:'状态',
        width:100,
        // dataIndex: 'status',
        render: ({id,status})=>{
          let btnText ='下架';
          let text = '在售';
          if(status === 1){
            btnText = '上架';
            text = '已下架';
          }
          return (
            <span>
              <span>{text}</span><br/>
              <button onClick={()=>{
                this.updateStatus(id,status);
              }}>{btnText}</button>
            </span>
          )
        }
      },{
        title:'类型',
        dataIndex: 'category'
      },{
        title: '操作',
        width:100,
        render: (product) =>(
          <span>
            <LinkButton onClick={()=>{
              memoryUtils.product = product;
              this.props.history.push('/product/detail/'+ product.id);
            }}>详情</LinkButton>
            <LinkButton onClick={()=>{
              memoryUtils.product = product;
              this.props.history.push('/product/addupdate');
            }}>修改
            </LinkButton>
            <LinkButton onClick={()=>{
              memoryUtils.product = product;
              this.delProduct();
            }}>删除
            </LinkButton>
          </span>
        )
      }
    ];
  }


  getProducts1 = async (pageNum)=>{
    const {pageSize} = this.state;
    const result = await reqProducts(pageNum,pageSize);
    if(result.code === 0){
      const {items}  = result;
      const {total} = result.pager;
      this.setState({
        products: items,
        pageNum,
        curCount: items.length,
        total
      },()=>{
        window.location.hash = `#${pageNum}`
      });
    }
  }

  getProducts = async (pageNum)=>{
    this.pageNum = pageNum;
    const {pageSize,searchKey,searchValue} = this.state;
    const conditions = [{key:searchKey,value:searchValue?searchValue:""}];
    const result = await reqProducts({pageNum,pageSize,conditions});
    if(result.code === 0){
      const {items}  = result;
      const {total} = result.pager;
      this.setState({
        products: items,
        pageNum,
        curCount: items.length,
        total
      },()=>{
        window.location.hash = `#${pageNum}`
      });
    }
  }

  delProduct = ()=>{
    Modal.confirm({
      title: '确认删除该商品吗？',
      onOk: async ()=>{
        const productId = memoryUtils.product.id;
        const result =await reqDelProduct({productId});
        if(result.code ===0){
          this.getProducts(this.pageNum);
          message.success(result.msg);
        }else{
          message.error('删除失败！');
        }
      },
      onCancel:()=>{
       console.log('取消');
      }
    })
  }

  updateStatus = throttle(async (productId,productStatus)=>{
      productStatus = productStatus===0?1:0;
      let product = {id:productId,status:productStatus};
      const result = await reqUpdateProduct(product);
      if(result.code === 0){
        message.success(result.msg);
        this.getProducts(this.pageNum);
      }else{
        message.error(result.msg);
      }
  },2000)

  handleOk = async () =>{
    // 进行表单验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 验证通过后, 得到输入数据
        const {productNo,productName,productPrice,productStatus,productDesc,productCateg} = values;
        const {showStatus} = this.state;
        let result = null;
        if (showStatus === 1) { // 添加
          // 发添加商品的请求
          result = await reqAddProduct({productNo,productName,productPrice,productDesc});
        } else { // 修改
          const productId = this.product.id;
          result = await reqUpdateProduct({productId,productNo,productName,productPrice,productStatus,productDesc,productCateg});
        }

        this.form.resetFields(); // 重置输入数据(变成了初始值)
        this.setState({ showStatus: 0 });

        const action = showStatus === 1 ? '添加' : '修改';
        // 根据响应结果, 做不同处理
        if (result.code === 0) {
          // 重新获取分类列表显示
          let num = this.state.pageNum;
          if(this.state.curCount === this.state.pageSize){
            num = num+1;
          }
          this.pageNum = num;
          this.getProducts(this.pageNum);
          message.success(action + '成功!');
        } else {
          message.error(action + '失败!');
        }
      }
    })
  }

  handleCancel = ()=>{
    this.form.resetFields();
    this.setState({
      showStatus: 0
    });
  }

  componentWillMount(){
    this.initColumns();
  }

  componentDidMount(){
    this.getProducts(1);
  }

  render(){
      const {loading,products,total,showStatus,searchKey,searchValue} = this.state;

      const title = (
        <span>
          <Select style={{ width: 200}} 
                  value={searchKey} 
                  onChange={(value)=>this.setState({searchKey:value})}>
            <Option value = "cpno">按编码搜索</Option>
            <Option value = "name">按名称搜索</Option>
          </Select>
          <Input 
              style={{width:200,margin:'0 10px'}} 
              placeholder="请输入" 
              value={searchValue}
              onChange={(event)=>{this.setState({searchValue:event.target.value})}}
          />
          <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
        </span>
      );

      const extra = (
        <Button type="primary" onClick={()=>{
          memoryUtils.product = {};
          this.props.history.push('/product/addupdate');
        }}>
          <Icon type="plus" />
          添加商品
        </Button>
      );

      return (
          <Card title={title} extra={extra}>
             <Table 
                  rowKey = 'id'
                  loading = {loading}
                  bordered = {true}
                  columns = {this.columns}
                  dataSource = {products}
                  pagination = {{
                    total,
                    defaultPageSize:3,
                    showQuickJumper:true,
                    onChange:this.getProducts,
                    current: this.pageNum
                  }}/>
          </Card>
      )
  }
}