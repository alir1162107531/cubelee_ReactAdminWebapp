import React,{Component} from 'react';
import {Card,Button,Icon,Table, Modal, message} from 'antd';
import LinkButton from '../../components/link-button';
import {reqCategorys, reqAddCategory,reqUpdateCategory,reqDelCategory} from '../../api';
import AddUpdateForm from './add-update-form';

export default class Category extends Component{

    state = {
      categorys:[],
      loading: false,
      showStatus:0,//0:不显示，1:显示添加，2：显示修改
    }

    initColumns(){
      this.columns = [
        {
          title: '分类名称',
          dataIndex: 'name',
          render: text => <a href={"console.log(1)"}>{text}</a>
        },{
          title: '分类编码',
          dataIndex: 'cgno'
        },{
          title: '描述',
          dataIndex: 'description'
        },{
          title: '操作',
          width:300,
          render: (category) =>(
            <span>
              <LinkButton onClick={()=>{
                this.category = category;
                this.setState({showStatus:2});
              }}>修改分类
              </LinkButton>
              <LinkButton onClick={()=>{
                this.category = category;
                this.delCategory();
              }}>删除分类
              </LinkButton>
            </span>
          )
        }
      ];
    }

    getCategorys = async ()=>{
       this.setState({
          loading:true
       });
       const result = await reqCategorys();
       this.setState({
        loading:false
      });
       if(result.code === 0){
         const categorys = result.items;
         this.setState({
           categorys
         })
       }else{
         message.error('获取分类失败！');
       }
    }

    delCategory = ()=>{
      Modal.confirm({
        title: '确认删除该商品分类吗？',
        onOk: async ()=>{
          const categoryId = this.category.id;
          const result =await reqDelCategory({categoryId});
          if(result.code ===0){
            this.getCategorys();
            message.success(result.msg);
          }else{
            message.error('删除失败！');
          }
        },
        onCancel:()=>{
         console.log('取消');
        }
      })
    }

    handleOk = async () =>{
    // 进行表单验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 验证通过后, 得到输入数据
        const {categoryNo,categoryName,categoryDesc} = values;
        const {showStatus} = this.state;
        let result = null;
        if (showStatus === 1) { // 添加
          // 发添加分类的请求
          result = await reqAddCategory({categoryNo,categoryName,categoryDesc});
        } else { // 修改
          const categoryId = this.category.id;
          result = await reqUpdateCategory({ categoryId,categoryNo,categoryName,categoryDesc });
        }

        this.form.resetFields(); // 重置输入数据(变成了初始值)
        this.setState({ showStatus: 0 });

        const action = showStatus===1 ? '添加' : '修改';
        // 根据响应结果, 做不同处理
        if (result.code===0) {
          // 重新获取分类列表显示
          this.getCategorys();
          message.success(action + '成功!');
        } else {
          message.error(action + '失败!');
        }
      }
    })
    }

    handleCancel = ()=>{
      this.form.resetFields();
      this.setState({
        showStatus: 0
      });
    }

    componentWillMount(){
      this.initColumns();
    }

    componentDidMount(){
      this.getCategorys();
    }

    render(){

        const {categorys,loading,showStatus} = this.state;

        const category = this.category || {};

        const extra = (
          <Button type="primary" onClick={()=>{
            this.category = null;
            this.setState({showStatus:1})}}>
            <Icon type="plus" />
            添加
          </Button>
        );

        return (
            <div className="category">
                <Card extra={extra}>
                 <Table 
                    rowKey = 'id'
                    loading = {loading}
                    bordered = {true}
                    columns = {this.columns}
                    dataSource = {categorys}
                    pagination = {{
                      defaultPageSize:3,
                      showQuickJumper:true
                    }}/>
                  <Modal
                    title = {showStatus===1?"添加分类":"修改分类"}
                    visible = {showStatus!==0}
                    onOk = {this.handleOk}
                    onCancel = {this.handleCancel}>
                    <AddUpdateForm setForm={form=>this.form = form} 
                    category={{
                      categoryNo:category.cgno,
                      categoryName:category.name,
                      categoryDesc:category.description
                    }}/>
                  </Modal>
                </Card>
            </div>
        )
    }
}