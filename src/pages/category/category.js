import React,{Component} from 'react';
import {Card,Button,Icon,Table} from 'antd';

// import './home.less';

export default class Category extends Component{
    render(){

        const extra = (
          <Button>
            <Icon type="plus" />
            添加
          </Button>
        );

        return (
            <div className="category">
                <Card extra={<a href="#">More</a>}>
                  <p>Card Content</p>
                  <p>Card Content</p>
                  <p>Card Content</p>
                </Card>
            </div>
        )
    }
}