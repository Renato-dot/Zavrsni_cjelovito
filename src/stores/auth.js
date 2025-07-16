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
      let endpoint, payload;

      if (credentials.isAdmin) {
        // Administrator login
        endpoint = "/admin/login";
        payload = {
          username: credentials.username, // koristi se kao username za admina
          password: credentials.password,
        };
      } else {
        // Korisnik login
        endpoint = "/korisnik/login";
        payload = {
          email_korisnika: credentials.email,
          lozinka: credentials.password,
        };
      }

      const response = await api.post(endpoint, payload);

      user.value =
        response.data.korisnik || response.data.user || response.data;

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
    // Opcionalno: možeš dodati poziv prema /logout endpointu ako koristiš sesije
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
