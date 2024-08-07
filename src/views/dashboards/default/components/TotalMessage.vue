<script setup>
import { shallowRef } from 'vue';
import { ArchiveIcon, CopyIcon, DownloadIcon, FileExportIcon, HttpDeleteIcon } from 'vue-tabler-icons';
const items = shallowRef([
  { title: '移除', icon: HttpDeleteIcon },
]);
</script>

<template>
  <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-6">
        <v-btn icon rounded="sm" color="darksecondary" variant="flat">
          <v-icon icon="mdi-message"></v-icon>
        </v-btn>
        <div class="ml-auto z-1">
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn icon rounded="sm" color="secondary" variant="flat" size="small" v-bind="props">
                <DotsIcon stroke-width="1.5" width="20" />
              </v-btn>
            </template>
            <v-sheet rounded="md" width="150" class="elevation-10">
              <v-list density="compact">
                <v-list-item v-for="(item, index) in items" :key="index" :value="index">
                  <template v-slot:prepend>
                    <component :is="item.icon" stroke-width="1.5" size="20" />
                  </template>
                  <v-list-item-title class="ml-2">{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-menu>
        </div>
      </div>
      <h2 class="text-h1 font-weight-medium">
        {{ message_total }}
      </h2>
      <span class="text-subtitle-1 text-medium-emphasis text-white">消息总数</span>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'TotalMessage',
  components: {
  },
  props: ['stat'],
  watch: {
    stat: {
      handler: function (val, oldVal) {
        this.message_total = val.message_total
      },
      deep: true
    }
  },
  data: () => ({
    message_total: 0,
  }),

  mounted() {
  }
};
</script>