<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="q-pa-md" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <q-icon name="person_add" size="3rem" color="primary" />
        <div class="text-h4 text-primary q-mt-md">Registracija</div>
        <div class="text-subtitle2 text-grey-6">Kreiraj svoj SportFields račun</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleRegister" class="q-gutter-md" ref="formRef">
          <q-input
            v-model="registerForm.name"
            label="Ime"
            filled
            :rules="[val => !!val || 'Ime je obavezno']"
            icon="person"
          />
          <q-input
            v-model="registerForm.surname"
            label="Prezime"
            filled
            :rules="[val => !!val || 'Prezime je obavezno']"
            icon="person"
          />
          <q-input
            v-model="registerForm.phone"
            label="Broj telefona"
            filled
            :rules="[val => !!val || 'Broj telefona je obavezan']"
            icon="phone"
          />
          <q-input
            v-model="registerForm.email"
            label="Email"
            type="email"
            filled
            :rules="[val => !!val || 'Email je obavezan', val => /.+@.+\..+/.test(val) || 'Email nije valjan']"
            icon="email"
          />
          <q-input
            v-model="registerForm.username"
            label="Korisničko ime"
            filled
            :rules="[val => !!val || 'Korisničko ime je obavezno']"
            icon="account_circle"
          />
          <q-input
            v-model="registerForm.password"
            :type="showPassword ? 'text' : 'password'"
            label="Lozinka"
            filled
            :rules="[
              val => !!val || 'Lozinka je obavezna',
              val => val.length >= 6 || 'Lozinka mora imati najmanje 6 znakova'
            ]"
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
          <q-input
            v-model="registerForm.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Potvrdi lozinku"
            filled
            :rules="[
              val => !!val || 'Potvrdite lozinku',
              val => val === registerForm.password || 'Lozinke se ne podudaraju'
            ]"
            icon="lock"
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            label="Registriraj se"
            color="primary"
            class="full-width"
            size="md"
            :loading="authStore.isLoading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-caption text-grey-6">
          Već imate račun?
          <q-btn
            flat
            no-caps
            color="primary"
            label="Prijavite se"
            @click="$router.push('/login')"
          />
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

const registerForm = ref({
  name: "",
  surname: "",
  phone: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const formRef = ref(null);

async function handleRegister() {
  if (!formRef.value.validate()) {
    $q.notify({
      type: "negative",
      message: "Popravite greške u formi.",
      position: "top",
    });
    return;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    $q.notify({
      type: "negative",
      message: "Lozinke se ne podudaraju.",
      position: "top",
    });
    return;
  }

  // Pošalji cijeli objekt na store koji će mapirati na hrvatska polja
  const result = await authStore.register(registerForm.value);

  if (result.success) {
    $q.notify({
      type: "positive",
      message: "Uspješna registracija! Sada ste prijavljeni.",
      position: "top",
    });
    router.push("/");
  } else {
    $q.notify({
      type: "negative",
      message: result.error || "Registracija nije uspjela",
      position: "top",
    });
  }
}
</script>
