<template>
  <div class>
    <el-button size="mini" @click="addFunc" class="el-icon-plus" round></el-button>

    <el-table :data="list" style="width: 100%">
      <el-table-column prop="key" label="序号" width="180"></el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="content" label="内容" width="180"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="memo_classify.name" label="类别" width="180"></el-table-column>
      <el-table-column prop="update_time" label="最近修改时间" width="200"></el-table-column>
      <el-table-column prop="id" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="editFunc(scope.row)" size="mini" class="el-icon-edit"></el-button>
            <el-button @click="deleteFunc(scope.row)" size="mini" class="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  分页  -->
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="itemTotal"
      :page-size="pageSize"
      @current-change="currentChange"
    ></el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" label-position="left">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" size="small" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="form.content" :autosize="{ minRows: 4, maxRows: 10 }" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="classify_id">
          <el-select size="small" v-model="form.classify_id" placeholder="请选择类别">
            <el-option v-for="(item,key) in classifyList" :key="key" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <a class="sub-btn" @click="classifyManage">管理类别</a>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="类别管理" :visible.sync="dialogVisibleClassify" width="40%">
        <el-button @click="addClassifyFunc" size="mini" class="el-icon-plus"></el-button>
        <el-table :data="classifyList" style="width: 100%">
            <el-table-column prop="name" label="类别名称" width="180"></el-table-column>
            <el-table-column prop="id" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="editClassifyFunc(scope.row)" size="mini" class="el-icon-edit"></el-button>
                    <el-popconfirm title="确定删除吗？" icon="el-icon-info" @onConfirm="deleteClassifyFunc(scope.row)">
                        <el-button size="mini" class="el-icon-delete" slot="reference"></el-button>
                    </el-popconfirm>
                    <el-button @click="addClassifyFunc(scope.row)" size="mini" class="el-icon-plus" v-if="scope.row.pid == 0"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      list: [],
      itemTotal: 0,
      pageIndex: 1,
      pageSize: 10,
      dialogVisible: false,
      dialogTitle: "",
      classifyList: [],
      form: {
        id: "",
        title: "",
        content: "",
        classify_id: "",
      },
      formMethod: "",
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        classify_id: [{ required: true, message: "请输选择类别", trigger: "change" }],
      },
      dialogVisibleClassify: false,

    };
  },
  created() {
    this.getList();
    this.getClassifyList();
  },
  methods: {
    addFunc: function () {
        this.dialogTitle = "添加备忘录";
        this.form.id = "";
        this.form.title = "";
        this.form.content = "";
        this.form.classify_id = "";
        this.formMethod = "post";
        this.dialogVisible = true;
    },

    editFunc: function (row) {
        this.dialogTitle = "编辑备忘录"
        this.form.id = row.id;
        this.form.title = row.title;
        this.form.content = row.content;
        this.form.classify_id = row.classify_id; 
        this.formMethod = "put";
        this.dialogVisible = true;
    },

    deleteFunc: function (row) {
        this.$confirm('此次删除操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios({
            url: this.$apiDomain + "/v1/memo",
            method: "delete",
            headers: { token: this.$uc.token },
            data: { id: row.id},
          })
            .then((res) => {
              if (res.data.code == 0) {
                this.$message(res.data.msg);
                this.getList();
              } else {
                this.$message(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
          }).catch(() => { console.log("cancel") });
    },

    submitFn: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$axios({
            url: this.$apiDomain + "/v1/memo",
            method: "" + this.formMethod,
            headers: { token: this.$uc.token },
            data: this.form,
          })
            .then((res) => {
              if (res.data.code == 0) {
                this.$message(res.data.msg);
                this.getList();
                this.dialogVisible = false;
              } else {
                this.$message(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    currentChange: function (pageIndex) {
      this.pageIndex = pageIndex;
      this.getList();
    },

    getList() {
      this.$axios({
        url: this.$apiDomain + "/v1/memo",
        method: "get",
        headers: { token: this.$uc.token },
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            let i = 1;
            this.list = res.data.result.list.map((v) => {
              v.key = i++;
              v.create_time = this.$util.formatUnix(v.create_time);
              v.update_time = this.$util.formatUnix(v.update_time);
              return v;
            });
            this.itemTotal = res.data.result.page.itemTotal;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getClassifyList() {
        this.$axios({
        url: this.$apiDomain + "/v1/memo/classify",
        method: "get",
        headers: { token: this.$uc.token },
        params: {},
      })
        .then((res) => {
          if (res.data.code == 0) {
            this.classifyList = res.data.result.map(v => {
              v.name = (v.pid > 0) ? "|— " + v.name : v.name
              return v
            })
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    classifyManage() {
        this.dialogVisibleClassify = true;

    },

    addClassifyFunc: function(row){
        var pid = (row.id == undefined) ? 0 : row.id;
        this.$prompt('请输入名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: "",
        }).then(({ value }) => {
           this.submitClassify(value, "", pid, "post")
        }).catch(() => { console.log("取消添加") });
    },

    editClassifyFunc: function(row){
        this.$prompt('请输入名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: "" + row.name,
        }).then(({ value }) => {
           this.submitClassify(value, row.id, "", "put")
        }).catch(() => { console.log("取消编辑") });
    },

    submitClassify(value,id,pid,formMethod){
        this.$axios({
            url: this.$apiDomain + "/v1/memo/classify",
            method: "" + formMethod,
            headers: { token: this.$uc.token },
            data: {
                name: value,
                id: id,
                pid: pid,
            },
          })
            .then((res) => {
              if (res.data.code == 0) {
                this.getClassifyList()
              } else {
                this.$message(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
        });
    },

    deleteClassifyFunc: function(row){
        this.$axios({
            url: this.$apiDomain + "/v1/memo/classify",
            method: "delete",
            headers: { token: this.$uc.token },
            data: { id: row.id},
          })
            .then((res) => {
              if (res.data.code == 0) {
                this.getClassifyList();
              } else {
                this.$message(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
        });
    },

  },
};
</script>