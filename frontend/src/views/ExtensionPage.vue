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
          <v-btn variant="plain">卸 载[待开发]</v-btn>
        </div>
      </ExtensionCard>
    </v-col>
    <v-col cols="12" md="12">
      <div style="background-color: white; width: 100%; padding: 16px; border-radius: 10px;">
        <h3>🧩 插件市场 [待开发]</h3>
      </div>
    </v-col>
  </v-row>
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
      save_message_success: ""
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
  },
}

</script>