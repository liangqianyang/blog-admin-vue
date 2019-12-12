<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    style="width:100%;left:50px;"
    center
    :visible.sync="dialogFormVisible"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="120px"
      style="width: 100%;"
    >

      <el-form-item label="用户头像">
        <img :src="temp.avatar" width="50">
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="temp.username" disabled />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="temp.content" type="textarea" :rows="6" disabled />
      </el-form-item>
      <el-form-item v-for="(item,index) in temp.replies" :key="index" label="站长回复">
        <el-input v-model="item.content" disabled />
      </el-form-item>
      <el-form-item label="回复内容" prop="reply">
        <el-input v-model="temp.reply" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取消</el-button>
      <el-button type="primary" @click="reply()">回复</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { reply } from '@/api/message'
export default {
  components: { },
  data() {
    return {
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      dataForm: {},
      dialogFormVisible: false, // 是否显示对话框
      // 临时数据
      temp: {
        id: '',
        avatar: '', // 头像
        username: '', // 用户名
        content: '', // 内容
        reply: '' // 回复内容
      },
      // 表单规则
      rules: {
        reply: [{ required: true, message: '请输入回复内容', trigger: 'blur' }]
      }
    }
  },
  created() {

  },
  methods: {
    // temp数据
    resetTemp() {
      this.temp = {
        id: '',
        title: '',
        content: '', // 内容
        reply: '' // 回复内容
      }
    },
    init(row) {
      this.dialogFormVisible = true
      this.resetTemp()// 重置表单
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
    },
    // 回复
    reply() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          reply(this.temp).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: response.type,
              message: response.message,
              type: response.type,
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    },
    // 点击取消
    handleCancel() {
      this.dialogFormVisible = false
    }
  }
}
</script>
