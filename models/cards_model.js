/**
 * Created by Tonywuke on 2016/11/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
    phonenumber:String, //用户唯一标示
    name: String, //用户名
    headImg: String,
    title:  String,
    likeNum: Number,//喜欢数
    commentNum: Number,//评论数
    body:  String,
    bodyImg:  [String],
    comments: [{ name:String, body: String, date: Date }],
    editDate: { type: Date, default: Date.now },
    upDate: { type: Date, default: Date.now },
    hidden: Boolean,
});

module.exports=mongoose.model('Card', CardSchema);