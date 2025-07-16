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

app.use(pinia); // <--- mora ići prije storea

// 💡 Kreiraj authStore s pinia instancom
const authStore = useAuthStore(pinia);

// 🧠 Inicijaliziraj auth podatke PRIJE routera
authStore.initializeAuth();

// 📦 Kreiraj router TEK SAD
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🛡️ Router guard
router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);

  console.log("Router Guard -> isAuthenticated:", authStore.isAuthenticated);

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
