<template>
  <div>
    <el-form :rules="rules" ref="ruleForm" :model="profile" label-width="80px">
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
        <el-input v-model="profile.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogVisible=true">确认修改</el-button>
        <el-button @click="goback">取消</el-button>
      </el-form-item>
      <el-dialog
        class="tishi"
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>确定要添加信息吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveProfile('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      profile: {},
      dialogVisible: false,
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
      }
    };
  },
  created() {
    this.axios.get("http://localhost:3002/api/profiles/"+this.id).then(res => {
      this.profile=res.data;
    });
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    saveProfile(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .put("http://localhost:3002/api/profiles/edit/"+this.id, this.profile)
            .then(res => {
              this.$message({
                message: "修改成功了!!!",
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
    goback(){
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
</style>