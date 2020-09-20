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
import { asyncTempoExportTask, awaitTempoExportTask } from "@/api/tempo";
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
            trigger: "change",
          },
        ],
      },
      isNotAbleToDownload: true,
      excelFileUrl: "",
    };
  },
  methods: {
    releaseTask() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          // this.$message("已经提交任务请求");
        } else {
          this.$message.error("请选择相关选项！");
          return false;
        }
        const asyncTaskFormData = this.getAsyncTaskFormData();
        asyncTempoExportTask(asyncTaskFormData)
          .then((response) => {
            const { data } = response;
            this.$message({
              message: `成功获得任务ID：${data.taskId}`,
              type: "success",
            });
            this.taskIdForm.taskId = data.taskId;
          })
          .catch((error) => {
            this.$message.error(error);
          });
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

    formatDateTime(dateTime) {
      const year = dateTime.getFullYear().toString();
      const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
      const date = dateTime.getDate().toString().padStart(2, "0");
      const hour = dateTime.getHours().toString().padStart(2, "0");
      const miniute = dateTime.getMinutes().toString().padStart(2, "0");
      const second = dateTime.getSeconds().toString().padStart(2, "0");
      const formattedDateTime = `${year}${month}${date}${hour}${miniute}${second}`;
      return formattedDateTime;
    },

    queryTask() {
      this.$refs["taskIdForm"].validate((valid) => {
        if (valid) {
          // this.$message("在后台查询任务ID");
        } else {
          this.$message.error("查询参数必须有任务ID！");
          return false;
        }
        awaitTempoExportTask({ taskId: this.taskIdForm.taskId })
          .then((response) => {
            const { data } = response;
            const state = data.state;
            const info = data.info;
            if (state === "SUCCESS") {
              this.$message({
                message: `恭喜你，${info}`,
                type: "success",
              });
              console.log(data.fileUrlWithHost);
              this.excelFileUrl = data.fileUrlWithHost;
              this.isNotAbleToDownload = false;
            } else if (state == "FAILURE") {
              this.$message({
                message: `很抱歉，${info}`,
                type: "error",
              });
            } else {
              this.$message(info);
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
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

