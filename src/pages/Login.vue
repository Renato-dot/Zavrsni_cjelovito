<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="q-pa-md" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <q-icon name="sports_soccer" size="3rem" color="primary" />
        <div class="text-h4 text-primary q-mt-md">Login</div>
        <div class="text-subtitle2 text-grey-6">Pristupite svom profilu</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin" class="q-gutter-md" ref="formRef">
          <q-input
            v-if="!loginForm.isAdmin"
            v-model="loginForm.email"
            label="Email"
            type="email"
            filled
            :rules="[val => !!val || 'Email je obavezan']"
            icon="email"
          />
          <q-input
            v-else
            v-model="loginForm.username"
            label="Korisničko ime"
            filled
            :rules="[val => !!val || 'Korisničko ime je obavezno']"
            icon="person"
          />

          <q-input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            label="Lozinka"
            filled
            :rules="[val => !!val || 'Lozinka je obavezna']"
            icon="lock"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-toggle
            v-model="loginForm.isAdmin"
            label="Prijava kao administrator"
            color="primary"
          />

          <q-btn
            type="submit"
            label="Login"
            color="primary"
            class="full-width"
            size="md"
            :loading="authStore.isLoading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-caption text-grey-6">
          Nemate profil?
          <q-btn flat no-caps color="primary" label="Registrirajte se" @click="$router.push('/register')" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const formRef = ref(null);

const loginForm = ref({
  email: "",
  username: "",
  password: "",
  isAdmin: false,
});

const showPassword = ref(false);

async function handleLogin() {
  if (formRef.value && !formRef.value.validate()) {
    $q.notify({
      type: "negative",
      message: "Molimo ispunite sva polja ispravno",
      position: "top",
    });
    return;
  }

  const result = await authStore.login(loginForm.value);

  if (result.success) {
    $q.notify({
      type: "positive",
      message: "Login uspješan!",
      position: "top",
    });

    if (loginForm.value.isAdmin) {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  } else {
    $q.notify({
      type: "negative",
      message: result.error || "Greška prilikom prijave",
      position: "top",
    });
  }
}
</script>
