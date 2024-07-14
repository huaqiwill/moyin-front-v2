<script setup>
import { onMounted, ref } from "vue";
import { DubbingButton } from "@/components";
import { ttsRecordList, ttsRecordDelete } from "@/api/tts";
import { ElMessage, ElMessageBox } from "element-plus";

const dialogVisible = ref(false);

const handleClicked = () => {
  getTtsRecordList();
  dialogVisible.value = true;
};

const getTtsRecordList = () => {
  ttsRecordList().then((res) => {
    console.log(res);
    tableData.value = res.rows;
  });
};

const onDelete = (row) => {
  ElMessageBox.confirm("确认删除吗？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ttsRecordDelete(row.id).then((res) => {
      ElMessage({
        message: "删除成功",
        type: "success",
      });
      getTtsRecordList();
    });
  });
};

onMounted(() => {});

const tableData = ref([]);
</script>
<template>
  <!-- 生成记录 -->
  <DubbingButton
    title="生成记录"
    content="从光标处开始试听"
    icon="log"
    @click="handleClicked"
  />
  <el-dialog v-model="dialogVisible" title="生成记录">
    <p>只保存本设备的最近24小时记录</p>
    <el-table :data="tableData" style="width: 100%; margin-top: 15px">
      <el-table-column prop="createTime" label="生成时间" width="180" />
      <el-table-column prop="speaker" label="生成音色" width="180" />
      <el-table-column prop="text" label="生成内容" />
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template #default="scope">
          <el-button type="primary" @click="onDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
