import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Menu from "@/views/Menu.vue";
import Admin from "@/views/Admin.vue";
import Login from "@/views/Login.vue";
import AdminCategories from "@/views/admin/Categories.vue";
import AdminProducts from "@/views/admin/Products.vue";
import AdminQRSettings from "@/views/admin/QRSettings.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/menu",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requiresAuth: true },
    children: [
      {
        path: "categories",
        name: "AdminCategories",
        component: AdminCategories,
      },
      {
        path: "products",
        name: "AdminProducts",
        component: AdminProducts,
      },
      {
        path: "qr-settings",
        name: "AdminQRSettings",
        component: AdminQRSettings,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !authStore.isAuthenticated
  ) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
