import React,{ Component } from "react";
import {Card,Icon,List} from 'antd';
import LinkButton from "../../components/link-button";
import memoryUtils from '../../utils/memoryUtils';
import {reqCategory,reqProduct} from '../../api';
import {Redirect} from 'react-router-dom';

const Item = List.Item;

export default class ProductDetail extends Component{

    state = {
      categoryName:'',
      product: memoryUtils.product,
      status:0
    }

    getCategory = async (categoryId) => {
      const result = await reqCategory(categoryId);
      if (result.code === 0) {
        const categoryName = result.item.name;
        this.setState({ categoryName });
      }
    }
  
    async componentDidMount () {
      let product = this.state.product;
      if (product.id) { // 如果商品有数据, 获取对应的分类
        this.getCategory(product.category);
      } else { // 如果当前product状态没有数据, 根据id参数中请求获取商品并更新
        const id = this.props.match.params.id;
        const result = await reqProduct(id);
        if (result.code === 0) {
          product = result.item;
          this.setState({
            product
          })
          this.getCategory(product.id); // 获取对应的分类
        }
      }
    }

    render(){

      const {categoryName} = this.state;

      const product = this.state.product;

      if(!product || !product.id){
        return <Redirect to="/product"/>
      }

      let status = product?product.status:this.state.status;

      const  statustext = status===0?'在售':'已下架';

      const title = (
              <span>
                <LinkButton>
                  <Icon type="arrow-left" onClick={() => this.props.history.goBack()}></Icon>  
                </LinkButton>
                <span>商品详情</span>
              </span>
      );


      return(
       <Card title={title} className="detail">
        <List>
          <Item>
            <span className="detail-left">商品名称:</span>&nbsp;&nbsp;
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className="detail-left">商品编码:</span>&nbsp;&nbsp;
            <span>{product.cpno}</span>
          </Item>
          <Item>
            <span className="detail-left">商品描述:</span>&nbsp;&nbsp;
            <span>{product.description}</span>
          </Item>
          <Item>
            <span className="detail-left">商品价格:</span>&nbsp;&nbsp;
            <span>{product.price}元</span>
          </Item>
          <Item>
            <span className="detail-left">商品状态:</span>&nbsp;&nbsp;
            <span>{statustext}</span>
          </Item>
          <Item>
            <span className="detail-left">所属分类:</span>&nbsp;&nbsp;
            <span>{categoryName}</span>
          </Item>
          {/* <Item>
            <span className="detail-left">商品图片:</span>
            <span>
              {
                product.imgs && product.imgs.map(img => <img className="detail-img" key={img} src={BASE_IMG + img} alt="img" />)
              }
              
            </span>
          </Item> */}
          <Item>
            <span className="detail-left">商品详情:</span>
            <div dangerouslySetInnerHTML={{ __html: product.detail}}></div>
          </Item>
        </List>
       </Card>
      )
    }
}