/**
 * 入口js文件
 */
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

//读取local中保存user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

//将App组件标签渲染
ReactDOM.render(<App/>, document.getElementById('root'))