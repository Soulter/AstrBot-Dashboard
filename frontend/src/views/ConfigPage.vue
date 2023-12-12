<script setup lang="ts">
import { ref, shallowRef } from 'vue';

import UiParentCard from '@/components/shared/UiParentCard.vue';

const page = ref({ title: 'Sample Page' });

const data_str = `
{
    "data": [
        {
            "type": "group",
            "name": "机器人平台配置",
            "description": "机器人平台配置描述",
            "body": [
                {
                    "type": "item",
                    "val_type": "bool",
                    "name": "启用 QQ 频道平台",
                    "description": "机器人平台名称描述",
                    "value": true
                },
                {
                    "type": "item",
                    "val_type": "string",
                    "name": "QQ机器人APPID",
                    "description": "机器人平台名称描述",
                    "value": "123456"
                },
                {
                    "type": "item",
                    "val_type": "string",
                    "name": "QQ机器人令牌",
                    "description": "机器人平台名称描述",
                    "value": "123456"
                },
                {
                    "type": "divider"
                },
                {
                    "type": "item",
                    "val_type": "bool",
                    "name": "启用 GO-CQHTTP 平台",
                    "description": "机器人平台名称描述",
                    "value": false
                }
            ]
        },
        {
            "type": "group",
            "name": "代理配置",
            "description": "代理配置描述",
            "body": [
                {
                    "type": "item",
                    "val_type": "string",
                    "name": "代理地址",
                    "description": "代理配置描述",
                    "value": "http://localhost:7890"
                }
            ]
        },
        {
            "type": "group",
            "name": "其他配置",
            "description": "其他配置描述",
            "body": [
                {
                    "type": "item",
                    "val_type": "string",
                    "name": "回复前缀",
                    "description": "[xxxx] 你好！ 其中xxxx是你可以填写的前缀。如果为空则不显示。",
                    "value": "GPT"
                }
            ]
        }
                
    ]
}
`

const config_data = JSON.parse(data_str);
</script>

<template>
  <!-- <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb> -->

  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard v-for="group in config_data.data" :key="group.name" :title="group.name" style="margin-bottom: 16px;">
        <!-- 对group内的数组进行解析。如果val_type是bool，则用vuetify的单选；以此类推-->
        <template v-for="item in group.body">
          <template v-if="item.type === 'item'">
            <template v-if="item.val_type === 'bool'">
              <v-switch v-model="item.value" :label="item.name" :hint="item.description" color="primary" inset></v-switch>
            </template>
            <template v-else-if="item.val_type === 'string'">
              <v-text-field v-model="item.value" :label="item.name" :hint="item.description" style="margin-bottom: 8px;" variant="outlined"></v-text-field>
            </template>
          </template>
          <template v-else-if="item.type === 'divider'">
            <v-divider style="margin-top: 8px; margin-bottom: 8px;"></v-divider>
          </template>
        </template>
      </UiParentCard>
    </v-col>
  </v-row>

  <v-btn icon="mdi-content-save" size="x-large" style="position: fixed; right: 52px; bottom: 52px;" color="darkprimary">
  </v-btn>
</template>
