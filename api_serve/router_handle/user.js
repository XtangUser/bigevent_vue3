// 导入数据库操作模块
const db = require('../db/index')
// 导入密码加密模块
const byct = require('bcryptjs')
// 导入生成token的包
const jwt = require('jsonwebtoken')
// 导入配置文件密钥
const config = require('../schema/config')
// 注册处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    //采用第三方库进行表单验证
    const sql01 = `select * from ev_users where username=?`
    db.query(sql01, [userinfo.username], function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        // 大于0就说明找到该用户了，即用户名被占用
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        //TODO---------------------------------------------------------------
        // 应用byct.hashsync对密码进行加密
        //参数一是明文密码，参数二是加密长度
        userinfo.password = byct.hashSync(userinfo.password, 10)
        // 定义插入新用户
        const sql02 = 'insert into ev_users set ?'
        db.query(sql02, { username: userinfo.username, password: userinfo.password }, function (err, results) {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)
            // SQL 语句执行成功，但影响行数不为 1，所谓的影响行数指的是数据库中数据有多少行在执行后受到到影响
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试！')
            }
            // 注册成功
            res.cc('注册成功', 0, true)
        }
        )
    })


}
// 登录处理函数
exports.login = (req, res) => {

    const userinfo = req.body

    const sql = `select * from ev_users where username=?`

    db.query(sql, userinfo.username, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败！')

        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        //第一个参数，用户提交密码，第二个参数用户注册的密码
        const compareResult = byct.compareSync(
            userinfo.password,
            results[0].password
        )
        //results[0].password找到用户名之后，会把找的的结果变成数组
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败！')
        }

        // res.send('登录成功')
        // 剩余函数处理，防止过大文件和密码泄露
        const user = { ...results[0], password: '', user_pic: '' }
        // 在登录处理函数中生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn, 
         // token 有效期为 10 个小时
        })
// 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
// 密钥token放在了success
        res.cc('登录成功！',0,'Bearer ' + tokenStr,
        )
    })
}


