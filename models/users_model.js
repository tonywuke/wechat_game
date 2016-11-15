/**
 * Created by Tonywuke on 2016/11/9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    phonenumber: { type: String, unique: true },
    hashed_password: String,
    username: String,
    sex: String,
    area: String,
    education: String,
    email: String,
    emailCode: String, //邮箱验证码
    isAuth: Boolean  //是否认证
});

module.exports=mongoose.model('User', UserSchema);