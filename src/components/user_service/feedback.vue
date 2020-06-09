<template>
    <div class="feedback">
        <div class="feedback-content">
            <div class="content">
                <textarea
                    class="form-control"
                    name="content"
                    id="feedback-content"
                    rows="10"
                    maxlength="200"
                    placeholder="请输入反馈内容（最多200个字符）"
                    v-model="content"
                ></textarea>
            </div>
            <div class="count">
                <span>{{content.length}} / 200</span>
            </div>
        </div>
        <div class="feedback-btn">
            <button class="btn btn-success col-xs-12" @click="submitFeedback()">提交反馈</button>
        </div>
        <div class="btn-back">
            <button class="btn btn-default col-xs-12" @click="goBack()">返回</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            accno: sessionStorage.getItem("accno"),
            content: ""
        };
    },
    methods: {
        submitFeedback() {
            if (this.accno == null) {
                return;
            }
            this.$axios
                .post("api/addFeedback", {
                    feedbackUnionKey: {
                        accno: this.accno
                    },
                    content: this.content
                })
                .then(result => {
                    if (result.data.status == 1) {
                        alert("反馈成功");
                        this.content = "";
                    } else {
                        alert(result.data.message);
                    }
                });
        },
        goBack() {
            this.$router.push({
                name: "useroperator"
            });
        }
    }
};
</script>

<style scoped>
textarea {
    resize: none;
}

.feedback-content,
.feedback-btn {
    margin: 10px;
}

.count {
    margin-top: -20px;
    margin-right: 10px;
    text-align: right;
    color: #ccc;
}

.feedback-btn button {
    letter-spacing: 10px;
    text-indent: 10px;
}

.btn-back {
    margin: 10px;
    margin-top: 55px;
}
</style>