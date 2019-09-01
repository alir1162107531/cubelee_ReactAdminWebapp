import React,{Component} from 'react';
import {Card,Button,Icon,Table} from 'antd';
import LinkButton from '../../components/link-button'

// import './home.less';

const columns = [
  {
    title: '分类名称',
    dataIndex: 'name',
    render: text => <a href="javascript:;">{text}</a>
  },{
    title: '操作',
    dataIndex: 'money',
    width:300,
    render: () =><LinkButton>修改分类</LinkButton>
  }
];

const data = [
  {
    key:'1',
    name:'1',
    money:'￥1',
    address:'New York1'
  }, {
    key:'2',
    name:'2',
    money:'￥2',
    address:'New York2'
  }, {
    key:'3',
    name:'3',
    money:'￥3',
    address:'New York3'
  },
];

export default class Category extends Component{
    render(){

        const extra = (
          <Button type="primary">
            <Icon type="plus" />
            添加
          </Button>
        );

        return (
            <div className="category">
                <Card extra={extra}>
                 <Table 
                    rowKey = 'key'
                    bordered = {true}
                    columns = {columns}
                    dataSource = {data}
                    pagination = {{defaultPageSize:2,showQuickJumper:true}}
                 />
                </Card>
            </div>
        )
    }
}