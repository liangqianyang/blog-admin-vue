<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-input
          v-model="listQuery.title"
          placeholder="请输入文章标题"
          style="width: 200px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter"
        />

        <div style="display:inline-block;">
          <tree-select
            :data="categotyData"
            :default-props="defaultProps"
            :node-key="nodeKey"
            placeholder="请选择文章分类"
            clearable
            :checked-keys="defaultCheckedKeys"
            class="filter-item"
            @popoverHide="popoverHide"
          />
        </div>

        <el-select v-model="listQuery.label" value-key="id" class="filter-item" clearable placeholder="请选择标签">
          <el-option
            v-for="item in labelData"
            :key="item.value"
            :label="item.title"
            :value="item.id"
          />
        </el-select>

        <el-select v-model="listQuery.status" class="filter-item" placeholder="请选择状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form>
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
        type="success"
        icon="el-icon-top"
        @click="handleUpArticles"
      >上架</el-button>
      <el-button
        v-waves
        :loading="delLoading"
        class="filter-item"
        type="warning"
        icon="el-icon-bottom"
        @click="handleDownArticles"
      >下架</el-button>
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
      <el-table-column label="封面图" min-width="150px">
        <template slot-scope="props">
          <img :src="props.row.cover" width="140" height="100">
        </template>
      </el-table-column>
      <el-table-column label="文章标题" min-width="250px">
        <template slot-scope="props">
          <span>{{ props.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章分类" min-width="100px">
        <template slot-scope="props">
          <el-tag>{{ props.row.categories.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="文章标签" min-width="150px">
        <template slot-scope="props">
          <el-tag v-for="(item,index) in props.row.labels" :key="index" type="success" style="margin-right:5px;">{{ item.title }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布日期" min-width="150px">
        <template slot-scope="props">
          <span>{{ props.row.publish_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" min-width="80px">
        <template slot-scope="props">
          <span>{{ props.row.likes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论数" min-width="80px">
        <template slot-scope="props">
          <span>{{ props.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否置顶" min-width="100px">
        <template slot-scope="props">
          <el-tag v-if="props.row.is_top =='1'" type="success">是</el-tag>
          <el-tag v-if="props.row.is_top =='0'" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100px">
        <template slot-scope="props">
          <el-tag v-if="props.row.status =='0'" type="success">正常</el-tag>
          <el-tag v-if="props.row.status =='9'" type="danger">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作者" min-width="100px">
        <template slot-scope="props">
          <span v-if="props.row.is_admin =='1'">{{ props.row.admin_name }}</span>
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
          <el-button size="mini" type="success" @click="handleTopArticle(row)">置顶</el-button>
          <el-button v-if="row.status =='9'" size="mini" type="success" @click="handleUpArticle(row)">上架</el-button>
          <el-button v-if="row.status =='0'" type="warning" size="mini" @click="handleDownArticle(row)">下架</el-button>
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

    <!-- 下架提示框 -->
    <el-dialog title="提示" :visible.sync="downArticleVisible" :close-on-click-modal="false" width="300px" center>
      <span>是否确定下架？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downArticleVisible = false">取 消</el-button>
        <el-button type="primary" @click="downArticle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上架提示框 -->
    <el-dialog title="提示" :visible.sync="upArticleVisible" :close-on-click-modal="false" width="300px" center>
      <span>是否确定上架？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upArticleVisible = false">取 消</el-button>
        <el-button type="primary" @click="upArticle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList" />
  </div>
</template>

<script>
import AddOrUpdate from './article-add-or-update'
import { list, destroy, top, up, down } from '@/api/article'
import { getEnableCategory } from '@/api/category'
import { getEnableLabel } from '@/api/label'
import TreeSelect from '@/components/TreeSelect/tree-select.vue'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Article',
  components: { AddOrUpdate, TreeSelect, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null, // 列表数据
      total: 0,
      listLoading: true, // loading
      // 查询条件
      listQuery: {
        title: '',
        cid: '',
        label: '',
        status: ''

      },
      // 状态
      statusOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '正常'
      }, {
        value: '9',
        label: '下架'
      }],
      categotyData: null, // 文章分类数据
      labelData: null, // 文章标签数据
      nodeKey: 'id',
      defaultCheckedKeys: [], // 选中的文章分类
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      delVisible: false, // 删除提示弹框的状态
      topArticleVisible: false, // 置顶文章提示弹框的状态
      upArticleVisible: false, // 上架文章提示弹框的状态
      downArticleVisible: false, // 下架文章提示弹框的状态
      id: '', // 选中的id
      ids: [], // 选中的ids
      delLoading: false, // 删除loading
      addOrUpdateVisible: false
    }
  },
  created() {
    this.getList()// 获取列表数据
    this.getEnableCategory()// 获取文章分类列表
    this.getEnableLabel()// 获取文章标签列表
  },
  methods: {
    // 搜索
    handleFilter() {
      this.getList()
    },
    // 获取文章分类列表
    getEnableCategory() {
      getEnableCategory().then(response => {
        this.categotyData = response.data
      })
    },
    // 获取文章标签列表
    getEnableLabel() {
      getEnableLabel().then(response => {
        this.labelData = response.data
      })
    },
    // 下拉框收回时设置选中的文章分类
    popoverHide(checkedIds, checkedData) {
      if (checkedIds !== '') {
        this.listQuery.cid = checkedIds
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
    // 响应上架操作
    handleUpArticle(row) {
      this.upArticleVisible = true // 显示上架弹框
      this.ids = []
      this.ids.push(row.id)
    },
    // 响应下架操作
    handleDownArticle(row) {
      this.downArticleVisible = true // 显示下架弹框
      this.ids = []
      this.ids.push(row.id)
    },
    // 批量上架文章
    handleUpArticles() {
      const select_rows = this.$refs.multipleTable.selection
      const length = select_rows.length
      if (length < 1) {
        this.$message({
          message: '请选择要上架的数据',
          type: 'warning'
        })
        return false
      }
      this.upArticleVisible = true // 显示上架文章弹框
      this.ids = []
      for (let i = 0; i < length; i++) {
        this.ids.push(select_rows[i].id)
      }
    },
    // 批量下架文章
    handleDownArticles() {
      const select_rows = this.$refs.multipleTable.selection
      const length = select_rows.length
      if (length < 1) {
        this.$message({
          message: '请选择要下架的数据',
          type: 'warning'
        })
        return false
      }
      this.downArticleVisible = true // 显示下架文章弹框
      this.ids = []
      for (let i = 0; i < length; i++) {
        this.ids.push(select_rows[i].id)
      }
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
    },
    // 确定上架文章
    upArticle() {
      this.delLoading = true
      up(this.ids).then(response => {
        this.$notify({
          title: response.type,
          message: response.message,
          type: response.type,
          duration: 1500
        })
        this.getList()
      })
      this.delLoading = false
      this.upArticleVisible = false// 关闭上架文章提示模态框
    },
    // 确定下架文章
    downArticle() {
      this.delLoading = true
      down(this.ids).then(response => {
        this.$notify({
          title: response.type,
          message: response.message,
          type: response.type,
          duration: 1500
        })
        this.getList()
      })
      this.delLoading = false
      this.downArticleVisible = false// 关闭下架文章提示模态框
    }
  }
}
</script>
