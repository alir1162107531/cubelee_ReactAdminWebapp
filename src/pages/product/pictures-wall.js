import React from 'react';
import { Upload, Icon, Modal ,message} from 'antd';

import {reqDeleteImg} from '../../api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
 
export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [
    ],
  };

  componentWillMount(){
    // const imgs = this.props.imgs;
    // if(imgs && imgs.length > 0){
    //   const fileList = imgs.maps((img,index)=>{
         
    //   })
    // }
  }


  getImgs = ()=>this.state.fileList.map(file=>file.name);
  

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange =async ({file, fileList }) => {
    let status = file.status;
    if(status === 'done'){
      file = fileList[fileList.length - 1];
      const {name,url} = file.response.data;
      file.name = name;
      file.url = url;
    }else if(status === 'removed'){
      const result = await reqDeleteImg(file.name);
      if(result.code === 0){
        message.success(result.msg);
      }else{
        message.success(result.msg);
      }
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          name= "image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
