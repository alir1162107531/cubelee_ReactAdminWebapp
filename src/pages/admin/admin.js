/**
 * Created by Administrator on 2019/8/26.
 */
import React,{Component} from 'react';
import {Redirect} from 'react-router-dom';
import storageutils from '../../utils/storageutils';

export default class Admin extends Component{
    render(){
        let user = null;
        // let kitem = localStorage.getItem('user_key');
        // let res = JSON.parse(kitem);
        let res = storageutils.getUser();
        console.log(res);
        if(res && res.data !== undefined){
           user = res.data;
        }else{
          user = JSON.parse('{}');
          return <Redirect to="/login" />
        }
        console.log(user);
        return (
            <div>hello,{user.username}</div>
        )
    }
}