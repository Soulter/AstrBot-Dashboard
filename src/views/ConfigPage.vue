<script setup>
import axios from 'axios';
import AstrBotConfig from '@/components/shared/AstrBotConfig.vue';
import WaitingForRestart from '@/components/shared/WaitingForRestart.vue';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
</script>

<template>
  <v-card style="margin-bottom: 16px;">
    <v-card-text style="padding: 0;">
      <div>
        <v-btn-group variant="outlined" divided>
          <v-btn icon="mdi-text-box-edit-outline" style="width: 80px;" :color="editorTab === 0 ? 'primary' : ''"
            @click="editorTab = 0">
          </v-btn>
          <v-btn icon="mdi-code-json" style="width: 80px;" :color="editorTab === 1 ? 'primary' : ''"
            @click="configToString(); editorTab = 1;"></v-btn>
        </v-btn-group>
        <v-btn v-if="editorTab === 1" style="margin-left: 16px;" size="small" @click="configToString()">回到更改前的代码</v-btn>
        <v-btn v-if="editorTab === 1 && config_data_has_changed" style="margin-left: 16px;" size="small"
          @click="applyStrConfig()">应用此配置</v-btn>
        <small v-if="editorTab === 1" style="margin-left: 16px;">💡 `应用此配置` 将配置暂存并应用到可视化。如要保存，需<span
            style="font-weight: 1000;">再</span>点击右下角保存按钮。</small>
      </div>

    </v-card-text>
  </v-card>

  <!-- 可视化编辑 -->
  <v-card v-if="editorTab === 0">
    <v-tabs v-model="tab" align-tabs="left" color="deep-purple-accent-4">
      <v-tab v-for="(item, index) in tabs_key" :key="index" :value="index" style="font-weight: 1000; font-size: 15px">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-if="tab === 0">
        <v-container fluid>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <h3>消息平台适配器</h3>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-tabs style="margin-top: 16px;" v-model="tabPlatform" align-tabs="left" color="deep-purple-accent-4">
                  <v-tab v-for="(item, index) in config_data?.platform" :key="index" :value="index">
                    {{ item.id }}({{ item.name }})
                  </v-tab>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn variant="plain" size="large" v-bind="props">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <v-list @update:selected="addPlatformAdapter($event)">
                      <v-list-item v-for="(item, index) in adapter_config_tmpl" :key="index" :value="index">
                        <v-list-item-title>{{ index }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-tabs>
                <v-tabs-window v-model="tabPlatform">
                  <v-tabs-window-item v-for="(platform, index) in config_data?.platform" v-show="tabPlatform === index"
                    :key="index" :value="index">
                    <v-container>
                      <AstrBotConfig :metadata="metadata" :iterable="platform" metadataKey="platform"></AstrBotConfig>
                    </v-container>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <h3>消息平台通用配置</h3>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <AstrBotConfig :metadata="metadata" :iterable="config_data?.platform_settings"
                  metadataKey="platform_settings">
                </AstrBotConfig>
                <AstrBotConfig :metadata="metadata" :iterable="config_data?.content_safety"
                  metadataKey="content_safety"></AstrBotConfig>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item v-if="tab === 1">
        <v-container fluid>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <h3>大语言模型提供商</h3>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-alert style="margin: 8px" text="点击加号即可添加新的提供商实例。使用 `/provider` 指令可切换提供商实例。如果想要删除，请切换至代码模式手动删除（慎重！）。下方括号当中的意思是此提供商使用该 `API 请求器` 来请求 LLM 服务。" title="💡小提示"
                  type="info" variant="tonal">
                </v-alert>
                <v-tabs v-model="tabProvider" align-tabs="left" color="deep-purple-accent-4">
                  <v-tab v-for="(item, index) in config_data?.provider" :key="index" :value="index">
                    {{ item.id }}({{ item.type }})
                  </v-tab>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn variant="plain" size="large" v-bind="props">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <v-list @update:selected="addProvider($event)">
                      <v-list-item v-for="(item, index) in provider_config_tmpl" :key="index" :value="index">
                        <v-list-item-title>{{ index }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                </v-tabs>
                <v-tabs-window v-model="tabProvider">
                  <v-tabs-window-item v-for="(provider, index) in config_data?.provider" v-show="tabProvider === index" :key="index"
                    :value="index">
                    <v-container>
                      <AstrBotConfig :metadata="metadata" :iterable="provider" metadataKey="provider"></AstrBotConfig>
                    </v-container>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>
                <h3>大语言模型通用配置</h3>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <AstrBotConfig :metadata="metadata" :iterable="config_data?.provider_settings" metadataKey="provider_settings">
                </AstrBotConfig>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item v-if="tab === 2">
        <v-container fluid>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="key in common_configs_key" :key="key">
              <v-expansion-panel-title>
                <h3>{{ metadata[key]?.description }}</h3>
              </v-expansion-panel-title>
              <v-expansion-panel-text>

                <!-- TODO: 兼容到 AstrBotConfig -->
                <div style="display: flex; align-items: center; justify-content: center; gap: 16px">
                  <div style="width: 100%;">
                    <v-select v-if="metadata[key]?.options && !metadata[key]?.invisible" v-model="config_data[key]" variant="outlined"
                      :items="metadata[key]?.options" :label="metadata[key]?.description + '(' + key + ')'"
                      dense></v-select>
                    <v-text-field v-else-if="metadata[key]?.type === 'string' && !metadata[key]?.invisible" v-model="config_data[key]"
                      :label="metadata[key]?.description + '(' + key + ')'" variant="outlined" dense></v-text-field>
                    <v-text-field v-else-if="metadata[key]?.type === 'int' && !metadata[key]?.invisible" v-model="config_data[key]"
                      :label="metadata[key]?.description + '(' + key + ')'" variant="outlined" dense></v-text-field>
                    <v-textarea v-else-if="metadata[key]?.type === 'text' && !metadata[key]?.invisible" v-model="config_data[key]"
                      :label="metadata[key]?.description + '(' + key + ')'" variant="outlined" dense></v-textarea>
                    <v-switch v-else-if="metadata[key]?.type === 'bool' && !metadata[key]?.invisible" v-model="config_data[key]"
                      :label="metadata[key]?.description + '(' + key + ')'" color="primary" inset></v-switch>
                    <v-combobox variant="outlined" v-else-if="metadata[key]?.type === 'list' && !metadata[key]?.invisible" v-model="config_data[key]"
                      chips clearable :label="metadata[key]?.description + '(' + key + ')'" multiple
                      prepend-icon="mdi-tag-multiple-outline">
                      <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip v-bind="attrs" :model-value="selected" closable @click="select"
                          @click:close="remove(item)">
                          <strong>{{ item }}</strong>
                        </v-chip>
                      </template>
                    </v-combobox>
                  </div>
                  <div v-if="metadata[key]?.hint && metadata[key]?.type !== 'object' && !metadata[key]?.invisible">
                    <v-btn icon size="x-small" style="margin-bottom: 22px;">
                      <v-icon size="x-small">mdi-help</v-icon>
                      <v-tooltip activator="parent" location="start">{{ metadata[key]?.hint
                        }}</v-tooltip>
                    </v-btn>
                  </div>
                </div>

              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-tabs-window-item>

      <div style="margin-left: 16px; padding-bottom: 16px">
        <small>不了解配置？请见 <a
            href="https://astrbot.soulter.top/docs/%E5%BC%80%E5%A7%8B%E4%B8%8A%E6%89%8B/%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6">官方文档</a>
          或 <a
            href="https://qm.qq.com/cgi-bin/qm/qr?k=EYGsuUTfe00_iOu9JTXS7_TEpMkXOvwv&jump_from=webapi&authKey=uUEMKCROfsseS+8IzqPjzV3y1tzy4AkykwTib2jNkOFdzezF9s9XknqnIaf3CDft">加群询问</a>。</small>
      </div>

    </v-tabs-window>
  </v-card>

  <!-- 代码编辑 -->
  <v-card v-else style="background-color: #1e1e1e;">
    <VueMonacoEditor theme="vs-dark" language="json" height="80vh" style="padding-top: 16px; padding-bottom: 16px;"
      v-model:value="config_data_str">
    </VueMonacoEditor>
  </v-card>

  <v-btn icon="mdi-content-save" size="x-large" style="position: fixed; right: 52px; bottom: 52px;" color="darkprimary"
    @click="updateConfig">
  </v-btn>

  <v-snackbar :timeout="3000" elevation="24" :color="save_message_success" v-model="save_message_snack">
    {{ save_message }}
  </v-snackbar>

  <WaitingForRestart ref="wfr"></WaitingForRestart>
</template>


<script>

export default {
  name: 'ConfigPage',
  components: {
    AstrBotConfig,
    VueMonacoEditor,
    WaitingForRestart
  },
  watch: {
    config_data_str: function (val) {
      this.config_data_has_changed = true;
    }
  },
  data() {
    return {
      config_data_has_changed: false,
      config_data_str: "",
      config_data: {
        config: {}
      },
      fetched: false,
      metadata: {},
      provider_config_tmpl: {},
      adapter_config_tmpl: {}, // 平台适配器
      save_message_snack: false,
      save_message: "",
      save_message_success: "",
      namespace: "",
      tab: 0,
      tabPlatform: 0,
      tabProvider: 0,
      tabs_key: ["消息平台", "大语言模型", "其他配置"],
      common_configs_key: [],
      editorTab: 0, // 0: visual, 1: code
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      // 获取配置
      axios.get('/api/config/get').then((res) => {
        this.config_data = res.data.data.config;
        this.fetched = true
        this.metadata = res.data.data.metadata;
        this.provider_config_tmpl = res.data.data.provider_config_tmpl;
        this.adapter_config_tmpl = res.data.data.adapter_config_tmpl;
        for (let key in this.config_data) {
          if (key != "platform" && 
              key != "provider" && 
              key != "platform_settings" && 
              key != "provider_settings" && 
              key != "content_safety" && 
              key != "project_atri" &&
              key != "config_version" &&
              key != "dashboard"
            ) {
            this.common_configs_key.push(key);
          }
        }
      }).catch((err) => {
        save_message = err;
        save_message_snack = true;
        save_message_success = "error";
      });
    },
    updateConfig() {
      if (!this.fetched) return;
      axios.post('/api/config/astrbot/update', this.config_data).then((res) => {
        if (res.data.status === "ok") {
          this.save_message = res.data.message;
          this.save_message_snack = true;
          this.save_message_success = "success";
          this.$refs.wfr.check();
        } else {
          this.save_message = res.data.message;
          this.save_message_snack = true;
          this.save_message_success = "error";
        }
      }).catch((err) => {
        this.save_message = err;
        this.save_message_snack = true;
        this.save_message_success = "error";
      });
    },
    configToString() {
      this.config_data_str = JSON.stringify(this.config_data, null, 2);
      this.config_data_has_changed = false;
    },
    applyStrConfig() {
      try {
        this.config_data = JSON.parse(this.config_data_str);
        this.config_data_has_changed = false;
        this.save_message_success = "success";
        this.save_message = "配置成功应用。如要保存，需再点击右下角保存按钮。";
        this.save_message_snack = true;
      } catch (e) {
        this.save_message_success = "error";
        this.save_message = "配置未应用，Json 格式错误。";
        this.save_message_snack = true;
      }
    },
    addProvider(val) {
      console.log(val);
      let provider = JSON.parse(JSON.stringify(this.provider_config_tmpl[val]));
      provider.id = "new_" + val + this.config_data.provider.length;
      this.config_data.provider.push(provider);
      this.tabProvider = this.config_data.provider.length - 1;
    },
    addPlatformAdapter(val) {
      console.log(val);
      let adapter = JSON.parse(JSON.stringify(this.adapter_config_tmpl[val]));
      adapter.id = "new_" + val + this.config_data.platform.length;
      this.config_data.platform.push(adapter);
      this.tabPlatform = this.config_data.platform.length - 1;
    }
  },
}

</script>

<style>
.v-tab {
  text-transform: none !important;
}
</style>