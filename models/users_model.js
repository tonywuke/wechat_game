/**
 * Created by Tonywuke on 2016/11/9.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
    phonenumber: { type: String, unique: true },
    hashed_password: String,
    username: String,
    sex: String,
    area: String,
    education: String
});

module.exports=mongoose.model('User', UserSchema);