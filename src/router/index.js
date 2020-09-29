import Vue from 'vue'
import Router from 'vue-router'
import Pages from './pages.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login', name: 'Login', component: Pages.Login
    },
    {
      path: '/',
      name: 'Main',
      component: Pages.Main,
      redirect: '/home',
      children: [
        {
          path: '/home', name: 'Home', component: Pages.Home
        },
        {
          path: '/memo', name: 'Memo', component: Pages.Memo
        },
        {
          path: '/account/modifyPassword', name: 'ModifyPassword', component: Pages.ModifyPassword
        },
        {
          path: '/account/PersonalInfo', name: 'PersonalInfo', component: Pages.PersonalInfo
        },
        {
          path: '/account/AccountSecurity', name: 'PersonalInfo', component: Pages.AccountSecurity
        },
      ]
    }
  ]
})
