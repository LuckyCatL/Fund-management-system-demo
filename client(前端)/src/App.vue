<template>
  <div id="nav">
  </div>
  <router-view/>
</template>

<script>
	import jwt_decode from 'jwt-decode';
	export default{
		name:'app',
		components:{},
		created(){
			if(localStorage.logintoken){
				const decoded = jwt_decode(localStorage.logintoken)
				this.$store.dispatch('setAuthenticated', !this.isEmpty(decoded))
				this.$store.dispatch('setUser', decoded)
			}
		},
		methods:{
			isEmpty(value){
				return(
					value === undefined ||
					value === null ||
					(typeof value === "object" && Object.keys(value).length===0) ||
					(typeof value === "string" && value.trim().length === 0)
				)
		}
		
	}
}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
