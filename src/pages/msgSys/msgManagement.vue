<template>
  <div class="msgManagement">
    <el-table
      :data="tableData"
      border>
      <el-table-column type="index" label="序号 " width="80">
      </el-table-column>
      <el-table-column prop="name" label="网友姓名" width="120">
      </el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="160">
      </el-table-column>
      <el-table-column prop="date" label="留言时间" width="160">
      </el-table-column>
      <el-table-column prop="status" label="处理状态" width="120">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="content" label="留言内容" min-width="290">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="answer" label="回复" min-width="290" >
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button plain type="primary" size="small" @click="deleteMsg(scope.row)" icon="el-icon-delete">删除</el-button>
          <el-button plain type="primary" size="small" @click="msgDetail(scope.row)" icon="el-icon-document">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: {
        current: 1,
        total: 100
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          mobile: '18283764876',
          status: '未回复',
          content: '东方嘉盛雷锋精神减肥is减肥is发链接速度快放假了斯柯达减肥is的覅司法所的覅胡卫锋是既相互VHS',
          answer: '放多久开始就懂法守法胜多负少开发商',
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          mobile: '18283764876',
          status: '未回复',
          content: '东方嘉盛雷锋精神减肥is减肥is发链接速度快放假了斯柯达减肥is的覅司法所的覅胡卫锋是既相互VHS',
          answer: '放多久开始就懂法守法胜多负少开发商',
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          mobile: '18283764876',
          status: '未回复',
          content: '东方嘉盛雷锋精神减肥is减肥is发链接速度快放假了斯柯达减肥is的覅司法所的覅胡卫锋是既相互VHS',
          answer: '放多久开始就懂法守法胜多负少开发商',
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          mobile: '18283764876',
          status: '未回复',
          content: '东方嘉盛雷锋精神减肥is减肥is发链接速度快放假了斯柯达减肥is的覅司法所的覅胡卫锋是既相互VHS',
          answer: '放多久开始就懂法守法胜多负少开发商',
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          mobile: '18283764876',
          status: '未回复',
          content: '东方嘉盛雷锋精神减肥is减肥is发链接速度快放假了斯柯达减肥is的覅司法所的覅胡卫锋是既相互VHS',
          answer: '放多久开始就懂法守法胜多负少开发商',
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          mobile: '18283764876',
          status: '未回复',
          content: '东方嘉盛雷锋精神减肥is减肥is发链接速度快放假了斯柯达减肥is的覅司法所的覅胡卫锋是既相互VHS',
          answer: '放多久开始就懂法守法胜多负少开发商',
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          mobile: '18283764876',
          status: '未回复',
          content: '东方嘉盛雷锋精神减肥is减肥is发链接速度快放假了斯柯达减肥is的覅司法所的覅胡卫锋是既相互VHS',
          answer: '放多久开始就懂法守法胜多负少开发商',
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          mobile: '18283764876',
          status: '未回复',
          content: '东方嘉盛雷锋精神减肥is减肥is发链接速度快放假了斯柯达减肥is的覅司法所的覅胡卫锋是既相互VHS',
          answer: '放多久开始就懂法守法胜多负少开发商',
        }
      ]
    }
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
  }
}
</script>

<style scoped lang="scss">
  .msgManagement{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .pagination{
      margin-top: 20px;
      display: flex;
      flex-direction: row-reverse;
    }
  }
</style>
