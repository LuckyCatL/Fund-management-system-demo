<template>
	<div class="fillcontain">
		<div style="width: 100%;">
			<el-form :inline="true" ref="add_data" :model="search_data">
				<!-- s筛选 -->
				<el-form-item label="按照时间筛选:">
					<el-date-picker
					        v-model="search_date.startTime"
					        type="datetime"
					        placeholder="选择开始时间"
					        :default-time="defaultTime"
					      />
						  --
					<el-date-picker
					        v-model="search_date.endTime"
					        type="datetime"
					        placeholder="选择结束时间"
					        :default-time="defaultTime"
					      />
				</el-form-item>
				<el-form-item>
					<el-button @click="handleSearch()" type="primary"><el-icon><Search /></el-icon>筛选</el-button>
				</el-form-item>
				<el-form-item class="btnRight">
					<el-button @click="handleAdd()" type="primary" v-if="user.identity == 'manager'"><el-icon><DocumentAdd /></el-icon>添加</el-button>
				</el-form-item>
			</el-form>
		</div>
	<div class="table_container">
	<el-table v-if="tableData.length>0" :data="tableData" style="width: 100%" max-height="450" border>
						<el-table-column
						type="index" 
						label="序号" 
						align='center'
						width="70">
						</el-table-column>
						<el-table-column 
						property="date" 
						label="创建时间" 
						align='center'
						width="250">
						<template #default="scope">
						        <div style="display: flex; align-items: center">
						          <el-icon><timer /></el-icon>
						          <span style="margin-left: 10px">{{ scope.row.date }}</span>
						        </div>
						      </template>
						</el-table-column>
		                <el-table-column
		                    prop="type"
		                    label="收支类型"
		                    align='center'
		                    width="150">
		                </el-table-column>
		                <el-table-column
		                    prop="describe"
		                    label="收支描述"
		                    align='center'
		                    width="180">
		                </el-table-column>
		                <el-table-column
		                    prop="income"
		                    label="收入"
		                    align='center'
		                    width="170"> 
							<template #default="scope">
							    <span style="color:#00d053">+ {{ scope.row.income }}</span>
							</template>
		                </el-table-column>
		                <el-table-column
		                    prop="expend"
		                    label="支出"
		                    align='center'
		                    width="170">
							<template #default="scope">
							    <span style="color:#f56767">- {{ scope.row.expend }}</span>
							</template>
		                </el-table-column>
		                <el-table-column
		                    prop="cash"
		                    label="账户现金"
		                    align='center'
		                    width="170">
							<template #default="scope">
							    <span style="color:#4db3ff">{{ scope.row.cash }}</span>
							</template>
		                </el-table-column>
		                 <el-table-column
		                    prop="remark"
		                    label="备注"
		                    align='center'
		                    width="320">
		                </el-table-column>
						<el-table-column label="操作" prop="operation" fixed="right" align='center' v-if="user.identity == 'manager'">
						      <template #default="scope">
						        <el-button 
								size="default" 
								@click="handleEdit(scope.$index, scope.row)"
								type="warning"
						          ><el-icon><Edit /></el-icon>编辑</el-button
						        >
						        <el-button
						          size="default"
						          type="danger"
						          @click="handleDelete(scope.$index, scope.row)"
						          ><el-icon><Delete /></el-icon> 删除</el-button
						        >
						      </template>
						    </el-table-column>
	  </el-table>
	  <!-- 分页 -->
	  <el-row>
		  <el-col :span="24">
			  <div class="pagination">
			  <el-pagination
			        v-model:current-page.sync="paginations.page_index"
			        v-model:page-size="paginations.page_size"
			        :page-sizes="paginations.page_sizes"
			        :small="small"
			        :disabled="disabled"
			        :background="background"
			        :layout="paginations.layout"
			        :total="paginations.total"
			        @size-change="handleSizeChange"
			        @current-change="handleCurrentChange"
			      />
				  </div>
		  </el-col>
	  </el-row>
	  </div>
	  <Dialog :option="dialog.option" :formData="formData" :title="dialog.title" :show="dialog.show" @onEvent="setshow()" @update="getProfile()"></Dialog>
	</div>
</template>

<script>
	import Dialog from '../components/Dialog'
	export default{
		name:"fundlist",
		data(){
			return{
				search_date:{
					startTime:'',
					endTime:'',
				},
				filterTableData:[],
				tableData:[],
				alltableData:[],
				dialog:{
					show:false,
					title:"",
					option:"edit"
				},
				formData:{
					type:"",
					describe:"",
					income:"",
					expend:"",
					cash:"",
					remark:"",
					id:""
				},
				paginations:{
					page_index:1, //当前位于哪一页
					total:0, //总数
					page_size:5, //一页显示多少条
					page_sizes:[5,10,15,20] ,//每页显示多少条
					layout:"total,sizes,prev,pager,next,jumper"
				}
			}
		},
		computed:{
			user(){
				return this.$store.getters.user;
			}
		},
		created(){
			this.getProfile();
			
		},
		components:{
			Dialog
		},
		methods:{
			getProfile(){
				//获取表格数据
				this.$axios.get("http://127.0.0.1:5000/api/profiles")
						   .then(res=>{
							   this.alltableData = res.data
							   this.filterTableData = res.data
							   
							   //设置分页数据
							   this.setPaginations();
						   })
						   .catch(err=>console.log(err))
			},
			setPaginations(){
				//分页属性设置
				this.paginations.total=this.alltableData.length;
				this.paginations.page_index = 1;
				this.paginations.page_size = 5;
				
				//设置默认分页数据
				this.tableData = this.alltableData.filter((item,index)=>{
					return index < this.paginations.page_size;
				})
			},
			handleEdit(index,row){
				this.dialog.title='修改资金信息'
				this.dialog.show=true
				this.dialog.option="edit"
				this.formData = {
					type:row.type,
					describe:row.describe,
					income:row.income,
					expend:row.expend,
					cash:row.expend,
					remark:row.remark,
					id:row._id
				}
			},
			handleDelete(index,row){
				this.$axios.delete(`http://127.0.0.1:5000/api/profiles/delete/${row._id}`)
				           .then(res=>{
							   this.$message('删除成功！')
							   this.getProfile()
						   })
			},
			handleAdd(){
				this.dialog.title='添加资金信息'
				this.dialog.show=true
				this.dialog.option="add"
				this.formData = {
					type:"",
					describe:"",
					income:"",
					expend:"",
					cash:"",
					remark:"",
					id:""
				}
			},
			setshow(data){
				
				this.dialog.show=data
			},
			handleSizeChange(page_size){
				//切换size
				this.paginations.page_index = 1;
				this.paginations.page_size = page_size;
				this.tableData = this.alltableData.filter((item,index)=>{
					return index < page_size;
				})
			},
			handleCurrentChange(page){
				// 获取当前页
				let index = this.paginations.page_size * (page-1);
				// 数据的总数
				let nums = this.paginations.page_size * page
				
				//容器
				let tables=[];
				for(let i=index;i<nums;i++){
					if(this.alltableData[i]){
						tables.push(this.alltableData[i])
					}
					this.tableData = tables;
				}
			},
			handleSearch(){
				if(!this.search_date.startTime || !this.search_date.endTime){
					this.$message({
						type:'warning',
						message:'请选择时间'
					});
					this.getProfile();
					return;
				}
				const sTime=this.search_date.startTime.getTime();
				const eTime=this.search_date.endTime.getTime();
				
				this.alltableData = this.filterTableData.filter(item=>{
					console.log(item)
					let date = new Date(item.date);
					let time = date.getTime()
					return time >= sTime && time <= eTime;
				});
				
				//分页数据的调用
				this.setPaginations()
			}
		}
	}
</script>

<style scoped>
	.fillcontain {
	  width: 100%;
	  height: 100%;
	  padding: 16px;
	  box-sizing: border-box;
	}
	.btnRight {
	  float: right;
	  width: ;
	}
	.pagination{
		float:right;
		margin-top: 10px;
	}
</style>