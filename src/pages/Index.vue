<template>
  <q-page class="page q-pa-sm q-gutter-y-sm">    
      <q-carousel
        swipeable
        animated
        v-model="slide"
        thumbnails
        infinite
      >
        <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
        <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
        <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
        <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />
      </q-carousel>
    
      <div class="">
        <div>
          文章
        </div>
        <div class="row  q-gutter-x-sm">
          <q-card class="my-card col">
            <img src="https://cdn.quasar.dev/img/mountains.jpg">

            <q-card-actions align="right">
              <q-btn flat round color="red" icon="favorite" />
              <q-btn flat round color="teal" icon="bookmark" />
              <q-btn flat round color="primary" icon="share" />
            </q-card-actions>
          </q-card>
          <q-card class="my-card col">
            <img src="https://cdn.quasar.dev/img/mountains.jpg">

            <q-card-actions align="right">
              <q-btn flat round color="red" icon="favorite" />
              <q-btn flat round color="teal" icon="bookmark" />
              <q-btn flat round color="primary" icon="share" />
            </q-card-actions>
          </q-card>
          <q-card class="my-card col">
            <img src="https://cdn.quasar.dev/img/mountains.jpg">

            <q-card-actions align="right">
              <q-btn flat round color="red" icon="favorite" />
              <q-btn flat round color="teal" icon="bookmark" />
              <q-btn flat round color="primary" icon="share" />
            </q-card-actions>
          </q-card>
          
        </div>
      </div>  
    <div>
      <q-carousel
        animated
        v-model="slideVideo"
        infinite
      >
        <q-carousel-slide name="soft-jazz">
          <q-video
            class="absolute-full"
            src="https://www.youtube.com/embed/k3_tw44QsZQ"
          />
        </q-carousel-slide>

        <q-carousel-slide name="Rihanna">
          <q-video
            class="absolute-full"
            src="https://www.youtube.com/embed/kOkQ4T5WO9E"
          />
        </q-carousel-slide>

        <q-carousel-slide name="ibiza">
          <q-video
            class="absolute-full"
            src="https://www.youtube.com/embed/p87miJIYEEk"
          />
        </q-carousel-slide>
      </q-carousel>

      <div class="row justify-center">
        <q-btn-toggle
          glossy
          v-model="slide"
          :options="[
            { label: 'Soft Jazz', value: 'soft-jazz' },
            { label: 'Rihanna', value: 'Rihanna' },
            { label: 'Ibiza Mix', value: 'ibiza' }
          ]"
        />
      </div>
    </div>
  </q-page>
</template>

<script>

// import moment from 'moment' ;
import {mapState,mapActions} from 'vuex' ;

export default {
  name: 'PageIndex',
  computed: {
    ...mapState({
      uid:state=> state.base.uid ,
      username:state=> state.base.username ,
      head:state=> state.base.head ,
    }),
  },
  created:async function(){    
    console.log('index created:' ,this.$route.query , this.uid , this.username )
    
  },
  methods: {
    
  },
  data (){
    return {
      slide: 1,
      slideVideo: 'Rihanna'
    }
  }
}
</script>
<style scoped>

.page{
  max-width:900px;margin-left: auto;margin-right: auto;
}

</style>