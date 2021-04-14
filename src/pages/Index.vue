<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    >
    <div>index</div>
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
}
</script>
