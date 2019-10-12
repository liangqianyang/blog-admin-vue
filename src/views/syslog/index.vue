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
      <el-table-column label="操作人" min-width="50px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数" min-width="200px">
        <template slot-scope="{row}">
          <span>{{ row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" min-width="50px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status =='0'" type="success">成功</el-tag>
          <el-tag v-if="scope.row.status =='9'" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
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
  </div>
</template>

<script>
import { list } from '@/api/syslog'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Syslog',
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
        username: '',
        status: '0'
      },
      statusOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '成功'
      }, {
        value: '9',
        label: '失败'
      }]
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
    // 获取数据列表
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    }
  }
}
</script>

