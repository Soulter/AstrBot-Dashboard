<template>
    <v-dialog v-model="visible" persistent max-width="400">
        <v-card>
            <v-card-title>正在等待 AstrBot 重启...</v-card-title>
            <v-card-text>
                <v-progress-linear indeterminate color="primary"></v-progress-linear>
                <div style="margin-top: 16px;">
                    <div class="py-12 text-center" v-if="newStartTime != -1">
                        <v-icon class="mb-6" color="success" icon="mdi-check-circle-outline" size="128"></v-icon>
                        <p>重启成功！</p>
                    </div>
                    <p v-if="startTime != -1">当前实例标识：{{ startTime }}</p>
                    <p v-if="newStartTime != -1">检查到新实例：{{ newStartTime }}，即将自动刷新页面</p>
                    <p v-if="status">{{ status }}</p>
                    <p>次数：{{ cnt }}</p>
                </div>

            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'

export default {
    name: 'WaitingForRestart',
    data() {
        return {
            visible: false,
            startTime: -1,
            newStartTime: -1,
            status: '',
            cnt: 0,
            intervalId: null // 用于保存 interval ID
        }
    },
    methods: {
        async check() {
            this.newStartTime = -1
            this.startTime = -1
            this.visible = true
            this.status = ""
            console.log('start wfr')
            await this.getStartTime()
            this.intervalId = setInterval(() => {
                if (this.newStartTime === -1 && this.cnt < 10 && this.visible) {
                    this.checkStartTime()
                    this.cnt++
                } else {
                    if (this.cnt == 10) {
                        this.status = '拉取状态达到最大次数，请手动检查。'
                    }
                    this.cnt = 0
                    setTimeout(() => {
                        this.visible = false
                    }, 1000)
                    clearInterval(this.intervalId) // 清除 interval
                    return
                }
            }, 1000)
        },
        async getStartTime() {
            axios.get('/api/stat/start-time').then((res) => {
                this.startTime = res.data.data.start_time
            })
        },
        async checkStartTime() {
            let res = await axios.get('/api/stat/start-time')
            this.newStartTime = res.data.data.start_time
            console.log('wfr: checkStartTime', this.newStartTime, this.startTime)
            if (this.newStartTime !== this.startTime) {
                console.log('wfr: restarted')
                setTimeout(() => {
                    this.visible = false
                    // reload 
                    window.location.reload()
                }, 2000)
            }
        }
    }
}
</script>