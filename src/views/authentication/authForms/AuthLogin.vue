<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
import md5 from 'js-md5';
import { ms } from 'date-fns/locale';

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
//const logform = ref();
const password = ref('');
const username = ref('');
const passwordRules = ref([
  (v: string) => !!v || '需要填写：密码'
]);
const emailRules = ref([(v: string) => !!v || '需要填写：用户名']);

const msg = ref('');

/* eslint-disable @typescript-eslint/no-explicit-any */
function validate(values: any, { setErrors }: any) {
  // md5加密
  if (password.value != '')
    // @ts-ignore
    password.value = md5(password.value);
  const authStore = useAuthStore();
  return authStore.login(username.value, password.value).catch((error) => {
    msg.value = error.message;
    setErrors({ apiError: error.message });
  });
}

</script>

<template>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <v-text-field v-model="username" :rules="emailRules" label="用户名" class="mt-4 mb-8" required density="comfortable"
      hide-details="auto" variant="outlined" color="primary"></v-text-field>
    <v-text-field v-model="password" :rules="passwordRules" label="密码" required density="comfortable" variant="outlined"
      color="primary" hide-details="auto" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'" @click:append="show1 = !show1" class="pwdInput"></v-text-field>

    <div class="d-sm-flex align-center mt-2 mb-7 mb-sm-0">
      <v-checkbox v-model="checkbox" :rules="[(v: any) => !!v || 'You must agree to continue!']" label="记住密码" required
        color="primary" class="ms-n2" hide-details></v-checkbox>
    </div>
    <v-btn color="secondary" :loading="isSubmitting" block class="mt-2" variant="flat" size="large" :disabled="valid"
      type="submit">
      登录</v-btn>
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>

    <span> {{ msg }}</span>
  </Form>

</template>
<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}

.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}

.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}

.pwdInput {
  position: relative;

  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
