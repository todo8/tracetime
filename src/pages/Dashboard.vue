<template>
  <q-page class=" q-pa-sm q-gutter-y-sm">
    <div class="q-pa-sm rad8 row  bg-grey-6 " style="height:120px;">
      <div class="rad8 col-6">当日时间汇总 popup 图</div>
      <div class="rad8 col-6">时间分片图</div>
    </div>
    <div  class="  row  ">
      <div class="rad8 q-mr-sm bg-grey-6  col place">
          <v-chart
            :option="bar"
            :init-options="initOptions"
            ref="bar"
            theme="ovilia-green"
            autoresize
          />
        </div>
        <div class="rad8 bg-grey-6 col place">
          <v-chart
            :option="pie"
            :init-options="initOptions"
            ref="pie"
            autoresize
          />
        </div>
      
    </div>    
    <div  class=" row  ">
      <div class="rad8 bg-grey-6 col-12" style="height:150px;">
       碎片时间图-小时
      </div>
    </div>    
    <div class=" rad8 bg-grey-5 " >
      <div class="rad8 col-12"><canvas class="flagmentTimeMinu"></canvas></div>
      <div  id="flagmentTimeDrag" class="q-pl-sm q-pr-sm row rad8 bg-grey-6 " style="height:20px;">
        <div class=" col-12" style="text-align: center;display:flex;display: -webkit-flex; ">
          <div v-bind:class="{ show1: hour%2==1,show2: hour%2!=1 }" style="flex:1;" v-for="hour in hours"  :key='hour'>{{hour}}</div>
        </div>
        <q-range
          :style="trackStyle"
          class="custom-colored-range custom-colored-range--outside"
          v-model="model"
          :min="range.min"
          :max="range.max"
          :step="range.step"
          :left-label-value="model.min + '点'"
          :right-label-value="model.max + '点'"
          drag-range snap markers dense label
          color="orange"
        />
      </div>
    </div>  
      
    <div  class="  row  " style="height:480px;">
        <div class="rad8  q-mr-sm col-8 bg-grey-5">mactime程序列表-可能用表格</div>
        <div class="rad8 col bg-grey-6">设置分类。列表元素点击左键，或邮件弹出菜单按钮，</div>
    </div>
  </q-page>
</template>

<script>

// import moment from 'moment' ;
import {mapState,mapActions} from 'vuex' ;
import VChart, { THEME_KEY } from "vue-echarts";
import * as echarts from "echarts/core";
import {
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart
} from "echarts/charts";
import {
  GridComponent,
  PolarComponent,
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DatasetComponent
} from "echarts/components";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
const { use, registerMap, registerTheme } = echarts;
use([
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart,
  GridComponent,
  PolarComponent,
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DatasetComponent,
  CanvasRenderer,
  SVGRenderer
]);

import getBar from "../data/bar";
import pie from "../data/pie";
import polar from "../data/polar";
import scatter from "../data/scatter";
import map from "../data/map";
import moment from 'moment'
// import _ from 'underscore'
import _ from "lodash"

export default {
  name: 'PageIndex',
  components: { VChart } ,
  computed: {
    ...mapState({
      uid:state=> state.base.uid ,
      username:state=> state.base.username ,
      head:state=> state.base.head ,
    }),
    trackStyle () {
      const colors = []
      const { min, max } = this.range
      const range = max - min

      let prev = min

      for (let i = 0; i < this.zones.length; i++) {
        const zone = this.zones[i]

        if (zone.min > prev) {
          colors.push(`transparent ${(prev - min) / range * 100}%`)
          colors.push(`transparent ${(zone.min - min) / range * 100}%`)
        }

        colors.push(`${zone.color} ${(zone.min - min) / range * 100}%`)
        colors.push(`${zone.color} ${(zone.max - min) / range * 100}%`)

        prev = zone.max
      }

      if (prev < max) {
        colors.push(`transparent ${(prev - min) / range * 100}%`)
        colors.push(`transparent ${(max - min) / range * 100}%`)
      }

      return {
        '--track-bg': `linear-gradient(to right,${colors.join(',')})`
      }
    },
  },
  created:async function(){    
    console.log('index created:' ,this.$route.query , this.uid , this.username )
    this.initData();
  },
  methods: {
    async initData(){
      let day , duration , times, timesPc , timesChrome ;
      // day = day.replace('/','-') ; // moment(day).format("YYYY-MM-DD") ;
      day = moment(day).format("YYYY-MM-DD") ;
      let data = await this.$api.actionGet({day , hasUid:true , uid: this.uid }) ; //, url  是在浏览器插件pop页面使用的.
      if( !data ) return this.$q.notify('网络异常')
      if( data.errno ) return this.$q.notify('失败：'+data.errmsg) ;
      data = data.data ;
      times = data.res , duration= eval( times.map(i=>i.duration||0).join('+') );
      times.forEach(i=> i.time = moment(i.timestamp).format("YYYY-MM-DD HH:mm:ss")) 
      timesPc = times.filter(i=>i.from=='exe') , timesChrome = times.filter(i=>i.from=='chrome') ;
      let timeDic ;
      timeDic = {} ;
      times.forEach(i=> {
        let nowMon = moment(i.timestamp); 
        let start = nowMon.hours()*60 + nowMon.minutes();
        let minutes = _.range( start , start + i.duration );
        minutes.forEach(m=> timeDic[m] = i.type || 0 )
      }) 

      let canvas = document.getElementsByClassName('flagmentTimeMinu')[0]
      let ctx = canvas.getContext('2d');
      let width = canvas.clientWidth ,height = canvas.clientHeight ;
      canvas.width = 1440 , canvas.height = height ; //canvas.width = width ,
      ctx.clearRect(0, 0, width, height);
      let colorArr = ["#9e9e9e","#1976d2","#3b8ad9","#b64f4f","#ec5d5d","#daae1e"] ;
      ctx.globalAlpha = 1 ;
      // ctx.fillStyle = '#aaa' ;      
      // ctx.fillRect(9*60,0, 9*60,height)
      for(let min in timeDic){
        let type = timeDic[min] ;
        ctx.fillStyle = colorArr[type] ;
        ctx.fillRect(min,0,1,height)
      }
      ctx.fillStyle = '#000' ;      
      _.range( 0,24 ).forEach(i=>{
        ctx.globalAlpha = 0.8 ;
        if(i>0) ctx.fillRect(i*60-1,0,2,8)
        ctx.globalAlpha = 0.4 ;
        _.range( i*60, i*60+60 ,10 ).forEach(m=> ctx.fillRect(m-1,0,2,4) )
      })      
      // ctx.fillStyle = '#666' ;      
      // ctx.globalAlpha = 0.8 ;
      // ctx.fillRect(9*60,height-4, 9*60,4); //需要改变成容易识别的2个图形。开始和结束
      this.hours = _.range(0,24,1) ; 
      console.log('timesPc:' , eval( timesPc.map(i=>i.duration||0).join('+') ), eval( timesChrome.map(i=>i.duration||0).join('+') ) )
      console.log('times:', timesChrome.pop() ,_.uniq( Object.values(timeDic) ) , _.uniq( times.map(i=>i.type) ) ,  width , height )      
    },
    transTime(list){
      return list ;
    },
    dranFlagmentTime(timeDic){

    }
  },
  data (){
    return {
      bar: getBar(),
      pie,
      polar,
      scatter,
      map,
      expand: {
        bar: true,
        pie: true,
        polar: true,
        scatter: true,
        map: true,
        radar: true,
        connect: true,
        flight: true
      },
      initOptions: {
        renderer: "canvas"
      },
      polarTheme: "dark",
      seconds: -1,
      asyncCount: false,
      connected: true,
      metricIndex: 0,
      hours:[],
      
      range: {
        min: 0,
        max: 24,
        step: 1
      },
      model: {
        min: 9,
        max: 18
      },
      // min and max in the unit of the value
      zones: [
        // { color: 'red', min: 0, max: 9 },
        { color: '#3b8ad9', min: 9, max: 18 },
        // { color: 'green', min: 18, max: 23 }
      ],
      // x in the unit of the value
      // y from top in px - tick is centered if y is not specified
      // width and height in px
      ticks: [
        { color: 'black', x: -10, width: 4, height: 20 },
        { color: 'green', x: -5, width: 12, height: 10 },
        { color: 'blue', x: 0, y: 0, width: 2, height: 9 },
        { color: 'orange', x: 10, y: 11, width: 8, height: 9 }
      ]
    }
  }
}
</script>
<style >
#flagmentTimeDrag .q-slider__track-markers{ opacity: 0.3; }
.show2 {opacity: 0.6;}
.show1 {opacity: 0.3;}
#flagmentTimeDrag .q-slider{margin-top: -21px; }
.rad8{ border-radius: 8px;}
.place{ height: 400px; }
.flagmentTimeMinu{background-color: white;width: 100%; height: 30px;}
</style>
<style lang="stylus">
.custom-colored-range
  .q-slider__track-container--h
    background-image: var(--track-bg)
    margin-top: -5px
    height: 10px

.custom-colored-range--inside
  .q-slider__track--h
    top: 2px
    bottom: 2px

.custom-colored-range--outside
  .q-slider__track--h
    border: 2px solid currentColor
    background: transparent

.custom-colored-range--zoom
  .q-slider__track-container--h
    background: linear-gradient(to right, rgba(0, 0, 0, 0.26) 0%, rgba(0, 0, 0, 0.26) 100%),
      var(--track-bg),
      var(--tick-bg)
    background-repeat: no-repeat
    background-position: 0 9px, 0 9px, var(--tick-bg-pos)
    background-size: 100% 2px, 100% 2px, var(--tick-bg-size)
    background-blend-mode: soft-light
    margin-top: -10px
    height: 20px
    overflow: visible !important
  .q-slider__track--h
    top: 9px
    bottom: 9px
    border: 1px solid currentColor
    border-radius: 10px
    background: transparent
    transition: width 0.28s, left 0.28s, right 0.28s, top .28s, bottom .28s, border-width .28s
  &.q-slider--active
    .q-slider__track--h
      top: 5px
      bottom: 5px
      border-width: 3px
      transition: top .28s, bottom .28s, border-width .28s
</style>