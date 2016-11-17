/**
 * Created by Tonywuke on 2016/11/16.
 */
var Card =  require('../models/cards_model');


exports.publish = function(req, res){
    console.log(req.body);
    var card = new Card(req.body);
    card.save(function(err,card) {
        if (err){
            console.log('保存错误：'+err);
        }else{
            res.send("success");
        }
    });
};