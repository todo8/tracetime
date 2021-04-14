<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>

export default {
  name: 'App',
  mounted:async function(){
  },
  created: async function(){  
    // this.$route.query 获取失败，
    let  { token , email,ukey,ukeyBex,ukeyPC,ukeyH5,ukeyApp ,auto } = Object.assign( {} , this.$route.query , localStorage )  ; 
    let hasKey = token || email || ukey|| ukeyBex || ukeyPC || ukeyH5|| ukeyApp ;
    if( !hasKey ) return ;
    let data = await this.$api.loginGet({ token , email,ukey,ukeyBex,ukeyPC,ukeyH5,ukeyApp,auto });
    if( !data.errno ) this.$store.commit('base/login' , data.data ) ;
    console.log('app.vue :' , data)
  }
}
</script>
