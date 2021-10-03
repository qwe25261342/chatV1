import Vue from 'vue'
import App from './App.vue'

import router from './router'
import { BootstrapVue, IconsPlugin } from  'bootstrap-vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 導入 Bootstrap 和 BootstrapVue CSS 文件（順序很重要）
import  'bootstrap/dist/css/bootstrap.css'
import  'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(ElementUI);
Vue.use(Vant);
// 使 BootstrapVue 在整個項目中可用
Vue.use(BootstrapVue)
// 可選擇安裝 BootstrapVue 圖標組件插件
Vue.use(IconsPlugin)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
