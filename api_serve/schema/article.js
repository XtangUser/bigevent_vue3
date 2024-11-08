// 导入定义验证规则的模块
const joi = require("joi")

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required();
const content = joi.string().required().allow("")
const state = joi.string().valid("已发布", "草稿").required()

// 验证规则对象 - 发布文章
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  },
}

// 搜索验证规则 不是必须，假如不带参数就是查询所有文章
const title1 = joi.string()
const cate_id1 = joi.number().integer().min(1)
const content1 = joi.string().allow("")
const state1 = joi.string()
const author_id1 = joi.number()
const author1 = joi.string()

// 验证规则对象 - 搜索文章
exports.search_article_schema = {
  body: {
    title: title1,
    cate_id: cate_id1,
    content: content1,
    state: state1,
    author_id: author_id1,
    author: author1,
  },
}
const id = joi.number().integer().required()
// 验证规则对象 - 修改文章
exports.edit_article_schema = {
  body: {
    id,
    title,
    cate_id,
    content,
    state,
  },
}
// 验证规则对象 - 删除文章
exports.delete_article_schema = {
  params: { id },
}
// 获取详情
exports.list_article_schema = {
  query: { id },
}
