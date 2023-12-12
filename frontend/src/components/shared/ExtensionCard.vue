<script setup lang="ts">
const props = defineProps({
  title: String,
  link: String
});

const open = (link: string) => {
  window.open(link, '_blank');
};
</script>

// ===============================|| Ui Parent Card||=============================== //
<template>
  <v-card variant="outlined" elevation="0" class="withbg">
    <v-card-item style="padding: 10px 20px">
      <div class="d-sm-flex align-center justify-space-between">
        <v-card-title>{{ props.title }}</v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-link" variant="plain" @click="open(props.link)"></v-btn>
      </div>
    </v-card-item>
    <v-divider></v-divider>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
