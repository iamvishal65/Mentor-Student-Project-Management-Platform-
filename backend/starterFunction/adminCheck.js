const userModel=require('../models/User.model')
const  {hashedPassword } = require("../utils/hashPassword.util");


async function adminCheck(){
  try {
    const confirmAdmin=await userModel.findOne({ roles: ["admin"] });
    if(confirmAdmin) {
        console.log("admin is there");
        return;
    }
    
    const passwordHash=await hashedPassword(process.env.ADMIN_PASSWORD);
    await userModel.create({
        name:process.env.ADMIN_NAME,
        userName:process.env.ADMIN_USERNAME,
        email:process.env.ADMIN_EMAIL,
        password:passwordHash,
        roles:["admin"]
    })
    console.log("Admin user seeded successfully");
    
  } catch (error) {
    console.log(error);
  }
}
module.exports=adminCheck;