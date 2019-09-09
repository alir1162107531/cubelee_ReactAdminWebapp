import React,{Component} from 'react';
import echarts from 'echarts';
import 'echarts/map/js/china';
import mapJson from 'echarts/map/json/china.json';
import {geoCoordMap,alirl} from './geo';
import EchartsGl from 'echarts-gl/dist/echarts-gl.js'

import './home.less';

export default class Home extends Component{

    state = {
      loading: true,
    }

    convertData =(data)=>{
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    }

    initDatas =()=>{
      echarts.registerMap('china', mapJson); // 注册地图
      var mapChart = echarts.init(document.getElementById('map'));
      var option = {
        title: {
            text: '全国行政区划3D地图',
            x: 'center',
            top: "30",
            textStyle: {
                color: 'skyblue',
                fontSize: 24
            }
        },
        tooltip: {
            show: true,
            // formatter:(params)=>{
            //   let data = "测试1:"+params.name + "<br/>"+"值:"+ params.value[2]+"<br/>"+"地理坐标:[" + params.value[0]+","+params.value[1] +"]";
            //   return data;
            // },
        },
        // visualMap: [{
        //     type: 'continuous',
        //     seriesIndex: 0,
        //     text: ['bar3D'],
        //     calculable: true,
        //     max: 300,
        //     inRange: {
        //         color: ['#87aa66', '#eba438', '#d94d4c']
        //     }
        // }, {
        //     type: 'continuous',
        //     seriesIndex: 1,
        //     text: ['scatter3D'],
        //     left: 'right',
        //     max: 100,
        //     calculable: true,
        //     inRange: {
        //         color: ['#000', 'blue', 'purple']
        //     }
        // }],
        geo3D: {
            map: 'china',
            roam: true,
            itemStyle: {
                areaColor: 'rgb(5,101,123)',
                opacity: 1,
                borderWidth: 0.8,
                borderColor: 'rgb(62,215,213)',
            },
            label: {
                show: true,
                textStyle: {
                    color: '#fff', //地图初始化区域字体颜色
                    fontSize: 16,
                    opacity: 1,
                    backgroundColor: 'rgba(0,0,0,0)'
                    //backgroundColor: 'rgba(53,171,199,0)'
                },
            },
            emphasis: { //当鼠标放上去  地区区域是否显示名称
                label: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize: 16,
                        backgroundColor: 'rgba(0,23,11,0)'
                    }
                }
            },
            //shading: 'lambert',
            light: { //光照阴影
                main: {
                    color: 'rgb(0,21,41)', //光照颜色
                    intensity: 1.2, //光照强度
                    //shadowQuality: 'high', //阴影亮度
                    shadow: false, //是否显示阴影
                    alpha: 55,
                    beta: 10
    
                },
                ambient: {
                    intensity: 0.3
                }
            },
            realisticMaterial:{
                detailTexture:'asset/images/logo.jpg'
            }
        },
        series: [
            //画线
    
            {
                type: 'lines3D',
    
                coordinateSystem: 'geo3D',
    
                effect: {
                    show: true,
                    trailWidth: 4,
                    trailOpacity: 0.5,
                    trailLength: 0.3,
                    constantSpeed: 5
                },
    
                blendMode: 'lighter',
    
                lineStyle: {
                    width: 0.2,
                    opacity: 0.05
                },
                data: alirl
            }
        ]
      }
      mapChart.setOption(option);
    }

    componentDidMount(){
        this.initDatas();
    }

    render(){
        return (
              <div>
                  <div id="map"></div>
                  <span className="home-bg">
                      <img className="fa-spin12s" src="http://cdn.files.51wyq.cn/web/css/indexV4/base/images/map-rootbg.png?v=201909052200" alt="动态图" />
                  </span>
              </div>
        )
    }
}