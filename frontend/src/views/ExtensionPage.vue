<script setup lang="ts">
import { ref, shallowRef } from 'vue';

import ExtensionCard from '@/components/shared/ExtensionCard.vue';

const page = ref({ title: 'Sample Page' });

const data_str = `
{
    "data": [
        {
            "name": "GoodPlugins",
            "repo": "https://gitee.com/soulter/goodplugins",
            "author": "soulter",
            "desc": "一些好用的插件，一些好用的插件，一些好用的插件。一些好用的插件。一些好用的插件，一些好用的插件。一些好用的插件，一些好用的插件。一些好用的插件，一些好用的插件，一些好用的插件。一些好用的插件。一些好用的插件，一些好用的插件。一些好用的插件，一些好用的插件",
            "version": "1.0"
        },
        {
            "name": "GoodPlugins",
            "repo": "https://gitee.com/soulter/goodplugins",
            "author": "soulter",
            "desc": "一些好用的插件",
            "version": "1.0"
        },
        {
            "name": "GoodPlugins",
            "repo": "https://gitee.com/soulter/goodplugins",
            "author": "soulter",
            "desc": "一些好用的插件",
            "version": "1.0"
        }
    ]
}`

const data = ref(JSON.parse(data_str));
</script>

<template>
  <v-row>
    <v-col cols="12" md="6" lg="4" v-for="extension in data.data" >
      <ExtensionCard :key="extension.name" :title="extension.name" :link="extension.repo" style="margin-bottom: 16px;">
        <p style="min-height: 180px; max-height: 180px; overflow: hidden;">{{ extension.desc }}</p>
        <div class="d-flex align-center gap-3">
          <v-icon>mdi-account</v-icon>
          <span>{{ extension.author }}</span>
          <v-spacer></v-spacer>
          <v-btn variant="plain">安 装</v-btn>
        </div>
      </ExtensionCard>
    </v-col>
  </v-row>
</template>
