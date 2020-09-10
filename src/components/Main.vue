<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="20">
          <span class="nav" v-for="(item,key) in navList" :key="key">{{ item.name }}</span>
        </el-col>
        <el-col :span="4" class="r-header">
          <span>{{ username }}</span>
          <i @click="logout()" class="el-icon-switch-button logout"></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main>Main</el-main>

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
export default {
  data() {
    return {
      username: this.$uc.username,
      drawer: false,
      navList: [
        {name: '书籍1', path: ''},
      ]
    };
  },
  beforeCreate() {
    if(!this.$uc.token){
      this.$message('请先登录')
      this.$router.push({ path: "/login" })
    }
    //拦截响应，要求用户重新登录
    this.$axios.interceptors.response.use((res) => {
      if (res.data.code == -10) {
        this.$router.push({ path: "/login" })
      }
      return res;
    }),
      (err) => err;
  },
  beforeRouteEnter (to, from, next) {
    //console.log(to, from) // 可以拿到 from， 知道上一个路由是什么，从而进行判断
    //在next中写处理函数
    next(vm => vm.setDrawer(from)); // err 与 12134 是随便传的值， 可忽略
  },
  methods: {
    setDrawer: function(from){
        if(from.name == 'Login') this.drawer = true
    },
    drawerMainClose: function(){
      this.drawer = false
    },
    logout: function () {
      this.$axios({
        url: this.$apiDomain + "/v1/user/logout",
        method: "get",
        headers: {
          token: this.$uc.token,
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            this.$uc.destroy();
            this.$message(res.data.msg);
            this.$router.push("/login");
          } else {
            this.$message(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>