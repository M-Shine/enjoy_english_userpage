<template>
    <div>
        <!-- 菜单选项 -->
        <div class="row">
            <!-- 类别 -->
            <div class="dropdown col-xs-6">
                <button
                    class="btn btn-default dropdown-toggle menus-btn"
                    type="button"
                    id="dropdownMenu1"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                >
                    类别
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu list-group" aria-labelledby="dropdownMenu1">
                    <li class="list-group-item" v-for="c in category" :key="c">
                        <a v-on:click="getGroup(c)">{{ c }}</a>
                    </li>
                </ul>
            </div>
            <!-- 组别 -->
            <div class="dropdown col-xs-6">
                <button
                    class="btn btn-default dropdown-toggle menus-btn"
                    type="button"
                    id="dropdownMenu1"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                >
                    组别
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu list-group" aria-labelledby="dropdownMenu1">
                    <li class="list-group-item" v-for="g in group" :key="g.groupno">
                        <a v-on:click="changeGroup(g.group)">{{ g.group }}</a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- QA -->
        <div class="qa">
            <!-- 放映区 -->
            <div class="qa-item">
                <div class="qa-item-text">
                    <p class="text-center">
                        <mark v-text="currentqa.itemq"></mark>
                    </p>
                    <br />
                    <p class="text-center">
                        <mark v-text="currentqa.itema"></mark>
                    </p>
                </div>
            </div>
            <div class="qa-info">
                <p class="row">
                    <span class="col-xs-1"></span>
                    <span class="col-xs-5 info">进度：{{index+1}} / {{qa.length}}</span>
                    <span class="col-xs-5 info">速度：{{speed/1000}}秒 / 组</span>
                    <span class="col-xs-1"></span>
                </p>
            </div>
            <!-- 控制区 -->
            <div class="qa-control">
                <div class="qa-control-type row">
                    <div class="col-xs-1"></div>
                    <button
                        class="btn btn-default col-xs-10"
                        v-text="auto == true ? '自动轮播' : '手动轮播'"
                        @click="auto = !auto, auto == true ? startCarousel() : stopCarousel()"
                    ></button>
                    <div class="col-xs-1"></div>
                </div>
                <div class="qa-control-speed row">
                    <div class="col-xs-1"></div>
                    <button
                        class="btn btn-default"
                        :class="[auto == true ? 'col-xs-4' : 'col-xs-10 btn-restart']"
                        @click="restart()"
                    >重来</button>
                    <div v-if="auto" class="col-xs-2"></div>
                    <button
                        v-if="auto"
                        class="btn btn-default col-xs-4"
                        @click="pause = !pause, pause == true ? pauseCarousel() : continueCarousel()"
                        v-text="pause == true ? '继续' : '暂停'"
                    ></button>
                    <div class="col-xs-1"></div>
                </div>
                <div class="qa-control-speed row" v-if="auto">
                    <div class="col-xs-1"></div>
                    <button class="btn btn-default col-xs-4" @click="speedDown()">减速</button>
                    <div class="col-xs-2"></div>
                    <button class="btn btn-default col-xs-4" @click="speedUp()">加速</button>
                    <div class="col-xs-1"></div>
                </div>
                <div class="qa-control-item row">
                    <div class="col-xs-1"></div>
                    <button class="btn btn-default col-xs-4" @click="preQA()">
                        <span class="glyphicon glyphicon-chevron-left"></span>
                        上一组
                    </button>
                    <div class="col-xs-2"></div>
                    <button class="btn btn-default col-xs-4" @click="nextQA()">
                        下一组
                        <span class="glyphicon glyphicon-chevron-right"></span>
                    </button>
                    <div class="col-xs-1"></div>
                </div>
            </div>
        </div>

        <!-- 用户信息 -->
        <div class="navbar-fixed-bottom text-center userinfo">
            <a v-on:click="goUseroperator()">
                <small>用户:{{ accno }}</small>
            </a>
            <span class="blank-block"></span>
            <a v-on:click="logout()">
                <small>退出</small>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menus: {},
            category: [],
            group: [],
            qa: [],
            pagenum: 0,
            page: 0,
            size: 10,
            selected_category: null,
            selected_group: null,
            accno: sessionStorage.getItem("accno"),
            index: 0,
            currentqa: { itemq: "", itmea: "" },
            auto: true,
            timer: null,
            speed: 3000,
            pause: false
        };
    },
    methods: {
        // 查询类别
        getCategory() {
            this.$axios.get("api/getMenus").then(
                result => {
                    if (result.data.status == 1) {
                        this.menus = result.data.data;
                        this.category = Object.keys(this.menus);
                        this.getGroup(this.category[0]);
                    } else {
                        alert("Error:查询菜单选项失败，请稍后重试！");
                        return;
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

        // 查询组别
        getGroup(category) {
            this.group = this.menus[category];
            this.selected_category = category;
            this.selected_group = this.group[0].group;
            this.getQA();
        },

        // 查询QA资料
        getQA() {
            this.$axios
                .get(
                    "api/getQA?category=" +
                        this.selected_category +
                        "&group=" +
                        this.selected_group +
                        "&page=" +
                        this.page +
                        "&size=" +
                        this.size
                )
                .then(
                    result => {
                        if (result.data.status == 1) {
                            if (this.page == 0 && this.index == 0) {
                                this.qa = result.data.data;
                            } else {
                                this.qa = this.qa.concat(result.data.data);
                            }
                            this.pagenum = result.data.pagenum;
                            this.setCurrentQA();
                        } else {
                            alert("Error:查询QA资料失败，请稍后重试！");
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

        // 设置当前放映的QA
        setCurrentQA() {
            this.currentqa = this.qa[this.index];
        },

        // 菜单选项发生改变
        changeGroup(group) {
            this.selected_group = group;
            this.page = 0;
            this.index = 0;
            this.getQA();
        },

        // 上一组QA
        preQA() {
            if (this.index - 1 < 0) {
                this.index = 0;
            } else {
                this.index -= 1;
            }
            this.setCurrentQA();
        },

        // 下一组QA
        nextQA() {
            if (this.index + 1 >= this.qa.length) {
                if (this.page >= this.pagenum - 1) {
                    this.index = this.qa.length - 1;
                    clearInterval(this.timer)
                } else {
                    this.page += 1;
                    this.getQA();
                    this.index += 1;
                }
            } else {
                this.index += 1;
                this.setCurrentQA();
            }
        },

        // 加速
        speedUp() {
            if (this.speed - 500 <= 0) {
                this.speed = 0;
                clearInterval(this.timer);
            } else {
                this.speed -= 500;
                clearInterval(this.timer);
                this.startCarousel(this.speed);
            }
        },

        // 减速
        speedDown() {
            this.speed += 500;
            clearInterval(this.timer);
            this.startCarousel(this.speed);
        },

        // 重来
        restart() {
            this.index = 0;
        },

        // 暂停轮播
        pauseCarousel() {
            clearInterval(this.timer);
        },

        // 继续轮播
        continueCarousel() {
            this.startCarousel(this.speed);
        },

        // 开启轮播定时器
        startCarousel(speed = 3000) {
            this.speed = speed;
            this.timer = setInterval(() => {
                this.nextQA();
            }, speed);
        },

        // 关闭轮播定时器
        stopCarousel() {
            clearInterval(this.timer);
        },

        // 退出登录
        logout() {
            this.$axios.get("logout").then(result => {});
            this.$router.push({
                name: "index"
            });
        },

        // 去用户操作页面
        goUseroperator() {
            this.$router.push({
                name: "useroperator"
            });
        }
    },
    created() {
        this.getCategory();
    },
    mounted() {
        this.startCarousel();
    }
};
</script>

<style scoped>
.row {
    margin: 0;
}

.dropdown {
    padding: 0;
}

.dropdown-menu {
    margin: 0;
    text-align: center;
    width: 100%;
    max-height: 200px;
    overflow: scroll;
}

.menus-btn {
    width: 100%;
    border-radius: 0;
}

.userinfo {
    letter-spacing: 2px;
    text-indent: 2px;
}

.blank-block {
    margin: 0 10px;
}

.qa-item {
    height: 200px;
    background-image: url(../../assets/img/格子背景.jpg);
    background-size: cover;
    border: 1px #ccc solid;
}

.qa-item-text {
    margin: 0 auto;
    position: relative;
    top: 25%;
}

.qa-item-text p {
    margin: 0;
    padding: 0;
    font-size: 2rem;
    letter-spacing: 5px;
    text-indent: 5px;
    font-weight: bolder;
    text-align: center;
}

mark {
    padding: 2px 15px;
    background-color: #eee;
}

.qa-control-type {
    margin-top: 10%;
}

.qa-control-type button {
    letter-spacing: 15px;
    text-indent: 15px;
}

.qa-control-speed {
    margin-top: 5%;
    letter-spacing: 5px;
    text-indent: 5px;
}

.qa-control-speed button {
    padding: 6px 25px;
    text-align-last: justify;
    text-align: justify;
    text-justify: distribute-all-lines;
}

.qa-control-item {
    margin-top: 5%;
}

.info {
    font-size: 10px;
    color: #ccc;
    text-align-last: justify;
    text-align: justify;
    text-justify: distribute-all-lines;
    padding: 5px 25px;
}

.btn-restart {
    text-align-last: center !important;
    letter-spacing: 15px;
    text-indent: 15px;
}

.list-group {
    padding: 0;
}

.list-group-item {
    padding: 5px;
}
</style>