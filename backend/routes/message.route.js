const express=require('express');
const router=express.Router();
const tokenVerification=require('../middlewares/TokenVerificaton.cjs')
const messageController=require("../controller/message.controller")

router.get('/message/checkConversation/:otherUserId',tokenVerification,messageController.checkConversation);

module.exports=router;