<script setup lang="ts">
import { shallowRef } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import sidebarItems from './sidebarItem';
import NavItem from './NavItem.vue';

const customizer = useCustomizerStore();
const sidebarMenu = shallowRef(sidebarItems);
</script>

<template>
  <v-navigation-drawer left v-model="customizer.Sidebar_drawer" elevation="0" rail-width="80" mobile-breakpoint="960"
    app class="leftSidebar" :rail="customizer.mini_sidebar">
    <v-list class="pa-4 listitem" style="height: auto">
      <template v-for="(item, i) in sidebarMenu" :key="i">
        <NavItem :item="item" class="leftPadding" />
      </template>
    </v-list>
    <div class="text-center">
      <v-chip color="inputBorder" size="small"> v{{ version }} </v-chip>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import axios from 'axios';
export default {
  name: 'VerticalSidebar',
  components: {
    NavItem,
  },
  data: () => ({
    version: "-",
  }),
  mounted() {
    this.get_version()
  },
  methods: {
    get_version() {
      axios.get('/api/stat/version')
        .then((res) => {
          this.version = res.data.data.version;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>