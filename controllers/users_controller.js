/**
 * Created by Tonywuke on 2016/11/9.
 */
var crypto = require('crypto');
var User =  require('../models/users_model');

function hashPW(pwd){
    return crypto.createHash('sha256').update(pwd).
    digest('base64').toString();
}

exports.signup = function(req, res){
    var user = new User({phonenumber:req.body.phonenumber});
    user.set('hashed_password', hashPW(req.body.password));
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
    User.findOne({ phonenumber: req.body.phonenumber })
        .exec(function(err, user) {
            if (!user){
                err = 'User Not Found.';
            } else if (user.hashed_password ===
                hashPW(req.body.password)) {
                req.session.regenerate(function(){
                    req.session.user = user._id;
                });
                console.log(req.body.phonenumber+'登录成功');
                res.send(user);
            }else{
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