// 导入express模块
const express=require('express')
// 导入验证数据合法性的中间件
const expressJoi=require('@escook/express-joi')
// 导入需要验证合法性的对象
const {update_userinfo_schema,update_password_scheam,update_Avatar_schema} =require('../schema/user')
// 导入个人信息处理函数
const userinfoHandler=require('../router-handler/userinfo')
// 创建对象
const router=express.Router()
// 获取用户的基本信息
router.get('/userinfo',userinfoHandler.userinfo_getuser_handler)
// 更新用户基本信息
router.post('/userinfo',expressJoi(update_userinfo_schema),userinfoHandler.userinfo_updateuser_handler)

// 重置密码路由
router.post('/updatepwd',expressJoi(update_password_scheam),userinfoHandler.userinfo_updatePassword_handler)

//更新用户头像
router.post('/update/avatar',expressJoi(update_Avatar_schema),userinfoHandler.userinfo_updateAvatar_handler)
// 向外共享路由对象
module.exports=router