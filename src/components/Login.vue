<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-unlock"></el-input>
                </el-form-item>
                <el-form>
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 这是登录表单的数据绑定对象
            loginForm: {
                username: 'zhangsan',
                password: '123456'
            },
            // 这是表单的验证规则对象
            loginFormRules: {
                // 验证用户名是否合法
                username: [
                    {required: true, message: "请输入用户名", trigger: "blur"},
                    {min: 3, max: 10, message: "长度在3-10个字符之间", trigger: "blur"}
                ], 
                // 验证密码是否合法
                password: [
                    {required: true, message: "请输入登录密码", trigger: "blur"},
                    {min: 3, max: 10, message: "长度在6-15个字符之间", trigger: "blur"}
                ],
            }
        }
    },
    methods: {
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid) return;
                let user = new FormData();
                user.append("username", this.loginForm.username);
                user.append("password", this.loginForm.password);
                const res = await this.$http.post("/auth/login", user);
                if (res.status !== 200) 
                    return this.$message.error('登录失败!');
                // let oDate = new Date();
                // oDate.setTime(oDate.getTime() + 24 * 60 * 60 * 1000);  // Cookie过期时间1天
                // console.log("vue_mall_token=" + res.data + ";expires=" + oDate.toGMTString());
                // document.cookie = "vue_mall_token=" + res.data + ";expires=" + oDate.toGMTString();
                this.$message.success('登录成功!');
                window.sessionStorage.setItem('token', res.data);
                this.$router.push('/home');
            });
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
</style>
