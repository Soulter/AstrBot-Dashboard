<script setup lang="ts">
// imported components
import TotalMessage from './components/TotalMessage.vue';
import TotalSession from './components/TotalSession.vue';
import OnlineTime from './components/OnlineTime.vue';
import MessageStat from './components/MessageStat.vue';
import PlatformStat from './components/PlatformStat.vue';
import axios from 'axios';

axios.get('/api/stats').then((res) => {
  console.log(res.data.data);
});
</script>

<template>
  <v-row>
    <v-col cols="12" md="4">
      <TotalMessage />
    </v-col>
    <v-col cols="12" md="4">
      <TotalSession/>
    </v-col>
    <v-col cols="12" md="4">
      <OnlineTime />
    </v-col>
    <v-col cols="12" lg="8">
      <MessageStat />
    </v-col>
    <v-col cols="12" lg="4">
      <PlatformStat />
    </v-col>
  </v-row>
</template>
