<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="20">
          <i class="el-icon-s-unfold"></i>
          <i>欢迎，{{ username }}</i>
        </el-col>
        <el-col :span="4" class="r-header">
          <i @click="logout()" class="el-icon-switch-button"></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main>Main</el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      username: this.$uc.username,
    };
  },
  beforeCreate() {
    //拦截响应，要求用户重新登录
    this.$axios.interceptors.response.use((res) => {
      if (res.data.code == -10) {
        this.$router.push({ path: "/login" });
      }
      return res;
    }),
      (err) => err;
  },
  methods: {
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