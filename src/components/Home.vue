<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" height="50px" width="50px" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activeUrl"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true">
          <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="subItem.url" v-for="subItem in item.subMenus" :key="subItem.id" @click="saveNavState(subItem.url)">
              <i class="el-icon-menu"></i>
              <span>{{subItem.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: [],
      iconsObj: {
        '1': 'el-icon-user-solid',
        '2': 'el-icon-s-help',
        '3': 'el-icon-s-goods',
        '4': 'el-icon-s-order',
        '5': 'el-icon-s-data',
      },
      isCollapse: false,  // 不折叠
      activeUrl: ''       // 被激活的链接地址
    };
  },
  created() {
    this.getMenus();
    this.activeUrl = sessionStorage.getItem("activeUrl");
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取菜单
    async getMenus() {
      const result = await this.$http.post("/menu/list");
      if (result.status !== 200) return this.$message.error(result.statusText);
      this.menus = result.data;
      console.log(this.menus);
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存左侧导航链接的激活状态
    saveNavState(activeUrl) {
      window.sessionStorage.setItem("activeUrl", activeUrl);
      this.activeUrl = activeUrl;
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
