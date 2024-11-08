// 导入创建规则的模块
const joi = require("joi")
// 定义分类名称，和分类别名的效验规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()
// 导出效验规则对象，添加分类
exports.add_cate_schema = {
  body: {
    name,
    alias,
  },
}

// 定义分类id的效验规则
const id = joi.number().integer().min(1).required()
// 向外共享
exports.delete_cate_schema = {
  params: {
    id,
  },
}
// 根据id编辑文章分类
exports.get_cateid_schema = {
  body: {
    id,
    name,
    alias,
  },
}
