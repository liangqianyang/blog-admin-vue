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
      style="width: 60%; margin-left:50px;"
    >
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="temp.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="real_name">
        <el-input v-model="temp.real_name" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item v-if="dialogStatus == 'create'" label="密码" prop="password">
        <el-input v-model="temp.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item v-if="dialogStatus == 'create'" label="确认密码" prop="check_password">
        <el-input v-model="temp.check_password" placeholder="请确认密码" type="password" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="uploadAction"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="temp.email" placeholder="请输入用户邮箱" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="temp.phone" placeholder="请输入用户手机号码" />
      </el-form-item>
      <el-form-item label="角色" prop="role_ids">
        <el-checkbox-group v-model="temp.role_ids">
          <el-checkbox v-for="role in rolesData" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态">
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
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update } from '@/api/user'
export default {
  components: { },
  data() {
    return {
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      dialogFormVisible: false, // 是否显示对话框
      imageUrl: '', // 用户头像链接
      rolesData: null, // 角色数据源
      statusOptions: [{
        value: '0',
        label: '正常'
      }, {
        value: '9',
        label: '停用'
      }],
      // 临时数据
      temp: {
        username: '',
        real_name: '', // 真实姓名
        password: '', // 密码
        check_password: '', // 确认密码
        email: '', // 邮箱
        phone: '', // 电话
        avatar: '',
        role_ids: [], // 选中角色
        status: '0'
      },
      // 表单规则
      rules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        real_name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        check_password: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
        phone: [{ required: true, pattern: /^0{0,1}(13[0-9]|15[7-9]|153|18[0-9]|199)[0-9]{8}$/, message: '手机号格式有误', trigger: 'blur' }]
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/api/user/avatar' // 上传头像的链接
    }
  },
  created() {

  },
  methods: {
    // temp数据
    resetTemp() {
      this.temp = {
        username: '',
        real_name: '', // 真实姓名
        email: '', // 邮箱
        phone: '', // 电话
        password: '', // 密码
        check_password: '', // 确认密码
        avatar: '', // 头像
        role_ids: [], // 角色
        status: '0'
      }
    },
    init(row, rolesDataList) {
      this.dialogFormVisible = true
      this.rolesData = rolesDataList
      this.imageUrl = ''
      if (Object.keys(row).length !== 0) {
        this.dialogStatus = 'update'
        this.temp = Object.assign({}, row) // copy obj
        this.imageUrl = this.temp.avatar
      } else {
        this.dialogStatus = 'create'
      }
    },
    // 图片上传成功后显示图片
    handleAvatarSuccess(res, file) {
      console.log(res)
      if (res.code === 0) {
        this.temp.avatar = res.path
        this.imageUrl = URL.createObjectURL(file.raw)
      } else {
        this.$message.error(res.message)
      }
    },
    // 图片上传检测
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
          if (this.temp.password === this.temp.check_password) {
            if (this.temp.role_ids) {
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
            } else {
              this.$message({
                message: '请选择角色',
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: '输入的密码与确认密码不相符,请确认输入的密码',
              type: 'warning'
            })
          }
        }
      })
    },
    // 更新数据
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.role_ids !== 0) {
            const tempData = Object.assign({}, this.temp)
            delete tempData.create_time
            delete tempData.update_time
            update(tempData).then(response => {
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
          } else {
            this.$message({
              message: '请选择角色',
              type: 'warning'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
