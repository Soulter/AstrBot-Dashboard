<script setup lang="ts">
import { shallowRef } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import sidebarItems from './sidebarItem';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import Logo from '../logo/LogoMain.vue';

const customizer = useCustomizerStore();
const sidebarMenu = shallowRef(sidebarItems);
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="105"
    mobile-breakpoint="960"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <div class="pa-5">
      <Logo />
    </div>
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <v-divider class="my-3" v-else-if="item.divider" />
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <NavItem :item="item" v-else class="leftPadding" />
        </template>
      </v-list>
      <div class="pa-4 text-center">
        <v-chip color="inputBorder" size="small"> v{{version}} </v-chip>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script lang="ts">
import axios from 'axios';
export default {
  name: 'VerticalSidebar',
  components: {
    NavGroup,
    NavItem,
    NavCollapse,
    Logo,
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