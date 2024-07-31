import config from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { code } = config

const timeout = 1000

export default [
  // 分析页统计接口
  {
    url: '/analysis/total',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: code,
        data: {
          users: 102400,
          messages: 81212,
          moneys: 9280,
          shoppings: 13600
        }
      }
    }
  },
  // 用户来源
  {
    url: '/analysis/userAccessSource',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: code,
        data: [
          { value: 1000, name: 'analysis.directAccess' },
          { value: 310, name: 'analysis.mailMarketing' },
          { value: 234, name: 'analysis.allianceAdvertising' },
          { value: 135, name: 'analysis.videoAdvertising' },
          { value: 1548, name: 'analysis.searchEngines' }
        ]
      }
    }
  },
  // 每周用户活跃量
  {
    url: '/analysis/weeklyUserActivity',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: code,
        data: [
          { value: 13253, name: 'analysis.monday' },
          { value: 34235, name: 'analysis.tuesday' },
          { value: 26321, name: 'analysis.wednesday' },
          { value: 12340, name: 'analysis.thursday' },
          { value: 24643, name: 'analysis.friday' },
          { value: 1322, name: 'analysis.saturday' },
          { value: 1324, name: 'analysis.sunday' }
        ]
      }
    }
  },
  // 每月销售额
  {
    url: '/analysis/monthlySales',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: code,
        data: {
          series: {
            avgCpc: [0.46, 0.4, 0.446, 0.478, 0.447, 0.586, 0.463, 0.373],
            click: [390, 10, 4198, 3002, 2629, 4029, 2967, 6],
            clickRate: [0.76, 0.03, 0.31, 0.37, 0.45, 0.26, 0.43, 3.17]
          },
          trendData: [
            { label: 'clickRate', value: '0.34' },
            { label: 'avgCpc', value: '0.488' },
            { label: 'click', value: '17231' }
          ],
          xAxis: [
            '20231212',
            '20231213',
            '20231214',
            '20231215',
            '20231216',
            '20231217',
            '20231218',
            '20231219'
          ]
        }
      }
    }
  }
] as MockMethod[]
