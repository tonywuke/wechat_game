/**
 * Created by Tonywuke on 2016/11/14.
 */
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '80249815@qq.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'ryqupwvuurvhbice'
    }
});

module.exports = transporter;