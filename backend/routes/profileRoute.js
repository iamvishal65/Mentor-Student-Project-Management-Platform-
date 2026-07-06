const express=require('express');
const router=express.Router();
const profileController=require("../controller/profile.controller")
const tokenVerification=require('../middlewares/TokenVerificaton.cjs')

router.get('/profile/searchProfile',tokenVerification,profileController.search);
module.exports=router;