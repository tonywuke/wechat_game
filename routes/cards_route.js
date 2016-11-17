/**
 * Created by Tonywuke on 2016/11/16.
 */
var express = require('express');
var router = express.Router();
var cardsConroller = require('../controllers/cards_controller');
/* GET users listing. */


router.post('/publish', cardsConroller.publish);


module.exports = router;
