import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/index.vue'
import Register from '../views/Register'
import Login from '../views/Login'
import NotFound from '../views/404'
import Home from '../views/Home'
import InfoShow from '../views/InfoShow'
import FundList from '../views/FoundList'



const routes = [
  {
    path: '/',
    redirect:'/index'
  },
  {
    path: '/index',
    name: 'index',
	component:Index,
	children:[
		{
			path:'',
			component:Home
		},
		{
			path:'/home',
			name:'home',
			component:Home
		},
		{
			path:'/infoshow',
			name:'infoshow',
			component:InfoShow
		},
		{
			path:'/fundlist',
			name:'fundlist',
			component:FundList
		}
	]
  },
  {
    path: '/register',
    name: 'Resister',
  	component:Register
  },
  {
    path: '/login',
    name: 'Login',
  	component:Login
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
  	component:NotFound
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=>{
	const isLogin = localStorage.logintoken ? true : false;
	if(to.path == "/login" || to.path =="/register"){
		next();
	}else{
		isLogin? next():next('/login')
	}
})


export default router
