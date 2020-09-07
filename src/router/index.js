import Vue from 'vue'
import Router from 'vue-router'
import Pages from './pages.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Pages.Login
    },
    {
      path: '/',
      name: 'Main',
      component: Pages.Main,
    }
  ]
})
