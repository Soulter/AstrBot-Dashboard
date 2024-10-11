<script setup>
import ExtensionCard from '@/components/shared/ExtensionCard.vue';
import ConfigDetailCard from '@/components/shared/ConfigDetailCard.vue';

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
      <ExtensionCard :key="extension.name" :title="extension.name" :link="extension.repo" style="margin-bottom: 4px;">
        <p style="min-height: 150px; max-height: 150px; overflow: hidden;">{{ extension.desc }}</p>
        <div class="d-flex align-center gap-2">
          <v-icon>mdi-account</v-icon>
          <span>{{ extension.author }}</span>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="openExtensionConfig(extension.name)">配置</v-btn>
          <v-btn variant="plain" @click="updateExtension(extension.name)" :loading="loading_">更新</v-btn>
          <v-btn variant="plain" @click="uninstallExtension(extension.name)" :loading="loading_">卸载</v-btn>
        </div>
      </ExtensionCard>
    </v-col>
    <v-col cols="12" md="12">
      <div style="background-color: white; width: 100%; padding: 16px; border-radius: 10px;">
        <h3>🧩 插件市场</h3>
      </div>
    </v-col>
    <v-col cols="12" md="6" lg="4" v-for="plugin in pluginMarketData" >
      <ExtensionCard :key="plugin.name" :title="plugin.name" :link="plugin.repo" style="margin-bottom: 4px;">
        <p style="min-height: 150px; max-height: 150px; overflow: hidden;">{{ plugin.desc }}</p>
        <div class="d-flex align-center gap-2">
          <v-icon>mdi-account</v-icon>
          <span>{{ plugin.author }}</span>
          <v-spacer></v-spacer>
          <v-btn :loading="loading_" v-if="!plugin.installed" variant="plain" @click="extension_url=plugin.repo; newExtension()">安装</v-btn>
          <v-btn v-else variant="plain" disabled>已安装</v-btn>
        </div>
      </ExtensionCard>
    </v-col>

  </v-row>

  <v-dialog
      v-model="configDialog"
      width="750"
    >
      <template v-slot:activator="{ props }">
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">插件配置</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <ConfigDetailCard :config="extension_config"></ConfigDetailCard>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="updateConfig"
          >
          保存并关闭
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="configDialog = false"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>

  <v-dialog v-model="dialog" persistent width="700">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-plus" size="x-large" style="position: fixed; right: 52px; bottom: 52px;"
        color="darkprimary">
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">安装插件</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <h3>从 GitHub 上在线下载</h3>
            <v-col cols="12">
              <small>请输入合法的 GitHub 仓库链接，当前仅支持 GitHub。如：https://github.com/Soulter/astrbot_plugin_aiocqhttp</small>
              <v-text-field label="仓库链接" v-model="extension_url" variant="outlined" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <h3>从本机上传 .zip 压缩包</h3>
            <v-col cols="12">
              <small>请保证插件文件存在压缩包根目录中的第一个文件夹中（即类似于从 GitHub 仓库页上下载的 Zip 压缩包的格式）。</small>
              <v-file-input label="选择文件" v-model="upload_file" accept=".zip" outlined required></v-file-input>
            </v-col>
          </v-row>
        </v-container>

        <br>
        <small>{{ status }}</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          关闭
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" :loading="loading_" @click="newExtension()">
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
    ExtensionCard,
    ConfigDetailCard
  },
  data() {
    return {
      extension_data: {
        "data": []
      },
      extension_url: "",
      status: "",
      dialog: false,
      snack_message: "",
      snack_show: false,
      snack_success: "success",
      loading_: false,
      configDialog: false,
      extension_config: {},
      upload_file: null,
      pluginMarketData: {},
    }
  },
  mounted() {
    this.getExtensions();
    this.fetchPluginCollection();
  },
  methods: {
    toast(message, success) {
      this.snack_message = message;
      this.snack_show = true;
      this.snack_success = success;
    },
    getExtensions() {
      axios.get('/api/plugin/get').then((res) => {
        this.extension_data.data = res.data.data;
        this.checkAlreadyInstalled();
      });
    },
    newExtension() {
      if (this.extension_url === "" && this.upload_file === null) {
        this.toast("请填写插件链接或上传插件文件", "error");
        return;
      }

      if (this.extension_url !== "" && this.upload_file !== null) {
        this.toast("请不要同时填写插件链接和上传插件文件", "error");
        return;
      }

      this.loading_ = true;
      if (this.upload_file !== null) {
        const formData = new FormData();
        formData.append('file', this.upload_file[0]);
        axios.post('/api/plugin/install-upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((res) => {
          this.loading_ = false;
          if (res.data.status === "error") {
            this.toast(res.data.message, "error");
            return;
          }
          this.extension_data.data = res.data.data;
          console.log(this.extension_data);
          this.upload_file = "";
          this.toast(res.data.message, "success");
          this.dialog = false;
          this.getExtensions();
        }).catch((err) => {
          this.loading_ = false;
          this.toast(err, "error");
        });
        return;
      } else {
        axios.post('/api/plugin/install',
          {
            url: this.extension_url
          }).then((res) => {
            this.loading_ = false;
            if (res.data.status === "error") {
              this.toast(res.data.message, "error");
              return;
            }
            this.extension_data.data = res.data.data;
            console.log(this.extension_data);
            this.extension_url = "";
            this.toast(res.data.message, "success");
            this.dialog = false;
            this.getExtensions();
          }).catch((err) => {
            this.loading_ = false;
            this.toast(err, "error");
          });

      }
    },
    uninstallExtension(extension_name) {
      this.loading_ = true;
      axios.post('/api/plugin/uninstall',
      {
        name: extension_name
      }).then((res) => {
        this.loading_ = false;
        if (res.data.status === "error") {
          this.toast(res.data.message, "error");
          return;
        }
        this.extension_data.data = res.data.data;
        console.log(this.extension_data);
        this.toast(res.data.message, "success");
        this.dialog = false;
        this.getExtensions();
      }).catch((err) => {
        this.loading_ = false;
        this.toast(err, "error");
      });
    },
    updateExtension(extension_name) {
      this.loading_ = true;
      axios.post('/api/plugin/update',
      {
        name: extension_name
      }).then((res) => {
        this.loading_ = false;
        if (res.data.status === "error") {
          this.toast(res.data.message, "error");
          return;
        }
        this.extension_data.data = res.data.data;
        console.log(this.extension_data);
        this.toast(res.data.message, "success");
        this.dialog = false;
        this.getExtensions();
      }).catch((err) => {
        this.loading_ = false;
        this.toast(err, "error");
      });
    },
    openExtensionConfig(extension_name) {
      this.curr_namespace = extension_name;
      this.configDialog = true;
      axios.get('/api/config/get?namespace='+extension_name).then((res) => {
        this.extension_config = res.data.data;
        console.log(this.extension_config);
      }).catch((err) => {
        this.toast(err, "error");
      });
    },
    updateConfig() {
      axios.post('/api/config/plugin/update', {
        "config": this.extension_config,
        "namespace": this.curr_namespace
      }).then((res) => {
        if (res.data.status === "ok") {
          this.toast(res.data.message, "success");
        } else {
          this.toast(res.data.message, "error");
        }
      }).catch((err) => {
        this.toast(err, "error");
      });
    },
    fetchPluginCollection() {
      let url = "https://soulter.github.io/AstrBot_Plugins_Collection/plugins.json"
      axios.get(url).then((res) => {
        let data = []
        this.pluginMarketDataOrigin = res.data;
        for (let key in res.data) {
          data.push({
            "name": key,
            "desc": res.data[key].desc,
            "author": res.data[key].author,
            "repo": res.data[key].repo,
            "installed": false
          })
        }
        this.pluginMarketData = data;
        this.checkAlreadyInstalled();
      }).catch((err) => {
        this.toast("获取插件市场数据失败: " + err, "error");
      });
    },
    checkAlreadyInstalled() {
      // 可优化
      for (let i = 0; i < this.pluginMarketData.length; i++) {
        for (let j = 0; j < this.extension_data.data.length; j++) {
          if (this.pluginMarketData[i].repo === this.extension_data.data[j].repo) {
            this.pluginMarketData[i].installed = true;
          }
        }
      }
    }
  },
}

</script>