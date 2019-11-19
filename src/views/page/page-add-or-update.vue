<template>
  <el-dialog
    :title="!temp.id ? '新增' : '编辑'"
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

      <el-form-item label="单页名称" prop="title">
        <el-input v-model="temp.title" />
      </el-form-item>
      <el-form-item label="单页URL" prop="url">
        <el-input v-model="temp.url" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="temp.sort" type="number" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取消</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update } from '@/api/page'
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
        title: '', // 单页名称
        url: '', // 单页路由
        sort: 1
      },
      // 表单规则
      rules: {
        title: [{ required: true, message: '请输入单页名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入单页路由', trigger: 'blur' }]
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
        url: '',
        sort: 1
      }
    },
    init(row) {
      this.dialogFormVisible = true
      this.resetTemp()// 重置表单
      if (Object.keys(row).length !== 0) {
        this.dialogStatus = 'update'
        this.temp = Object.assign({}, row) // copy obj
      } else {
        this.dialogStatus = 'create'
      }
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
    },
    // 点击取消
    handleCancel() {
      this.dialogFormVisible = false
    }
  }
}
</script>
