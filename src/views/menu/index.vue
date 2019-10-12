<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入菜单名称"
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
      <el-table-column label="菜单名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路由" prop="url" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" prop="icon" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column label="权限" prop="perms" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.perms }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type =='0'">目录</span>
          <span v-if="scope.row.type =='1'">菜单</span>
          <span v-if="scope.row.type =='2'">按钮</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
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
        <el-form-item label="父节点" prop="parent_id">
          <tree-select
            :data="menusData"
            :default-props="defaultProps"
            :node-key="nodeKey"
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
          <el-select v-model="temp.status" placeholder="请选择">
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
import svgIcons from '../icons/svg-icons'
import { list, menus, create, update, destroy } from '@/api/menu'
import waves from '@/directive/waves' // waves directive
import TreeSelect from '@/components/TreeSelect/tree-select.vue'

export default {
  name: 'Menu',
  components: { TreeSelect },
  directives: { waves },
  data() {
    return {
      svgIcons,
      radio: 1,
      menusData: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      nodeKey: 'id',
      defaultCheckedKeys: [],
      tableKey: 0,
      list: null, // 列表数据
      listLoading: true, // loading
      // 查询条件
      listQuery: {
        name: '',
        sort: '',
        status: '0'
      },
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
      dialogFormVisible: false, // 是否显示Dialog 对话框
      dialogStatus: '', // Dialog对话框状态 新增|编辑
      delVisible: false, // 删除提示弹框的状态
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 表单规则
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
      },
      options: [{
        value: '0',
        label: '是'
      }, {
        value: '9',
        label: '否'
      }],
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
      ids: [], // 选中的id
      delLoading: false// 删除loading
    }
  },
  created() {
    this.getList()// 获取列表数据
    this.getMenus()// 获取下拉框中可用的菜单列表
  },
  methods: {
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
    // 根据排序排序
    sortBySort(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'sort asc'
      } else {
        this.listQuery.sort = 'sort desc'
      }
      this.handleFilter()
    },
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
    // 获取菜单列表
    getMenus() {
      menus().then(response => {
        this.menusData = response.data
        this.menusData.unshift({ id: '0', name: '无' })
      })
    },
    // 获取数据列表
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data
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
          create(this.temp).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: response.type,
              message: response.message,
              type: response.type,
              duration: 1500
            })
            this.getList()
            this.getMenus()// 获取下拉框中可用的菜单列表
          })
        }
      })
    },
    // 响应更新操作
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.defaultCheckedKeys = [row.parent_id]
      this.radio = parseInt(row.type)
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
            this.getMenus()// 获取下拉框中可用的菜单列表
          })
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
