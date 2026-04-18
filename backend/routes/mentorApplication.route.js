const express=require('express');
const router=express.Router();
const tokenVerification=require('../middlewares/TokenVerificaton.cjs')
const mentorController=require('../controller/mentor.controller.js');
const checkRoleMiddleware = require('../middlewares/checkRole.middleware.js');

router.get('/mentor/applicationStatus',tokenVerification,checkRoleMiddleware,mentorController.applyForMentor)
router.post('/mentor/applyForMentor',tokenVerification,checkRoleMiddleware,mentorController.applyForMentor)

module.exports=router;