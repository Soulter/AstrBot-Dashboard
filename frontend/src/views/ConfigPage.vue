<script setup>
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ConfigGroupCard from '@/components/shared/ConfigGroupCard.vue';
import ConfigGroupItem from '@/components/shared/ConfigGroupItem.vue';
import ConfigDetailCard from '@/components/shared/ConfigDetailCard.vue';

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
      <ConfigDetailCard :config="config_data"></ConfigDetailCard>
      <ConfigDetailCard :config="config_base"></ConfigDetailCard>
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
    ConfigGroupItem,
    ConfigDetailCard
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
        this.namespace = namespace;
        this.config_data = res.data.data;
        console.log(this.config_data);
      }).catch((err) => {
        save_message = err;
        save_message_snack = true;
        save_message_success = "error";
      });
    },
    getConfig() {
      // 获取配置大纲（LLM、消息平台）
      axios.get('/api/config_outline').then((res) => {
        this.config_outline = res.data.data;
        console.log(this.config_outline);
      }).catch((err) => {
        save_message = err;
        save_message_snack = true;
        save_message_success = "error";
      });
      // 获取基础配置
      axios.get('/api/configs').then((res) => {
        this.config_base = res.data.data;
        console.log(this.config_data);
      }).catch((err) => {
        save_message = err;
        save_message_snack = true;
        save_message_success = "error";
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
      }).catch((err) => {
        this.save_message = err;
        this.save_message_snack = true;
        this.save_message_success = "error";
      });
    }
  },
}

</script>