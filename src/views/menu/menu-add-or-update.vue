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
      <el-form-item label="父节点" prop="parent_id">
        <tree-select
          :data="menusData"
          :default-props="defaultProps"
          :node-key="nodeKey"
          :width="410"
          :checked-keys="defaultCheckedKeys"
          @popoverHide="popoverHide"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="路由" prop="url">
        <el-input v-model="temp.url" placeholder="根节点时请填#" />
      </el-form-item>
      <el-form-item label="授权" prop="perms">
        <el-input v-model="temp.perms" placeholder="请填写授权权限,列如:api.user.list" />
      </el-form-item>
      <el-form-item label="图标">
        <el-select v-model="temp.icon" class="el-input" placeholder="请选择图标">
          <el-option
            v-for="item in svgIcons"
            :key="item"
            :label="item"
            :value="item"
          >
            <svg-icon :icon-class="item" class-name="disabled" />
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="radio" :change="typeChange(radio)">
          <el-radio :label="0">目录</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="temp.sort" type="number" min="0" />
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
import { create, update } from '@/api/menu'
import svgIcons from '../icons/svg-icons'
import TreeSelect from '@/components/TreeSelect/tree-select.vue'
export default {
  components: { TreeSelect },
  data() {
    return {
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      dialogFormVisible: false, // 是否显示对话框
      svgIcons,
      radio: 1,
      menusData: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      nodeKey: 'id',
      defaultCheckedKeys: [],
      statusOptions: [{
        value: '0',
        label: '正常'
      }, {
        value: '9',
        label: '停用'
      }],
      // 临时数据
      temp: {
        name: '', // 菜单名称
        url: '', // 菜单路由
        perms: '', // 授权权限
        icon: '',
        type: '1',
        parent_id: '0',
        sort: '10',
        status: '0'
      },
      // 表单规则
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
      }
    }
  },
  created() {

  },
  methods: {
    // temp数据
    resetTemp() {
      this.temp = {
        name: '',
        url: '',
        perms: '', // 授权权限
        icon: '',
        type: '1',
        parent_id: '0',
        sort: '10',
        status: '0'
      }
    },
    init(row, menusDataList) {
      this.dialogFormVisible = true
      this.menusData = menusDataList
      if (Object.keys(row).length !== 0) {
        this.dialogStatus = 'update'
        this.temp = Object.assign({}, row) // copy obj
        this.defaultCheckedKeys = [this.temp.parent_id]
        this.radio = parseInt(row.type)
      } else {
        this.dialogStatus = 'create'
        this.defaultCheckedKeys = [0]
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
      this.temp.type = radio
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
                this.$emit('refreshMenuDataList')
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
                this.$emit('refreshMenuDataList')
              }
            })
          })
        }
      })
    }
  }
}
</script>

