<script setup>
import { ref, computed } from 'vue';
import { ChevronUpIcon, ChevronDownIcon } from 'vue-tabler-icons';

// chart 1
const chartOptions1 = computed(() => {
  return {
    chart: {
      type: 'area',
      height: 95,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      sparkline: {
        enabled: true
      }
    },
    colors: ['#5e35b1'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => '消息条数 '
        }
      },
      marker: {
        show: false
      }
    }
  };
});

// chart 1
const lineChart1 = {
  series: [
    {
      data: [0, 15, 10, 50, 30, 40, 25]
    }
  ]
};

const platforms = ref([
  {
    name: 'QQ 群',
    count: 14124
  },
  {
    name: 'QQ 频道',
    count: 612
  },
  {
    name: 'Discord',
    count: 123
  }
]);
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1">各平台上行消息数</h4>
          <div class="ml-auto">
            <v-menu transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" size="small" icon rounded="sm" variant="text" v-bind="props">
                  <DotsIcon stroke-width="1.5" width="25" />
                </v-btn>
              </template>
              <v-sheet rounded="md" width="150" class="elevation-10">
                <v-list>
                  <v-list-item value="1">
                    <v-list-item-title>今天</v-list-item-title>
                  </v-list-item>
                  <v-list-item value="2">
                    <v-list-item-title>今月</v-list-item-title>
                  </v-list-item>
                  <v-list-item value="3">
                    <v-list-item-title>今年</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-menu>
          </div>
        </div>

        <!-- <v-card class="bg-lightsecondary mt-5">
          <div class="pa-5">
            <div class="d-flex align-start justify-space-between">
              <div>
                <h6 class="text-secondary text-h5">QQ 群</h6>
              </div>
              <h4 class="text-h4">12183</h4>
            </div>
          </div>
          <apexchart type="area" height="95" :options="chartOptions1" :series="lineChart1.series"> </apexchart>
        </v-card> -->
        <div class="mt-4">
          <perfect-scrollbar v-bind:style="{ height: '270px' }">
            <v-list lines="two" class="py-0">
              <v-list-item v-for="(platform, i) in platforms" :key="i" :value="platform" color="secondary" rounded="sm">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <h6 class="text-subtitle-1 text-medium-emphasis font-weight-bold">
                      {{ platform.name }}
                    </h6>
                  </div>

                  <div class="ml-auto text-subtitle-1 text-medium-emphasis font-weight-bold">{{ platform.count }} 条</div>
                </div>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text"
              >详情
              <template v-slot:append>
                <ChevronRightIcon stroke-width="1.5" width="20" />
              </template>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>


<script>

export default {
  name: 'PlatformStat',
  components: {
  },
  props: ['stat'],
  watch: {
    stat: {
      handler: function (val, oldVal) {
        this.stat = val;
      },
      deep: true
    }
  },
  data: () => ({

  }),

  mounted() {
  }
};
</script>