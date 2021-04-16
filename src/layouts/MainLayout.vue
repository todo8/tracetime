<template>
  <q-layout view="hHh Lpr lFf" class=" bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 " >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdns.7dtime.com/z39pc/img/logo100.d2ae20f.png">
          </q-avatar>
          <span class="q-pl-sm text-subtitle1">追踪时间清单</span>
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn flat>
            查看更多
          </q-btn>
          <!-- <q-btn round flat>
            赚钱
            <q-tooltip>我有时间，想要兼职赚钱。<br>
              我有需求：想要付费求助。</q-tooltip>
          </q-btn> 
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>系统消息</q-tooltip>
          </q-btn> -->

          <q-btn v-if="!uid" round push color="primary" icon="person" size="sm"  @click="onLoginRegist"> 
            <q-tooltip>登录注册</q-tooltip>            
          </q-btn>
          <q-btn v-else flat size="sm"> 
            <q-avatar size="26px">
              <img src="/head/1.jpg">
            </q-avatar>
            <q-tooltip>账号：{{ this.username || this.email || this.uid }}</q-tooltip>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="onBind">绑定邮箱</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="onChange">切换账号</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="240"
      content-class="bg-grey-2"
    >
      <q-list padding>
        <q-item tag="a" :href="item.link" :active="'/#'+$route.path==item.link" active-class="bg-grey-4" v-for="item in linksData" :key="item.text" v-ripple clickable >
          <q-item-section avatar>
            <q-icon  color="grey" :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
        </q-item>        
      </q-list>
      <q-separator class="q-my-md" />
      <q-list>
        <q-item tag="a" :href="item.link" :active="'/#'+$route.path==item.link" active-class="bg-grey-4" v-for="item in showData" :key="item.text" v-ripple clickable >
          <q-item-section avatar>
            <q-icon  color="grey" :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
        </q-item>        
      </q-list>
      <q-separator class="q-my-md" />
      <q-list>
        <q-item tag="a" :href="item.link" :active="'/#'+$route.path==item.link" active-class="bg-grey-4" v-for="item in baseData" :key="item.text" v-ripple clickable >
          <q-item-section avatar>
            <q-icon  color="grey" :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
        </q-item>        
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import {mapState,mapActions} from 'vuex' ;
import random from "random-string";
// import api from '../boot/api.js'

const linksData = [
  {text: '主页',icon: 'home',link: '/#/'},
  {text: '成长时间',icon: 'score',link: '/#/dashboard'}, // 时间报表
  {text: '分类设置',icon: 'settings',link: '/#/config'},
  {text: '影响指数',icon: 'emoji_events',link: '/#/influence'  },
  // {text: '插件窗口',icon: 'extension',link: '/#/popup'  }, //只在插件中显示,不在浏览器显示。
  // {text: '插件选项',icon: 'tune',link: '/#/options'  },
  {text: '保持专注',icon: 'center_focus_strong',link: '/#/focus'  },
];
const showData = [
  {text: '人生意义',icon: 'verified',link: '/#/videos'},  //live_tv
  {text: '下载软件',icon: 'download',link: '/#/download'},
  {text: '提问回答',icon: 'help',link: 'https://www.zhihu.com/topic/21239822/hot'},
] ;
const baseData = [
  // {text: '相关产品',icon: 'help',link: '/#/products'},
  {text: '反馈建议',icon: 'feedback',link: '/#/feedback'},
  {text: '关于我们',icon: 'contact_page',link: '/#/about'},
] ;

export default {
  name: 'MainLayout',
  components: {  },
  computed: {
    ...mapState({
      uid:state=> state.base.uid ,
      username:state=> state.base.username ,
      head:state=> state.base.head ,
      email:state=> state.base.email ,
    }),
  },

  data () {
    return {
      leftDrawerOpen: false,
      linksData: linksData,
      showData : showData ,
      baseData : baseData ,
    }
  },
  created:async function(){    
    console.log('this.$route.path:', this.$route.path)
    this.doLogin();
  },
  methods: {
    async doLogin(autoRegist){
      let data , token , { email,ukey,ukeyBex,ukeyPC,ukeyH5,ukeyApp, auto } = this.$route.query ;
      let hasKey = email || ukey|| ukeyBex || ukeyPC || ukeyH5|| ukeyApp ;
      if( !hasKey && !autoRegist) return console.log('还未注册过' ,this.$route.query) ;
      ukey = localStorage['ukey'] , auto = auto || autoRegist ; // , auto = auto || hasKey
      console.log("this.$q.platform.is.desktop:" ,this.$q.platform.is.desktop)
      if( !ukey && this.$q.platform.is.desktop ) ukey = random({ length: 16 }) ;
      // data = await this.$axios.get(`http://localhost:8401/api/login`,{params:{ email,ukey,ukeyBex,ukeyH5,ukeyPC,ukeyApp, auto }}).then(r=>r.data).catch(e=> {}) ;
      data = await this.$api.loginGet({ email,ukey,ukeyBex,ukeyH5,ukeyPC,ukeyApp, auto });      
      if( !data ) return this.$q.notify('网络异常')
      if( data.errno ) return this.$q.notify('失败：'+data.errmsg) ;      
      this.$q.notify({message:'已登录成功',icon: 'announcement'}) ;
      if( ukeyBex ) this.$q.dialog({title: '登录成功',message: '在插件中已自动登录'}).onOk(() => {}).onCancel(() => {}) ;
      else if( ukeyPC ) this.$q.dialog({title: '登录成功',message: '在客户端中已自动登录'}).onOk(() => {}).onCancel(() => {}) ;
      if( ukeyBex || ukeyPC ) this.$router.push('/');
      data = data.data ;
      
      for(let key in data) localStorage[key] = data[key] ;
      if( data.token ) this.$api.setToken(data.token) ;
      this.$store.commit('base/login' , data ) ;
      console.log('index login:' , this.uid , this.username )

      if(ukey) localStorage['ukey'] = ukey ;
      console.log('hello index' , this.$q.platform.is, 'bex:' , this.$q.platform.is.bex , 'desktop' , this.$q.platform.is.desktop , ukey ,data ) ;
      return true ;
    },
    onClickPage(item){
      this.$router.push(item.link)
    },
    async onLoginRegist(){
      let ok = await this.doLogin(true);
      if(ok && !this.email) this.onBind();
    },
    onBind(evt ,defaultVal){
       this.$q.dialog({
        title: '绑定邮箱',
        message: '用于登录指定账号，方便多台设备使用',
        prompt: {
          model: defaultVal || this.email || '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true,
      }).onOk(async(val) => {
        console.log('>>>> OK, received', val)
        let { ukey,ukeyBex,ukeyH5,ukeyPC,ukeyApp } = localStorage ;
        let sdata =  { ukey,ukeyBex,ukeyH5,ukeyPC,ukeyApp, email:val , auto : 1 }  ; // _id: this.uid 
        let data = await this.$api.loginGet(sdata);      
        if( !data ) return this.$q.notify('网络异常')
        if( data.errno ) return this.$q.notify('失败：'+data.errmsg),this.onBind( null ,val) ;    
        if( !data ) this.$q.notify('绑定成功') ;
        data = data.data ;  
        for(let key in data) localStorage[key] = data[key] ;
        if( data.token ) this.$api.setToken(data.token) ;
        this.$store.commit('base/login' , data ) ;
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
      // this.$q.dialog({title: '登录成功',message: '在客户端中已自动登录'}).onOk(() => {}).onCancel(() => {}) ;
    },
    onChange(){     
      this.$q.dialog({
        title: '切换账号',
        message: '输入邮箱或账号ID即可快速切换',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true,
      }).onOk(async(val) => {
        console.log('>>>> OK, received', val)
        let sdata = val.includes('@') ? { email:val ,changeAccount:1 } : { _id:val ,changeAccount:1 } ;
        let data = await this.$api.loginGet(sdata);      
        if( !data ) return this.$q.notify('网络异常')
        if( data.errno ) return this.$q.notify('失败：'+data.errmsg),this.onChange() ;    
        if( !data ) this.$q.notify('切换成功')
        data = data.data ;  
        for(let key in data) localStorage[key] = data[key] ;
        if( data.token ) this.$api.setToken.setToken(data.token) ;
        this.$store.commit('base/login' , data ) ;
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    onLogout(){
      this.$store.commit('base/login' , {} ) ;
    },
  },
}
</script>
