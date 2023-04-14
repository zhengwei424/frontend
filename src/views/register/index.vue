<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="ruleForm"
      class="register-form"
      auto-complete="off"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">账号注册</h3>
      </div>

      <el-form-item prop="username" label="账号">
        <el-input
          ref="username"
          v-model.trim="registerForm.username"
          placeholder="请输入账号名称"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input
          ref="password"
          v-model="registerForm.password"
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

      <el-form-item prop="confirmPassword" label="确认密码">
        <el-input
          ref="confirmPassword"
          v-model="registerForm.confirmPassword"
          :type="passwordType1"
          placeholder="请确认密码"
          name="confirmPassword"
          tabindex="3"
          auto-complete="off"
        />
        <span class="show-pwd" @click="showPwd1">
          <svg-icon :icon-class="passwordType1 === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="name" label="姓名">
        <el-input
          ref="name"
          v-model.trim="registerForm.name"
          placeholder="请输入姓名"
          name="name"
          type="text"
          tabindex="4"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="phone_number" label="手机">
        <el-input
          ref="phone_number"
          v-model.trim="registerForm.phone_number"
          placeholder="请输入手机号"
          name="phone_number"
          type="text"
          tabindex="5"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="email" label="邮箱">
        <el-input
          ref="email"
          v-model.trim="registerForm.email"
          placeholder="请输入邮箱"
          name="email"
          type="text"
          tabindex="6"
          auto-complete="off"
        />
      </el-form-item>

      <div style="width:65%;margin-bottom:30px;position: relative;left: 80px">
        <el-button
          :loading="loading"
          style="width: 45%"
          type="primary"
          @click.native.prevent="handleRegister"
        >
          注册
        </el-button>
        <el-button
          :loading="loading"
          style="width: 45%;margin-left: 25px"
          type="primary"
          @click.native.prevent="handleReset"
        >
          清空
        </el-button>
      </div>

      <div style="padding-left: 300px">
        <el-link class="tips" :underline="false" style="display: block; text-align: right; position: relative;right: 90px" @click="toLogin">
          已有账号?立即登录 </el-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 8) {
        callback(new Error('密码不能少于8位数'))
      } else {
        if (this.registerForm.password !== '') {
          this.$refs.registerForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入姓名'))
      }
    }
    const validatePhonenumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      }
    }
    return {
      // 用户名和密码是否验证成功
      userVerified: false,
      // 验证码是否验证成功
      captchaVerified: false,
      // 用户信息
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone_number: '',
        email: ''
      },
      // 从服务器获取验证码
      captchaData: {
        id: '',
        b64s: ''
      },
      // 将验证码的answer传递给服务器
      captchaAnswer: {
        id: '',
        answer: ''
      },
      ruleForm: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validatePass2 }],
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        phone_number: [{ required: true, trigger: 'blur', validator: validatePhonenumber }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      },
      loading: false, // 设置登录按钮的是否为"加载中"状态
      passwordType: 'password',
      passwordType1: 'password',
      redirect: undefined
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      // ?????????????
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showPwd1() {
      if (this.passwordType1 === 'password') {
        this.passwordType1 = ''
      } else {
        this.passwordType1 = 'password'
      }
      // ?????????????
      this.$nextTick(() => {
        this.$refs.confirmPassword.focus()
      })
    },
    handleRegister() {
      axios.post(`${process.env.VUE_APP_BASE_API}/register`, this.registerForm).then(response => {
        if (response.data.code === 602) {
          this.$message({
            type: 'error',
            message: '账号已存在！'
          })
        } else if (response.data.code === 0) {
          this.$message({
            type: 'success',
            message: '注册成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '注册异常!'
          })
        }
      })
    },
    handleReset() {
      this.registerForm = {
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone_number: '',
        email: ''
      }
    },
    toLogin() {
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

//$bg: #283443;
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #000;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .el-input {
    border: 1px solid;
    display: inline-block;
    text-align: right;
    height: 47px;
    width: 65%;

    input {
      background: white;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      /* 解决auto-complate自动填充input，文字和背景颜色的问题*/
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #ffffff inset !important;
        -webkit-text-fill-color: #000000 !important;
      }
    }
  }

  .el-form-item {
    //border: 1px solid rgba(255, 255, 255, 0.1);
    background: #2d3a4b;
    //background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .el-form-item__label {
    color: white;
    width: 80px;
  }

  .el-form-item__error {
    left: 80px;
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
      color: white;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 90px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

