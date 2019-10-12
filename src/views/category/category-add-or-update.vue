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
      <el-form-item label="父级分类" prop="parent_id">
        <tree-select
          :data="categotyData"
          :default-props="defaultProps"
          :node-key="nodeKey"
          :checked-keys="defaultCheckedKeys"
          @popoverHide="popoverHide"
        />
      </el-form-item>

      <el-form-item label="分类名称" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="是否是目录" prop="is_directory">
        <el-radio v-model="temp.is_directory" label="1">是</el-radio>
        <el-radio v-model="temp.is_directory" label="0">否</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update } from '@/api/category'
import TreeSelect from '@/components/TreeSelect/tree-select.vue'
export default {
  components: { TreeSelect },
  data() {
    return {
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      dataForm: {},
      dialogFormVisible: false, // 是否显示对话框
      categotyData: null, // 类目数据
      nodeKey: 'id',
      defaultCheckedKeys: [], // 选中的父级分类
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 临时数据
      temp: {
        id: '',
        name: '', // 类目名称
        parent_id: '0',
        is_directory: '0'
      },
      // 表单规则
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
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
        name: '',
        parent_id: '0',
        is_directory: '0'
      }
      this.defaultCheckedKeys = [0]
    },
    init(row, data) {
      this.dialogFormVisible = true
      this.categotyData = data
      if (Object.keys(row).length !== 0) {
        this.dialogStatus = 'update'
        this.temp = Object.assign({}, row) // copy obj
        this.defaultCheckedKeys = [row.parent_id]
      } else {
        this.dialogStatus = 'create'
      }
    },
    // 下拉框收回时设置父节点ID
    popoverHide(checkedIds, checkedData) {
      if (checkedIds !== '') {
        this.temp.parent_id = checkedIds
      }
    },
    // 监听单选框
    typeChange(radio) {
      this.temp.is_directory = radio
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
                this.$emit('refreshCategoryList')
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
                this.$emit('refreshCategoryList')
              }
            })
          })
        }
      })
    }
  }
}
</script>
