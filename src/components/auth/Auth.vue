<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-table :data="auths" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="name"></el-table-column>
            <el-table-column label="路径" prop="url"></el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 权限列表
            auths: []
        }
    },
    created() {
        // 获取所有的权限
        this.getAuths();
    },
    methods: {
        async getAuths() {
            const {data: res} = await this.$http.get('/menu/list');
            if (res.code !== 1){
                return this.$message.error('获取权限列表失败');
            }
            this.auths = res.data;
        }
    }
};
</script>

<style lang="less" scoped>
</style>