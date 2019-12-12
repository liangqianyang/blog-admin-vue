<template>
  <el-form>
    <el-form-item label="中文名">
      <el-input v-model.trim="user.cn_name" />
    </el-form-item>
    <el-form-item label="英文名">
      <el-input v-model.trim="user.en_name" />
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model.trim="user.nickname" />
    </el-form-item>
    <el-form-item label="职业">
      <el-input v-model.trim="user.profession" />
    </el-form-item>
    <el-form-item label="现居">
      <el-input v-model.trim="user.address" />
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model.trim="user.phone" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="个人简介">
      <el-input v-model.trim="user.summary" type="textarea" :rows="4" />
    </el-form-item>
    <el-form-item label="内心独白">
      <el-input v-model.trim="user.description" type="textarea" :rows="6" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateCenter } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          cn_name: '',
          en_name: '',
          nick_name: '',
          profession: '',
          address: '',
          username: '',
          phone: '',
          email: '',
          summary: '',
          description: ''
        }
      }
    }
  },
  methods: {
    submit() {
      updateCenter(this.user).then(response => {
        this.$notify({
          title: response.type,
          message: response.message,
          type: response.type,
          duration: 1500
        })
      })
    }
  }
}
</script>
