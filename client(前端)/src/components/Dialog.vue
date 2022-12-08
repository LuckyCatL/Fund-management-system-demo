<template>
	<div class="dialog">
		<el-dialog 
		:title="title" 
		v-model="dialog.show" 
		:close-on-click-modal="false" 
		:close-on-press-escape="false"
		:append-to-body="false"
		@close="setDialog()">
		<div class="form">
			<el-form ref="form" :model="formData" :rules="form_rules" label-width="120px" style="margin:10px;width:auto;">
				<el-form-item label="收支类型:">
					<el-select v-model="formData.type" placeholder="收支类型">
						<el-option v-for="(formtype,index) in form_type_list" :key="index" :label="formtype" :value="formtype"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="收支描述:" prop="describe">
					<el-input type="describe" v-model="formData.describe"></el-input>
				</el-form-item>
				<el-form-item label="收入:" prop="income">
					<el-input type="income" v-model="formData.income"></el-input>
				</el-form-item>
				<el-form-item label="支出:" prop="expend">
					<el-input type="expend" v-model="formData.expend"></el-input>
				</el-form-item>
				<el-form-item label="账户现金:" prop="cash">
					<el-input type="cash" v-model="formData.cash"></el-input>
				</el-form-item>
				<el-form-item label="备注:" prop="remark">
					<el-input type="textarea" v-model="formData.remark"></el-input>
				</el-form-item>
				<el-form-item class="text_right">
					<el-button @click="dialog.show=false">取消</el-button>
					<el-button type="primary" @click="onSubmit('form')">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name:'dialog',
		data(){
			return{
				dialog:{
					show:false,
					title:"",
					option:"",
				},
				// formData:{
				// 	type:"",
				// 	describe:"",
				// 	income:"",
				// 	expend:"",
				// 	cash:"",
				// 	remark:"",
				// },
				form_type_list:[
					"提现",
					"手续费",
					"充值",
					"转账",
					"其他"
				],
				form_rules:{
					describe:[
						{required:true,message:"收支描述不能为空",trigger:"blur"}
					],
					income:[
						{required:true,message:"收入不能为空",trigger:"blur"}
					],
					expend:[
						{required:true,message:"支出不能为空",trigger:"blur"}
					],
					cash:[
						{required:true,message:"账户现金不能为空",trigger:"blur"}
					]
				}
				
			}
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			title:{
				type:String,
			},
			formData:Object,
			option:Object
		},
		watch:{
			show:function(show){
			          this.dialog.show = show ? true : false;
					  // console.log(this.dialog)
			      },
			title:function(title){
				this.dialog.title=title
			},
			option:function(option){
				this.dialog.option=option
			},
			// formData:function(formData){
			// 	this.formData=formData
			// }

		},
		methods:{
			setDialog(){
				this.dialog.show=false
				this.$emit('onEvent',this.dialog)

			},
			onSubmit(form){
				this.$refs[form].validate(valid=>{
					const url = this.dialog.option == "add" ? "add" : `edit/${this.formData.id}`
					console.log(url)
						this.$axios.post(`http://127.0.0.1:5000/api/profiles/${url}`,this.formData)
								   .then(res=>{
									   this.$message({
										   message:"数据更新成功",
										   type:"success"
									   })
									   this.dialog.show=false;
									   this.$emit('update')
								   })
					})
				}
			}
		}

</script>

<style>
</style>