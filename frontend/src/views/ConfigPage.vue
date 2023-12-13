<script setup>
import UiParentCard from '@/components/shared/UiParentCard.vue';
import axios from 'axios';

</script>

<template>
  <!-- <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb> -->

  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard v-for="group in config_data.data" :key="group.name" :title="group.name" style="margin-bottom: 16px;">
        <!-- 对group内的数组进行解析。如果val_type是bool，则用vuetify的单选；以此类推-->
        <template v-for="item in group.body">
          <template v-if="item.config_type === 'item'">
            <template v-if="item.val_type === 'bool'">
              <v-switch v-model="item.value" :label="item.name" :hint="item.description" color="primary" inset></v-switch>
            </template>
            <template v-else-if="item.val_type === 'string'">
              <v-text-field v-model="item.value" :label="item.name" :hint="item.description" style="margin-bottom: 8px;" variant="outlined"></v-text-field>
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
    UiParentCard
  },
  data() {
    return {
      config_data: {
        "data": []
      },
      save_message_snack: false,
      save_message: "",
      save_message_success: ""
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      axios.get('/api/configs').then((res) => {
        this.config_data = res.data.data;
        console.log(this.config_data);
      });
    },
    updateConfig() {
      axios.post('/api/configs', this.config_data).then((res) => {
        console.log(this.config_data)
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