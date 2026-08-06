const authController=require('../controller/auth.controller.js')
const express=require('express');
const router=express.Router();
const tokenVerification=require('../middlewares/TokenVerificaton.cjs')
const mentorController=require("../controller/mentor.controller.js")



router.post('/user/register',authController.Register);
router.post('/user/login',authController.Login);
router.get('/logincheck',tokenVerification, authController.loginCheck)
router.post('/user/logout',authController.logout);
router.post('/mentor/register',tokenVerification,mentorController.newMentor)

module.exports=router;