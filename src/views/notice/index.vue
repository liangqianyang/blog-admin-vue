<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入标题"
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
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" min-width="50px">
        <template slot-scope="props">
          <span>{{ props.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通告标题" min-width="250px">
        <template slot-scope="props">
          <span>{{ props.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否置顶" min-width="100px">
        <template slot-scope="props">
          <el-tag v-if="props.row.is_top =='1'" type="success">是</el-tag>
          <el-tag v-if="props.row.is_top =='0'" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150px">
        <template slot-scope="props">
          <span>{{ props.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleTopArticle(row)">置顶</el-button>
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

    <!-- 置顶提示框 -->
    <el-dialog title="提示" :visible.sync="topArticleVisible" :close-on-click-modal="false" width="300px" center>
      <span>是否确定置顶？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="topArticleVisible = false">取 消</el-button>
        <el-button type="primary" @click="topArticle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList" />
  </div>
</template>

<script>
import AddOrUpdate from './notice-add-or-update'
import { list, destroy, top } from '@/api/notice'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Notice',
  components: { AddOrUpdate, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null, // 列表数据
      total: 0,
      listLoading: true, // loading
      // 查询条件
      listQuery: {
        title: ''
      },
      delVisible: false, // 删除提示弹框的状态
      topArticleVisible: false, // 置顶文章提示弹框的状态
      id: '', // 选中的id
      ids: [], // 选中的ids
      delLoading: false, // 删除loading
      addOrUpdateVisible: false
    }
  },
  created() {
    this.getList()// 获取列表数据
  },
  methods: {
    // 搜索
    handleFilter() {
      this.getList()
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
    handleCreate(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row, this.categotyData, this.labelData)
      })
    },
    // 响应更新操作
    handleUpdate(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row, this.categotyData, this.labelData)
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
    },
    handleTopArticle(row) {
      this.topArticleVisible = true // 置顶上架弹框
      this.id = row.id
    },
    // 确定置顶文章
    topArticle() {
      this.delLoading = true
      top(this.id).then(response => {
        this.$notify({
          title: response.type,
          message: response.message,
          type: response.type,
          duration: 1500
        })
        this.getList()
      })
      this.delLoading = false
      this.topArticleVisible = false// 关闭置顶文章提示模态框
    }
  }
}
</script>
