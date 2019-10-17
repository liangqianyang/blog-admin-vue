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
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="temp.name" el-input />
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="temp.remark" class="el-input" />
      </el-form-item>

      <el-form-item label="权限">
        <el-tree
          ref="tree"
          node-key="id"
          :props="props"
          :data="menusData"
          :check-strictly="checkStrictly"
          show-checkbox
          @check-change="handleCheckChange"
        />
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
import { role_info, create, update } from '@/api/role'
export default {
  components: { },
  data() {
    return {
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      dialogFormVisible: false, // 是否显示对话框
      menusData: null, // 菜单列表(权限)
      checkStrictly: false,
      // 权限列表的配置
      props: {
        label: 'name',
        children: 'children'
      },
      // 状态
      statusOptions: [{
        value: '0',
        label: '正常'
      }, {
        value: '9',
        label: '停用'
      }],
      // 临时数据
      temp: {
        id: '', // 角色ID
        name: '', // 角色名称
        remark: '', // 备注
        rule_ids: [], // 选中的权限
        status: '0'// 状态
      },
      // 表单规则
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    // temp数据
    resetTemp() {
      this.temp = {
        id: '', // 角色ID
        name: '', // 角色名称
        remark: '', // 备注
        rule_ids: [], // 选中的权限
        status: '0'// 状态
      }
    },
    init(row, menusDataList) {
      this.dialogFormVisible = true
      this.menusData = menusDataList
      this.imageUrl = ''
      if (Object.keys(row).length !== 0) {
        this.dialogStatus = 'update'
        this.temp = Object.assign({}, row) // copy obj
        this.getRoleInfo()
      } else {
        this.dialogStatus = 'create'
        this.$refs.tree.setCheckedKeys([])// 设置已选中的权限
      }
    },

    // 获取角色信息(编辑时触发)
    getRoleInfo() {
      /** 将树的父级与子级关联移除 */
      this.checkStrictly = true
      if (this.temp.id !== '') {
        role_info(this.temp.id).then(response => {
          // 给表单赋值开始
          this.$refs.tree.setCheckedKeys(response.data.menu_ids)// 设置已选中的权限

          /** 将树的父级与子级关联绑定 */
          this.checkStrictly = false
        })
      } else {
        /** 将树的父级与子级关联绑定 */
        this.checkStrictly = false
      }
    },
    // 权限选项发生改变时获取选中的节点
    handleCheckChange(data, checked, indeterminate) {
      const parentArr = this.$refs.tree.getHalfCheckedNodes()
      const childeArr = this.$refs.tree.getCheckedNodes()
      const arr = childeArr.concat(parentArr)
      const length = arr.length
      this.temp.rule_ids = []
      for (let i = 0; i < length; i++) {
        this.temp.rule_ids.push(arr[i].id)
      }
    },
    // 创建数据
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.rule_ids.length === 0) {
            this.$message({
              message: '请选择权限',
              type: 'warning'
            })
            return
          }
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
          return false
        }
      })
    },
    // 更新数据
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.rule_ids.length === 0) {
            this.$message({
              message: '请选择权限',
              type: 'warning'
            })
            return
          }
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
        } else {
          return false
        }
      })
    }
  }
}
</script>

