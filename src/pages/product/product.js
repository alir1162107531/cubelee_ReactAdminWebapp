import React,{Component} from 'react';
import {Card,Select,Input,Button,Icon,Table} from 'antd';
import LinkButton from '../../components/link-button';
import {reqProducts} from '../../api';


const Option = Select.Option;
// import './home.less';

export default class Product extends Component{

    state = {
      loading:false,
      products:[],
      total: 0,
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
                // this.delCategory();
              }}>删除
              </LinkButton>
            </span>
          )
        }
      ];
    }


    getProducts = async (pageNum)=>{
      const result = await reqProducts(pageNum,2);
      if(result.code === 0){
        const {total,items}  = result;
        this.setState({
          products: items,
          total
        });
      }
    }

    componentWillMount(){
      this.initColumns();
    }

    componentDidMount(){
      this.getProducts(1);
    }

    render(){
        const {loading,products,total} = this.state;
        const title = (
          <span>
            <Select style={{width:200}} value="1">
              <Option value="1">按编码搜索</Option>
              <Option value="2">按名称搜索</Option>
            </Select>
            <Input style={{width:200,margin:'0 10px'}} placeholder="请输入"/>
            <Button type="primary">搜索</Button>
          </span>
        );

        const extra = (
          <Button type="primary">
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
                      defaultPageSize:2,
                      showQuickJumper:true,
                      onChange:this.getProducts
                    }}/>
                </Card>
        )
    }
}