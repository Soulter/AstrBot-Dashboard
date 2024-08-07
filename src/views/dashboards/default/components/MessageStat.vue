<script setup>
import { ref, computed } from 'vue';
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="9">
            <span class="text-subtitle-2 text-disabled font-weight-bold">上行消息总趋势</span>
            <h3 class="text-h3 mt-1">{{ total_cnt }}</h3>
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              color="primary"
              variant="outlined"
              hide-details
              v-model="select"
              :items="items"
              item-title="state"
              item-value="abbr"
              label="Select"
              persistent-hint
              return-object
              single-line
            >
            </v-select>
          </v-col>
        </v-row>
        <div class="mt-4">
          <apexchart type="bar" height="280" :options="chartOptions1" :series="lineChart1.series" ref="rtchart"> </apexchart>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script>

export default {
  name: 'MessageStat',
  components: {
  },
  props: ['stat'],
  data: () => ({
    total_cnt: 0,
    select: { state: 'Today', abbr: 'FL' },
    items: [
      { state: '过去 24 小时', abbr: 'FL' },
      { state: '更多维度待开发喵!', abbr: 'GA' },
    ],
    // chart 1
    chartOptions1: {
      chart: {
        type: 'bar',
        height: 400,
        fontFamily: `inherit`,
        foreColor: '#a1aab2',
        stacked: true
      },
      // colors: ['#eef2f6', '#1e88e5', '#5e35b1', '#ede7f6'],
      colors: ['#1e88e5', '#5e35b1', '#ede7f6'],
      responsive: [
        {
          breakpoint: 400,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      },
      xaxis: {
        type: 'category',
        categories: []
      },
      legend: {
        show: true,
        fontFamily: `'Roboto', sans-serif`,
        position: 'bottom',
        offsetX: 20,
        labels: {
          useSeriesColors: false
        },
        markers: {
          width: 16,
          height: 16,
          radius: 5
        },
        itemMargin: {
          horizontal: 15,
          vertical: 8
        }
      },
      fill: {
        type: 'solid'
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: true
      },
      tooltip: {
        theme: 'dark'
      }
    },
    lineChart1: {
      series: [
        {
          name: '消息条数',
          // 24小时
          data: []
        }
      ]
    },
  }),

  watch: {
    stat: {
      handler: function (val, oldVal) {
        let x_labels = []
        let y_values = []

        for (let i = 0; i < val.message.length; i++) {
          let date = new Date(val.message[i][0] * 1000)
          let hour = date.getHours()
          let minute = date.getMinutes()
          minute = minute < 10 ? "0" + minute : minute
          x_labels.push(hour + ":" + minute)
          y_values.push(val.message[i][1])
          this.total_cnt += val.message[i][1]
        }
        // this.$refs.rtchart.updateSeries([
        //   {
        //     name: '消息条数',
        //     data: y_values
        //   }
        // ])
        // this.$refs.rtchart.updateOptions([
        //   {
        //     xaxis: {
        //       type: 'category',
        //       categories: x_labels
        //     }
        //   }
        // ])

        this.$refs.rtchart.updateOptions({
          xaxis: {
              categories: x_labels
          },
          series: [{
              data: y_values
          }],
        });
        
      },
      deep: true
    }
  },

  mounted() {

  }
};

</script>