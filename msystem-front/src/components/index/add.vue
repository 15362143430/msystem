<template>
  <div>
    <el-form ref="form" @submit.native.prevent="confirm" :model="profile" label-width="80px">
      <el-form-item label="收支类型">
        <el-input v-model="profile.type" placeholder="请输入你的收支类型"></el-input>
      </el-form-item>
      <el-form-item label="收支描述">
        <el-input v-model="profile.describe" placeholder="请输入收支描述"></el-input>
      </el-form-item>
      <el-form-item label="收入">
        <el-input v-model="profile.income" placeholder="请输入收入"></el-input>
      </el-form-item>
      <el-form-item label="支出">
        <el-input v-model="profile.expend" placeholder="请输入支出"></el-input>
      </el-form-item>
      <el-form-item label="账户现金">
        <el-input v-model="profile.cash" placeholder="请输入账户现金"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="profile.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">立即创建</el-button>
        <el-button>取消</el-button>
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
          <el-button type="primary" @click="saveprofile">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
export default {
    data () {
        return {
            profile:[],
            dialogVisible: false
        }
    }
};
</script>

<style scoped>
</style>