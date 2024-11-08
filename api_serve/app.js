// 导入express
const express = require("express")
// 导入cors中间件,解决跨域问题
const cors = require("cors")
const joi = require("joi")
// 导入解析中间件
const bodyParser = require("body-parser")
//创建服务器实例
const app = express()
// 将中间件配置成全局中间件
app.use(cors())

//导入配置中间件
const config = require("./config")
// 在路由之前优化res.send函数，进行封装
// 响应函数中间件
app.use((req, res, next) => {
  // status=0为成功，status=1,失败
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，err的状态可能是一个对象，也可能是一个字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  //将res.cc扭转给下面的路由
  next()
})
// 解析token的中间件
const expressJwt = require("express-jwt")
//指定接口不需要token验证
app.use(
  expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })
)
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
// 通过 express.json() 这个中间件，解析表单中的 JSON 格式的数据
app.use(bodyParser.json({ limit: "500mb" }))
// 配置解析表单数据的中间件解析form-urlencoded格式数据
app.use(bodyParser.urlencoded({ extended: false, limit: "500mb" }))
// ---导入用户模块---在路径前面加上/api前缀
const userRouter = require("./router/user")
app.use("/api", userRouter)
// 获取用户基本信息
const userinfoRouter = require("./router/userinfo")
//注意:以/my开头，有权限接口，进行token认证
app.use("/my", userinfoRouter)
// 导入文章分类模块路由
const artCateRouter = require("./router/artcate")
//为文章分类路由挂载统一访问前缀
app.use("/my/cate", artCateRouter)
// 导入并使用文章路由模块
const articleRouter = require('./router/article');
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter);
//定义错误级别中间件
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 未知错误
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败",401)
  res.cc(err)
})
// 启动服务器
app.listen(3007, () => {
  console.log("服务器启动在:http://127.0.0.1:3007")
})
