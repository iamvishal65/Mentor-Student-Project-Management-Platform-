const express=require('express');
const router=express.Router();
const tokenVerification=require('../middlewares/TokenVerificaton.cjs')
const mentorController=require('../controller/mentor.controller.js');
const checkRoleMiddleware = require('../middlewares/checkRole.middleware.js');
const adminController=require('../controller/admin.controller.js')

router.get('/mentor/applicationStatus',tokenVerification,checkRoleMiddleware,mentorController.applicationState)
router.post('/mentor/applyForMentor',tokenVerification,checkRoleMiddleware,mentorController.applyForMentor)
router.get('/admin/allApplication',adminController.allApplicationForMentorRole)
router.post('/admin/approveApplication/:id',tokenVerification,checkRoleMiddleware,adminController.approveApplication);
router.post('/admin/rejectApplication/:id',tokenVerification,checkRoleMiddleware,adminController.rejectApplication);
module.exports=router;