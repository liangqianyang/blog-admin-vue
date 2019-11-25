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
      <el-form-item label="父级栏目" prop="parent_id">
        <tree-select
          :data="categotyData"
          :default-props="defaultProps"
          :node-key="nodeKey"
          :checked-keys="defaultCheckedKeys"
          @popoverHide="popoverHide"
        />
      </el-form-item>

      <el-form-item label="栏目名称" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="栏目简介" prop="summary">
        <el-input v-model="temp.summary" />
      </el-form-item>

      <el-form-item label="链接" prop="url">
        <el-input v-model="temp.url" />
      </el-form-item>

      <el-form-item label="栏目图片">
        <el-radio-group v-model="image_radio">
          <el-radio :label="0">网络图片</el-radio>
          <el-radio :label="1">上传栏目图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="image_radio==0" label="栏目图片" prop="image">
        <el-input v-model="temp.image" type="url" />
      </el-form-item>
      <el-form-item v-if="image_radio==1" label="栏目图片" prop="image">
        <el-upload
          class="image-uploader"
          :action="uploadAction"
          :show-file-list="false"
          :on-success="handleImageSuccess"
        >
          <img v-if="temp.image" :src="temp.image" class="image">
          <i v-else class="el-icon-plus image-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="是否是分类">
        <el-radio-group v-model="radio" :change="typeChange(radio)">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input v-model="temp.sort" type="number" />
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
      radio: 1, // 是否是分类的按钮
      image_radio: 1, // 图片类型的按钮
      // 临时数据
      temp: {
        id: '',
        name: '', // 类目名称
        url: '', // 链接
        is_category: 1, // 是否是分类
        parent_id: '0',
        image: '', // 栏目图片
        summary: '', // 栏目简介
        sort: '1'// 排序
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/api/material/upload', // 上传图片的链接
      // 表单规则
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        image: [{ required: true, message: '请选择栏目图片', trigger: 'blur' }],
        summary: [{ required: true, message: '请输入栏目简介', trigger: 'blur' }],
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
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
        url: '',
        parent_id: '0',
        image: '', // 栏目图片
        summary: '', // 栏目简介
        is_category: 1, // 是否是分类
        sort: '1'// 排序
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
    handleImageSuccess(res, file) {
      this.temp.image = res.file
    },
    // 监听单选框
    typeChange(radio) {
      this.temp.is_category = radio
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

<style>
  .image-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .image-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 420px;
    height: 280px;
    line-height: 280px;
    text-align: center;
  }
  .image {
    width: 420px;
    height: 280px;
    display: block;
  }
</style>

