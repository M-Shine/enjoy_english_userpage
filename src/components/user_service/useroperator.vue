<template>
    <div>
        <div class="userinfo">
            <table class="table table-bordered">
                <thead>
                    <th class="col-xs-4"></th>
                    <th class="col-xs-8"></th>
                </thead>
                <tbody>
                    <tr>
                        <td class="title">用户</td>
                        <td class="content">{{userinfo.accno}}</td>
                    </tr>
                    <tr>
                        <td class="title">用户名</td>
                        <td v-if="modify" class="td-input">
                            <input type="text" v-model="name" :placeholder="userinfo.name" />
                        </td>
                        <td class="content" v-if="!modify">{{userinfo.name}}</td>
                    </tr>
                    <tr>
                        <td class="title">手机</td>
                        <td v-if="modify" class="td-input">
                            <input type="text" v-model="telno" :placeholder="userinfo.telno" />
                        </td>
                        <td class="content" v-if="!modify">{{userinfo.telno}}</td>
                    </tr>
                    <tr v-if="modify">
                        <td class="title">密码</td>
                        <td class="td-input">
                            <input type="password" v-model="password" placeholder="输入密码" />
                        </td>
                    </tr>
                    <tr v-if="modify">
                        <td class="title">确认密码</td>
                        <td class="td-input">
                            <input type="password" v-model="confirmPassword" placeholder="确认密码" />
                        </td>
                    </tr>
                    <tr v-if="!modify">
                        <td class="title">注册时间</td>
                        <td class="content">{{userinfo.registerdatetime}}</td>
                    </tr>
                </tbody>
            </table>
            <button
                class="btn col-xs-12 btn-modify"
                :class="[modify == true ? 'btn-danger' : 'btn-success']"
                v-on:click="modify = !modify, update = !update"
                v-text="modify == true ? '确认' : '修改'"
            ></button>
            <button
                class="btn col-xs-12 btn-default btn-modify"
                v-on:click="modify == true ? modify = !modify : goBack()"
            >返回</button>
            <div class="tips">
                <p v-if="modify">
                    <small>*提示：任意选项不填则保持原来的设置不变</small>
                </p>
            </div>
        </div>
        <div class="feedback navbar-fixed-bottom text-center">
            <a v-on:click="goFeedback()">
                <small>向管理员反馈</small>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            accno: sessionStorage.getItem("accno"),
            userinfo: {
                accno: "null",
                name: "null",
                telno: "null",
                registerdatetime: "null"
            },
            name: null,
            telno: null,
            password: null,
            confirmPassword: null,
            modify: false,
            update: false
        };
    },
    methods: {
        // 查询用户信息
        getUserInfo() {
            this.$axios
                .get("api/getUserByAccno?accno=" + this.accno)
                .then(result => {
                    if (result.data.status == 1) {
                        this.userinfo = result.data.data;
                    }
                });
        },

        // 修改用户信息
        updateUserInfo() {
            if (this.accno == null) {
                return;
            }
            if (
                this.name == null &&
                this.telno == null &&
                this.password == null
            ) {
                return;
            }
            if (this.password == "") {
                this.password = null;
            }
            if (this.confirmPassword == "") {
                this.confirmPassword = null;
            }
            if (this.confirmPassword != this.password) {
                alert("两次输入的密码不一致！");
                return;
            }
            var user = {
                accno: this.accno,
                password: this.password,
                name: this.name,
                telno: this.telno
            };
            console.log(this.password)
            this.$axios.post("api/updateUser", user).then(
                result => {
                    if (result.data.status == 1) {
                        alert("资料修改成功！");
                        this.userinfo = result.data.data;
                        this.name = null;
                        this.telno = null;
                        this.password = null;
                        this.confirmPassword = null;
                    } else {
                        alert(result.data.message);
                    }
                },
                error => {
                    alert(
                        "Error:网络请求失败，请检查网络连接是否正常\n" + error
                    );
                    return;
                }
            );
        },

        // 到反馈页面
        goFeedback() {
            this.$router.push({
                name: "feedback"
            });
        },

        // 返回
        goBack() {
            this.$router.push({
                name: "study"
            });
        }
    },
    watch: {
        update: function(newValue, oldValue) {
            if (newValue == false) {
                this.updateUserInfo();
            }
        }
    },
    created() {
        if (this.accno != null) {
            this.getUserInfo();
        }
    }
};
</script>

<style scoped>
.table {
    margin-bottom: 10px;
}

.title {
    font-weight: bold;
    text-align-last: justify;
    text-align: justify;
    text-justify: distribute-all-lines;
    padding: 8px 13px;
}

.content {
    text-align: center;
}

.btn-modify {
    letter-spacing: 25px;
    text-indent: 25px;
    margin-bottom: 10px;
}

td.td-input {
    margin: 0;
    padding: 0;
}

input {
    width: 100%;
    height: 35px;
    border: 0;
    text-align: center;
    font-style: italic;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
    color: lightskyblue;
}

input:-moz-placeholder,
textarea:-moz-placeholder {
    color: lightskyblue;
}

input::-moz-placeholder,
textarea::-moz-placeholder {
    color: lightskyblue;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
    color: lightskyblue;
}

.tips {
    margin: 0 10px;
    margin-top: 15%;
    color: #d43f3a;
}

.feedback {
    letter-spacing: 2px;
    text-indent: 2px;
}
</style>

