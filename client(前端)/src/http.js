import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus'
import router from './router'


let loading;

function startLoading(){
	loading = ElLoading.service({
		lock:true,
		text:'Loading...',
		background:'rgba(0,0,0,0.7)'
	});
}


function endLoading(){
	loading.close();
}

//请求拦截
axios.interceptors.request.use(config=>{
	//开始加载动画
	startLoading();
	
	//请求时判断是否有token
	if(localStorage.logintoken){
		//设置请求头
		config.headers.Authorization = localStorage.logintoken;
	}
	
	return config;
},error=>{
	return Promise.reject(error);
});


//响应拦截
axios.interceptors.response.use(response=>{
	//结束加载动画
	endLoading();
	console.log(response)
	return response;
},error=>{
	// console.log(error.message.data)
	endLoading();
	
	
	//获取状态码
	const { status } = error.response
	if(status == 401){
		ElMessage.error("token已失效，请再重新登录");
		
		//清除token
		localStorage.removeItem('logintoken');
		
		//跳转登录页面
		router.push("/login")
	}else{
		ElMessage.error(error.response.data);
	}
	
	
	return Promise.reject(error);
});



export default axios;