<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入分类名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
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
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="分类名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否是目录" prop="is_directory" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.is_directory =='1'">是</span>
          <span v-if="scope.row.is_directory =='0'">否</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" prop="level" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" prop="path" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
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

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList" @refreshCategoryList="getEnableCategory" />
  </div>
</template>

<script>
import AddOrUpdate from './category-add-or-update'
import { getEnableCategory, list, destroy } from '@/api/category'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Menu',
  components: { AddOrUpdate },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null, // 列表数据
      listLoading: true, // loading
      // 查询条件
      listQuery: {
        name: ''
      },
      categotyData: null, // 类目数据
      delVisible: false, // 删除提示弹框的状态
      ids: [], // 选中的id
      delLoading: false, // 删除loading
      addOrUpdateVisible: false
    }
  },
  created() {
    this.getList()// 获取列表数据
    this.getEnableCategory() // 获取分类数据
  },
  methods: {
    // 搜索
    handleFilter() {
      this.getList()
    },
    // 获取类目列表
    getEnableCategory() {
      getEnableCategory().then(response => {
        this.categotyData = response.data
        this.categotyData.unshift({ id: '0', name: '无' })
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
        this.$refs.addOrUpdate.init(row, this.categotyData)
      })
    },
    // 响应更新操作
    handleUpdate(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.resetTemp()
        this.$refs.addOrUpdate.init(row, this.categotyData)
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
