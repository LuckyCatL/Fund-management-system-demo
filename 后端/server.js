const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const passport = require("passport")
const cors = require("cors")
const app = express();

//引入users.js
const users = require("./routes/api/users");

//引入profile
const profiles = require("./routes/api/profiles")

//DB config
const db = require("./config/keys").mongoURI;

//后端解决跨域
app.use(cors())

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Connect to mongodb
mongoose.connect(db)
		.then(()=> console.log("mongodb Connect"))
		.catch(err=>console.log(err));

//possport 初始化
app.use(passport.initialize());

require("./config/passport")(passport);


// app.get("/",(req,res)=>{
// 	res.send("Hello Word")
// })


//使用 routes
app.use("/api/users",users);
app.use("/api/profiles",profiles);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
	console.log(`server runing on port ${port}`)
})