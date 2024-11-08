// 导入jwt中间件，将token解析成功后，挂载到res.user上
const jwt = require("express-jwt")
// 导入数据库组件
const db = require("../db/index")
// 创建获取文章列表函数
exports.article_getlist_handler = (req, res) => {
  /**
   * 根据分类状态，获取所有未删除的文章数据
   * 数据库中，is_delete 为0 表示没有被标记为删除数据
   */
  // 按照从小到大排序
  const sql09 =
    "select * from ev_article_cate where is_delete=0 order by id asc"
  db.query(sql09, (err, results) => {
    // 执行语句失败
    if (err) return res.cc(err)
    // 执行成功
    res.send({
      status: 0,
      message: "获取文章列表成功",
      data: results,
    })
  })
}
// 新增文章分类数据处理函数
exports.article_addlist_handler = (req, res) => {
  // 定义查询语句，判断分类名称或分类别名是否存在且is_delete状态为1
  const sql10 = "select * from ev_article_cate where name=? or alias=?"
  db.query(sql10, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err)

    let existingCategory = results.find(
      (result) =>
        result.name === req.body.name || result.alias === req.body.alias
    )

    if (existingCategory) {
      if (existingCategory.is_delete === 1) {
        // 更新is_delete为0
        const sqlUpdate = "update ev_article_cate set is_delete=? where id=?"
        db.query(sqlUpdate, [0, existingCategory.id], (err, results) => {
          if (err) return res.cc(err)
          res.cc("新增文章分类成功", 0)
        })
      } else {
        return res.cc("分类名或别名已存在，请更换后尝试！")
      }
    } else {
      // 新增文章分类
      const sql11 = "insert into ev_article_cate set ?"
      db.query(sql11, req.body, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
          return res.cc("新增文章分类失败！")
        }
        res.cc("新增文章分类成功", 0)
      })
    }
  })
}

// 定义删除文章分类的处理函数
exports.article_deleteCateById_handler = (req, res) => {
  // 定义语句sql12，标记删除更安全
  const sql12 = "update ev_article_cate set is_delete=1 where id=?"
  // 执行删除
  db.query(sql12, req.params.id, (err, results) => {
    // 执行语句失败
    if (err) return res.cc(err)
    //执行语句成功
    if (results.affectedRows !== 1) return res.cc("删除文章分类失败！")
    //删除文章分类成功
    res.cc("删除文章分类成功", 0)
  })
}
// -----------------------------------------------
// 定义根据id编辑文章分类数据函数
exports.article_getArtcateById_handler = (req, res) => {
  const sql13 =
    "select * from ev_article_cate where id!=? and (name=? or alias=?)"
  db.query(
    sql13,
    [req.body.id, req.body.name,req.body.alias],
    (err, results) => {
      // 如果sql语句执行失败
      if (err) return res.cc(err)
      // 分类名称和分类别名都被占用
      switch (results.length) {
        case 1:
          if (
            results[0].name === req.body.name &&
            results[0].alias === req.body.alias
          ) {
            return res.cc("分类名与别名被占用，请更换后尝试！")
          } else if (results[0].name === req.body.name)
            return res.cc("分类名称被占用,请更换后尝试！")
          else {
            return res.cc("分类别名被占用,请更换后尝试！")
          }
        case 2:
          return res.cc("分类名或别名被占用，请更换后尝试！")
        default:
          // 新增文章分类
          const sql14 = "update ev_article_cate set name=? ,alias=? where id=?"
          db.query(sql14, [req.body.name,req.body.alias, req.body.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
              return res.cc("更新文章分类失败！")
            }
            res.cc("更新文章分类成功", 0)
          })
      }
    }
  )
}
