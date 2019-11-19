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

      <el-form-item label="文章标题" prop="title">
        <el-input v-model="temp.title" />
      </el-form-item>
      <el-form-item label="文章简介" prop="summary">
        <el-input v-model="temp.summary" />
      </el-form-item>
      <el-form-item label="文章分类" prop="cid">
        <tree-select
          :data="categoryOptions"
          :default-props="defaultProps"
          :node-key="nodeKey"
          :checked-keys="defaultCheckedKeys"
          :width="755"
          class="el-input"
          @popoverHide="popoverHide"
        />
      </el-form-item>
      <el-form-item label="标签" prop="label_ids">
        <el-select v-model="temp.label_ids" multiple value-key="id" class="el-input" placeholder="请选择标签">
          <el-option
            v-for="item in labelOptions"
            :key="item.value"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SEO标题" prop="seo_title">
        <el-input v-model="temp.seo_title" />
      </el-form-item>
      <el-form-item label="SEO关键词" prop="seo_keywords">
        <el-input v-model="temp.seo_keywords" />
      </el-form-item>
      <el-form-item label="SEO描述" prop="seo_description">
        <el-input v-model="temp.seo_description" />
      </el-form-item>
      <el-form-item label="封面图片">
        <el-radio-group v-model="radio">
          <el-radio :label="0">网络图片</el-radio>
          <el-radio :label="1">上传封面图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="radio==0" label="封面图片" prop="cover">
        <el-input v-model="temp.cover" type="url" />
      </el-form-item>
      <el-form-item v-if="radio==1" label="封面图片" prop="cover">
        <el-upload
          class="cover-uploader"
          :action="uploadAction"
          name="cover"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="temp.cover" :src="temp.cover" class="cover">
          <i v-else class="el-icon-plus cover-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="内容" prop="content" style="margin-bottom: 30px;">
        <Tinymce ref="editor" v-model="temp.content" :height="400" />
      </el-form-item>
      <el-form-item v-if="dialogStatus=='create'" label="发布日期" prop="publish_date">
        <el-date-picker
          v-model="temp.publish_date"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width:100%;"
          placeholder="选择发布时间"
        />
      </el-form-item>
      <el-form-item v-if="dialogStatus=='update'" label="点赞数" prop="likes">
        <el-input v-model="temp.likes" type="number" />
      </el-form-item>
      <el-form-item v-if="dialogStatus=='update'" label="评论数" prop="comments">
        <el-input v-model="temp.comments" type="number" />
      </el-form-item>
      <el-form-item v-if="dialogStatus=='update'" label="状态" prop="status">
        <el-select v-model="temp.status" class="el-input" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取消</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update } from '@/api/article'
import Tinymce from '@/components/Tinymce'
import TreeSelect from '@/components/TreeSelect/tree-select.vue'
export default {
  components: { Tinymce, TreeSelect },
  data() {
    return {
      radio: 1,
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      dataForm: {},
      dialogFormVisible: false, // 是否显示对话框
      // 状态
      statusOptions: [{
        value: '0',
        label: '正常'
      }, {
        value: '9',
        label: '下架'
      }],
      categoryOptions: [], // 文章分类数据
      labelOptions: [], // 文章标签数据
      nodeKey: 'id',
      defaultCheckedKeys: [], // 选中的文章分类
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      imageUrl: '', // 封面展示图
      // 临时数据
      temp: {
        id: '',
        title: '', // 文章标题
        summary: '', // 文章简介
        cid: '', // 分类ID
        label_ids: [], // 选择的文章标签
        content: '', // 内容
        is_admin: '1', // 是否是后台发布
        publish_date: '', // 发布日期
        cover: '', // 封面图
        status: '0', // 状态
        seo_title: '', // seo标题
        seo_keywords: '', // seo关键词
        seo_description: '', // seo描述
        likes: 0, // 点赞数
        comments: 0 // 点赞数
      },
      // 表单规则
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        summary: [{ required: true, message: '请输入文章简介', trigger: 'blur' }],
        cid: [{ required: true, message: '请选择文章分类', trigger: 'blur' }],
        label_ids: [{ required: true, message: '请选择文章标签', trigger: 'blur' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover: [{ required: true, message: '请上传文章封面图片', trigger: 'blur' }]
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/api/article/upload' // 上传图片的链接
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
        summary: '',
        cid: '', // 分类ID
        label_ids: [], // 标签ID
        content: '', // 内容
        is_admin: '1', // 是否是后台发布
        publish_date: '', // 发布日期
        cover: '', // 封面图
        status: '0', // 状态
        seo_title: '', // seo标题
        seo_keywords: '', // seo关键词
        seo_description: '', // seo描述
        likes: 0, // 点赞数
        comments: 0 // 点赞数
      }
      this.defaultCheckedKeys = []
      if (this.$refs['editor']) {
        window.tinymce.get(this.$refs['editor'].id).setContent('')
      }
    },
    init(row, categoryData, labelData) {
      this.dialogFormVisible = true
      this.resetTemp()// 重置表单
      this.categoryOptions = categoryData// 为文章分类数据赋值
      this.labelOptions = labelData// 为文章标签数据赋值
      if (Object.keys(row).length !== 0) {
        this.dialogStatus = 'update'
        this.temp = Object.assign({}, row) // copy obj
        if (this.$refs['editor']) {
          window.tinymce.get(this.$refs['editor'].id).setContent(row.content)
        }
        this.defaultCheckedKeys = [this.temp.cid]
        const selectedLabels = [] // 选中的标签
        for (const key in row.labels) {
          selectedLabels.push(row.labels[key]['lid'])
        }
        this.temp.label_ids = selectedLabels
      } else {
        this.dialogStatus = 'create'
      }
    },
    // 下拉框收回时设置选中的文章分类
    popoverHide(checkedIds, checkedData) {
      if (checkedIds !== '') {
        this.temp.cid = checkedIds
      }
    },
    handleAvatarSuccess(res, file) {
      this.temp.cover = res.file
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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

<style>
  .cover-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .cover-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 420px;
    height: 280px;
    line-height: 280px;
    text-align: center;
  }
  .cover {
    width: 420px;
    height: 280px;
    display: block;
  }
</style>
