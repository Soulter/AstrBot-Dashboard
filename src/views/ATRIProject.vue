<script setup>
</script>


<template>
  <v-alert style="margin-bottom: 16px"
    text="这是一个长期实验性项目，目标是实现更具人类机能的 LLM 对话。测试功能包括但不限于：更像人类的回答、长短期记忆（不是 LSTM）、视觉理解与回复、基于兴趣的主动话题展开、TTS。"
    title="💡这是一个长期实验性项目" type="info" variant="tonal">
  </v-alert>
  <v-card>
    <v-card-text>
      <v-container fluid>
        <AstrBotConfig :metadata="project_atri_config_metadata" :iterable="project_atri_config?.project_atri"
          metadataKey="project_atri">
        </AstrBotConfig>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
import AstrBotConfig from '@/components/shared/AstrBotConfig.vue';

export default {
  name: 'AtriProject',
  components: {
    AstrBotConfig
  },
  data() {
    return {
      project_atri_config: {},
      fetched: false,
      project_atri_config_metadata: {},
      save_message_snack: false,
      save_message: "",
      save_message_success: "",
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      // 获取配置
      axios.get('/api/config/get').then((res) => {
        this.project_atri_config = res.data.data.config;
        this.fetched = true
        this.project_atri_config_metadata = res.data.data.metadata;
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
  },
}

</script>