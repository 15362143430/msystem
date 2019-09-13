import Vue from 'vue'
import Router from 'vue-router'
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
import notFound from '../components/404.vue'
import register from '../components/Register.vue'
import login from '../components/Login.vue'
import index from '../components/index/index.vue'
import home from '../components/index/home.vue'
import table from '../components/index/table.vue'
import add from '../components/index/add.vue'
import edit from '../components/index/edit.vue'
import user from '../components/index/user.vue'
import accountmanagement from '../components/index/accountManagement.vue'

Vue.use(Router)

let router=new Router({
  routes: [
   { path: '*', component: notFound },
   { path: '/', component: login },
  //  { path: '/login', component: login },
   { path: '/register', component: register },
   { path: '/index', component: index,children:[
     { path: '', component: home },
     { path: 'table', component: table },
     { path: 'add', component: add },
     { path: 'edit/:id', component: edit },
     { path: 'user', component: user },
     { path: 'accountmanagement', component: accountmanagement }
   ]}

  ]
})


//路由守卫
// 导航钩子有3个参数：

//   1、to:即将要进入的目标路由对象；

//   2、from:当前导航即将要离开的路由对象；

//   3、next ：调用该方法后，才能进入下一个钩子函数（afterEach）。

        // next()直接进to 所指路由
        // next(false) 中断当前路由
        // next('route') 跳转指定路由
        // next('error') 跳转错误路由
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ?true:false;
  if(to.path =="/"||to.path =="/register"){
    next();
  }else{
    isLogin ? next():next("/")
  }
  
})


export default router;
