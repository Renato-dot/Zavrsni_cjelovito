import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  async function login(credentials) {
    isLoading.value = true;
    try {
      const response = await api.post("/korisnik/login", {
        email_korisnika: credentials.email,
        lozinka: credentials.password,
      });

      user.value = response.data.korisnik || response.data.user;

      if (user.value) {
        localStorage.setItem("user", JSON.stringify(user.value));
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Prijava nije uspjela",
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function register(userData) {
    isLoading.value = true;
    try {
      const payload = {
        ime_korisnika: userData.name,
        prezime_korisnika: userData.surname,
        broj_telefona_korisnika: userData.phone,
        email_korisnika: userData.email,
        korisnicko_ime: userData.username,
        lozinka: userData.password,
      };

      const response = await api.post("/korisnik", payload);
      user.value = response.data;

      if (user.value) {
        localStorage.setItem("user", JSON.stringify(user.value));
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Registracija nije uspjela",
      };
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    localStorage.removeItem("user");
    // Opcionalno: možeš pozvati i backend /logout endpoint ako postoji
  }

  function initializeAuth() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
  };
});
