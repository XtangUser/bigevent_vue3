// 导入jwt中间件，将token解析成功后，挂载到res.user上
const jwt=require('express-jwt')
// 导入数据库组件
const db=require('../db/index')
// 导入bcryptjs，使用其中的方法，对加密的密码进行比较
const bcrypt=require('bcryptjs')
// 定义sql语句
const sql04='select id,username,nickname,email,user_pic from ev_users where id=?'
// 获取个人信息函数
exports.userinfo_getuser_handler=(req,res)=>{
db.query(sql04,req.user.id,(err,results)=>{
    //1.执行语句失败
    if(err) return res.cc(err)
        // 2.执行语句成功，但是查询到的数据条数不等于一
    if(results.length!==1) return res.cc('获取用户信息失败')
        // 3.将用户数据响应给客户端
    res.send({
        status:0,
        message:'获取用户基本信息成功',
        data:results[0]
    })
})
}
// 更新用户基本信息
exports.userinfo_updateuser_handler=(req,res)=>{
const sql05='update ev_users set ? where id=?'
db.query(sql05,[req.body,req.body.id],(err,results)=>{
    // 执行sql语句失败
    if(err) return  res.cc(err)
        // 执行语句成功，但影响行数不等于一
    if(results.affectedRows!==1) return res.cc('修改用户基本信息失败！')
        // 修改用户信息成功
    return res.cc('修改用户信息成功',0)
}
)
}

//重置密码的处理函数
exports.userinfo_updatePassword_handler=(req,res)=>{
    //根据id查询用户是否存在
const sql06='select * from ev_users where id=?'
db.query(sql06,req.user.id,(err,results)=>{
    //执行sql语句失败
if(err) return res.cc(err)
    // 检查指定的id是否存在
if(results.length!==1){
    return res.cc('用户不存在！')
}
//TODO：执行成功，旧密码对比正确
const compareResults=bcrypt.compareSync(req.body.old_pwd,results[0].password)
if(!compareResults) return res.cc('原密码错误！')
    //原密码正确后,定义新密码
const sql07='update ev_users set password=? where id=?'
//对新密码进行加密
const new_pwd=bcrypt.hashSync(req.body.new_pwd,10)
//执行sql语句，根据id更新密码
db.query(sql07,[new_pwd,req.user.id],(err,results)=>{
if(err) return res.cc(err.message)
    if(results.affectedRows!==1) return res.cc('执行失败,id重复!')
        res.cc('更新用户密码成功',0)
})
})
}

//更新用户头像处理函数
exports.userinfo_updateAvatar_handler=(req,res)=>{
const sql08='update ev_users set user_pic=? where id=?'
db.query(sql08,[req.body.avatar,req.user.id],(err,results)=>{
    //执行sql语句失败
if(err) return res.cc(err)
    //执行语句成功，但是影响行数不等于一
if(results.affectedRows1==1) return res.cc('更新头像失败！')
    // 更新用户头像成功
return res.cc('更新头像成功',0)
})

}
