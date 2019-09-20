<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入角色名称"
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
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="角色名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="path" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
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
            default-expand-all
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
  </div>
</template>

<script>
import { role_info, list, create, update, destroy } from '@/api/role'
import { menus } from '@/api/menu'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Role',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null, // 列表数据
      total: 0,
      listLoading: true, // loading
      // 查询条件
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        sort: '',
        status: '0'
      },
      delLoading: false, // 删除的loading
      delVisible: false, // 删除提示弹框的状态
      ids: [], // 选中的id
      // 状态
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
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogFormVisible: false, // 是否显示Dialog 对话框
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      menusData: null, // 菜单列表(权限)
      checkStrictly: false,
      // 权限列表的配置
      props: {
        label: 'name',
        children: 'children'
      },
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
    this.getList()// 获取列表数据
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
      if (prop === 'sort') {
        this.sortBySort(order)
      }
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
        id: '', // 角色ID
        name: '', // 角色名称
        remark: '', // 备注
        rule_ids: [], // 选中的权限
        status: '0'// 状态
      }
    },
    // 获取菜单列表用于权限控制
    getMenus() {
      menus().then(response => {
        this.menusData = response.data
      })
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
    // 获取数据列表
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    // 响应新增操作
    handleCreate() {
      this.getMenus()// 获取菜单列表(权限)
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
          return false
        }
      })
    },

    // 响应编辑操作
    handleUpdate(row) {
      this.getMenus()// 获取菜单列表(权限)
      this.temp = Object.assign({}, row) // copy obj
      this.getRoleInfo()
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
          update(this.temp).then(response => {
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
          return false
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
