<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="form"
    label-width="80px"
    label-position="left"
    class="form"
  >
    <el-form-item label="系统登录">请填写账号和密码进行登录</el-form-item>
    <el-form-item label="用户" prop="username">
      <el-input v-model="form.username" size="small" placeholder="请输入用户名" clearable></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" size="small" placeholder="请输入密码" show-password clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit()" size="small">进入系统</el-button>
    </el-form-item>
  </el-form>
</template>
<style>
  .form {
    padding: 50px;
    width: 350px;
    margin: 150px auto;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
</style>
<script>
// eslint-disable-next-line no-unused-vars
import AppVue from '../App.vue'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let loading = this.$loading()
          this.$axios({
            url: this.$apiDomain + '/v1/user/login',
            method: 'post',
            data: this.form
          })
            .then((res) => {
              loading.close()
              if (res.data.code === 0) {
                this.$notify({
                  title: '' + res.data.msg,
                  type: 'success'
                })
                this.$uc.save(res.data.result)
                this.$router.push({
                  path: '/'
                })
              } else {
                this.$message(res.data.msg)
              }
            })
            .catch((err) => {
              loading.close()
              console.log(err)
              this.$message('网络错误')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
