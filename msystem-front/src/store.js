import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


var store=new Vuex.Store({
    state: {
     User:{}
    },
    mutations: {
      changeUser(state,decoded){
        state.User=decoded
      }
    }
  })

  export default store