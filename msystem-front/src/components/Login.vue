<template>
  <div class="login">
    <section class="form-container">
      <div class="manage-tip">
        <span class="title">米修在线后台管理系统</span>
        <el-form
          label-position="left"
          :model="loginUser"
          :rules="rules"
          ref="ruleForm"
          label-width="60px"
          class="demo-ruleForm"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="loginUser.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginUser.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submitBtn" @keyup.enter="submitForm('ruleForm')" @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
          <div class="register">
              <p>还没有账号？现在去&nbsp&nbsp<router-link to="/register">注册</router-link></p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  data() {
    return {
      loginUser: {},
      rules: {
        email: [
          {
            type: "email",
            required: true,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            min: 2,
            max: 30,
            message: "长度在2到30个字符之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created () {
    var ck=this;
    document.onkeydown=function(event) {
      if(event.keyCode==13){
        ck.submitForm('ruleForm')
      }
    }
  },
  methods: {
      submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios.post("http://localhost:3002/api/users/login", this.loginUser).then(res => {
              //token
              console.log(res)
              const {token}=res.data;//解构赋值，取res.data里的token属性
              localStorage.setItem('eleToken',token);
              //解析token
              const decoded = jwt_decode(token);
              console.log(decoded);
              //将docoded传到vuex保存
              this.$store.commit("changeUser",decoded);

             this.$router.push("/index");
          })
        } else {
          this.$message.error('请正确填写各项信息！！！！');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg);
  background-size: 100% 100%;
}
.form-container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 34%;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
}
.form-container .manage-tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}

.demo-ruleForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 5px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
.submitBtn {
  width: 100%;
}
.register{
    text-align: right;
    font-size: 12px;
}

.register p a{
    color: blue;
}


</style>