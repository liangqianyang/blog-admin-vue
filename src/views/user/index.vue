<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="请输入用户名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.status" class="filter-item" placeholder="请选择状态">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
      <el-button
        v-waves
        :loading="delLoading"
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="handleDeletes"
      >删除</el-button>
    </div>

    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" prop="avatar" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="100" height="100">
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="150px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.role_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status =='0'" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status =='9'" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" :close-on-click-modal="false" width="300px" center>
      <span>是否确定删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增/编辑提示框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
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
          <el-input v-model="temp.avatar" placeholder="请上传头像" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入用户手机号码" />
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <tree-select
            :data="rolesData"
            :default-props="defaultProps"
            :node-key="nodeKey"
            :checked-keys="defaultCheckedKeys"
            placeholder="请选择角色"
            @popoverHide="popoverHide"
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
  </div>
</template>

<script>
import { list, create, update, destroy } from '@/api/user'
import { roles } from '@/api/role'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import TreeSelect from '@/components/TreeSelect/tree-select.vue'

export default {
  name: 'User',
  components: { Pagination, TreeSelect },
  directives: { waves },
  data() {
    return {
      rolesData: null, // 角色数据源
      // 角色父节点的配置
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      nodeKey: 'id', // 角色列表的key
      defaultCheckedKeys: [], // 父节点默认选中的值
      tableKey: 0,
      list: null, // 列表数据
      total: 0,
      listLoading: true, // loading
      // 查询条件
      listQuery: {
        page: 1,
        limit: 20,
        username: '',
        sort: '',
        status: '0'
      },
      // 临时数据
      temp: {
        username: '',
        real_name: '', // 真实姓名
        password: '', // 密码
        check_password: '', // 确认密码
        email: '', // 邮箱
        phone: '', // 电话
        avatar: '',
        role_id: '', // 角色
        status: '0'
      },
      dialogFormVisible: false, // 是否显示Dialog 对话框
      delVisible: false, // 删除提示弹框的状态
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 表单规则
      rules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        real_name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        check_password: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
        phone: [{ required: true, pattern: /^0{0,1}(13[0-9]|15[7-9]|153|18[0-9]|199)[0-9]{8}$/, message: '手机号格式有误', trigger: 'blur' }]
      },
      statusOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '正常'
      }, {
        value: '9',
        label: '停用'
      }],
      ids: [], // 选中的id
      delLoading: false// 删除loading
    }
  },
  created() {
    this.getList()// 获取列表数据
    this.getRoles()// 获取下拉框中可用的角色列表
  },
  methods: {
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 排序
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'status') {
        this.sortByStatus(order)
      }
    },
    // 根据状态排序
    sortByStatus(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'status asc'
      } else {
        this.listQuery.sort = 'status desc'
      }
      this.handleFilter()
    },
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
        role_id: '0', // 角色
        status: '0'
      }
    },
    // 下拉框收回时设置父节点ID
    popoverHide(checkedIds, checkedData) {
      if (checkedIds !== '') {
        this.temp.role_id = checkedIds
      }
    },
    // 获取角色列表
    getRoles() {
      roles().then(response => {
        this.rolesData = response.data
      })
    },
    // 获取数据列表
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    // 响应创建操作
    handleCreate() {
      this.defaultCheckedKeys = []
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 创建数据
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.password === this.temp.check_password) {
            if (this.temp.role_id) {
              create(this.temp).then(response => {
                this.dialogFormVisible = false
                this.$notify({
                  title: response.type,
                  message: response.message,
                  type: response.type,
                  duration: 1500
                })
                this.getList()
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
    // 响应更新操作
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.defaultCheckedKeys = [this.temp.role_id]
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新数据
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.role_id !== 0) {
            const tempData = Object.assign({}, this.temp)
            delete tempData.create_time
            delete tempData.update_time
            update(tempData).then(response => {
              this.dialogFormVisible = false
              this.$notify({
                title: response.type,
                message: response.message,
                type: response.type,
                duration: 1500
              })
              this.getList()
            })
          } else {
            this.$message({
              message: '请选择角色',
              type: 'warning'
            })
          }
        }
      })
    },
    // 响应删除操作
    handleDelete(row) {
      this.delVisible = true // 显示删除弹框
      this.ids = []
      this.ids.push(row.id)
    },
    // 批量删除
    handleDeletes() {
      const select_rows = this.$refs.multipleTable.selection
      const length = select_rows.length
      if (length < 1) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning'
        })
        return false
      }
      this.delVisible = true // 显示删除弹框
      this.ids = []
      for (let i = 0; i < length; i++) {
        this.ids.push(select_rows[i].id)
      }
    },
    // 确定删除
    deleteRow() {
      this.delLoading = true
      destroy(this.ids).then(response => {
        this.$notify({
          title: response.type,
          message: response.message,
          type: response.type,
          duration: 1500
        })
        this.getList()
      })
      this.delLoading = false
      this.delVisible = false// 关闭删除提示模态框
    }
  }
}
</script>
