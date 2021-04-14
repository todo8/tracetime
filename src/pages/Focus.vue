<template>
  <q-page class="q-pa-sm q-gutter-y-sm" style="max-width:900px;margin-left: auto;margin-right: auto;">      
        <q-banner inline-actions rounded class="bg-primary  text-white">
        此功能需要在谷歌浏览器插件上面使用。

        <template v-slot:action>
            <q-btn flat label="离线下载" />
            <q-btn flat label="在线安装" />
        </template>
        </q-banner>
        <div class="q-pa-sm q-gutter-y-sm">
            <div class="text-h4">最长访问时间</div>
            <div class=" row">
                <q-input class="q-mr-sm" style="width:100px;" v-model="minMax" dense filled  suffix="分钟"/>
                <!-- <div>分钟</div> -->
                <q-btn color="white" text-color="black" label="设置" />
            </div>
            <div>它是“被阻止的网站”列表中访问的总时间，不是每个站点的计时器。您一天的时间到期后就无法更改此时间。</div>
            <div></div>
        </div>
        <q-separator />
        <div class="q-pa-sm q-gutter-y-sm">
            <div class="text-h4">屏蔽的网站</div>
            <div>
                在下面的文本框中添加要阻止的站点，然后单击“添加阻止的网站”。
                <ul>
                    <li>要阻止多个站点，请每行添加一个。</li>
                <li>不要输入http：//</li>
                <li>如果要阻止整个网站，请不要使用www（即youku.com而不是www.youku.com）</li>
                <li>您可以使用前面的星号作为通配符（即* .com阻止所有.com网站，或* foo阻止所有包含单词“ foo”的域）</li>
                </ul>          
            </div>
            <!-- <div>想要一些推荐屏蔽网站吗？ <q-btn color="white" text-color="black" label="推荐列表" /></div> -->
            <div class="q-gutter-y-sm" style="max-width: 400px">
                <q-input v-model="blackTxt" :placeholder="placeholderBlack" style="min-height:200px;"  filled  type="textarea"/>
                <q-btn  color="white" text-color="black" label="添加阻止的网站" />
            </div>
            <div class="q-pa-sm" style="max-width: 400px;border:solid 1px;border-radius: 6px;">
                <div><q-icon color="red" name="remove_circle" size='sm' /> v.qq.com </div>
                <div><q-icon color="red" name="remove_circle" size='sm' /> v.qq.com </div>
                <div><q-icon color="red" name="remove_circle" size='sm' /> v.qq.com </div>
            </div>
        </div>
        <q-separator />
      
  </q-page>
</template>

<script>


export default {
  name: "HelloWorld",
  components: {
    
  },
  data() {
    return {
      blackTxt:'',
      minMax:10,
      placeholderBlack:`v.qq.com\nwww.youku.com\nwww.iqiyi.com\ntv.le.com`
    };
  }
};
</script>

<style scoped>


</style>