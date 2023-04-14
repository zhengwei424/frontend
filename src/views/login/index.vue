<template>
  <div class="login-container">
    <!--图片在src内才能加载到background-image-->
    <img class="bg" src="@/static/images/1.png" alt="">
    <img class="gif" src="@/static/images/2.gif" alt="">
    <!--回车键提交-->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="off"
      label-position="left"
      @keyup.enter.native="handleLogin"
    >

      <div class="title-container">
        <h3 class="title">KUBERNETES 后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model.trim="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="off"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <!--验证码-->
      <!--native是将原生的keyup.enter事件绑定到自定义标签el-input上（自定义的标签无法绑定原生事件，官方标签才行，因此需要加native）-->
      <div style="height: 52px; width: 100%; margin-bottom: 22px">
        <el-form-item prop="answer" style="float: left; width:220px">
          <span class="svg-container">
            <svg-icon icon-class="email" />
          </span>
          <el-input
            ref="answer"
            v-model.trim="loginForm.answer"
            type="text"
            placeholder="请输入验证码答案"
            name="answer"
            tabindex="3"
            auto-complete="off"
          />
        </el-form-item>
        <!--<el-image-->
        <!--  style="float: right;width: 220px;height: 50px;margin: 1px 0;"-->
        <!--  :src="captchaData.b64s"-->
        <!--  @click.native.prevent="getCaptcha"-->
        <!--/>-->

        <!--解决e-image在切换src（图形验证码）时，出现白色背景（failed为白色背景）导致验证码闪烁问题-->
        <img
          style="float: right;width: 220px;height: 50px;margin: 1px 0;"
          :src="captchaData.b64s"
          alt=""
          @click.prevent="getCaptcha"
        >
      </div>

      <div style="height: 20px;line-height: 20px;text-align: left">
        <el-link :underline="false" class="tips" @click="forgetPwd">忘记密码?</el-link>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-top: 22px;margin-bottom: 22px"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
      <div style="padding-left: 300px">
        <el-link class="tips" :underline="false" style="display: block; text-align: right;" @click="toRegister"> 还没有账号?立即注册 </el-link>
      </div>
    </el-form>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateAnswer = (rule, value, callback) => {
      if (!value) {
        callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    return {
      // 用户名和密码是否验证成功
      userVerified: false,
      // 验证码是否验证成功
      captchaVerified: false,
      // 验证失败后的提示
      // captchaVerifyFailedMessage: '',
      // 用户信息
      loginForm: {
        username: '',
        password: '',
        answer: ''
      },
      // 从服务器获取验证码
      captchaData: {
        id: '',
        b64s: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        answer: [{ required: true, trigger: 'blur', validator: validateAnswer }]
      },
      loading: false, // 设置登录按钮的是否为"加载中"状态
      passwordType: 'password'
      // redirect: undefined
    }
  },
  computed: {},
  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       this.redirect = route.query && route.query.redirect
  //     },
  //     immediate: true
  //   }
  // },
  created() {
    this.getCaptcha()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // 验证用户名和密码
      // 箭头函数和this指向性问题？？？？？？？？？？？、
      this.$refs.loginForm.validate(valid => {
        const that = this
        if (valid) {
          that.loading = true
          const verifyInfo = {
            username: that.loginForm.username,
            password: that.loginForm.password,
            id: that.captchaData.id,
            answer: that.loginForm.answer
          }
          that.$store.dispatch('user/login', verifyInfo).then((res) => {
            if (res.code === 0) {
              that.$router.push('/')
            } else if (res.code === 600) {
              that.$message({
                type: 'error',
                message: '验证码过期或答案错误'
              })
              // 更新验证码
              that.getCaptcha()
            } else if (res.code === 601) {
              that.$message({
                type: 'error',
                message: '用户名或密码错误'
              })
              // 更新验证码
              that.getCaptcha()
            }
            that.loading = false
          }).catch((err) => {
            console.log('login_err:', err)
            that.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCaptcha() {
      axios.get(`${process.env.VUE_APP_BASE_API}/captcha`).then(response => {
        if (response.data.code === 0) {
          this.captchaData = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: '获取验证码失败！'
          })
        }
      })
    },
    toRegister() {
      this.$router.replace('/register')
    },
    forgetPwd() {
      this.$message({
        message: '忘记密码请联系管理员',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

//$bg: #283443;
$bg: #2d3a4b;
$light_gray: #fff;
$cursor: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #283443 inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    width: 450px;
    height: 52px;
  }
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gif {
  height: 300px;
  width: 300px;
  position: absolute;
  top: 680px;
  left: 1010px;
}

.login-container {
  //min-height: 100%;
  height: 100%;
  width: 100%;
  background-color: $bg;
  background-size: 100% 100%;
  overflow: hidden;

  .login-form {
    position: absolute;
    right: 20px;
    top: 50px;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
