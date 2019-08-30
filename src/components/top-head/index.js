import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import {Modal} from 'antd';
import menuList from '../../config/menuConfig';
import {formateDate} from '../../utils/dateUtils';
import {reqWeather} from '../../api';
import LinkButton from '../../components/link-button';

import './index.less';

class TopHead extends Component{

    state = {
      currentTime: formateDate(Date.now()),
      dayPictureUrl: '',
      weather: '',
    }

    logout = ()=>{
       Modal.confirm({
         title: '确认退出吗？',
         onOk:()=>{
          storageUtils.removeUser();
          memoryUtils.user = {};
          this.props.history.replace('/login');
         },
         onCancel:()=>{
          console.log('取消');
         }
       })
    }

    getTitle = ()=>{
      let title = '';
      const path = this.props.location.pathname;
      menuList.forEach(it=>{
        if(it.key === path){
          title = it.title;
        }else if(it.children){
          let child =it.children.find(at=>at.key === path);
          if(child){
            title = child.title;
          }
        }
      })
      return title;
    }

    getWeather = async ()=>{
      const {dayPictureUrl,weather} = await reqWeather('杭州');
      // 更新
      this.setState({
        dayPictureUrl,
        weather
      })
    }

    componentDidMount(){
      this.intervalId = setInterval(() => {
        this.setState({
          currentTime: formateDate(Date.now())
        })
      }, 1000);
      //获取天气信息
      this.getWeather();
    }

    componentWillUnmount(){
      clearInterval(this.intervalId);
    }

    render(){
        let userinfo = memoryUtils.user;
        const title = this.getTitle();
        const {currentTime,dayPictureUrl,weather} = this.state;
        return (
            <div className="top-head">
                <div className="header-top">
                  欢迎，{userinfo.username} &nbsp;&nbsp;
                  {/* <a href="javascript:" onClick={this.logout}>退出</a> */}
                  <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                  <div className="header-bottom-left">{title}</div>
                  <div className="header-bottom-right">
                    <span>{currentTime}</span>
                    <img src={dayPictureUrl} alt="weather"/>
                    <span>{weather}</span>
                  </div>
                </div>
            </div>
        )
    }
}

export default withRouter(TopHead);