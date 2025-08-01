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
        endpoint = "/admin/login";
        payload = {
          username: credentials.username,
          password: credentials.password,
        };
      } else {
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

  // **Dodaj ovu funkciju**
async function register(registrationData) {
  isLoading.value = true;
  try {
    const response = await api.post("/korisnik/register", {
      ime_korisnika: registrationData.name,
      prezime_korisnika: registrationData.surname,
      broj_telefona_korisnika: registrationData.phone,
      email_korisnika: registrationData.email,
      korisnicko_ime: registrationData.username,
      lozinka: registrationData.password,
    });

    // Nakon registracije, korisnika možeš automatski prijaviti ako backend vrati podatke o korisniku
    // ovdje samo prikazujem da se registracija uspjela, ne radim automatski login

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
    register, // **Obavezno dodaj register u return!**
    logout,
    initializeAuth,
  };
});
