//导入路由模块
const express=require('express')
// 创建路由实例
const router=express.Router()
//导入express-joi中间件,这个中间件用来实现表单数据的自动验证
const expressJoi=require('@escook/express-joi')
// 导入验证规则表单数据中间件
const {reg_login_schema}=require('../schema/user')
// 在实例上挂载路由接口
// ----登录与注册接口-----------------------
// 注册
const userHandler=require('../router-handler/user')
/**
 * 在处理函数生效之前，先对表单数据进行规则效验
 * 效验不通过，交由全局中间件扭转抛出错误
 */
router.post('/reg',expressJoi(reg_login_schema),userHandler.regUser)
// 登录
router.post('/login',expressJoi(reg_login_schema),userHandler.loginUser)
// 导出路由
module.exports=router