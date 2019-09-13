<template>
  <div>
      <el-table
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
        :data="userData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      >
        <el-table-column prop="date" label="创建时间" width="200"></el-table-column>
        <el-table-column prop="name" label="姓名" width="80"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="100"></el-table-column>
        <el-table-column prop="identity" label="身份" width="90"></el-table-column>
        <el-table-column prop="avatar" label="头像" width="230"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="freeze(scope.row._id)">冻结</el-button>
            <el-button size="mini" type="success" @click="thaw(scope.row._id)">解冻</el-button>
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
        :total="userData.length"
      ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: [],
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
    };
  },
  created() {
    this.axios.get("http://localhost:3002/api/users").then(res => {
      console.log(res);
      this.userData = res.data;
    });
  },
  methods: {
      thaw(id){
          this.axios.put("http://localhost:3002/api/users/thaw/"+id).then(res=>{
              console.log(res)
          })
      },
      freeze(id){
          this.axios.put("http://localhost:3002/api/users/freeze/"+id).then(res=>{
              console.log(res)
          })
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
              .delete("http://localhost:3002/api/users/delete/" + id)
              .then(res => {
                this.axios
                  .get("http://localhost:3002/api/users")
                  .then(res => {
                    this.userData = res.data;
                    // this.userData.forEach(item => {
                    //   var t = item.date;
                    //   var d = new Date();
                    //   d.setTime(t);
                    //   item.date = d.toLocaleString();
                    // });
                    // console.log(new Date(this.userData))
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
  }
};
</script>

<style scoped>
</style>