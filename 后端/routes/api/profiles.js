//配置信息
const express = require("express");
const router = express.Router();
const passport = require("passport");


const Profile = require("../../models/Profile");


router.get("/test",(req,res)=>{
	res.json({msg:"profiles works"})
})


//添加
// @route post请求 api/profiles/add
// @desc 创建信息接口
// @access 私密的
router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
	const profileFields={};
	if(req.body.type) profileFields.type = req.body.type;
	if(req.body.describe) profileFields.describe = req.body.describe;
	if(req.body.income) profileFields.income = req.body.income;
	if(req.body.expend) profileFields.expend = req.body.expend;
	if(req.body.cash) profileFields.cash = req.body.cash;
	if(req.body.remark) profileFields.remark = req.body.remark;
	
	new Profile(profileFields).save()
							  .then(profile=>{
								  res.json(profile);
							  })
})


//获取信息
// @route get请求 api/profiles/
// @desc 获取信息接口
// @access 私密的
router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
	Profile.find()
		   .then(profile=>{
			   if(!profile){
				   return res.status(404).json("没有任何内容！")
			   }
			   res.json(profile);
		   })
		   .catch(err=>res.status(404).json(err))
})


//获取单个信息
// @route get请求 api/profiles/:id
// @desc 获取信息接口
// @access 私密的
router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
	Profile.find({_id:req.params.id})
		   .then(profile=>{
			   if(!profile){
				   return res.status(404).json("没有任何内容！")
			   }
			   res.json(profile);
		   })
		   .catch(err=>res.status(404).json(err))
})


//编辑
// @route post请求 api/profiles/edit/:id
// @desc 修改信息接口
// @access 私密的
router.post("/edit/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
	const profileFields={};
	if(req.body.type) profileFields.type = req.body.type;
	if(req.body.describe) profileFields.describe = req.body.describe;
	if(req.body.income) profileFields.income = req.body.income;
	if(req.body.expend) profileFields.expend = req.body.expend;
	if(req.body.cash) profileFields.cash = req.body.cash;
	if(req.body.remark) profileFields.remark = req.body.remark;
	
	Profile.findOneAndUpdate(
		{_id:req.params.id},
		{$set:profileFields},
		{new:true}
	
	)
		   .then(prfile=>res.json(prfile))
})


//删除
// @route post请求 api/profiles/delete/:id
// @desc 删除信息接口
// @access 私密的
router.delete("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
	Profile.findOneAndRemove({_id:req.params.id})
		   .then(profile=>{
					 res.json(profile)
		   })
		   .catch(err=>res.status(404).json('删除失败！'))
})

module.exports = router;