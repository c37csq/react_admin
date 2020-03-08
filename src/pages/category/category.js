import React, { Component } from 'react';
import { Card, Table, Icon, Button, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
/**
 * 商品分类路由
 */
class Category extends Component {
  state = {
    loading: false,
    categorys: [], //一级分类列表
    subCategorys: [],//二级分类
    parentId: '0',
    parentName: '',
    showStatus: 0, //标识是否更新或添加, 0:都不显示 1:显示添加, 2:显示更新
  }
  //初始化所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {
              this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null
            }
            {/* 向事件回调中传递参数 */}
          </span>
        )
      }
    ];
  }
  //获取列表数据
  getCategorys = async (parentId) => {
    this.setState({ loading: true })
    parentId = parentId || this.state.parentId
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      this.setState({ loading: false })
      const categorys = result.data
      if (parentId === '0') {
        this.setState({
          categorys
        })
      } else {
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }
  //显示二级分类
  showSubCategorys = (category) => {
    //异步更新的
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { //在状态更新且重新render后执行
      this.getCategorys()
    })
  }
  //显示一级分类列表
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
  //显示添加
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }
  //显示更新
  showUpdate = (category) => {
    //保存分类对象
    this.category = category
    this.setState({
      showStatus: 2
    })
  }
  //点击取消,隐藏弹框
  handleCancel = () => {
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }
  //添加分类
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          showStatus: 0
        })
        //收集数据
        const { parentId, categoryName } = values
        this.form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if (result.status === 0) {
          if (parentId === this.state.parentId) {
            //重新获取当前分类列表
            this.getCategorys()
          } else if (parentId === '0') { //在二级分类添加一级分类项，重新获取一级分类列表不需要显示
            this.getCategorys('0')
          }
        }
      }
    })
  }

  //更新分类
  updateCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //隐藏确认框
        this.setState({
          showStatus: 0
        })
        const categoryId = this.category._id
        const { categoryName } = values
        //清除输入数据
        this.form.resetFields()
        //发请求
        const result = await reqUpdateCategory({ categoryId, categoryName })
        if (result.status === 0) {
          //更新列表
          this.getCategorys()
        }
      }
    })
  }

  //为第一次render准备数据
  componentWillMount() {
    this.initColumns()
  }
  //发请求
  componentDidMount() {
    this.getCategorys()
  }
  render() {
    const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state
    const category = this.category || {}
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{ marginRight: '5px' }} />
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type='plus' />
        添加
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          loading={loading}
          bordered
          columns={this.columns}
          dataSource={parentId === '0' ? categorys : subCategorys}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }} />;
           <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => { this.form = form }} />
        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => this.form = form} />
        </Modal>
      </Card>
    );
  }
}

export default Category;