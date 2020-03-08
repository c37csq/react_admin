/**
 * 包含应用中请求函数的模块
 */
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'

const BASE = ''

//登录接口
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

//获取分类列表
export const reqCategorys = (parentId) => ajax (BASE + '/manage/category/list', { parentId })

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax (BASE + '/manage/category/add', { categoryName, parentId }, 'POST')

//更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax (BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

//获取所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

//更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')


//搜索商品分页列表(根据商品名称)
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName
})

//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info?categoryId=', {categoryId})

//更新商品状态
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

//删除指定名称图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

//添加/修改商品
export const reqAddUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

//获取用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

//删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//jsonp请求天气的函数
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    let url = 'http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === 'success') {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else {
        message.error('获取天气信息失败')
      }
    })
  })
}
