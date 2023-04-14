import Vue from "vue"
import VueRouter from "vue-router"
// import Home from "@/views/Home.vue"
const MainLayout = () => import(/* webpackChunkName: "mainLayout" */ "@/components/mainLayout/index.vue");
const RenderRoute = () => import(/* webpackChunkName: "renderRoute" */ "@/components/renderRoute/index.vue");
const DiyForm = () => import(/* webpackChunkName: "diyformRoute" */ "@/pages/diyForm/index.vue")
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/mainLayout"
  },
  {
    path: "/mainLayout",
    name: "mainLayout",
    component: MainLayout,
    meta: { key: "mainLayout" },
    children: [
      // {
      //   path: "systemSettings",
      //   name: "mainLayout/systemSettings",
      //   component: RenderRoute,
      //   meta: { title: "系统设置", icon: "mail" }
      // },
      {
        path: "DIYFORM",
        name: "mainLayout/diyForm",
        component: DiyForm,
        meta: { title: "DIY表单", icon: "mail" }
      }
    ]
  }
]

const router = new VueRouter({ routes });

export default router;
export {
  routes
}
