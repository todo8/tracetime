
<template>
  <q-layout view="hHh lpR fFf" class="  bg-grey-8  text-white">
    <div style="height:1px;width:700px;"></div>
    <q-header elevated class="bg-grey-7 text-white">
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
          
          <q-btn v-if="!uid" round push color="primary" icon="person" size="sm" > 
            <q-tooltip>登录注册</q-tooltip>            
          </q-btn>
          <q-btn v-else flat size="sm" > 
            <q-avatar size="26px">
              <img src="/head/1.jpg">
            </q-avatar>
            <q-tooltip>账号：{{ this.username || this.email || this.uid }}</q-tooltip>
            
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      id="dack"
      :width="240"
      content-class="bg-grey-7"
    >
      <q-list padding>
        <q-item tag="a" :href="item.link" v-for="item in linksData" :key="item.text" v-ripple clickable >
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
        <q-item tag="a" :href="item.link" v-for="item in showData" :key="item.text" v-ripple clickable >
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
        <q-item tag="a" :href="item.link" v-for="item in baseData" :key="item.text" v-ripple clickable >
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

        <div class="q-pa-md row justify-center " id="grey_table">
            <div class="column tableCon">
                <div id="fixLabel" class="rad8 bg-grey-7 q-pa-sm q-mb-sm row justify-between">                    
                    <q-select class="bg-grey-6 col-3 rad8" clearable  filled v-model="typeSelect" :options="typeNameOptions" label="类型："  dense/>
                    <div class="col-4 ">
                        <q-input class="  rad8"  dense filled v-model="date" mask="date" first-day-of-week="1" :rules="['date']">
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                    <q-date v-model="date">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                    </q-date>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                </div>
                <div class=" q-pb-sm">
                    <q-table
                        title="设置分类"
                        :data="data"
                        :columns="columns"
                        row-key="_id"
                        rows-per-page-label="每页显示数量："
                        :pagination="{rowsPerPage:10}"
                        binary-state-sort
                        
                        dark
                        color="amber"
                        >
                        <template v-slot:body="props">
                            <q-tr :props="props" @click.native="onItemclick(props.row)">
                            <!-- <q-td key="desc" :props="props">
                                {{ props.row.name }}
                                <q-popup-edit v-model="props.row.name">
                                <q-input v-model="props.row.name" dense autofocus counter />
                                </q-popup-edit>
                            </q-td> -->
                            <q-td key="percent" :props="props">{{ props.row.percent }}</q-td>
                            <q-td key="duration" :props="props">{{ formatTime1(props.row.duration) }}</q-td>
                            <q-td key="title" :props="props">{{ props.row.title.substr(0,20) }}</q-td>    
                            <q-td key="domain" :props="props">{{ props.row.domain }}</q-td>                    
                            <q-td key="type" :props="props">{{ typeNameArr[ props.row.type||0 ] }}</q-td>
                            <q-tooltip content-class="bg-white text-black">标题：{{props.row.title}}<br><br>提示：点击后，在下方可修改分类。</q-tooltip>
                            </q-tr>
                        </template>
                    </q-table>
                </div>
                <div class="rad8 q-pa-sm bg-grey-7 row justify-between">
                    <q-input class="bg-grey-6 q-mr-sm rad8" placeholder="网址：" filled v-model="domain" dense />
                    <div class="q-gutter-sm q-mr-sm ">
                        <q-radio dark keep-color v-model="type" val="5" label="生活" color="orange" />
                        <q-radio dark keep-color v-model="type" val="4" label="娱乐" color="red-10" />
                        <q-radio dark keep-color v-model="type" val="3" label="干扰" color="red-4" />
                        <q-radio dark keep-color v-model="type" val="2" label="学习" color="blue-6" />
                        <q-radio dark keep-color v-model="type" val="1" label="工作" color="blue-14" />
                        <q-radio dark keep-color v-model="type" val="0" label="未分类" color="grey-10" />
                    </div>
                    <q-btn class="bg-grey-6 rad8" text-color="black" size="xs" label="提交"  @click="onChangeType"/>
                </div>
            </div>
        </div>
        
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
import _ from "lodash"
const UrlLib  = require('url');

const linksData = [
  {text: '主页',icon: 'home',link: '/#/'},
  {text: '时间报表',icon: 'score',link: '/#/dashboard'},
  {text: '分类设置',icon: 'settings',link: '/#/config'},
  // {text: '插件窗口',icon: 'extension',link: '/#/popup'  }, //只在插件中显示,不在浏览器显示。
  {text: '插件选项',icon: 'tune',link: '/#/options'  }
];
const showData = [
  {text: '下载软件',icon: 'download',link: '/#/download'},
  {text: '视频教程',icon: 'live_tv',link: '/#/video'},
] ;
const baseData = [
  {text: '相关产品',icon: 'help',link: '/#/products'},
  {text: '关于我们',icon: 'feedback',link: '/#/aboutus'},
] ;


export default {
  components: {  },
  computed: {
    ...mapState({
      uid:state=> state.base.uid ,
      username:state=> state.base.username ,
      head:state=> state.base.head ,
      email:state=> state.base.email ,
    }),
  },
  created: async function(){
    let day = moment().format("YYYY/MM/DD") ;
    let {type} = this.$route.query ;
    if(type) this.typeSelect = this.typeNameOptions[type] ;
    this.initDay(day);
  },
  activated:function(){
      
  },
  watch: {
    "date":function(val){
        this.initDay(val);
        console.log('data:' , val , this.date  )
    },
    "typeSelect":function(val){        
        if( this.typeSelect ) this.data = this.domainAll.filter(i=> i.type==this.typeSelect.value ) ;
        else this.data = this.domainAll ;
        console.log('typese',val)
    }
  },
  methods: {
    formatTime1(duration){      
      return moment('2000-01-01').add(duration,'m').format('H:mm').replace('0小时 ','') ;
    },
    onItemclick(row){ // evt, row, index
        console.log("onItem",row )
        this.domain = row.domain , this.type = row.type + '' ;
    },
    async initDay(day){
        if(this.date == day ) return;
        // Loading.show();
        let times, typeArr , typeNameArr , type1, type2,type3,type4,typeLife, typeNo , duration , url;
        url = window.location.host ;
        this.date = day ;
        day = day.replace('/','-') ; // moment(day).format("YYYY-MM-DD") ;
        let data = await this.$api.actionGet({day , hasUid:true , uid: this.uid }) ; //, url  是在浏览器插件pop页面使用的.
        if( !data ) return this.$q.notify('网络异常')
        if( data.errno ) return this.$q.notify('失败：'+data.errmsg) ;
        data = data.data ;
        times = data.res , duration= eval( times.map(i=>i.duration||0).join('+') );
        // this.data = times ;
        let domainDic , configDic , domainList ;
        domainDic = {}, configDic = {} , domainList = [] ;
        times.forEach(i=> i.domain = UrlLib.parse(i.url).host || (i.url.replace(/.*\\/,'') ) )  ;
        domainDic = _.groupBy( times , 'domain');    
        for(var key in domainDic){
            let links = domainDic[key] ;
            links.forEach((item,index)=>{
                if(index == 0) domainList.push(item)  ;
                else{
                    let first = links[0] ;
                    first.duration += item.duration ;
                }            
            })
        }
        domainList.forEach(i=>{
            i.percent = `${Math.ceil(i.duration / duration *100)}%` ; 
            i.type = i.type || 0 ;
        })
        domainList = _.orderBy(domainList,['duration'],['desc'])
        // console.log("times:", times , domainList) ;
        this.domainAll = domainList ;
        if( this.typeSelect != '') this.data = this.domainAll.filter(i=> i.type==this.typeSelect.value ) ;
        else this.data = domainList ;

        // times.forEach(i=> configDic[ ] = i.type )
        // res.forEach(i=>  i.type = configDic[ UrlLib.parse( i.url ).host  ] ) ;
        // Loading.hide();
    },
    async onChangeType(){
        if(!this.domain) return this.$q.notify('请填写网址或程序' ) ;
        if(!this.type) return this.$q.notify('请选择类型' ) ;      
        console.log('onChangeType' , this.type , this.domain )
        let url = UrlLib.parse( this.domain ).host ;  //避免手动输入的链接中包含http
        let sdata = {url: url || this.domain ,type:this.type , uid: this.uid } ;  // 需要修改，未登录的测试数据
        // let data = await this.$axios.post(`http://localhost:8401/api/config`, sdata).then(r=>r.data).catch(e=> {}) ;
        let data = await this.$api.configPost(sdata) ;        
        if( !data ) return this.$q.notify('网络异常')
        if( data.errmsg ) return this.$q.notify('失败：'+data.errmsg) ;
        this.$q.notify('配置成功');
        this.data.forEach(i=> {
            if(i.domain== this.domain) i.type = this.type ;
        } )
        // this.domain = '' ;
    }
  },
  data () {
    return {
        leftDrawerOpen: false,
        linksData: linksData,
        showData : showData ,
        baseData : baseData ,
        urlWWW:'http://log.todo8.cn',
        typeNameArr : ['未分类','生产/工作','阅读学习','聊天/新闻','娱乐'] , 
        typeNameOptions : [{label:'未分类',value:0},{label:'生产/工作',value:1},{label:'阅读学习',value:2},{label:'聊天/新闻',value:3},{label:'娱乐',value:4}] ,
        domain:'' ,
        type:'',
        typeSelect:'',
        colorArr: ["#575756","#1976d2","#3b8ad9","#b64f4f","#ec5d5d","#daae1e"],
        columns: [
            { name: 'percent', align: 'center', label: '%', field: 'percent' , style: 'width: 70px', sortable: true },
            { name: 'duration',align: 'left',  label: '时间', field: 'duration' , style: 'width: 80px' , sortable: true}, // 
            { name: 'title',align: 'left',  label: '标题', field: 'title' , style: 'width: 300px' },
            { name: 'domain',align: 'left',  label: '域名(程序)', field: 'domain'  },
            { name: 'type',align: 'center',  label: '分类', field: 'type' , sortable: true }
        ],
        date: '',
        domainAll: [] ,
        //   percent,duration,title,url,type,
        data: [
            {
            percent: '42%',
            duration: 64,
            title: '追踪时间清单-测试数据',
            domain:'log.todo8.cn',
            type: 0
            }
        ]    
    }    
  }
}
</script>

<style>

.tableCon { width: 760px;}
#grey_table .q-dark{ background: #757575; }
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
#dack aside { border-right: 0px; }
#fixLabel label{height: 40px;}
.rad8{ border-radius: 8px;}
.colorTest{ height: 19px; margin: 1px; border: 1px solid #aba4a4; }
.todo_con{ padding: 1px; border: 1px solid #989292; border-radius: 4px; height: 25px;overflow-y: hidden;overflow-x: auto;display: flex;white-space: nowrap;}
.todo_1_color{ border-radius: 4px; background-color: rgb(25 118 210);}
.todo_2_color{ border-radius: 4px; background-color: rgb(59 138 217);}
.todo_3_color{ border-radius: 4px; background-color: rgb(182, 79, 79);}
.todo_4_color{ border-radius: 4px;background-color: #ec5d5d}
.todo_5_color{ border-radius: 4px;background-color: rgb(218, 174, 30);}
.todo_no_color{ border-radius: 4px;background-color: rgb(87, 87, 86);}
</style>