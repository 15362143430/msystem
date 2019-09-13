import axios from 'axios' //引入axios
import {
  Loading,
  Message
} from 'element-ui'; //引入Loading服务
import router from './router/index'

//开始加载动画
let loading;

function startLoading() {
  loading = Loading.service({
    lock: true, //是否锁定
    text: '拼命加载中...', //加载中需要显示的文字
    background: 'rgba(0,0,0,.7)', //背景颜色
  });
}
//结束加载动画
function endLoading() { 
    loading.close();
}
//请求拦截
axios.interceptors.request.use(config => {
  startLoading(); //请求时的加载动画

  //设置请求头
  if(localStorage.eleToken){
      config.headers.Authorization = localStorage.eleToken;
  }

  return config; //加载动画的时候把config return 回去
}, error => {
  return Promise.reject(error)
})
//响应拦截
axios.interceptors.response.use(response => {
  endLoading(); //结束加载动画
  return response; //结束时把response return回去
}, error => {
  //错误提醒
  endLoading() //如果错误也结束动画
  Message.error(error.response.data)

  //获取错误状态码
  const {status} = error.response;
    if(status == 401){
        Message.error("token失效请重新登录");
        //清除token
        localStorage.removeItem("eleToken")
        router.push("/");
    }

  return Promise.reject(error)
})

export default axios //导出axios  在main.js中可以引入
