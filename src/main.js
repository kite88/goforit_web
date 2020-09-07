// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import pages from './router/pages.js'
import conf from './conf.js'

import axios from 'axios'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.prototype.$axios = axios;
Vue.prototype.$apiDomain = conf.apiDomain;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App, ...pages },
  template: '<App/>',
  render: h => h(App)
})