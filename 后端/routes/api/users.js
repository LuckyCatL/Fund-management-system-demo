//登录 和 注册
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const cors = require("cors")

const keys =require("../../config/keys");

const User = require("../../models/user");


// $route get请求 api/users/test
// @desc 返回的请求的json数据
// @access 公共接口
router.get("/test",(req,res)=>{
	res.json({msg:"login works"})
})

//注册
// $route post请求 api/users/register
// @desc 返回的请求的json数据
// @access 公共接口
router.post("/register",(req,res)=>{
	// console.log(req.body);
	
	//查询数据库中邮箱是否存在
	User.findOne({email:req.body.email})
		.then((user)=>{
			if(user){
				return res.status(400).json("邮箱已被注册！")
			}else{
				var avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
				const newUser = new User({
					name:req.body.name,
					email:req.body.email,
					avatar,
					password:req.body.password,
					identity:req.body.identity
				})
				
				
				//bcrypt加密
				// console.log(newUser)
				bcrypt.genSalt(10, function(err, salt) {
				    bcrypt.hash(newUser.password, salt, function(err, hash) {
				        if(err) throw err;
						
						newUser.password = hash;
						
						newUser.save()
							   .then(user => res.json(user))
							   .catch(err => console.log(err))
				    });
				});
				
			}
		})
})


//登录
// $route post请求 api/users/login
// @desc 返回token jwt passport
// @access 公共接口
router.post("/login",(req,res)=>{
	const email = req.body.email
	const password = req.body.password
	
	//查询数据库
	User.findOne({email})
		.then(user=>{
			if(!user){
				return res.status(404).json("用户不存在！")
			}
			
			//密码匹配
			bcrypt.compare(password, user.password)
				  .then(isMatch=>{
					  if(isMatch){
						  const rule={
							id:user.id,
							name:user.name,
							avatar: user.avatar,
							identity: user.identity
						  }
						  
						  //jwt.sign("规则","加密名字","过期时间","箭头函数")
						  jwt.sign(rule,keys.secretOrkey,{expiresIn:3600},(err,token)=>{
							  if(err) throw err;
							  res.json({
								  success:true,
								  token:"Bearer " + token
							  });
						  })
						  // res.json({msg:"success"});
					  }else{
						  return res.status(400).json("密码错误！")
					  }
				  })
		})
})


//token验证
// $route get请求 api/users/current
// @desc return current user
// @access 私密的
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
	res.json({
		id:req.user.id,
		name:req.user.name,
		email:req.user.email,
		identity:req.user.identity
	});
})


module.exports = router;