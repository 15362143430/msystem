<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="100px" size="mini">
      <el-form-item label="投标日期筛选">
        <el-col :span="4">
          <el-date-picker type="date" placeholder="开始日期" v-model="sizeForm.start" style="width: 80"></el-date-picker>
        </el-col>
        <el-col class="line" :span="1">---</el-col>
        <el-col :span="4">
          <el-date-picker type="date" placeholder="结束日期" v-model="sizeForm.end" style="width: 80"></el-date-picker>
        </el-col>
        <el-button size="mini" type="primary" @click="screen">筛选</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      border
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
    >
      <el-table-column prop="date" label="创建时间" width="200"></el-table-column>
      <el-table-column prop="type" label="收支类型" width="80"></el-table-column>
      <el-table-column prop="describe" label="收支描述" width="100"></el-table-column>
      <el-table-column prop="income" label="收入" width="90"></el-table-column>
      <el-table-column prop="expend" label="支出" width="90"></el-table-column>
      <el-table-column prop="cash" label="账户现金" width="100"></el-table-column>
      <el-table-column prop="remark" label="备注" width="115"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="bianji(scope.row._id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      screenDate: [],
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      sizeForm: {}
    };
  },
  created() {
    this.axios.get("http://localhost:3002/api/profiles").then(res => {
      console.log(res.data);
      this.tableData = res.data;
      this.tableData.forEach(item => {
        var t = item.date;
        var d = new Date();
        d.setTime(t);
        item.date = d.toLocaleString();
      });
    });
  },
  methods: {
    bianji(id) {
      if (this.$store.state.User.identity !== "manager") {
        this.$message.error("您没有权限进行编辑！！！");
      } else {
        this.$router.push({ path: "/index/edit/" + id, parmas: { id: id } });
      }
    },
    del(id) {
      if (this.$store.state.User.identity !== "manager") {
        this.$message.error("您没有权限进行删除！！！");
      } else {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.axios
              .delete("http://localhost:3002/api/profiles/delete/" + id)
              .then(res => {
                this.axios
                  .get("http://localhost:3002/api/profiles")
                  .then(res => {
                    console.log(res.date);
                    this.tableData = res.data;
                    this.tableData.forEach(item => {
                      var t = item.date;
                      var d = new Date();
                      d.setTime(t);
                      item.date = d.toLocaleString();
                    });
                    // console.log(new Date(this.tableData))
                  });
              });
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    handleSizeChange(size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.tempList = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tempList.push(list[from]);
        }
      }
    },
    screen() {
      if (!this.sizeForm.start || !this.sizeForm.end) {
        this.$message.error("请输入对应的时间");
      } else {
        var starttime = this.sizeForm.start.getTime();
        var endtime = this.sizeForm.end.getTime();
        this.axios.get("http://localhost:3002/api/profiles").then(res => {
          res.data.forEach(item => {
            if (item.date >= starttime && item.date <= endtime) {
              var t = item.date;
              var d = new Date();
              d.setTime(t);
              item.date = d.toLocaleString();
              this.screenDate.push(item)
            }
          });
          this.tableData=this.screenDate;
        });
        // this.tableData.forEach(item=>{
        //   console.log(new Date(item.date))
        //   if (item.date>=starttime&&item.date<=endtime) {
        //     this.screenDate.push(item)
        //     console.log(this.screenDate)
        //   }
        // })
      }
    }
  }
};
</script>

<style scoped>
.el-date-editor.el-input {
  width: 125px;
}
</style>