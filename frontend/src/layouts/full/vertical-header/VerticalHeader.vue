<script setup lang="ts">
import { ref } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
// Icon Imports
import { BellIcon, SettingsIcon, SearchIcon, Menu2Icon } from 'vue-tabler-icons';
import axios from 'axios';
import { md5 } from 'js-md5';
import { useAuthStore } from '@/stores/auth';


const customizer = useCustomizerStore();
const showSearch = ref(false);
function searchbox() {
  showSearch.value = !showSearch.value;
}
let dialog = ref(false);
let updateStatusDialog = ref(false);
let password = ref('');
let newPassword = ref('');
let status = ref('');

const open = (link: string) => {
  window.open(link, '_blank');
};

// 密码修改
function passwordChange() {
  // md5加密
  // @ts-ignore
  if (password.value != '') {
    password.value = md5(password.value);
  }
  newPassword.value = md5(newPassword.value);
  axios.post('/api/change_password', {
      password: password.value,
      new_password: newPassword.value
    })
    .then((res) => {
      if (res.data.status == 'error') {
        status.value = res.data.message;
        password.value = '';
        newPassword.value = '';
        return;
      }
      dialog.value = !dialog.value;
      status.value = res.data.message;
      setTimeout(() => {
        const authStore = useAuthStore();
        authStore.logout();
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
      status.value = err
      password.value = '';
      newPassword.value = '';
    });
}
</script>

<template>
  <v-app-bar elevation="0" height="80">
    <v-btn
      class="hidden-md-and-down text-secondary"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
      size="small"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>
    <v-btn
      class="hidden-lg-and-up text-secondary ms-3"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
      size="small"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>

    <v-spacer />

    <v-dialog
        v-model="dialog"
        persistent
        width="700"
      >
        <template v-slot:activator="{ props }">
          <v-btn class="profileBtn text-primary" color="lightprimary" variant="flat" rounded="pill" v-bind="props">
              <v-icon icon="mdi-account-edit" size="25" ></v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">密码修改</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="原密码*"
                    type="password"
                    v-model="password"
                    required
                  ></v-text-field>

                  <v-text-field
                    label="新密码*"
                    type="password"
                    v-model="newPassword"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>如果是第一次修改密码，原密码请留空。</small>
            <br>
            <small>{{ status }}</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialog = false"
            >
              关闭
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="passwordChange"
            >
              提交
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog
        v-model="updateStatusDialog"
        width="700"
      >
        <template v-slot:activator="{ props }">
          <v-btn class="profileBtn text-primary" color="lightprimary" variant="flat" rounded="pill" v-bind="props">
              <v-icon icon="mdi-update" size="25" ></v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">更新项目</span>
          </v-card-title>
          <v-card-text>
            <v-container>
             <p>此功能正在开发中，你可以在消息平台内使用 `/update` 指令来更新。</p>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="updateStatusDialog = false"
            >
              关闭
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <v-btn class="profileBtn text-primary" 
      color="lightprimary" 
      variant="flat" 
      @click="open('https://github.com/Soulter/AstrBot')"
      rounded="pill">
        <v-icon icon="mdi-github" size="25" ></v-icon>
    </v-btn>
  </v-app-bar>
</template>
