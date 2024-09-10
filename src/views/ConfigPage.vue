<script setup>
import ConfigGroupCard from '@/components/shared/ConfigGroupCard.vue';
import ConfigGroupItem from '@/components/shared/ConfigGroupItem.vue';
import ConfigDetailCard from '@/components/shared/ConfigDetailCard.vue';

import axios from 'axios';
import AstrBotConfig from '@/components/shared/AstrBotConfig.vue';

</script>

<template>
  <v-card>
    <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4">
      <v-tab v-for="(item, index) in tabs_key" :key="index" :value="index">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-if="tab === 0">
        <v-container fluid>
          <h2>消息平台</h2>

          <v-tabs style="margin-top: 16px;" v-model="tabPlatform" align-tabs="left" color="deep-purple-accent-4">
            <v-tab v-for="(item, index) in config_data.platform" :key="index" :value="index">
              {{ item.id }}({{ item.name }})
            </v-tab>
          </v-tabs>
          <v-tabs-window v-model="tabPlatform">
            <v-tabs-window-item v-for="(platform, index) in config_data.platform" v-show="tabPlatform===index" :key="index" :value="index">
              <v-container>
                <AstrBotConfig :metadata="metadata" :iterable="platform" metadataKey="platform"></AstrBotConfig>
              </v-container>
            </v-tabs-window-item>
          </v-tabs-window>

          <h2 style="margin-bottom: 16px; margin-top: 16px">通用配置</h2>
          <!-- platform_settings -->
          <AstrBotConfig :metadata="metadata" :iterable="config_data.platform_settings" metadataKey="platform_settings"></AstrBotConfig>
        </v-container>
      </v-tabs-window-item>

      <v-tabs-window-item v-if="tab === 1">
        <v-container fluid>
          <h2>LLM</h2>
          <v-tabs v-model="tabLLM" align-tabs="left" color="deep-purple-accent-4">
            <v-tab v-for="(item, index) in config_data.llm" :key="index" :value="index">
              {{ item.name }}
            </v-tab>
          </v-tabs>
          <v-tabs-window v-model="tabLLM">
            <v-tabs-window-item v-for="(llm, index) in config_data.llm" v-show="tabLLM===index" :key="index" :value="index">
              <v-container>
                <AstrBotConfig :metadata="metadata" :iterable="llm" metadataKey="llm"></AstrBotConfig>
              </v-container>
              
            </v-tabs-window-item>
          </v-tabs-window>


          <h2 style="margin-bottom: 16px;">通用配置</h2>
          <!-- llm_settings -->
          <AstrBotConfig :metadata="metadata" :iterable="config_data.llm_settings" metadataKey="llm_settings"></AstrBotConfig>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item v-if="tab === 2">
        <v-container fluid>
          <!-- common_configs_key -->

          <v-card-text style="margin-top:16px">
            <div v-for="key in common_configs_key" :key="key">
              <v-text-field v-if="metadata[key]?.type === 'string' && key !== 'name'" v-model="config_data[key]"
                :label="metadata[key]?.description + '(' + key + ')'" variant="outlined" dense></v-text-field>
              <v-text-field v-if="metadata[key]?.type === 'int' && key !== 'name'" v-model="config_data[key]"
                :label="metadata[key]?.description + '(' + key + ')'" variant="outlined" dense></v-text-field>
              <v-switch v-else-if="metadata[key]?.type === 'bool'" v-model="config_data[key]"
                :label="metadata[key]?.description + '(' + key + ')'" color="primary" inset></v-switch>
              <v-combobox variant="outlined" v-else-if="metadata[key]?.type === 'list'" v-model="config_data[key]"
                chips clearable :label="metadata[key]?.description + '(' + key + ')'" multiple
                prepend-icon="mdi-tag-multiple-outline">
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip v-bind="attrs" :model-value="selected" closable @click="select" @click:close="remove(item)">
                    <strong>{{ item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
            </div>
          </v-card-text>
        </v-container>
      </v-tabs-window-item>

    </v-tabs-window>

  </v-card>


  <v-btn icon="mdi-content-save" size="x-large" style="position: fixed; right: 52px; bottom: 52px;" color="darkprimary"
    @click="updateConfig">
  </v-btn>

  <v-snackbar :timeout="2000" elevation="24" :color="save_message_success" v-model="save_message_snack">
    {{ save_message }}
  </v-snackbar>
</template>


<script>

export default {
  name: 'ConfigPage',
  components: {
    ConfigGroupCard,
    ConfigGroupItem,
    ConfigDetailCard,
    AstrBotConfig
  },
  data() {
    return {
      config_data: {
        config: {
          platform: [],
          llm: [],
          platform_settings: {},
          llm_settings: {},
        }
      },
      metadata: {},
      save_message_snack: false,
      save_message: "",
      save_message_success: "",
      namespace: "",
      tab: 0,
      tabPlatform: 0,
      tabLLM: 0,
      tabs_key: ["消息平台", "大语言模型", "其他配置"],
      common_configs_key: [],
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      // 获取配置
      axios.get('/api/configs').then((res) => {
        this.config_data = res.data.data.config;
        this.metadata = res.data.data.metadata;
        for (let key in this.config_data) {
          if (key != "platform" && key != "llm" && key != "platform_settings" && key != "llm_settings" && key != "content_safety") {
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
      axios.post('/api/astrbot-configs', this.config_data).then((res) => {
        if (res.data.status === "success") {
          this.save_message = res.data.message;
          this.save_message_snack = true;
          this.save_message_success = "success";
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
    }
  },
}

</script>

<style>
.v-tab {
  text-transform: none !important;
}
</style>