<script setup lang="ts">
const props = defineProps({
  title: String,
});
</script>

<template>
  <v-card variant="outlined" elevation="0" class="withbg" style="width: 50%;">
    <v-card-item style="padding: 10px 20px">
      <div class="d-sm-flex align-center justify-space-between">
        <v-card-title>{{ props.title }}</v-card-title>
        <v-spacer></v-spacer>
      </div>
    </v-card-item>
    <v-divider></v-divider>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
