<template>
  <div class="login-container">
    <img class="logo" src="@/assets/logo_images/logo.png" alt="logo">
    <img class="logo_bg" src="@/assets/login_images/login_bg.png" alt="登陆">
    <div class="slogan">
      <p style="font-size: 68px;">A.I.L</p>
      <p style="font-size: 38px;">all in logistics,logistics all in</p>
    </div>

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <!-- <lang-select class="set-language"/> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model.trim="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model.trim="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="off"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item prop="syscode">
        <span class="svg-container">
          <svg-icon icon-class="international" />
        </span>
        <el-select v-model="loginForm.syscode" placeholder="系统" @change="changeSyaCode">
          <el-option v-for="item in syscodeOptions" :key="item.key" :label="item.value" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>

      <!-- <div class="tips">
        <span>{{ $t('login.username') }} : admin</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div> -->
      <!-- <div class="tips">
        <span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div>

      <el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{ $t('login.thirdparty') }}</el-button> -->
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
    <!-- <a-i-cockpit ref="aicockpit" :show.sync="true" /> -->
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
// import { AICockpit } from '../operationcenter/components'
import { setSysCode } from '@/utils/auth'
import { Debounce } from '@/utils/debounce'
export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('请输入用户名！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入密码！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '18900001112',
        password: '123456',
        syscode: '100002'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      syscodeOptions: [{ key: '100002', value: '承运商' }, { key: '100004', value: '货主' }],
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }

  },
  created() {
    setSysCode(this.loginForm.syscode)
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    changeSyaCode($event) {
      setSysCode(this.loginForm.syscode)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin: Debounce(function() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          setSysCode(this.loginForm.syscode)
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }),
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:rgba(0, 0, 0, 0.1);
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
   .logo_bg {
    position: relative;
    width: 100%;
   }
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
        height: 52px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-select{
       width: 92%;
       .el-input{  width: 100%;}
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .logo{
    height: 45px;
    position: absolute;
    top:30px;
    left: 60px;
    z-index: 1;
  }
  .slogan{
           position: absolute;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    z-index: 9;
    top: 25%;
    width: 50%;
    p{
      color:white;
          text-align: center;
    }
  }
  .login-form {
       position: absolute;
    right: 13%;
    width: 499px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    /* margin: 120px auto; */
    z-index: 9;
    top: 25%;
    background-color: rgba(255, 255, 255, 0.3);
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
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
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
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
