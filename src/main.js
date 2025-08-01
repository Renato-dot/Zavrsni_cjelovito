import { createApp } from "vue";
import { Quasar, Notify } from "quasar";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import quasarLang from "quasar/lang/en-US";
import quasarIconSet from "quasar/icon-set/material-icons";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import App from "./App.vue";
import routes from "./routes";
import { useAuthStore } from "./stores/auth";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

const authStore = useAuthStore();
authStore.initializeAuth();

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !authStore.isAuthenticated) {
    next("/login");
  } else if (
    !authRequired &&
    authStore.isAuthenticated &&
    to.path === "/login"
  ) {
    next("/");
  } else {
    next();
  }
});

app.use(Quasar, {
  plugins: { Notify },
  lang: quasarLang,
  iconSet: quasarIconSet,
});

app.use(router);
app.mount("#app");
