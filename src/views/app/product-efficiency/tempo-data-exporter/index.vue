<template>
  <div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>发布查询任务</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <el-form ref="taskForm" :rules="rules" :model="taskForm" label-width="80px">
            <el-form-item label="产线选择" prop="millLineTag">
              <el-select v-model="taskForm.millLineTag" placeholder="请选择热轧产线">
                <el-option label="热轧2250产线" value="HSM1" />
                <el-option label="热轧1580产线" value="HSM2" />
              </el-select>
            </el-form-item>
            <el-form-item label="时间跨度" prop="timeRange">
              <el-date-picker
                v-model="taskForm.timeRange"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期与时间"
                end-placeholder="结束日期与时间"
                align="right"
              />
              <!-- <el-col></el-col> -->
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="releaseTask">发布查询任务</el-button>
              <!-- <el-button>取消</el-button> -->
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="9">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>查询任务进度</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <el-form ref="taskIdForm" :rules="rules" :model="taskIdForm" label-width="80px">
            <el-form-item label="任务ID" prop="taskId">
              <el-input v-model="taskIdForm.taskId" placeholder="任务ID" />
            </el-form-item>
            <el-form-item id="query-button-group">
              <el-button type="primary" @click="queryTask">根据ID查询进度</el-button>
              <el-button
                type="success"
                :disabled="isNotAbleToDownload"
                @click="downloadExcelFile"
              >下载Excel文件</el-button>
              <a :href="excelFileUrl" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      taskForm: {
        millLineTag: "",
        timeRange: "",
      },
      taskIdForm: {
        taskId: "",
      },
      rules: {
        millLineTag: [
          {
            required: true,
            message: "请选择产线",
            trigger: "change",
          },
        ],
        timeRange: [
          {
            required: true,
            message: "请选择起始时间",
            trigger: "change",
          },
        ],
        taskId: [
          {
            required: true,
            message: "需要一个任务ID",
            trigger: "blur",
          },
        ],
      },
      isNotAbleToDownload: true,
      excelFileUrl: "https://www.djangoproject.com/download/2.1.15/tarball/",
    };
  },
  methods: {
    releaseTask() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          this.$message("已经提交任务请求");
        } else {
          this.$message.error("请选择相关选项！");
          return false;
        }
        // const asyncTaskFormData = this.getAsyncTaskFormData();

        // const { taskId } = this.$store.dispatch(
        //   "tempo/asyncExportTask",
        //   asyncTaskFormData
        // );

        this.taskIdForm.taskId = "dwdwdwdwdw";
        // this.taskIdForm.taskId = taskId;
      });
    },

    getAsyncTaskFormData() {
      const formData = {};
      formData["millLineTag"] = this.taskForm.millLineTag;
      formData["startTime"] = this.formatDateTime(this.taskForm.timeRange[0]);
      formData["endTime"] = this.formatDateTime(this.taskForm.timeRange[1]);
      console.log(formData);
      return formData;
    },

    formatDateTime(date) {
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const strDate = date.getDate().toString().padStart(2, "0");
      const formattedDate = `${date.getFullYear()}${month}${strDate}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
      return formattedDate;
    },

    queryTask() {
      this.$refs["taskIdForm"].validate((valid) => {
        if (valid) {
          this.$message("在后台查询任务ID");
        } else {
          this.$message.error("查询必须有任务ID！");
          return false;
        }
        // const { state, info, fileUrlWithHost } = this.$store.dispatch(
        //   "tempo/awaitExportTask",
        //   this.taskIdForm
        // );

        // if (state === "SUCCESS") {
        //   // this.excelFileUrl = "";
        //   this.isNotAbleToDownload = false;
        //   this.$message({
        //     message: "恭喜你，这是一条成功消息",
        //     type: "success",
        //   });
        //   this.$message("在后台查询任务ID");
        // } else if (state == "FAILURE") {
        //   this.$message("任务失败");
        //   this.$message({
        //     message: "恭喜你，这是一条成功消息",
        //     type: "warning",
        //   });
        // }
      });
    },

    downloadExcelFile() {
      const a = document.createElement("a");
      a.href = this.excelFileUrl;
      a.click();
    },
  },
};
</script>

<style scoped>
.el-card {
  padding: 0px;
  margin: 10px;
  width: 100%;
}
/* #query-button-group {
  padding: 10px;
} */
</style>

