<template>
    <div class="container-fluid">
        <form v-on:submit.prevent="Register">
            <!-- 用户名 -->
            <div class="form-group">
                <span>*</span>
                <label for="accno">用户名：</label>
                <input class="form-control" type="text" id="accno" v-model="accno" />
            </div>
            <!-- 姓名 -->
            <div class="form-group">
                <label for="name">姓名：</label>
                <input
                    class="form-control"
                    type="text"
                    id="name"
                    v-model="name"
                    placeholder="可不填，默认与用户名相同"
                />
            </div>
            <!-- 手机号码 -->
            <div class="form-group">
                <label for="telno">手机号码：</label>
                <input
                    class="form-control"
                    type="text"
                    id="telno"
                    v-model="telno"
                    placeholder="可不填"
                />
            </div>
            <!-- 密码 -->
            <div class="form-group">
                <span>*</span>
                <label for="password">密码：</label>
                <input class="form-control" type="password" id="password" v-model="password" />
            </div>
            <!-- 确认密码 -->
            <div class="form-group">
                <span>*</span>
                <label for="confirmPassword">确认密码：</label>
                <input
                    class="form-control"
                    type="password"
                    id="confirmPassword"
                    v-model="confirmPassword"
                />
            </div>
            <!-- 注册按钮 -->
            <button type="submit" class="btn btn-primary btn-content">注册</button>
        </form>
        <button class="btn btn-default btn-content" @click="goBack()">返回</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            accno: null,
            name: null,
            telno: null,
            password: null,
            confirmPassword: null
        };
    },
    methods: {
        Register() {
            if (this.parameterCalibration() == false) {
                return;
            }
            this.$axios
                .post("register", {
                    accno: this.accno,
                    name: this.name,
                    telno: this.telno,
                    password: this.password
                })
                .then(
                    result => {
                        if (result.data.status == 1) {
                            alert("注册成功");
                            this.$router.push({
                                name: "login"
                            });
                        } else {
                            alert(result.data.message);
                            return;
                        }
                    },
                    error => {
                        alert(
                            "Error:网络请求失败，请检查网络连接是否正常\n" +
                                error
                        );
                        return;
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
            if (this.confirmPassword != this.password) {
                alert("两次输入的密码不一致！");
                return false;
            }
            return true;
        },
        // 返回
        goBack() {
            this.$router.push({
                name: "login"
            });
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

span {
    color: red;
}

/* 修改 input 元素中提示文字的样式 */
input::-webkit-input-placeholder {
    font-style: italic;
}

input:-moz-placeholder {
    font-style: italic;
}

input::-moz-placeholder {
    font-style: italic;
}

input:-ms-input-placeholder {
    font-style: italic;
}
</style>