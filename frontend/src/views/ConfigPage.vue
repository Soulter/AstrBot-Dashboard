<script setup>
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ConfigGroupCard from '@/components/shared/ConfigGroupCard.vue';
import ConfigGroupItem from '@/components/shared/ConfigGroupItem.vue';
import ConfigDetailCard from '@/components/shared/ConfigDetailCard.vue';

import axios from 'axios';

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
          <div style="display: flex; align-items:center;">
            <h3>已配置的消息平台</h3>
            <v-btn @click="config_data.platform.push({})" style="margin-left: 16px;">
              新建消息平台
            </v-btn>
          </div>

          <v-tabs v-model="tabPlatform" align-tabs="left" color="deep-purple-accent-4">
            <v-tab v-for="(item, index) in config_data.platform" :key="index" :value="index">
              {{ item.name }}
            </v-tab>
          </v-tabs>
          <v-tabs-window v-model="tabPlatform">
            <v-tabs-window-item v-for="(platform, index) in config_data.platform" v-show="tabPlatform===index" :key="index" :value="index">
              <v-container>
                <v-card-text style="margin-top:16px">
                  <v-row v-for="(index, key) in platform" :key="key" style="margin-bottom: 2px;">
                    <!-- int and string -->
                    <v-text-field v-if="metadata.platform.items[key]?.type === 'string' && key !== 'name'"
                      v-model="platform[key]" :label="metadata.platform.items[key]?.description + '(' + key + ')'"
                      variant="outlined" dense></v-text-field>
                    <v-text-field v-if="metadata.platform.items[key]?.type === 'int' && key !== 'name'"
                      v-model="platform[key]" :label="metadata.platform.items[key]?.description + '(' + key + ')'"
                      variant="outlined" dense></v-text-field>
                    <v-switch v-else-if="metadata.platform.items[key]?.type === 'bool'" v-model="platform[key]"
                      :label="metadata.platform.items[key]?.description + '(' + key + ')'" color="primary" inset></v-switch>
                    <v-combobox variant="outlined" v-else-if="metadata.platform.items[key]?.type === 'list'"
                      v-model="platform[key]" chips clearable
                      :label="metadata.platform.items[key]?.description + '(' + key + ')'" multiple
                      prepend-icon="mdi-tag-multiple-outline">
                      <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip v-bind="attrs" :model-value="selected" closable @click="select" @click:close="remove(item)">
                          <strong>{{ item }}</strong>
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-tabs-window-item>
          </v-tabs-window>
          

          <h3 style="margin-bottom: 16px; margin-top: 16px">消息平台通用配置</h3>
          <!-- platform_settings -->
          <v-card-text>
            <v-row v-for="(index, key) in config_data.platform_settings" :key="key" style="margin-bottom: 2px;">
              <!-- int and string -->
              <v-text-field v-if="metadata.platform_settings.items[key]?.type === 'string' && key !== 'name'"
                v-model="config_data.platform_settings[key]"
                :label="metadata.platform_settings.items[key]?.description + '(' + key + ')'" variant="outlined"
                dense></v-text-field>
              <v-text-field v-if="metadata.platform_settings.items[key]?.type === 'int' && key !== 'name'"
                v-model="config_data.platform_settings[key]"
                :label="metadata.platform_settings.items[key]?.description + '(' + key + ')'" variant="outlined"
                dense></v-text-field>
              <v-switch v-else-if="metadata.platform_settings.items[key]?.type === 'bool'"
                v-model="config_data.platform_settings[key]"
                :label="metadata.platform_settings.items[key]?.description + '(' + key + ')'" color="primary"
                inset></v-switch>
              <v-combobox variant="outlined" v-else-if="metadata.platform_settings.items[key]?.type === 'list'"
                v-model="config_data.platform_settings[key]" chips clearable
                :label="metadata.platform_settings.items[key]?.description + '(' + key + ')'" multiple
                prepend-icon="mdi-tag-multiple-outline">
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip v-bind="attrs" :model-value="selected" closable @click="select" @click:close="remove(item)">
                    <strong>{{ item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
            </v-row>
          </v-card-text>

        </v-container>
      </v-tabs-window-item>

      <v-tabs-window-item v-if="tab === 1">
        <v-container fluid>
          <div style="display: flex; align-items:center;">
            <h3>已配置的 LLM 渠道</h3>
            <v-btn @click="config_data.platform.push({})" style="margin-left: 16px;">
              新建 LLM 渠道
            </v-btn>
          </div>
          <v-tabs v-model="tabLLM" align-tabs="left" color="deep-purple-accent-4">
            <v-tab v-for="(item, index) in config_data.llm" :key="index" :value="index">
              {{ item.name }}
            </v-tab>
          </v-tabs>
          <v-tabs-window v-model="tabLLM">
            <v-tabs-window-item v-for="(llm, index) in config_data.llm" v-show="tabLLM===index" :key="index" :value="index">
              <v-container>
                <v-card-text style="margin-top:16px">
                  <v-row v-for="(index, key) in llm" :key="key" style="margin-bottom: 2px;">
                    <!-- int and string -->
                    <v-text-field v-if="metadata.llm.items[key]?.type === 'string' && key !== 'name'" v-model="llm[key]"
                      :label="metadata.llm.items[key]?.description + '(' + key + ')'" variant="outlined"
                      dense></v-text-field>
                    <v-text-field v-if="metadata.llm.items[key]?.type === 'int' && key !== 'name'" v-model="llm[key]"
                      :label="metadata.llm.items[key]?.description + '(' + key + ')'" variant="outlined"
                      dense></v-text-field>
                    <v-switch v-else-if="metadata.llm.items[key]?.type === 'bool'" v-model="llm[key]"
                      :label="metadata.llm.items[key]?.description + '(' + key + ')'" color="primary" inset></v-switch>
                    <v-combobox variant="outlined" v-else-if="metadata.llm.items[key]?.type === 'list'" v-model="llm[key]"
                      chips clearable :label="metadata.llm.items[key]?.description + '(' + key + ')'" multiple
                      prepend-icon="mdi-tag-multiple-outline">
                      <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip v-bind="attrs" :model-value="selected" closable @click="select" @click:close="remove(item)">
                          <strong>{{ item }}</strong>
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-row>
                </v-card-text>
              </v-container>
              
            </v-tabs-window-item>
          </v-tabs-window>


          <h3 style="margin-bottom: 16px;">大语言模型通用配置</h3>
          <!-- llm_settings -->
          <v-card-text>
            <v-row v-for="(index, key) in config_data.llm_settings" :key="key" style="margin-bottom: 2px;">
              <!-- int and string -->
              <v-text-field v-if="metadata.llm_settings.items[key]?.type === 'string' && key !== 'name'"
                v-model="config_data.llm_settings[key]"
                :label="metadata.llm_settings.items[key]?.description + '(' + key + ')'" variant="outlined" dense>
              </v-text-field>
              <v-text-field v-if="metadata.llm_settings.items[key]?.type === 'int' && key !== 'name'"
                v-model="config_data.llm_settings[key]"
                :label="metadata.llm_settings.items[key]?.description + '(' + key + ')'" variant="outlined" dense>
              </v-text-field>
              <v-switch v-else-if="metadata.llm_settings.items[key]?.type === 'bool'"
                v-model="config_data.llm_settings[key]"
                :label="metadata.llm_settings.items[key]?.description + '(' + key + ')'" color="primary" inset>
              </v-switch>
              <v-combobox variant="outlined" v-else-if="metadata.llm_settings.items[key]?.type === 'list'"
                v-model="config_data.llm_settings[key]" chips clearable
                :label="metadata.llm_settings.items[key]?.description + '(' + key + ')'" multiple
                prepend-icon="mdi-tag-multiple-outline">
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip v-bind="attrs" :model-value="selected" closable @click="select" @click:close="remove(item)">
                    <strong>{{ item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
            </v-row>
          </v-card-text>
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
    UiParentCard,
    ConfigGroupCard,
    ConfigGroupItem,
    ConfigDetailCard
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
      common_configs_key: []
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