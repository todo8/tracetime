<template>
  <q-page class=" q-pa-sm q-gutter-y-sm page">
    <div class="q-pa-sm rad8 row  bg-grey-3 " style="height:120px;">
      <div class="rad8 col-6">当日时间汇总 popup 图</div>
      <div class="rad8 col-6">时间分片图</div>
    </div>
    <div  class="  row  ">
      <div class="rad8 q-mr-sm bg-grey-3  col place">
          <v-chart
            :option="bar"
            :init-options="initOptions"
            ref="bar"
            theme="ovilia-green"
            autoresize
          />
        </div>
        <div class="rad8 bg-grey-3 col place">
          <v-chart
            :option="pie"
            :init-options="initOptions"
            ref="pie"
            autoresize
          />
        </div>
      
    </div>    
    <div  class="rad8 q-pa-xs bg-grey-3 col-12 fragmentHour _todo8" >
       
    </div>    
    <div class=" rad8 bg-grey-3 " >
      <div class="rad8 col-12 flagmentTimeCon"><canvas class="flagmentTimeMinu"></canvas></div>
      <div  id="flagmentTimeDrag" class="q-pl-sm q-pr-sm row rad8 bg-grey-3 " style="height:20px;">
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
        <div class="rad8  q-mr-sm col-8 bg-grey-3">mactime程序列表-可能用表格</div>
        <div class="rad8 col bg-grey-3">设置分类。列表元素点击左键，或邮件弹出菜单按钮，</div>
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



  //组合成碎片图数组并返回
  var fragment = function(data) {
      var fragmentData = [];
      for (var i = 0; i < 24 * 6; i++) {
          var title = parseInt(i / 6) + ':' + (i % 6 * 10);
          fragmentData.push({ time: 0, item: [], title: title, tags: {}, count: 0 });
      }

      //获取清单标签
      let getTag = function(tags) {
          var tag = '';
          var tagArr = ['critical', 'high', 'low', 'minor', 'life'];
          for (var i = 0; i < tagArr.length; i++) {
              if (tags[tagArr[i]] !== undefined)
                  return tagArr[i];
          }

      }
      //一个任务会有多次暂停情况，将一个任务分解为全部相连的小任务
      let cutItems = function(tags) {
          var started = tags['started'],
              done = tags['done']?tags['done']:tags['cancelled'];
          var toggle = tags['toggle'];
          let toggleArr = [];
          if (toggle) {
              //替换、切割
              toggle = toggle.replace(/\ (\d{2}-\d{2}-\d{2})/g, ' 20$1').trim();
              toggleArr = toggle.replace(/\ (\d{4}-\d{2}-\d{2})/g, '|$1').split('|');
              //排序

              for (let i = 0; i < toggleArr.length; i++) {
                  toggleArr[i] = moment(toggleArr[i]).format('X');
              }
              toggleArr.sort();
              if (toggleArr.length % 2 != 0 && toggleArr.length > 1) {
                  toggleArr.splice(toggleArr.length - 1, 1);
              }
              for (let i = 0; i < toggleArr.length; i++) {
                  toggleArr[i] = moment.unix(toggleArr[i]).format('YYYY-MM-DD HH:mm');
              }
          }
          var timeGroup = [started, ...toggleArr];
          if(done) timeGroup.push(done);
          for (let i = 0; i < timeGroup.length; i += 2) {
              tags['started'] = timeGroup[i];
              tags['done'] = timeGroup[i + 1];
              fillItems(tags);
          }


      }

      //开始或结束时间点
      let getTimePoint = function(time){
          
          if(moment(time).isBefore(moment(time).format("YYYY-MM-DD"))){
              return 0;
          }
          if(moment(time).isAfter(moment(time).format("YYYY-MM-DD 23:59:59"))){
              return 9;
          }
          return moment(time).minute()%10;
      }

      //填充多个小碎片
      let fillItems = function(tags){
          if(!(tags['started']&&tags['done'])) return ;
          var started = tags['started'], done = tags['done'];
          var startItemKey = getIndex(started);
          var endItemKey = getIndex(done);
          var start=getTimePoint(started), end;
          
          for(var ItemKey=startItemKey; ItemKey<=endItemKey; ItemKey++){
              end = 9;
          
              if(ItemKey==endItemKey) end=getTimePoint(done);
              fragmentData[ItemKey] = fillItem(fragmentData[ItemKey], start, end, getTag(tags));

              start = 0;
          }
      }

      //空心圆
      let circleItem = function(tags){
          var index = getIndex(tags['started']||tags['done']||tags['cancelled']);
          fragmentData[index]['circle'] = true;
      }

      //填充每个小碎片
      let fillItem = function(item, start, end, tag) {
          var begin = Math.max(0, start);
          end = Math.min(9, end);
          if (!item['tags'][tag]) item['tags'][tag] = 0;
          item['tags'][tag] += (end - begin);


          //if(item['item'].length >= 10) return item;
          for (var i = begin; i <= end; i++) {
              if (item['item'].indexOf(i) >= 0) {
                  item['count'] += 1; //当这分钟已有任务时，累加标记
                  continue;
              }
              item['item'].push(i);
          }
          item['time'] = item['item'].length * 10;
          return item;
      };

      //根据时间返回对应数组下标
      let getIndex = function(time) {
          var h = moment(time).hour();
          var m = moment(time).minute();
          var index = h * 6 + parseInt(m / 10);
          return index;
      }

      for (let tskey in data) {
          var tasks = data[tskey];
          for (let tkey in tasks) {
              var tags = tasks[tkey];
              if (!(tags['started'] && (tags['done'] || tags['toggle'] || tags['cancelled']))) {
                  //标注空心园
                  if(tags['started'] || tags['done'] || tags['cancelled']){
                      circleItem(tags);
                  }
                  continue;
              }
              cutItems(tags);
          }
      }
      //整理成按小时的数组
      var fragmentData1 = [];
      var group = [];
      var i = 0;
      do {
          if (i % 6 == 0) {
              group = [];
          }
          if (i % 6 == 5) {
              fragmentData1.push(group);
          }
          group.push(fragmentData[i]);
          i++;
      } while (i < fragmentData.length);

      return fragmentData1;

  };
//画出碎片图html
var drawFragment = function(data) {

    var FLAG_SYSTEM = ["critical", "high", "low", "minor", "life"];
    var FLAG_COLOR = ["#1ba4ff", "#72c7ff", "#f7c3c3", "#fb6969", "orange"]; // 浅蓝#72c7ff 天蓝#1ba4ff green yellowgreen orange red
    var TAG_LIST = ['重要紧急', '重要不紧急', '紧急不重要', '不紧急不重要', '生活'];

    //获取同一碎片内重叠标签数
    let isMulti = function(item) {
        return item['count'] > 1;
    }
    //取时间占比最多的标签颜色
    let getTagColor = function(item) {
        var tag = {};
        for (var i in item['tags']) {
            if (!tag['key']) tag = { key: i, val: item['tags'][i] };
            if (item['tags'][i] > tag['val']) tag = { key: i, val: item['tags'][i] };
        }
        if (!tag['key']) return '';

        return FLAG_COLOR[FLAG_SYSTEM.indexOf(tag['key'])];
    }

    var html = $('<div class="fragment"></div>');
    var line ;
    for(var i in data){
        var item = data[i];
        var _item = $('<dl class="fragment-item" ></dl>');
        let indexLine = Math.floor( i/4 ) ;
        if( i%4 ==0 ) line = $('<div class="fragment-line"></div>');
        for(let k in item ){
            var multi = isMulti(item[k])?' multi':'';
            var circle = item[k]['circle']?' circle':'';
            var inner = $('<dt class="fragment-item-inner" title="'+item[k]['title']+'"><div class="fragment-item-inner-progress'+multi+circle+'"><div class="fragment-item-inner-progress-item" style="height:'+item[k]['time']+'%;background-color:'+ getTagColor(item[k])+';"></div></div></dt>');
            _item.append(inner);
        }
        line.append(_item);
        html.append( line );
        // html.append(_item);
    }

    var tagHtml = '';
    for(var i=0; i<TAG_LIST.length; i++) {
        tagHtml += ('<span class="tag-color" style="background-color:' + FLAG_COLOR[i] + '"></span><span class="tag-name">' + TAG_LIST[i] + '</span>');
    }
    tagHtml = '<div class="tag-group">' + tagHtml + '</div>';
    html.append(tagHtml);
    //html.append('<div class="tag-tip">任务四象限：重要紧急 重要不紧急 紧急不重要 不紧急不重要 生活</div>');

    return html;

}

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
    setTimeout(this.initFlagment ,1000 )
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
    async initFlagment(){      
      let html  = drawFragment( fragment(this.flagmentTimeData) ) ;
      $('.fragmentHour').append(html)
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
      ],
      flagmentTimeData: {"0":[{"high":"","started":"2021-04-13 06:24","done":"2021-04-13 09:13"}],"z39timelog":[{"critical":"","started":"2021-04-13 16:37","done":"2021-04-13 16:49"},{"critical":"","started":"2021-04-13 10:11","done":"2021-04-13 16:23","toggle":"2021-04-13 10:19 2021-04-13 10:54 2021-04-13 12:17 2021-04-13 12:46 2021-04-13 14:27 2021-04-13 15:04 "},{"critical":"","started":"2021-04-13 16:54","done":"2021-04-13 17:25"},{"critical":"","started":"2021-04-13 17:29","done":"2021-04-13 19:24"},{"critical":"","started":"2021-04-13 19:38","done":"2021-04-13 19:49"},{"low":"","started":"2021-04-13 20:10","done":"2021-04-13 20:24"}],"unproject":[{"high":"","started":"2021-04-13 09:40","done":"2021-04-13 10:09"},{"high":"","started":"2021-04-13 23:31","done":"2021-04-13 23:58"},{"life":"","started":"2021-04-13 20:00","done":"2021-04-13 20:10"},{"life":"","started":"2021-04-13 22:46","done":"2021-04-13 23:21"},{"life":"","started":"2021-04-13 09:14","done":"2021-04-13 09:31"},{"minor":"","started":"2021-04-13 06:03","done":"2021-04-13 06:16"},{"high":"","started":"2021-04-13 10:19","done":"2021-04-13 10:37"},{"high":"","started":"2021-04-13 20:24","done":"2021-04-13 22:09"},{"high":"","started":"2021-04-13 22:46","done":"2021-04-13 23:24"},{"life":"","done":"2021-04-13 05:45"},{"life":"","done":"2021-04-13 06:01"},{"life":"","started":"2021-04-13 07:19","done":"2021-04-13 07:23"},{"life":"","started":"2021-04-13 07:15","done":"2021-04-13 07:19"},{"life":"","started":"2021-04-13 10:19","done":"2021-04-13 10:52"},{"life":"","started":"2021-04-13 12:17","done":"2021-04-13 12:28"},{"life":"","started":"2021-04-13 14:33","done":"2021-04-13 15:04"},{"life":"","started":"2021-04-13 12:30","done":"2021-04-13 12:41"},{"life":"","started":"2021-04-13 19:24","done":"2021-04-13 19:37"}],"today":"2021-04-13"}
    }
  }
}
</script>
<style lang="scss">

._todo8 .fragment-line{
  display: flex;
  flex:1;
}
._todo8 .fragment-item {
  margin-bottom: 4px;
  margin-top: 0px;
  position: relative;
}

$indexFragment:1 ;
.fragment-item-inner-base{
  content: '';
  position: absolute;
  font-size: 12px;
  font-weight: 200;
  color:#0D3349;
  z-index: 2;
}
.fragment-item-inner-clock{
  @extend .fragment-item-inner-base;
  left: -10px;
  display: inline-block;
  width: 50px;
  position: relative;
}
._todo8 .fragment-line:nth-child(1) .fragment-item:nth-child(1) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-clock;
  content: '0点';
}
._todo8 .fragment-line:nth-child(1) .fragment-item:nth-child(2) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(1) .fragment-item:nth-child(3) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(1) .fragment-item:nth-child(4) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(2) .fragment-item:nth-child(1) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(2) .fragment-item:nth-child(2) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(2) .fragment-item:nth-child(3) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(2) .fragment-item:nth-child(4) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(3) .fragment-item:nth-child(1) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(3) .fragment-item:nth-child(2) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-clock;
  content: '9';
}
._todo8 .fragment-line:nth-child(3) .fragment-item:nth-child(3) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(3) .fragment-item:nth-child(4) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(4) .fragment-item:nth-child(1) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-clock;
  content: '12点';
}
._todo8 .fragment-line:nth-child(4) .fragment-item:nth-child(2) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(4) .fragment-item:nth-child(4) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(4) .fragment-item:nth-child(4) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(5) .fragment-item:nth-child(1) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(5) .fragment-item:nth-child(2) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(5) .fragment-item:nth-child(3) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-clock;
  content: '18';
}
._todo8 .fragment-line:nth-child(5) .fragment-item:nth-child(4) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(6) .fragment-item:nth-child(1) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(6) .fragment-item:nth-child(2) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(6) .fragment-item:nth-child(3) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-base;
}
._todo8 .fragment-line:nth-child(6) .fragment-item:nth-child(4) dt.fragment-item-inner:nth-child(4):before {
  @extend .fragment-item-inner-clock;
  content: '23点';
}

.fragment-item {
  display: flex;
  flex:1;
  margin-right: 4px;
  height: 20px;
  margin-bottom: 4px;
  border: 1px solid #0568b7;
  border-radius: 3px;
}

.fragment-item-inner {
  flex: 1;
  border-right: 1px solid #e5e5e5;
  margin-top: 0 !important;
}

.fragment-item-inner-progress {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  position: relative;
}

.fragment-item-inner-progress-item {
  width: 100%;
  background-color: #7eb7f0;
  position: absolute;
  left: 0px;
  bottom: 0px;
  border: 0;
  z-index: 1;
}

.fragment-item-inner-progress.circle::before {
  position: absolute;
  content: '';
  z-index: 2;
  height: 10px;
  width: 10px;
  top: 5px;
  border: 2px solid green;
  border-radius: 50%;
  left: 50%;
  margin-left: -5px;
}

.fragment-item-inner-progress.multi::before {
  position: absolute;
  content: '';
  z-index: 2;
  height: 4px;
  width: 4px;
  top: 8px;
  background: #2d6896;
  border-radius: 50%;
  left: 50%;
  margin-left: -2px;
}

.fragment-item-inner:nth-child(6n) {
  flex: 1;
  border-right: 0;
}

.fragment-item:nth-child(4n) {
  margin-right: 0;
}

.tag-group {
  justify-content: center;
  display: flex;
}
.tag-group .tag-color {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  width: 20px;
  border-radius: 4px;
  margin-right: 4px;
  vertical-align: text-bottom;
}
.tag-group .tag-name {
  display: inline-block;
  margin-right: 20px;
  vertical-align: text-bottom;
  height: 16px;
  line-height: 16px;
}
.tag-tip {
  margin-bottom: 5px;
}

$indexFragmentWork:9;
._todo8 .fragment-line:nth-child(#{ceil($indexFragmentWork/4)}) .fragment-item:nth-child(#{$indexFragmentWork%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }
._todo8 .fragment-line:nth-child(#{ceil(($indexFragmentWork+1)/4)}) .fragment-item:nth-child(#{($indexFragmentWork+1)%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }
._todo8 .fragment-line:nth-child(#{ceil(($indexFragmentWork+2)/4)}) .fragment-item:nth-child(#{($indexFragmentWork+2)%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }
._todo8 .fragment-line:nth-child(#{ceil(($indexFragmentWork+31)/4)}) .fragment-item:nth-child(#{($indexFragmentWork+6)%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }
._todo8 .fragment-line:nth-child(#{ceil(($indexFragmentWork+4)/4)}) .fragment-item:nth-child(#{($indexFragmentWork+4)%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }
._todo8 .fragment-line:nth-child(#{ceil(($indexFragmentWork+5)/4)}) .fragment-item:nth-child(#{($indexFragmentWork+5)%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }
._todo8 .fragment-line:nth-child(#{ceil(($indexFragmentWork+6)/4)}) .fragment-item:nth-child(#{($indexFragmentWork+9)%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }
._todo8 .fragment-line:nth-child(#{ceil(($indexFragmentWork+7)/4)}) .fragment-item:nth-child(#{($indexFragmentWork+7)%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }
._todo8 .fragment-line:nth-child(#{ceil(($indexFragmentWork+8)/4)}) .fragment-item:nth-child(#{($indexFragmentWork+8)%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }
._todo8 .fragment-line:nth-child(#{ceil(($indexFragmentWork+9)/4)}) .fragment-item:nth-child(#{($indexFragmentWork+9)%4+1}) .fragment-item-inner-progress { background-color: #d2d2d2; }


</style>
<style>

#flagmentTimeDrag .q-slider__track-markers{ opacity: 0.2; }

</style>
<style scoped>
.page{
  max-width:900px;margin-left: auto;margin-right: auto;
}
.flagmentTimeCon{padding: 2px 2px 0 2px;    border: 1px solid #e0e0e0;    margin-top: 2px;}
.show2 {opacity: 0.4;}
.show1 {opacity: 0.1;}
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