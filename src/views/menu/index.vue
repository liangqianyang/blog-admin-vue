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
        @click="handleCreate({})"
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList" @refreshMenuDataList="getMenus" />
  </div>
</template>

<script>
import { list, authMenus, destroy } from '@/api/menu'
import waves from '@/directive/waves' // waves directive
import AddOrUpdate from './menu-add-or-update'

export default {
  name: 'Menu',
  components: { AddOrUpdate },
  directives: { waves },
  data() {
    return {
      menusData: null,
      tableKey: 0,
      list: null, // 列表数据
      listLoading: true, // loading
      // 查询条件
      listQuery: {
        name: '',
        sort: '',
        status: '0'
      },
      delVisible: false, // 删除提示弹框的状态
      addOrUpdateVisible: false, // 新增编辑弹窗
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
    // 获取菜单列表
    getMenus() {
      authMenus().then(response => {
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
    handleCreate(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.resetTemp()
        this.$refs.addOrUpdate.init(row, this.menusData)
      })
    },

    // 响应更新操作
    handleUpdate(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.resetTemp()
        this.$refs.addOrUpdate.init(row, this.menusData)
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
