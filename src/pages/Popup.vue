
<template>
  <q-layout view="hHh lpR fFf" class="pupupPage  bg-grey-8">
    <q-header elevated class="bg-grey-7 text-white">
      <q-toolbar>
        
        <q-toolbar-title @click="onClickIndex" class="cursor">
          <q-avatar>
            <img src="https://cdns.7dtime.com/z39pc/img/logo100.d2ae20f.png">
          </q-avatar>
          <span class="q-pl-sm text-subtitle1">追踪时间清单</span>
        </q-toolbar-title>
        
        <q-space />

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
          
          <q-btn v-if="!uid" round push color="primary" icon="person" size="sm"  @click="doLogin"> 
            <q-tooltip>登录注册</q-tooltip>            
          </q-btn>
          <q-btn v-else flat size="sm"  @click="doLogin"> 
            <q-avatar size="26px">
              <img src="/head/1.jpg">
            </q-avatar>
            <q-tooltip>账号：{{ this.username || this.email || this.uid }}</q-tooltip>
            
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container >
      <div class="q-pa-md row justify-center">
        <div class="bexState">
            <div class="row  bg-grey-7 rad8"> 
            <div class="col-6 q-pa-md text-white" @click="testBrige"> 
              <div class=" q-pb-xs">今天所有时间</div>
              <div class=" q-pb-xs text-h4">{{ formatTime(duration) }}</div>
              <div class=" q-pb-xs">
                <q-linear-progress dark stripe size="10px" :value="progress1" />
                <q-linear-progress dark stripe rounded size="10px" :value="progress2" color="warning" class="q-mt-xs" />
              </div>
              <div>“更多”，相比历史平均耗时</div>
            </div>
            <div class="col-6 q-pa-md  text-white">            
              <div class=" q-pb-xs text-grey-8">-</div>
              <div class=" q-pb-xs text-h4">生产率：{{productivity}}%<span class="text-h5"> +{{productivityExt}}% 
                <q-tooltip content-class="bg-white text-black">未分类部分,可能会有工作时间</q-tooltip></span></div>
              <div class=" q-mb-xs todo_con" >
                <div v-if="todoLife" class="colorTest todo_5_color" :style="{width:todoLife+'px'}"><q-tooltip content-class="bg-white text-black">生活类时间</q-tooltip></div>
                <div v-if="todo4" class="colorTest todo_4_color" :style="{width:todo4+'px'}"><q-tooltip content-class="bg-white text-black">不紧急不重要：娱乐类时间</q-tooltip></div>
                <div v-if="todo3" class="colorTest todo_3_color" :style="{width:todo3+'px'}"><q-tooltip content-class="bg-white text-black">紧急不重要：浏览网页，获取信息</q-tooltip></div>
                <div v-if="todoNo" class="colorTest todo_no_color" :style="{width:todoNo+'px'}"><q-tooltip content-class="bg-white text-black">未分类时间</q-tooltip></div>
                <div v-if="todo2" class="colorTest todo_2_color" :style="{width:todo2+'px'}"><q-tooltip content-class="bg-white text-black">重要：学习类</q-tooltip></div>
                <div v-if="todo1" class="colorTest todo_1_color" :style="{width:todo1+'px'}"><q-tooltip content-class="bg-white text-black">重要紧急：生产类，工作创造价值</q-tooltip></div>
                <!-- <q-linear-progress dark stripe size="23px" :value="progress1" /> -->
              </div>
              <div>{{productivityNormal}}%，您日常的生产率</div>
            </div>
          </div>

          <div class="row q-mt-md bg-grey-7  text-white rad8">
            <div class="col-7 q-ma-md line">
              <div class=" q-pb-xs text-grey-5">当前的在：</div>
              <div class=" q-pb-xs  text-h6 text-bold"> {{urlCurr}}</div>
              <div class="row q-pb-xs" >
                <div class="col-auto q-pr-sm div_a_link">您今天已经在这里用了： {{ formatTime(urlUsedTime) }}</div>
                <q-icon class="q-pl-md" name="send" size="xs" />
                <q-tooltip content-class="bg-white text-black">点击查看访问时长</q-tooltip>
              </div>
            </div>
            <div class="col-4 q-pt-md ">
              <div class=" q-pb-xs text-grey-5">当前分类：</div>
              <div class="row q-pb-xs text-h6 text-bold cursor" @click="jumpTo('/config')" >
                <div class="col-auto q-pr-sm">{{type}}</div>
                <!-- <q-btn flat icon="edit" /> -->
                <q-icon name="edit" class="q-pt-xs" size="sm" />
                <q-tooltip content-class="bg-white text-black">点击修改分类</q-tooltip>
              </div>
              <div class="row q-pb-xs"  @click="jumpTo('/config')">
                <div class="col-auto q-pr-sm div_a_link">今天总时长： {{formatTime(durationType)}}</div>
                <q-icon class="q-pl-md" name="send" size="xs" />
                <q-tooltip content-class="bg-white text-black">点击查看分类下所有时间</q-tooltip>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <!-- <div style="">
                
      </div> -->
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title class=" text-subtitle1">          
          已超越185,130人，超越全国95%
        </q-toolbar-title>
        <q-space />
        
        <div class="q-gutter-sm row items-center no-wrap">
          <q-toolbar-title class=" text-subtitle1 ">          
            by {{urlWWW}}
          </q-toolbar-title>
        </div>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import {mapState,mapActions} from 'vuex' ;
import { Loading } from 'quasar'
import moment from 'moment' ;
import random from "random-string";
const UrlLib  = require('url');
import api from '../boot/api.js'
import { route } from 'quasar/wrappers';

export default {
  
  computed: {
    ...mapState({
      uid:state=> state.base.uid ,
      username:state=> state.base.username ,
      head:state=> state.base.head ,
      email:state=> state.base.email ,
    }),
  },
  created: async function(){
    // this.$q.bex.on('bex.action.url', this.updateUrl)
    console.log('popup created' ) ;
    console.log('popup created bex.tab.opened' ) ;
    this.testBrige();
    await this.checkLogin();
    await this.readyToGetData() ;
    // await this.getTimeData();
  },
  activated:function(){
    console.log('activated not in,url',window.location.href)
  },
  methods: {
    onClickIndex(url){
      if( this.$q.platform.is.bex ){
          window.open( this.urlWWW ,'_blank')
      }else{
        this.$router.push('/');
      }
    },
    doOnTabOpened (url) {
      console.log('New Browser Tab Openend: ', url)
    },
    async readyToGetData(){
      let hasInitBex = false ;
      if( this.$q.platform.is.bex ){
          chrome.windows.getCurrent({populate: true}, (windowData)=>{
            if(typeof(windowData) !== "undefined" && windowData.state != "minimized"){
                var [activeTab] = windowData.tabs.filter(tab=>tab.active === true);
                if (typeof(activeTab) !== "undefined") {
                  hasInitBex = true ;
                  this.getTimeData( activeTab.url );
                } else {
                  console.log('browser tab: no current active tab');
                  this.getTimeData();
                }
            } else {
              console.log('browser window: no current window exists');
              this.getTimeData();
            }
          })
      }else{
        await this.getTimeData( window.location.host );
      }
    },
    async testBrige(){
      console.log('testbrige')
       
      // let re = await QBexBridge.send('wb.drawer.toggle', {        open: 111      })        
      // console.log('popup created ,bex :' , re) ;        
      // try{
        
      //   let r = await this.$q.bex.send('wb.drawer.toggle', {        open: 123      })        
      //   console.log('popup created ,bex :' , r) ;        
      // }catch(e){
      //   console.log('chrome.tabs.query err:' , e ) ;
      // }
    },
    formatTime(duration){      
      return moment('2000-01-01').add(duration,'m').format('H小时 m分钟');
    },
    formatWidth(val){
      return Math.ceil( val * 300 ) ;
    },
    jumpTo(path){
      this.$router.push(path);
    },
    updateUrl(val){
      console.log('bex.action.url updateUrl:' , val) ;

    },
    async getTimeData( link ){
        // Loading.show()
        let times, typeArr , typeNameArr , type1, type2,type3,type4,typeLife, typeNo , duration , url;
        link = link || window.location.host ;
        let { protocol , host} = UrlLib.parse( link ) ;
        url = protocol.includes('localhost:')? `${protocol}${host}`:host ;
        console.log('link:' , UrlLib.parse( link ) )

        let day = moment().format("YYYY-MM-DD") ;
        let data = await this.$api.actionGet({day , url, uid: this.uid });
        if( !data ) return this.$q.notify('网络异常')
        if( data.errmsg ) return this.$q.notify('失败：'+data.errmsg) ;
        data = data.data ;
        times = data.res , duration= eval( times.map(i=>i.duration||0).join('+') );
        this.duration = duration ;
        if(data.productivityNormal) this.productivityNormal = data.productivityNormal || 0;
        this.urlCurr = url , this.urlUsedTime = eval( times.filter(i=>i.url.includes(this.urlCurr)).map(i=>i.duration||0).join('+') ) ;
        type1 = eval( times.filter(i=>i.type ==1 ).map(i=>i.duration||0).join('+') ) ||0;
        type2 = eval( times.filter(i=>i.type ==2).map(i=>i.duration||0).join('+') ) ||0;
        type3 = eval( times.filter(i=>i.type ==3).map(i=>i.duration||0).join('+') ) ||0;
        type4 = eval( times.filter(i=>i.type ==4).map(i=>i.duration||0).join('+') ) ||0;
        typeLife = eval( times.filter(i=>i.type ==5).map(i=>i.duration||0).join('+') ) ||0;
        typeNo = eval( times.filter(i=> !i.type ).map(i=>i.duration||0).join('+') ) ||0;
        typeArr = [ typeNo , type1, type2,type3,type4,typeLife] ;
        typeNameArr = ['未分类','生产/工作','阅读学习','聊天/新闻','娱乐'] ;
        this.todo1 = this.formatWidth( type1 /duration ) ;
        this.todo2 = this.formatWidth( type2 /duration ) ;
        this.todo3 = this.formatWidth( type3 /duration ) ;
        this.todo4 = this.formatWidth( type4 /duration ) ;
        this.todoLife = this.formatWidth( typeLife /duration ) ;
        this.todoNo = this.formatWidth( typeNo /duration ) ;
        this.productivity = Math.ceil( 100 * (type1+type2) /duration ) , this.productivityExt = Math.ceil( 100* typeNo /duration ) ;
        this.durationType = typeArr[data.type] , this.type = typeNameArr[data.type] || '未分类';
        // Loading.hide();
        console.log('created,url', url , data , Math.ceil( 100 * (type1+type2) /duration ) , Math.ceil( 100* typeNo /duration ) )
      
    },
    async checkLogin(){
      let  { email,ukey,ukeyBex,ukeyH5,ukeyPC,ukeyApp, auto , all } = localStorage ;
      // let data = await this.$axios.get(`http://localhost:8401/api/login`,{params:{ email,ukey,ukeyBex,ukeyH5,ukeyPC,ukeyApp }}).then(r=>r.data).catch(e=> {}) ;
      let data = await this.$api.loginGet({ email,ukey,ukeyBex,ukeyH5,ukeyPC,ukeyApp });      
      if( !data ) return console.log('网络异常');
      if( data.errno ) this.$q.notify(data.errmsg) ;
      if( !data.errno ) {
        data = data.data ;
        for(let key in data) localStorage[key] = data[key] ;
        if( data.token ) this.$api.setToken(data.token) ;
        // this.$q.notify({message:'已登录成功',icon: 'announcement'}) ;
      }
      console.log('popup checklogin:' , data)
    },
    async doLogin(){
      if( this.$q.platform.is.bex ) {
        let ukeyBex = localStorage['ukeyBex'] || random({length:18}) ;
        this.urlWWW = 'http://localhost:8080' ; // 开发时测试地址。
        localStorage['ukeyBex'] = ukeyBex ;
        window.open( `${this.urlWWW}/#/?auto=1&ukeyBex=${ukeyBex}`, '_blank');
        let hasLogin , count = 60 ;
        let tempId =  setInterval(async ()=>{
          count-- ;
          if( count < 0 || hasLogin ) return clearInterval(tempId) ;
          // let data = await this.$axios.get(`http://localhost:8401/api/login`,{params:{ ukeyBex }}).then(r=>r.data).catch(e=> {}) ;
          let data = await this.$api.loginGet({ ukeyBex });
      
          if( !data ) return console.log('网络异常')
          if( !data.errno ) {
            data = data.data ;
            for(let key in data) localStorage[key] = data[key] ;
            this.$q.notify({message:'已登录成功',icon: 'announcement'}) ;
          }
        },1000)
      }else this.$router.push('/?auto=1');
    }
  },
  data () {
    return {
      leftDrawerOpen:true ,
      duration:0,
      productivity:0,
      productivityExt:0,
      productivityNormal:81,
      urlCurr:'',
      urlUsedTime:0,
      durationType:0 ,
      type:'' ,
      progress1:0.5,
      progress2:0.65,
      todo1: 40,
      todo2: 40,
      todo3: 40,
      todo4: 40,
      todoLife: 40,
      todoNo: 160,
      total: 300,
      urlWWW:'http://log.todo8.cn',
    }    
  }
}
</script>

<style>
.pupupPage{
  /* width:700px;height:350px; */
}
.bexState{
  /* width:700px;height:350px; */
  max-width: 800px;
  width:700px;
}
.tableCon { width: 760px;}
.line{
  border-right: 2px solid #dcdedc;
}
.div_a_link{
  border-bottom:#a9a6a6 1px dotted ;
  cursor: pointer;
}
.cursor{
  cursor: pointer;
}
.rad8{ border-radius: 8px;}
.colorTest{ height: 19px; margin: 1px; border: 1px solid #aba4a4; }
.todo_con{ padding: 1px; border: 1px solid #989292; border-radius: 4px; height: 25px;overflow-y: hidden;overflow-x: auto;display: flex;white-space: nowrap;}
.todo_1_color{ border-radius: 4px; background-color: #1976d2;}
.todo_2_color{ border-radius: 4px; background-color: #3b8ad9;}
.todo_3_color{ border-radius: 4px; background-color: #b64f4f;}
.todo_4_color{ border-radius: 4px;background-color: #ec5d5d}
.todo_5_color{ border-radius: 4px;background-color: #daae1e;}
.todo_no_color{ border-radius: 4px;background-color: #575756;}
</style>