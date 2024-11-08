// 这个文件中主要是一些验证规则
// 导入joi包，这个中间件用来为表单数据定义规则
const joi=require('joi')
/**
 * string() 值必须是字符串
 * alphanum() 值只能包含a-z，A-Z，0——9,的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项
 * pattern(正则表达式) 值必须是正则表达式的规则
 */
//用户验证规则
const username=joi.string().alphanum().min(1).max(10).required()
//密码验证规则
const password=joi.string().pattern(/^[^\s]{6,12}$/).required()

// 导出注册和登录的验证规则
exports.reg_login_schema={
    //在请求体中进行验证
    body:{
        username,
        password
    }
}

// 定义 id, nickname, email 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 验证规则对象 - 更新用户基本信息
exports.update_userinfo_schema = {
	body: {
		id,
		nickname,
		email,
	},
}
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()
// 导出规则，用户头像
exports.update_Avatar_schema={
    body:{
        avatar
    }
}

//新旧密码验证规则
exports.update_password_scheam={
    body:{
        //使用password
        old_pwd:password,
        //使用joi.not(joi.ref('oldPwd)).concat(password),验证req.body.newPwd的值
        /**
         * 1.joi.ref('oldPwd')表示newOld的值必须与old值保持一致
         * 2.joi.not(joi.ref('oldPwd'))表示newPwd值不等于new
         * 3..concat()用于合并joi.not()h和password这两条验证规则
         */
        new_pwd:joi.not(joi.ref('oldPwd')).concat(password)
    }
}