import React,{Component} from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';

import ProductHome from './home';
import ProductAddUpdate from './add-update';
import ProductDetail from './detail';
// import './home.less';
import './product.less';

export default class Product extends Component{

  render(){
    return(
      <Switch>
        <Route path="/product" exact component={ProductHome}></Route>
        <Route path="/product/addupdate" exact component={ProductAddUpdate}></Route>
        <Route path="/product/detail/:id" exact component={ProductDetail}></Route>
        <Redirect to="/product"/>
      </Switch>
    )
  }
    
}