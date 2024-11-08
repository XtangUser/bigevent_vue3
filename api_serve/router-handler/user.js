// 这里存放user处理函数
//导入数据库模块
const db=require('../db/index')
// 导入生成token的包
const jwt=require('jsonwebtoken')
//导入配置token规则
const config=require('../config')
// 导入密码加密包bcryptjs,对添加在数据库中的密码进行加密
const bcrypt=require('bcryptjs')
// ---登录与注册-res响应参数--req请求参数体
exports.regUser=(req,res)=>{
    //收取表单数据
    const userinfo=req.body
    /**
     * 这里由express-joi进行自动效验
     */
    // // 判断数据是否合法
    // if(!userinfo.username ||!userinfo.password ){
    //     return res.cc('用户名或密码不能为空')
    // }
    // 查询语句
    const sql01=`select * from ev_users where username=?`
    // 插入语句
    const sql02='insert into ev_users set ?'
          // 这里的results是查询到符合条件的结果数据
    db.query(sql01,userinfo.username,function(err,results){
       //如果执行sql语句失败
       if(err){
        return res.cc(err.message)
       } 
       //用户名被占用
       if(results.length>0){
        return res.cc('用户名已经被占用！')
       }
       // 用户名可用TODO--
       // 对用户密码，进行bcrypt加密，并赋值给原来的密码
    //    10 是加密盐的长度
      userinfo.password=bcrypt.hashSync(userinfo.password,10)
      // 定义插入新用户的sql语句
      
      db.query(sql02,{username:userinfo.username,password:userinfo.password},function(err,results){
        if(err){
            return res.cc(err)
        }
        if(results.affectedRows !==1){
            return res.cc('注册用户失败,稍后再试')
        }
        res.cc('注册成功',0)
      })
    })
}
exports.loginUser=(req,res)=>{
  // 接受表单数据
  const userinfo=req.body
  // 定义sql语句
  const sql03='select * from ev_users where username=?'
  //执行查询语句
  db.query(sql03,userinfo.username,(err,results)=>{
// 执行语句失败
if(err) return res.cc(err)
  // 执行成功，但是查询到的语句不等于一
if(results.length!==1) return res.cc('登陆失败')
  //TODO:判断用户输入的密码与数据库中的是否一样
//调用方法，对用户输入的密码与数据库存储的密码进行比较
const compareResult=bcrypt.compareSync(userinfo.password,results[0].password)
if(!compareResult){
  return res.cc('登陆失败')
}

// 通过es6高级语法剔除密码和头像里面得值
const user={...results[0],password:'',user_pic:''}
//TODO：登陆成功，生成token字符串
const tokenStr=jwt.sign(user,config.jwtSecretKey,{
  expiresIn:'10h', // token的有效期是10个小时
})
// 将生成的token字符串响应给客户端
res.send({
  status:0,
  message:'登陆成功',
  // 方便客户端进行使用，在前面加上Bearer,后面加上空格
  token:'Bearer ' + tokenStr
})
  })
 
}