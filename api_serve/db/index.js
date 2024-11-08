// 创建数据库连接文件
// 导入数据库mysql对象
const mysql=require('mysql')
const { promisify } = require('util')
// 创建数据库连接对象
const db=mysql.createPool({
    host:'127.0.0.1', //基地址
    user:'root',
    password:'123456',
    database:'my-db-02'
})
const queryByPromisify = promisify(db.query).bind(db)
db.queryByPromisify =  queryByPromisify
// 向外暴露db数据库连接
module.exports=db