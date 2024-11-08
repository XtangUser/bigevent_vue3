// 文章管理路由
const express = require("express")
const router = express.Router()
// 导入解析 formdata 格式表单数据的包
const multer = require("multer")
// 导入处理路径的核心模块
const path = require("path")
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi")
// 导入文章的验证模块
const schemaArticle = require("../schema/article")
/**
 * 使用 express.urlencoded() 中间件无法解析 multipart/form-data 格式的请求体数据。
 * 当前项目，推荐使用 multer 来解析 multipart/form-data 格式的表单数据
 */
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, "../uploads") })
// 导入文章的路由处理函数模块
const { searchArticle, addArticle ,editArticle, deleteArticle,queryArticleDetail} = require("../router-handler/article")
// --------发布新文章的路由---------------
/**
 * upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
 * 将文件类型的数据，解析并挂载到 req.file 属性中
 * 将文本类型的数据，解析并挂载到 req.body 属性中
 * 发布新文章的路由
 * 注意：在当前的路由中，先后使用了两个中间件：
 * 先使用 multer 解析表单数据
 * 再使用 expressJoi 对解析的表单数据进行验证
 * */
router.post(
  "/add",
  upload.single("cover_img"),
  expressJoi(schemaArticle.add_article_schema),
  addArticle
)
// 查询函数
router.post("/search", expressJoi(schemaArticle.search_article_schema), searchArticle)
// 修改文章
router.post(
  "/edit",
  upload.single("cover_img"),
  expressJoi(schemaArticle.edit_article_schema),
  editArticle
)
// 删除文章
router.delete('/delete/:id', expressJoi(schemaArticle.delete_article_schema), deleteArticle);

// 查询
router.get('/list', expressJoi(schemaArticle.list_article_schema), queryArticleDetail)


module.exports = router