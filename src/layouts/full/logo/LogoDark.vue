<template>
  <div class="logo" style="display: flex; align-items: center; ">
    <RouterLink to="/"  style="text-decoration: none; color: black;">
      <span style="font-size: 24px; font-weight: 1000;" v-show="!customizer.mini_sidebar">AstrBot 仪表盘</span>
      <span style="font-size: 20px; font-weight: 1000;" v-show="customizer.mini_sidebar">Astr</span>
      <span style="font-size: 20px;" v-show="customizer.mini_sidebar">Bot</span>
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useCustomizerStore } from '../../../stores/customizer';
const primary = ref('rgb(var(--v-theme-primary))');
const secondary = ref('rgb(var(--v-theme-secondary))');
const customizer = useCustomizerStore();
</script>
