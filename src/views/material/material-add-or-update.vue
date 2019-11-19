<template>
  <el-dialog
    :title="!temp.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="120px"
      style="width: 400px; margin-left:50px;"
    >

      <el-form-item label="标题" prop="title">
        <el-input v-model="temp.title" />
      </el-form-item>
      <el-form-item label="素材图" prop="url">
        <el-upload
          class="material-uploader"
          :action="uploadAction"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="temp.url" :src="temp.url" class="material">
          <i v-else class="el-icon-plus material-uploader-icon" />
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update } from '@/api/material'
export default {
  components: { },
  data() {
    return {
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      dataForm: {},
      dialogFormVisible: false, // 是否显示对话框
      uploadAction: process.env.VUE_APP_BASE_API + '/api/material/upload', // 上传图片的链接
      imageUrl: '', // 素材展示图
      // 临时数据
      temp: {
        id: '',
        title: '', // 标题
        url: '', // 素材链接
        width: '', // 宽度
        height: '', // 高度
        type: ''// 类型
      },
      // 表单规则
      rules: {
        title: [{ required: true, message: '请输入标题名称', trigger: 'blur' }]
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
        title: '', // 标题
        url: '', // 素材链接
        width: '', // 宽度
        height: '', // 高度
        type: ''// 类型
      }
    },
    init(row) {
      this.dialogFormVisible = true
      if (Object.keys(row).length !== 0) {
        this.dialogStatus = 'update'
        this.temp = Object.assign({}, row) // copy obj
      } else {
        this.dialogStatus = 'create'
      }
    },
    handleAvatarSuccess(res, file) {
      this.temp.url = res.file
      this.temp.width = res.width
      this.temp.height = res.height
      this.temp.type = res.type
      this.imageUrl = URL.createObjectURL(file.raw)
    },

    // 创建数据
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          create(this.temp).then(response => {
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
    // 更新数据
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          update(this.temp).then(response => {
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
    }
  }
}
</script>

<style>
  .material-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .material-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .material-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 420px;
    height: 280px;
    line-height: 280px;
    text-align: center;
  }
  .material {
    width: 420px;
    height: 280px;
    display: block;
  }
</style>
