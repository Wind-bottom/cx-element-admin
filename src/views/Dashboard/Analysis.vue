<script setup lang="ts">
import PanelGroup from './components/PanelGroup.vue'
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { Echart } from '@/components/Echart'
import {
  pieOptions,
  // barOptions,
  lineOption
} from './echarts-data'
import { ref, reactive, onMounted } from 'vue'
import {
  // getUserAccessSourceApi,
  // getWeeklyUserActivityApi,
  getMonthlySalesApi
} from '@/api/dashboard/analysis'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'


const { t } = useI18n()

const loading = ref(true)

const DataTime = ref()
onMounted(() => {
  // 获取当前日期
  let currentDate = new Date();

  // 存储最近30天日期的数组
  let recentDates = [];

  // 循环获取最近30天的日期
  for (let i = 0; i < 30; i++) {
    // 获取年、月、日
    let year = currentDate.getFullYear();
    let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // 月份从0开始，所以要加1，并确保两位数格式
    let day = ('0' + currentDate.getDate()).slice(-2); // 确保两位数格式

    // 将日期按照需要的格式组合
    let formattedDate = `${year}-${month}-${day}`;

    // 将当前日期推到数组中
    recentDates.unshift(formattedDate);

    // 递减当前日期
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // recentDates 数组现在包含了最近30天的日期
  DataTime.value = recentDates
})

const lineOptionsData = reactive<EChartsOption>(lineOption) as EChartsOption

// 每月销售总额
const getMonthlySales = async () => {
  const res: any = await getMonthlySalesApi().catch(() => { })
  if (res) {
    console.log(res.data.xAxis)

    set(lineOptionsData, 'xAxis.data', DataTime.value)
    set(lineOptionsData, 'series', [
      // 预计
      {
        name: t('analysis.avgCpc'),
        smooth: true,
        type: 'line',
        data: res.data.series.avgCpc,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      }
    ])

  }
}

const getAllApi = async () => {
  await Promise.all([
    // getUserAccessSource(),
    // getWeeklyUserActivity(),
    getMonthlySales()
  ])
  loading.value = false
}

getAllApi()
</script>

<template>
  <PanelGroup />
  <ElRow :gutter="20" justify="space-between">
    <!-- <ElCol :xl="10" :lg="10" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol> -->
    <!-- <ElCol :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="barOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol> -->
    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="4">
          <Echart :options="lineOptionsData" :height="350" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="4">
          <Echart :options="lineOptionsData" :height="350" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElTable></ElTable>
      </ElCard>
    </ElCol>
  </ElRow>
</template>
