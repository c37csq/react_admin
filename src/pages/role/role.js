import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form';
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { formateDate } from '../../utils/dateUtils'
/**
 * 角色路由
 */
class Role extends Component {
  state = {
    roles: [], //所有角色列表
    role: {},  //选中的role
    isShowAdd: false,
    isShowAuth: false
  }
  constructor(props) {
    super(props)
    this.auth = React.createRef()
  }
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  }
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }
  onRow = (role) => {
    return {
      onClick: event => {
        this.setState({
          role
        })
      }
    }
  }
  addRole = () => {
    this.form.validateFields(async (error, values) => {
      if (!error) {
        this.setState({
          isShowAdd: false
        })
        const { roleName } = values
        this.form.resetFields()
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          message.success('添加角色成功')
          // this.getRoles()
          const role = result.data
          // const roles = this.state.roles
          // roles.push(role)
          // this.setState({
          //   roles
          // })


          //更新roles状态: 基于原本状态数据更新
          this.setState((state, props) => ({
            roles: [...state.roles, role]
          }))
        } else {
          message.error('添加角色失败')
        }
      }
    })
  }
  updateRole = async () => {
    this.setState({
      isShowAuth: false
    })
    const role = this.state.role
    //得到最新menu
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_name = memoryUtils.user.username
    role.auth_time = Date.now()
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      //如果当前更新的是自己角色权限，强制退出
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/login')
        message.success('当前用户角色修改了, 重新登录')
      } else {
        message.success('设置角色权限成功')
        // this.getRoles()
        this.setState({
          roles: [... this.state.roles]
        })
      }
    } else {
      message.error('设置角色权限失败')
    }
  }
  componentWillMount() {
    this.initColumn()
  }
  componentDidMount() {
    this.getRoles()
  }
  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state
    const title = (
      <span>
        <Button type="primary" onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button> &nbsp;&nbsp;
        <Button type="primary" onClick={() => this.setState({ isShowAuth: true })} disabled={!role._id}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          rowKey='_id'
          bordered
          columns={this.columns}
          dataSource={roles}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({
                role
              })
            }
          }}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          onRow={this.onRow} />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false })
            this.form.resetFields()
          }}
        >
          <AddForm
            setForm={(form) => { this.form = form }}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <AuthForm
            role={role}
            ref={this.auth}
          />
        </Modal>
      </Card>
    );
  }
}

export default Role;