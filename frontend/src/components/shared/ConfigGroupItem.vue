<script setup lang="ts">
const props = defineProps({
  title: String,
  desc: String,
  btnRoute: String,
  namespace: String,
});
</script>

<template>
  <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 12px;">
    <div style="display: flex; flex-direction: row;">
        <h3 style="margin-right: 10px; color: black">{{ props.title }}</h3>
        <p style="color: #222;">{{ props.desc }}</p>
    </div>
    <v-btn :to="props.btnRoute" color="primary" class="ml-2" style="border-radius: 10px;">配置</v-btn>
  </div>
</template>
