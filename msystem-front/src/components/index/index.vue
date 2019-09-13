<template>
  <div>
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-header style="font-size: 12px">
        <h1>资金管理系统</h1>
        <div class="touxiang">
          <el-col :span="5">
            <div class="demo-basic--circle">
              <div class="block">
                <el-avatar :size="50" :src="circleUrl"></el-avatar>
              </div>
            </div>
          </el-col>
          <span class="userName">欢迎{{this.$store.state.User.name}}</span>
          <el-dropdown>
            <i class="el-icon-caret-bottom" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="touser">个人信息</el-dropdown-item>
              <el-dropdown-item  @click.native="tologin">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <el-aside width="180px" style="background-color: rgb(238, 241, 246);overflow-x: hidden">
          <el-menu router :default-openeds="['1', '3']">
            <el-menu-item index="/index">
              <i class="el-icon-s-home"></i>首页
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-notebook-2"></i>资金管理
              </template>
              <el-menu-item-group>
                <el-menu-item index="/index/table">
                  <i class="el-icon-notebook-1"></i>资金流水
                </el-menu-item>
                <el-menu-item @click="dialogFormVisible = true">
                  <i class="el-icon-edit"></i>添加记录
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-tools"></i>信息管理
              </template>
              <el-menu-item-group>
                <el-menu-item index="/index/user">
                  <i class="el-icon-user"></i>个人信息
                </el-menu-item>
                <el-menu-item index="/index/accountmanagement" v-if="identities">
                  <i class="el-icon-user"></i>员工管理
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
          <el-dialog width="40%" title="添加资金信息" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="ruleForm" label-position="left" :model="profile">
              <el-form-item label="收支类型" prop="type">
                <el-select v-model="profile.type" placeholder="收支类型">
                  <el-option label="提现" value="提现"></el-option>
                  <el-option label="提现手续费" value="提现手续费"></el-option>
                  <el-option label="充值" value="充值"></el-option>
                  <el-option label="优惠券" value="优惠券"></el-option>
                  <el-option label="充值礼券" value="充值礼券"></el-option>
                  <el-option label="转账" value="转账"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="收支描述" prop="describe">
                <el-input v-model="profile.describe" placeholder="请输入收支描述"></el-input>
              </el-form-item>
              <el-form-item label="收入" prop="income">
                <el-input v-model="profile.income" placeholder="请输入收入"></el-input>
              </el-form-item>
              <el-form-item label="支出" prop="expend">
                <el-input v-model="profile.expend" placeholder="请输入支出"></el-input>
              </el-form-item>
              <el-form-item label="账户现金" prop="cash">
                <el-input v-model="profile.cash" placeholder="请输入账户现金"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="profile.remark" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
          </el-dialog>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  data() {
    return {
      profile: {},
      dialogFormVisible: false,
      rules: {
        type: [
          {
            required: true,
            message: "请选择收支类型",
            trigger: "blur"
          }
        ],
        describe: [
          {
            required: true,
            message: "请输入收支描述",
            trigger: "blur"
          }
        ],
        income: [
          {
            required: true,
            message: "请输入收入",
            trigger: "blur"
          }
        ],
        expend: [
          {
            required: true,
            message: "请输入支出",
            trigger: "blur"
          }
        ],
        cash: [
          {
            required: true,
            message: "请输入账户现金",
            trigger: "blur"
          }
        ]
      },
      circleUrl: this.$store.state.User.avatar,
      squareUrl:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      identities:false
    };
  },
  created() {
    //解析token
    const decoded = jwt_decode(localStorage.eleToken);
    console.log(decoded);
    //将docoded传到vuex保存
    this.$store.commit("changeUser", decoded);
    if(this.$store.state.User.identity == "manager"){
      this.identities=true;
    }else{
      this.identities=false;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const date =new Date();
          this.profile.date=date.getTime();
          console.log(this.profile)
          console.log(typeof this.profile.date)
          this.axios
            .post("http://localhost:3002/api/profiles/add", this.profile)
            .then(res => {
              this.$message({
                message: "添加成功了!!!",
                type: "success"
              });
              this.dialogFormVisible = false;
              this.$router.push("/index/table");
            });
        } else {
          this.$message.error("请正确填写各项信息！！！！");
          return false;
        }
      });
    },
    touser() {
      this.$router.push("/index/user");
    },
    tologin(){
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  display: flex;
  justify-content: space-between;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.touxiang {
  width: 15%;
  display: flex;
  justify-content: space-between;
}
.touxiang .demo-basic--circle {
  padding-top: 5px;
}
.userName {
  width: 60px;
}
</style>