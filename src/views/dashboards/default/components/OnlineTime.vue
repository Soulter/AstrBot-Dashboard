<script setup lang="ts"></script>

<template>
  <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape-sm bubble-primary mb-6">
    <v-card-text class="pa-5">
      <div class="d-flex align-center gap-3">
        <v-btn color="darkprimary" icon rounded="sm" variant="flat">
          <v-icon icon="mdi-clock"></v-icon>
        </v-btn>
        <div>
          <h4 class="text-h4 font-weight-medium">{{ runtime_str }}</h4>
          <span class="text-subtitle-2 text-medium-emphasis text-white">运行时间</span>
        </div>
        <v-spacer></v-spacer>
        <div>
          <v-btn icon rounded="sm" variant="plain">
            <v-icon color="black" icon="mdi-stop" size="32"></v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <v-card elevation="0" class="bubble-shape-sm overflow-hidden bubble-warning">
    <v-card-text class="pa-5">
      <div class="d-flex align-center gap-3">
        <v-btn color="lightwarning" icon rounded="sm" variant="flat">
          <v-icon icon="mdi-memory"></v-icon>
        </v-btn>
        <div>
          <h4 class="text-h4 font-weight-medium">{{ memory }} MiB</h4>

          <span class="text-subtitle-2 text-disabled font-weight-medium">占用内存</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>


<script>

export default {
  name: 'OnlineTime',
  components: {
  },
  props: ['stat'],
  watch: {
    stat: {
      handler: function (val, oldVal) {
        this.memory = val.sys_perf.memory
        this.runtime_str = val.sys_start_time // timestamp
        // 转换为xx天xx小时xx分xx秒
        let now = new Date().getTime()
        let start = new Date(val.sys_start_time * 1000).getTime()
        let diff = now - start
        let days = Math.floor(diff / (24 * 3600 * 1000))
        let leave1 = diff % (24 * 3600 * 1000)
        let hours = Math.floor(leave1 / (3600 * 1000))
        let leave2 = leave1 % (3600 * 1000)
        let minutes = Math.floor(leave2 / (60 * 1000))
        let leave3 = leave2 % (60 * 1000)
        let seconds = Math.round(leave3 / 1000)
        this.runtime_str = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒"
      },
      deep: true
    }
  },
  data: () => ({
    _stat: {},
    memory: "Loading",
    runtime_str: "Loading"
  }),

  mounted() {
  }
};

</script>