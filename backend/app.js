const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const cors=require('cors');
const auth=require('./routes/auth.route')
const project=require('./routes/projectRoutes')
const github=require('./routes/github.routes')
const mentorApplication=require('./routes/mentorApplication.route')

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',auth)
app.use('/api/project',project)
app.use('/api/auth',github)
app.use('/api/auth',mentorApplication)


app.get('/',(_,res)=>{
    res.send("Server is running");
});

module.exports=app;