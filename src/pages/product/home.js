import React, { Component } from 'react';
import { Card, Select, Input, Icon, Button, Table, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
const Option = Select.Option
/**
 * product默认子路由组件
 */
class ProductHome extends Component {
  state = {
    products: [], //商品数组
    total: 0, //商品总数量
    loading: false,
    searchName: '', //搜索关键字
    searchType: 'productName', //默认根据商品名称搜索
  }
  /**
   * 初始化列的数组
   */
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const { status, _id } = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, newStatus)}>
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      }
    ];
  }
  //获取指定页码列表数据
  getProducts = async (pageNum) => {
    this.pageNum = pageNum  //保存pageNum
    this.setState({ loading: true })
    const { searchName, searchType } = this.state
    let result
    if (searchName) {
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({ loading: false })
    if (result.status === 0) {
      const { total, list } = result.data
      this.setState({
        total,
        products: list
      })
    }
  }
  //更新商品状态
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }
  render() {
    const { products, total, loading, searchType, searchName } = this.state

    const title = (
      <span>
        <Select
          onChange={value => this.setState({ searchType: value })} value={searchType} style={{ width: '120px' }}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 180, margin: '0 15px' }}
          value={searchName}
          onChange={e => this.setState({ searchName: e.target.value })} />
        <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type="plus" />
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          loading={loading}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getProducts,
            current: this.pageNum
          }}
          bordered
          dataSource={products}
          columns={this.columns} />
      </Card>
    );
  }
}

export default ProductHome;