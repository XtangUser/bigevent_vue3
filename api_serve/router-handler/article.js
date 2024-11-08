// 这个是文章管理处理函数
// 导入处理路径的 path 核心模块
const path = require("path")
// 导入数据库模块
const db = require("../db/index")
// 发布新文章的处理函数
exports.addArticle = (req, res) => {
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== "cover_img")
    return res.cc("文章封面是必选参数！")
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join("/uploads", req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
  }
  const sql15 = `insert into ev_articles set ?`
  // 执行 SQL 语句
  db.query(sql15, articleInfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc("发布文章失败！")

    // 发布文章成功
    res.cc("发布文章成功", 0)
  })
}

// 搜索文章处理函数
exports.searchArticle = async (req, res) => {
    const sql = `select a.id, a.title, a.pub_date, a.state, b.name as cate_name
                from ev_articles as a,ev_article_cate as b 
                where a.cate_id = b.id and a.cate_id = ifnull(? ,a.cate_id)  and a.state = ifnull(? ,a.state) and a.is_delete = 0  limit ?,?`

    let results = []
    try {
        results = await db.queryByPromisify(sql, [req.query.cate_id || null, req.query.state || null, (req.query.pagenum - 1) * req.query.pagesize, req.query.pagesize])
    } catch (e) {
        return res.cc(e)
    }

    // bugfix: 之前这里没有添加过滤条件 state和cate_id，导致 文章列表的分页pageBox中查询总数不正确
    const countSql = 'select count(*) as num from ev_articles where is_delete = 0 and state = ifnull(?,state) and cate_id = ifnull(?,cate_id)'
    let total = null
    try {
        let [{ num }] = await db.queryByPromisify(countSql, [req.query.state || null, req.query.cate_id || null])
        total = num
    } catch (e) {
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '获取文章列表成功',
        data: results,
        total
    })

}
// 修改文章 应该现在前端通过点击文章修改按钮，然后通过搜索文章id获取文章的内容，再将搜索到的内容展示在前端界面，修改完文章内容后点击确认按钮将文章的内容提交的修改链接，实现修改
exports.editArticle = (req, res) => {
  let sql17 = `select * from ev_articles where id=${req.body.id}`
  db.query(sql17, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc("文章编号出错！")
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== "cover_img") {
      return res.cc("文章封面是必选参数！")
    }
    const articleInfo = {
      // 标题、内容、状态、所属的分类Id
      ...req.body,
      // 文章封面在服务器端的存放路径
      cover_img: path.join("/uploads", req.file.filename),
      // 文章发布时间
      pub_date: new Date(),
    }
    const sql18 = `update ev_articles set ? where id=${req.body.id}`
    db.query(sql18, articleInfo, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc("修改文章失败！")
        res.json({
          status: 0,
          message: "修改文章成功",
          data: articleInfo // 如果需要，可以包含更新后的文章信息
        });
    })
  })
}
// 删除文章函数
exports.deleteArticle = (req, res) => {
  const sql = `update ev_articles set is_delete=1 where id=${req.params.id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc("删除文章失败！")
    res.cc("删除文章成功", 0)
  })
}
//查询
// 查询文章详情的函数
exports.queryArticleDetail = (req, res) => {
  // 使用查询参数中的 id
  const articleId = req.query.id;

  // 简单的验证，确保 id 是存在的并且是数字
  if (!articleId || isNaN(articleId)) {
    return res.status(400).json({ status: -1, msg: '无效的文章 ID' });
  }

  // 构造 SQL 查询语句
  const sql = 'SELECT * FROM ev_articles WHERE id = ? AND is_delete = 0';

  // 执行数据库查询
  db.query(sql, [articleId], (err, results) => {
    if (err) {
      // 处理数据库错误
      return res.status(500).json({ status: -1, msg: '数据库查询失败', error: err });
    }

    if (results.length === 0) {
      // 如果没有找到文章
      return res.status(404).json({ status: -1, msg: '文章未找到' });
    }

    // 返回文章详情
    res.status(200).json({
      status: 0,
      msg: '查询文章详情成功',
      data: results[0],
    });
  });
};