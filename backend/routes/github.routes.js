const express=require('express');
const router=express.Router();
const tokenVerification=require('../middlewares/TokenVerificaton.cjs')
const githubController=require('../controller/github.controller.js')





router.get('/github/check',tokenVerification,githubController.checkConnection);
router.get('/github/redirect',githubController.redirect);
router.get('/github/callback',tokenVerification,githubController.exchangeToken);
router.get("/github/repos", tokenVerification, githubController.getGithubRepos);


module.exports=router;