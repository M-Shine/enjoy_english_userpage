import VueRouter from "vue-router"

import login from "./components/user_service/login.vue"
import register from "./components/user_service/register.vue"
import study from "./components/study_service/study.vue"
import useroperator from "./components/user_service/useroperator.vue"
import feedback from "./components/user_service/feedback.vue"

var router = new VueRouter({
    mode: "history",
    routes: [
        {path: "/", name: "index", redirect: "/loginPage"},
        {path: "/loginPage", name: "login", component: login},
        {path: "/registerPage", name: "register", component: register},
        {path: "/study", name: "study", component: study},
        {path: "/useroperator", name: "useroperator", component: useroperator},
        {path: "/feedback", name: "feedback", component: feedback},
        {path: "/*", redirect: "/loginPage"}
    ]
})

export default router