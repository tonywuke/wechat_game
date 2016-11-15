/**
 * Created by Tonywuke on 2016/11/9.
 */
var crypto = require('crypto');
var User =  require('../models/users_model');
var Email =  require('./emails_controller');

function hashPW(pwd){
    return crypto.createHash('sha256').update(pwd).
    digest('base64').toString();
}

exports.signup = function(req, res){
    var user = new User({phonenumber:req.body.phonenumber});
    user.set('hashed_password', hashPW(req.body.password));
    user.set('isAuth', false);//身份认证，校内邮箱认证
    user.save(function(err,user) {
        if (err){
            res.session.error = err;
        }else{
            console.log(user._id);
            req.session.user = user._id;
            res.send(user);
        }
    });
};

exports.login = function(req, res){
    var accessToken={
        isLoginSuccess:false,
        token:""
    };
    User.findOne({ phonenumber: req.body.phonenumber })
        .exec(function(err, user) {
            if (!user){
                res.send(accessToken);
                err = 'User Not Found.';
            } else if (user.hashed_password ===hashPW(req.body.password)) {
                req.session.regenerate(function(){
                    req.session.user = user._id;
                });
                console.log(req.body.phonenumber+'登录成功');
                accessToken.isLoginSuccess=true;
                res.send(accessToken);
                //res.send(user);
            }else{
                res.send(accessToken);
                err = 'Authentication failed.';
            }
            if(err){
                req.session.regenerate(function(){
                    req.session.msg = err;
                });
            }
        });
};

exports.saveUserInfo= function(req, res){
    console.log(req.body);
    User.findOne({ phonenumber: req.body.phonenumber })
        .exec(function(err, user) {
            if(err){
            }
            user.set('username', req.body.username);
            user.set('sex', req.body.sex);
            user.set('area', req.body.area);
            user.set('education', req.body.education);
            user.save(function(err,user) {
                if (err){
                    res.session.error = err;
                }else{
                    console.log(user._id);
                    req.session.user = user._id;
                    res.send(user);
                }
            });
        });

};

exports.getUserInfo= function(req, res){
    console.log(req.query);
    User.findOne({ phonenumber: req.query.phonenumber })
        .exec(function(err, user) {
            if(err){
            }
            res.send(user);
        });

};


exports.sendVerifyMail= function(req, res) {
    console.log(req.body);
    var email=req.body.email;
    var ms=new Date().getTime().toString();//返回从 1970 年 1 月 1 日至今的毫秒数。
    var emailCode= ms.substring(ms.length-6);//取ms最后6位作为验证码。由于1分钟=60000毫秒，如果设置验证码5分钟内有效，用户输入验证码的时间-验证码<=300000即可。

    User.findOne({ email:email , isAuth:true })
        .exec(function(err, user) {
            if(!user) {
                User.findOne({phonenumber: req.body.phonenumber})
                    .exec(function (err, user) {
                        if (err) {
                        }
                        user.set('emailCode', emailCode);
                        user.set('email', email);
                        user.save();

                        var mailOptions = {
                            from: '80249815@qq.com', // 发件地址
                            to: email,  // 收件列表
                            subject: '验证您的电子邮件地址', // 标题
                            //text和html两者只支持一种
                            text: user.username + '，您好：\n' +
                            '       您最近添加了 ' + email + '作为您账号的电子邮件地址。\n' +
                            '       为验证此电子邮件地址属于您，请在软件中输入下方验证码进行验证:\n' +
                            '       ' + emailCode // 内容
                            //html: '<b>Hello world ?</b>' // html 内容
                        };
                        Email.sendMail(mailOptions);
                        res.send('success');
                    });
            }else{
                console.log('邮箱已被验证')
                res.send('exist');
            }
            if (err) {
            }
        });

}

exports.verifyMailbox= function(req, res) {
    var email=req.body.email;
    var emailCode=req.body.emailCode;
    var ms=new Date().getTime().toString()
    var msCode=ms.substring(ms.length-6);
    User.findOne({ phonenumber: req.body.phonenumber })
        .exec(function(err, user) {
            if(err){
            }
            var time=0;//用于验证邮箱时效，有效时间5分钟
            if(parseInt(user.emailCode) > parseInt(msCode)) {
                console.log('time1:  '+time+'   code1:   '+user.emailCode+'   ms1:   '+msCode);
                time = 1000000 - parseInt(user.emailCode) + parseInt(msCode);
            }else{
                console.log('time2:  '+time+'   code2:   '+user.emailCode+'   ms2:   '+msCode);
                time=parseInt(msCode) - parseInt(user.emailCode);
            }
            console.log('time3:  '+time);


            var verifyState='';
            if(user.email==email) {
                if(user.emailCode==emailCode){
                    if(time <= 300000){
                        console.log('邮箱验证成功');
                        user.set('isAuth', true);
                        user.save();
                        verifyState='success';
                        res.send(verifyState);
                    }else{
                        console.log('验证码失效');
                        verifyState='timeout';
                        res.send(verifyState);
                    }
                }else {
                    console.log('验证码不正确');
                    verifyState='incorrect';
                    res.send(verifyState);
                }
            }else {
                console.log('当前输入邮箱与验证邮箱不匹配');
                verifyState='mismatch';
                res.send(verifyState);
            }

        });


}