import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menu.config.js'
import './index.less'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu;
/**
 * 左侧导航组件
 */
class Nav extends Component {

  /**
   * 根据数据生成标签数组
   */
  // getMenuNodes = (menuList) => {
  //   return menuList.map(item => {
  //     if (!item.children) {
  //       return (
  //         <Menu.Item key={item.key}>
  //           <Link to={item.key}>
  //             <Icon type={item.icon} />
  //             <span>{item.title}</span>
  //           </Link>
  //         </Menu.Item>
  //       )
  //     } else {
  //       return (
  //         <SubMenu
  //           key={item.key}
  //           title={
  //             <span>
  //               <Icon type={item.icon} />
  //               <span>{item.title}</span>
  //             </span>
  //           }>
  //           {this.getMenuNodes(item.children)}
  //         </SubMenu>
  //       )
  //     }
  //   })
  // }
  hasAuth = (item) => {
    const {key, isPublic} = item 
    const menus = memoryUtils.user.role.menus 
    const username = memoryUtils.user.username
    //1、admin
    //2、当前用户由此item权限就是看key有没有在menus中
    //3、如果当前item是公开的直接返回true
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) {
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      //如果当前用户由当前item对应的权限，才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        if (!item.children) {
          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {
          //查找有关与当前请求路径的子item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          if (cItem) {
            this.openKey = item.key
          }
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }>
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }

      return pre
    }, [])
  }
  //第一次render之前执行一次
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    //得到当前请求路径
    let path = this.props.location.pathname
    if (path.indexOf('/product') === 0) {  //当前请求时商品或子路由
      path = '/product'
    }
    const openKey = this.openKey
    return (
      <div to='/' className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>后台系统</h1>
        </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    );
  }
}

/**
 * withRouter高阶组件
 * 包装非路由组件, 返回新组件
 * 新组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(Nav);