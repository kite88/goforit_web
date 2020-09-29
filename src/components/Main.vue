<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="20">
          <el-menu :default-active="activePath" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <template v-for="(item,i) in navList">
              <el-menu-item v-if="item.children.length === 0" :index="item.path">{{ item.name }}</el-menu-item>
              <el-submenu v-else :index="item.path">
                <template slot="title">{{ item.name }}</template>
                <template v-for="(item2,i2) in item.children">
                  <el-menu-item v-if="item2.children.length === 0" :index="item2.path">{{ item2.name }}</el-menu-item>
                  <el-submenu v-else :index="item2.path">
                    <template slot="title">{{ item2.name }}</template>
                    <el-menu-item v-for="(item3,i3) in item2.children" :index="item3.path">{{ item3.name }}</el-menu-item>
                  </el-submenu>
                </template>
              </el-submenu>
            </template>
          </el-menu>
        </el-col>
        <el-col :span="4" class="r-header">
          <a v-if="!isAuth" class="sub-btn" @click="goLogin">去登陆</a>
          <template v-else>
            <span>{{ username }}</span>
            <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom-end">
              <i @click="logout()" class="el-icon-switch-button logout"></i>
            </el-tooltip>
          </template>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="main-box">
      <router-view></router-view>
    </el-main>

    <el-drawer
      custom-class="drawer-main"
      :withHeader="false"
      :visible.sync="drawer"
      direction="ttb">
      <div class="drawer-main-box">
        <div class="drawer-main-box-left">
          <span>欢迎， {{ username }} </span>
          <a @click="drawerMainClose()" class="el-icon-close drawer-main-box-close"></a>
        </div>
      </div>
    </el-drawer>

  </el-container>
</template>
<script>
  import menuJson from '../router/menu.json'

  export default {
    data () {
      return {
        isAuth: false,
        username: this.$uc.username,
        drawer: false,
        navList: menuJson,
        activePath: ''
      }
    },
    beforeCreate () {
      if (!this.$uc.token && this.$route.path !== '/home') {
        this.$router.push({path: '/home'})
      }
      // 拦截响应，要求用户重新登录
      // eslint-disable-next-line no-unused-expressions
      this.$axios.interceptors.response.use((res) => {
        if (res.data.code === -10) {
          this.$uc.destroy()
          this.$route.path !== '/login' && this.$router.push('/login')
        }
        return res
      }),
        (err) => err
    },
    beforeRouteEnter (to, from, next) {
      // console.log(to, from) // 可以拿到 from， 知道上一个路由是什么，从而进行判断
      // 在next中写处理函数
      next(vm => vm.setDrawer(from))
    },
    created () {
      this.isAuth = !!this.$uc.token
      this.activePath = this.$route.path
    },
    methods: {
      handleSelect (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      setDrawer: function (from) {
        // eslint-disable-next-line eqeqeq
        if (from.name === 'Login') this.drawer = true
      },
      drawerMainClose: function () {
        this.drawer = false
      },
      goLogin: function () {
        this.$router.push('/login')
      },
      logout: function () {
        this.$axios({
          url: this.$apiDomain + '/v1/user/logout',
          method: 'get',
          headers: {
            token: this.$uc.token
          }
        })
          .then((res) => {
            if (res.data.code === 0) {
              this.isAuth = false
              this.$uc.destroy()
              this.$message(res.data.msg)
              //this.$router.push('/home')
              window.history.go(0)
            } else {
              this.$message(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
</script>
