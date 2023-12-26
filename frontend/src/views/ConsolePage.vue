<script setup>
import { ref, shallowRef } from 'vue';

import ExtensionCard from '@/components/shared/ExtensionCard.vue';
import axios from 'axios';
import {Terminal} from 'xterm';

</script>

<template>
  <div style="width: 100%; height: 100%; background-color: #fff; padding: 16px; border-radius: 10px;">
    <div id="terminal" style=""></div>
  </div>

</template>

<script>

export default {
  name: 'ConsolePage',
  components: {
  },
  data() {
    return {
      term: null
    }
  },
  mounted() {
    this.term = new Terminal({
        // rendererType: "canvas", //渲染类型
        rows: 35,
        cols: 100, // 不指定行数，自动回车后光标从下一行开始

        theme: {
          foreground: "#000", //字体
          background: "#ffffff", //背景色
        }
      }
    );
    this.term.open(document.getElementById('terminal'));
    this.term.write('AstrBot Console By xterm && Soulter\n')
    this.term.write('🚧 施工中 🚧\n')
    this.term.write('此 Console 暂时不可用。\n')
  },
  methods: {
  },
}

</script>

<style>
/* .xterm-helper-textarea {
  display: none;
}
.xterm-char-measure-element {
  color: #fff;
}
.xterm-scroll-area {
  display: none;
} */
</style>