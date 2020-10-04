<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roles" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', 'bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeAuth(scope.row, item1.id)">{{item1.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="['vcenter', i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeAuth(scope.row, item2.id)"
                    >{{item2.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeAuth(scope.row, item3.id)"
                    >{{item3.name}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetAuthDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setAuthDialogVisible"
      width="50%"
      @close="setAuthDialogClosed"
    >
      <el-tree
        :data="authList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setAuthDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotAuth">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表
      roles: [],
      authList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "name",
        children: "children"
      },
      // 默认选中的节点ID值数组
      defKeys: [],
      // 控制分配权限对话框的显示和隐藏
      setAuthDialogVisible: false,
      roleId: '',
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const { data: res } = await this.$http.get("/role");
      if (res.code !== 1) return this.$message.error("获取角色列表失败");
      this.roles = res.data;
    },
    // 根据ID删除对应的权限
    async removeAuth(role, authId) {
      const confirmResult = await this.$confirm("确认删除权限？", "提示", {
        confirmButtonText: "确定",
        cancelButoonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `/role/${role.id}/auth/${authId}`
      );
      if (res.code !== 1) {
        return this.$message.error("删除失败");
      }
      role.authList = res.data.authList;
    },
    // 展示分配权限对话框
    async showSetAuthDialog(role) {
      this.roleId = role.id;
      this.getLeafKeys(role, this.defKeys);
      const { data: res } = await this.$http.get("/auth/tree");
      if (res.code !== 1) {
        return this.$message.error("获取权限数据失败");
      }
      this.authList = res.data;
      this.setAuthDialogVisible = true;
    },
    // 通过递归的形式获取角色下所有3级权限的ID 并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (node.level !== null && node.level === 3) {
        return arr.push(node.id);
      }
      if (node.children === null) return;
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    // 监听分配权限对话框的关闭事件
    setAuthDialogClosed() {
      this.defKeys = [];
    },
    // 分配权限对话框的确定按钮
    async allotAuth() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const keyStr = keys.join(',');
      let formData = new FormData();
      formData.append("authIds", keyStr);
      const {data: res} = await this.$http.post(`role/${this.roleId}/auth`, formData);
      if (res.code !== 1){
        return this.$message.error('分配权限失败');
      }
      this.$message.success('分配权限成功');
      this.getRoles();
      this.setAuthDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>