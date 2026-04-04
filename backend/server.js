require("dotenv").config()
const app=require('./app')
const connectdb=require('./starterFunction/DB')
const { default: webSocketConnection } = require("./starterFunction/Socket")
const adminCheck=require('./starterFunction/adminCheck')
const http = require("http");

async function startServer() {
  try {
    const server = http.createServer(app); 
    webSocketConnection(server);
    await connectdb();        
    await adminCheck();       
    server.listen(5000, () => {
      console.log("server is on");
    });
  } catch (err) {
    console.log("error in starting server:", err);
  }
}

startServer();