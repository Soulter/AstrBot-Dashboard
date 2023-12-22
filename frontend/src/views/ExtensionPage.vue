<script setup>
import { ref, shallowRef } from 'vue';

import ExtensionCard from '@/components/shared/ExtensionCard.vue';
import axios from 'axios';

</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <div style="background-color: white; width: 100%; padding: 16px; border-radius: 10px;">
        <h3>🧩 已安装的插件</h3>
      </div>
    </v-col>
    <v-col cols="12" md="6" lg="4" v-for="extension in extension_data.data" >
      <ExtensionCard :key="extension.name" :title="extension.name" :link="extension.repo" style="margin-bottom: 16px;">
        <p style="min-height: 180px; max-height: 180px; overflow: hidden;">{{ extension.desc }}</p>
        <div class="d-flex align-center gap-3">
          <v-icon>mdi-account</v-icon>
          <span>{{ extension.author }}</span>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="uninstallExtension(extension.name)" :loading="uninstall_loading">卸 载</v-btn>
        </div>
      </ExtensionCard>
    </v-col>
    <v-col cols="12" md="12">
      <div style="background-color: white; width: 100%; padding: 16px; border-radius: 10px;">
        <h3>🧩 插件市场 [待开发]</h3>
      </div>
    </v-col>
  </v-row>

  <v-dialog
        v-model="dialog"
        persistent
        width="700"
      >
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-plus" size="x-large" style="position: fixed; right: 52px; bottom: 52px;" color="darkprimary">
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">从 Git 仓库链接安装插件</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Git 库链接"
                    v-model="extension_url"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>github, gitee, gitlab 等公开的仓库都行。</small>
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
              :loading="install_loading"
              @click="newExtension(extension_url)"
            >
              安装
            </v-btn>
          </v-card-actions>
        </v-card>
  </v-dialog>

    <v-snackbar
    :timeout="2000"
    elevation="24"
    :color="snack_success"
    v-model="snack_show"
  >
    {{ snack_message  }}
  </v-snackbar>
</template>

<script>

export default {
  name: 'ExtensionPage',
  components: {
    ExtensionCard
  },
  data() {
    return {
      extension_data: {
        "data": []
      },
      save_message_snack: false,
      save_message: "",
      save_message_success: "",
      extension_url: "",
      status: "",
      dialog: false,
      snack_message: "",
      snack_show: false,
      snack_success: "success",
      install_loading: false,
      uninstall_loading: false
    }
  },
  mounted() {
    this.getExtensions();
  },
  methods: {
    getExtensions() {
      axios.get('/api/extensions').then((res) => {
        this.extension_data.data = res.data.data;
        console.log(this.extension_data);
      });
    },
    newExtension() {
      this.install_loading = true;
      console.log(this.install_loading);
      axios.post('/api/extensions/install',
      {
        url: this.extension_url
      }).then((res) => {
        this.install_loading = false;
        if (res.data.status === "error") {
          this.snack_message = res.data.message;
          this.snack_show = true;
          this.snack_success = "error";
          return;
        }
        this.extension_data.data = res.data.data;
        console.log(this.extension_data);
        this.extension_url = "";
        this.snack_message = res.data.message;
        this.snack_show = true;
      
        this.snack_success = "success";
        this.dialog = false;
        this.getExtensions();
      }).catch((err) => {
        this.install_loading = false;
        this.snack_message = err;
        this.snack_show = true;
        this.snack_success = "error";
      });
    },
    uninstallExtension(extension_name) {
      this.uninstall_loading = true;
      axios.post('/api/extensions/uninstall',
      {
        name: extension_name
      }).then((res) => {
        this.uninstall_loading = false;
        if (res.data.status === "error") {
          this.snack_message = res.data.message;
          this.snack_show = true;
          this.snack_success = "error";
          return;
        }
        this.extension_data.data = res.data.data;
        console.log(this.extension_data);
        this.snack_message = res.data.message;
        this.snack_show = true;
        this.snack_success = "success";
        this.dialog = false;
        this.getExtensions();
      }).catch((err) => {
        this.uninstall_loading = false;
        this.snack_message = err;
        this.snack_show = true;
        this.snack_success = "error";
      });
    }
  },
}

</script>