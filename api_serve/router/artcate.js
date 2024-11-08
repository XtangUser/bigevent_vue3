// 导入express
const express=require('express')
// 创建路由对象
const router =express.Router()
// 导入验证数据规则中间件
const expressJoi=require('@escook/express-joi')
//导入文章分类的验证模块
const {add_cate_schema,delete_cate_schema,get_cateid_schema}=require('../schema/artcate')
// 导入函数入口
const article_Handler=require('../router-handler/arcate')
// 获取分类列表数据
router.get('/list',article_Handler.article_getlist_handler)
// 新增文章分类路由接口
router.post('/add',expressJoi(add_cate_schema),article_Handler.article_addlist_handler)
// 新增删除问文章分类的路由
router.delete('/del/:id',expressJoi(delete_cate_schema),article_Handler.article_deleteCateById_handler)
// 添加根据id编辑文章分类路由
router.post('/info',expressJoi(get_cateid_schema),article_Handler.article_getArtcateById_handler)















// 向外共享路由
module.exports=router