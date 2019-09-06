import React,{Component} from 'react';
import {Card,Select,Input,Button,Icon,Table,Modal,message} from 'antd';
import LinkButton from '../../components/link-button';
import {reqAddProduct,reqProducts} from '../../api';
import AddUpdateForm from './add-update-form';


const Option = Select.Option;
// import './home.less';

export default class Product extends Component{

    state = {
      loading:false,
      products:[],
      showStatus:0,//0:不显示，1:显示添加，2：显示修改
      curCount:0,
      pageNum:1,  //起始页码
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
          dataIndex: 'status',
          render: (status)=>{
            let btnText ='下架';
            let text = '在售';
            if(status === 1){
              btnText = '上架';
              text = '已下架';
            }
            return (
              <span>
                <button>{btnText}</button><br/>
                <span>{text}</span>
              </span>
            )
          }
        },{
          title: '操作',
          width:300,
          render: (product) =>(
            <span>
              <LinkButton onClick={()=>{
                this.product = product;
                this.setState({showStatus:2});
              }}>修改
              </LinkButton>
              <LinkButton onClick={()=>{
                this.product = product;
                // this.delproduct();
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

    handleOk = async () =>{
      // 进行表单验证
      this.form.validateFields(async (err, values) => {
        if (!err) {
          // 验证通过后, 得到输入数据
          const {productNo,productName,productPrice,productDesc} = values;
          const {showStatus} = this.state;
          let result = null;
          if (showStatus === 1) { // 添加
            // 发添加分类的请求
            result = await reqAddProduct({productNo,productName,productPrice,productDesc});
          } else { // 修改
            // const productId = this.product.id;
            // result = await reqUpdateProduct({ productId,productNo,productName,productDesc });
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
            this.getProducts(num);
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

        const product = this.product || {};

        const title = (
          <span>
            <Select style={{ width: 200}} 
                    value={searchKey} 
                    onChange={(value)=>this.setState({searchKey:value})}>
              <Option value = "cpno">按编码搜索</Option>
              <Option value = "name">按名称搜索</Option>
            </Select>
            <Input style={{
                            width:200,
                            margin:'0 10px'
                          }} 
                    placeholder="请输入" 
                    value={searchValue}
                    onChange={(event)=>{this.setState({searchValue:event.target.value})}}
            />
            <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
          </span>
        );

        const extra = (
          <Button type="primary" onClick={()=>{
            this.product = null;
            this.setState({
              showStatus:1
            });
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
                      onChange:this.getProducts
                    }}/>
                <Modal
                    title = {showStatus===1?"添加商品":"修改商品"}
                    visible = {showStatus!==0}
                    onOk = {this.handleOk}
                    onCancel = {this.handleCancel}>
                    <AddUpdateForm setForm={form=>this.form = form} 
                    product={{
                      productName: product.name,
                      productNo: product.cpno,
                      productPrice: product.price,
                      productDesc: product.description
                    }}/>
                  </Modal>    
            </Card>
        )
    }
}