<script setup>
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ConfigGroupCard from '@/components/shared/ConfigGroupCard.vue';
import ConfigGroupItem from '@/components/shared/ConfigGroupItem.vue';

import axios from 'axios';

</script>

<template>
  <!-- <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb> -->

  <v-row>
    <div style="display: flex; flex-direction: row; padding: 16px; gap: 16px; width: 100%;">
      <ConfigGroupCard v-for="outline in config_outline" :key="outline.name" :title="outline.name">
        <ConfigGroupItem v-for="item in outline.body" :title="item.title" :desc="item.desc" :namespace="item.namespace" @click="switchConfig(item.namespace)"></ConfigGroupItem>
      </ConfigGroupCard>
    </div>
    <v-col cols="12" md="12">
      <UiParentCard v-for="group in config_data" :key="group.name" :title="group.name" style="margin-bottom: 16px;">
        <!-- 对group内的数组进行解析。如果val_type是bool，则用vuetify的单选；以此类推-->
        <template v-for="item in group.body">
          <template v-if="item.config_type === 'item'">
            <template v-if="item.val_type === 'bool'">
              <v-switch v-model="item.value" :label="item.name" :hint="item.description" color="primary" inset></v-switch>
            </template>
            <template v-else-if="item.val_type === 'string'">
              <v-text-field v-model="item.value" :label="item.name" :hint="item.description" style="margin-bottom: 8px;" variant="outlined"></v-text-field>
            </template>
            <template v-else-if="item.val_type === 'int'">
              <v-text-field v-model="item.value" :label="item.name" :hint="item.description" style="margin-bottom: 8px;" variant="outlined"></v-text-field>
            </template>
            <template v-else-if="item.val_type === 'list'">
              <span>{{ item.name }}</span>
              <v-combobox
                  v-model="item.value"
                  chips
                  clearable
                  label="请添加"
                  multiple
                  prepend-icon="mdi-tag-multiple-outline"
              >
                  <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                      v-bind="attrs"
                      :model-value="selected"
                      closable
                      @click="select"
                      @click:close="remove(item)"
                  >
                      <strong>{{ item }}</strong>
                  </v-chip>
                  </template>
              </v-combobox>
            </template>
          </template>
          <template v-else-if="item.config_type === 'divider'">
            <v-divider style="margin-top: 8px; margin-bottom: 8px;"></v-divider>
          </template>
        </template>
      </UiParentCard>

      <!-- todo：抽象成独立的组件 -->
      <UiParentCard v-for="group in config_base" :key="group.name" :title="group.name" style="margin-bottom: 16px;">
        <!-- 对group内的数组进行解析。如果val_type是bool，则用vuetify的单选；以此类推-->
        <template v-for="item in group.body">
          <template v-if="item.config_type === 'item'">
            <template v-if="item.val_type === 'bool'">
              <v-switch v-model="item.value" :label="item.name" :hint="item.description" color="primary" inset></v-switch>
            </template>
            <template v-else-if="item.val_type === 'string'">
              <v-text-field v-model="item.value" :label="item.name" :hint="item.description" style="margin-bottom: 8px;" variant="outlined"></v-text-field>
            </template>
            <template v-else-if="item.val_type === 'int'">
              <v-text-field v-model="item.value" :label="item.name" :hint="item.description" style="margin-bottom: 8px;" variant="outlined"></v-text-field>
            </template>
            <template v-else-if="item.val_type === 'list'">
              <span>{{ item.name }}</span>
              <v-combobox
                  v-model="item.value"
                  chips
                  clearable
                  label="请添加"
                  multiple
                  prepend-icon="mdi-tag-multiple-outline"
              >
                  <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                      v-bind="attrs"
                      :model-value="selected"
                      closable
                      @click="select"
                      @click:close="remove(item)"
                  >
                      <strong>{{ item }}</strong>
                  </v-chip>
                  </template>
              </v-combobox>
            </template>
          </template>
          <template v-else-if="item.config_type === 'divider'">
            <v-divider style="margin-top: 8px; margin-bottom: 8px;"></v-divider>
          </template>
        </template>
      </UiParentCard>
    </v-col>
  </v-row>

  <v-btn icon="mdi-content-save" size="x-large" style="position: fixed; right: 52px; bottom: 52px;" color="darkprimary" @click="updateConfig">
  </v-btn>

  <v-snackbar
      :timeout="2000"
      elevation="24"
      :color="save_message_success"
      v-model="save_message_snack"
    >
      {{ save_message  }}
  </v-snackbar>
</template>


<script>

export default {
  name: 'ConfigPage',
  components: {
    UiParentCard,
    ConfigGroupCard,
    ConfigGroupItem
  },
  data() {
    return {
      config_data: [],
      config_base: [],
      save_message_snack: false,
      save_message: "",
      save_message_success: "",
      config_outline: [],
      namespace: ""
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    switchConfig(namespace) {
      axios.get('/api/configs?namespace='+namespace).then((res) => {
        this.config_data = res.data.data;
        // this.config_base.forEach((item) => {
        //   this.config_data.push(item);
        // });
        console.log(this.config_data);
      });
    },
    getConfig() {
      // 获取配置大纲（LLM、消息平台）
      axios.get('/api/config_outline').then((res) => {
        this.config_outline = res.data.data;
        console.log(this.config_outline);
      });
      // 获取基础配置
      axios.get('/api/configs').then((res) => {
        this.config_base = res.data.data;
        console.log(this.config_data);
      });
    },
    updateConfig() {
      axios.post('/api/configs', {
        "base_config": this.config_base,
        "config": this.config_data,
        "namespace": this.namespace
      }).then((res) => {
        if (res.data.status === "success") {
          this.save_message = res.data.message;
          this.save_message_snack = true;
          this.save_message_success = "success";
        } else {
          this.save_message = res.data.message;
          this.save_message_snack = true;
          this.save_message_success = "error";
        }
      });
    }
  },
}

</script>