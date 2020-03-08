import React, { Component } from 'react';
import { Form, Input, Button, Icon, message } from 'antd'

import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom';
/**
 * 登录路由组件
 */
class Login extends Component {

  //提交表单函数
  handleSubmit = (event) => {
    //阻止事件默认行为
    event.preventDefault()

    //对所有表单字段进行验证
    this.props.form.validateFields(async (err, values) => {

      //校验成功
      if (!err) {
        //请求登录
        const { username, password } = values
        const result = await reqLogin(username, password)

        //登录成功
        if (result.status === 0) {
          // 提示登录成功
          message.success('登陆成功')

          //保存user
          const user = result.data
          memoryUtils.user = user  //保存再内存中
          storageUtils.saveUser(user)  //保存再storage中

          //跳转后台管理界面 (不需要再回退回来)
          this.props.history.replace('/')
        } else {  //登录失败

          //提示错误信息
          message.error(result.msg)
        }
      } else {
      }
    })
  }

  //对密码进行自定义验证
  validatePwd = (rule, value, callback) => {

    //callback()  //验证通过
    //callback('xxxx') //验证失败，并提示文字
    if (!value) {
      callback('密码必须输入')
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.length > 12) {
      callback('密码长度最多12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() //验证通过
    }
  }


  render() {

    //如果已经登录
    const user = memoryUtils.user
    if (user && user._id) {
      return <Redirect to='/' />
    }
    //获取父组件传递的form对象
    const form = this.props.form
    const { getFieldDecorator } = form

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="" />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {
                getFieldDecorator('username', {
                  //声明式验证：直接使用别人定义好的验证规则进行验证
                  rules: [
                    { required: true, whitespace: true, message: '用户名必须输入' },
                    { min: 4, message: '用户名至少4位' },
                    { max: 12, message: '用户名最多12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [{
                    validator: this.validatePwd
                  }]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
/**
 * 1、高阶函数
     1). 特别的函数
         a. 接受函数类型的参数
         b. 返回值是函数
     2). 常见的高阶函数
         a. 定时器: setTimeout()/setInterval()
         b. Promise: Promise(() => {}) then(value => {}, reason => {})
         c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
         d. fn.bind()
     3). 高阶函数更加具有扩展性

 * 2、高阶组件
      1). 本质就是一个函数
      2). 接受一个组件，返回一个新的组件，包装组件会向被包装组件传入特定属性
      3). 作用：扩展组件的功能
 */

const WrapLogin = Form.create()(Login)
export default WrapLogin;

/**
 * 1、前台表单验证
 * 2、收集表单输入数据
 */