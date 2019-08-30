import React from 'react';
import './index.less';
/**
 * 自定义看似连接实是button组件
 * 1.{...props} 将接收的所有属性传递给字标签
 * 2.传过来标签的children:1.string 2.标签obj 3.标签array
 */

export default function LinkButton(props){
  return <button className="link-button" {...props} />
}