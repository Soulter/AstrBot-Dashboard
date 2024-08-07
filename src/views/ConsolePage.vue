<script setup>
import {Terminal} from 'xterm';
import 'xterm/css/xterm.css'

</script>

<template>
  <div style="background-color: white; width: 100%; padding: 8px; padding-left: 16px; border-radius: 10px; margin-bottom: 16px; display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
    <h3>{{ status }}</h3>
    <v-btn color="primary" variant="text" @click="handleConnection">
      {{ connection_status }}
    </v-btn>
  </div>
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
      term: null,
      websocket: null,
      status: '',
      connection_status: '连接'
    }
  },
  mounted() {
    this.term = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: 28,
        cols: 100,
        theme: {
          foreground: "#000", //字体
          background: "#ffffff", //背景色
          cursor: "#000", //光标
          convertEol: true, //自动换行
        }
      }
    );
    this.term.open(document.getElementById('terminal'));
    // websockets
    this.createWebSocket()
  },
  methods: {
    createWebSocket() {
      this.status = '正在连接'
      
      this.websocket = new WebSocket('ws://' +  window.location.hostname + ':6186');
      this.status = '已连接'
      this.connection_status = '断开'
      this.websocket.onopen = () => {
        console.log('WebSocket连接已打开');
      };
      this.websocket.onerror = (error) => {
        console.error('WebSocket发生错误:', error);
      };
      this.websocket.onclose = () => {
        console.log('WebSocket连接已关闭');
      };
      this.websocket.onmessage = (evt) => {
        this.term.write(evt.data + '\r\n')
      }
    },
    handleConnection() {
      if (this.connection_status === '连接') {
        this.createWebSocket()
      } else {
        this.websocket.close()
        this.term.write('已手动断开连接。\r\n')
        this.status = '未连接'
        this.connection_status = '连接'
      }
    }
  },
  beforeUnmount() {
    this.websocket.close()
  }
}

</script>

<style>
</style>