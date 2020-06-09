<template>
    <div class="container-fluid">
        <form v-on:submit.prevent="Login">
            <!-- 用户名 -->
            <div class="form-group">
                <label for="accno">用户名：</label>
                <input class="form-control" type="text" id="accno" v-model="accno" />
            </div>
            <!-- 密码 -->
            <div class="form-group">
                <label for="password">密码：</label>
                <input class="form-control" type="password" id="password" v-model="password" />
            </div>
            <!-- 验证码 -->
            <div class="form-group">
                <label for="code">验证码：</label>
                <div class="row">
                    <div class="col-xs-8">
                        <input class="form-control" type="text" id="code" v-model="code" />
                    </div>
                    <div class="col-xs-4">
                        <img
                            :src="verificationCodeURL"
                            v-on:click="changeVerificationCode"
                            alt="刷新验证码"
                        />
                    </div>
                </div>
            </div>
            <!-- 登录按钮 -->
            <button type="submit" class="btn btn-primary btn-content">登录</button>
            <!-- 注册按钮 -->
            <router-link to="/registerPage" tag="button" type="submit" class="btn btn-default btn-content">注册</router-link>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            accno: null,
            password: null,
            code: null,
            verificationCodeURL: null,
            message: this.$route.params.message
        };
    },
    methods: {
        // 修改验证码URL
        changeVerificationCode() {
            this.verificationCodeURL =
                this.$axios.defaults.baseURL +
                "/verificationCode?date=" +
                new Date();
        },
        // 发送登录请求
        Login() {
            if (this.parameterCalibration() == false) {
                return;
            }
            this.$axios
                .post("login", {
                    accno: this.accno,
                    password: this.password,
                    code: this.code
                })
                .then(
                    result => {
                        if (result.data.status == 1) {
                            sessionStorage.setItem("accno", this.accno);
                            this.$router.push({
                                name: "study"
                            });
                        } else {
                            alert(result.data.message);
                            this.changeVerificationCode();
                            this.code = null;
                        }
                    },
                    () => {
                        alert("Error:网络请求失败，请检查网络连接是否正常");
                    }
                );
        },
        // 校验参数
        parameterCalibration() {
            if (this.accno == null || this.accno.trim().length == 0) {
                alert("用户名不能为空！");
                return false;
            }
            if (this.password == null || this.password.trim().length == 0) {
                alert("密码不能为空！");
                return false;
            }
            if (this.code == null || this.code.trim().length == 0) {
                alert("验证码不能为空！");
                return false;
            }
            return true;
        }
    },
    created() {
        this.changeVerificationCode();
        if (this.message != null) {
            alert(this.message);
        }
    }
};
</script>

<style scoped>
.container-fluid {
    margin-top: 15px;
}

.btn {
    width: 100%;
    margin-bottom: 15px;
}

.btn-content {
    letter-spacing: 25px;
    text-indent: 25px;
}

img {
    width: 100%;
    height: auto;
}
</style>