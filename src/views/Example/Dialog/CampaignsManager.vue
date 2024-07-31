<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElButton,
  ElInputNumber,
  ElMessage,
  ElTag,
  ElDatePicker,
  ElDivider,
  ElSelect,
  ElOption,
  ElDialog,
  ElForm, ElFormItem, ElInput, ElMessageBox, ElText
} from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { PostPopinApi, updateAppFieldApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { reactive, ref, unref } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useIcon } from '@/hooks/web/useIcon'

const ids = ref<string[]>([])
// getPopinCampaigns()是获取Popin活动数据的Api
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { } = tableState
    const res = await PostPopinApi({
      fn: unref('get_campaigns'),
      row: payload
    })
    if (res) {
      if (res.code != '0') {
        ElMessage.error('操作失败:' + res.message)
      }
    }
    return {
      list: res.data.detail,
      total: res.data.total
    }

  },

  // 删除功能
  fetchDelApi: async () => {
    const res = await updateAppFieldApi({ fn: 'delete_app', row: unref(ids) })
    return !!res
  }
})
// getElTableExpose - 获取单个数据下来
// delList - 删除列表数据
const { loading, dataList, total, currentPage, pageSize } = tableState
pageSize.value = 500
const { getElTableExpose, delList } = tableMethods

const { t } = useI18n()

// 编辑Table
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'campaignName',
    label: '活动名称',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      width: '180px',
      sortable: true,
      align: 'left',
      slots: {
        default: ({ row }) => {
          // 2黄，1红，3绿
          return (
            <ElTag
              type={row.display_status === '3' ? 'success' : row.display_status === '2' ? 'warning' : row.display_status === '1' ? 'danger' : ''}>
              {row.status === 0 ? '🚫' : ''} {row.campaignName === undefined ? row.accountName : row.campaignName}
            </ElTag>
          )
        }
      }
    }
  },
  {
    field: 'dailyBudget',
    label: '日预算',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      width: '100px',
      align: 'center',
      slots: {
        default: (row: any) => {
          return (payload.accountId === '' ? 'null' : '$' + row.row.dailyBudget
          )
        }
      }
    }
  },
  {
    field: 'spend',
    label: '花费',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '100px',
      align: 'left',
      formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
        return (`$${parseFloat(cellValue).toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      }
    }
  },
  {
    field: 'cpc_format',
    label: 'cpc',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '110px',
      align: 'center',
      slots: {
        default: (row: any) => {
          return (payload.accountId === '' ? 'null' :
            <>
              <ElTag>
                {row.row.cpc_format === undefined ? '$' + row.row.cpc : row.row.cpc_format}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'impression',
    label: '展示',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '100px',
      align: 'left'
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return (`${cellValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    }
  },
  {
    field: 'click',
    label: '点击',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '100px',
      align: 'left',
      formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
        return (`${cellValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      }
    }
  },
  {
    field: 'ctr',
    label: '点击率',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '100px',
      align: 'center',
      formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
        return (`${(cellValue * 100).toFixed(2)}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      }
    }
  },
  {
    field: 'conversion',
    label: '转化',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '80px',
      align: 'center',
      formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
        return (`${(cellValue)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      }
    }
  },
  {
    field: 'conversionRate',
    label: '转化率',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '100px',
      align: 'center',
      slots: {
        default: (row: any) => {
          let conversionRate = row.row.conversionRate * 100
          return (
            <>
              <ElTag type={conversionRate <= 2 ? 'danger' : conversionRate < 3 ? 'warning' : 'success'}>
                {conversionRate.toFixed(2)}%
              </ElTag>
            </>
          )
        }
      }
      // formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      //   return (`${(cellValue * 100).toFixed(2)}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      // }
    }
  },
  {
    field: 'cvViewContent',
    label: '到达率',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '100px',
      align: 'center',
      slots: {
        default: (row: any) => {
          let cvViewContent = parseFloat(row.row.cvViewContent) * 100 / parseFloat(row.row.click)
          return (
            <>
              <ElTag type={cvViewContent < 75 ? 'danger' : cvViewContent < 85 ? 'warning' : 'success'}>
                {cvViewContent.toFixed(2)}%
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'conversionPrice',
    label: '转化成本',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '120px',
      align: 'center',
      formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
        return (
          <ElTag
            type={cellValue == 0 ? 'danger' : cellValue < 15 ? 'success' : cellValue < 25 ? 'warning' : 'danger'}>
            {`$${cellValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </ElTag>
        )
      }
    }
  },
  {
    field: 'avgCpc',
    label: '平均CPC',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '110px',
      align: 'center',
      formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
        return (`$${cellValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      }
    }
  },
  {
    field: 'platform_targeting',
    label: '投放平台',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      sortable: true,
      width: '120px',
      align: 'center',
      slots: {
        default: (row: any) => {
          return (payload.accountId === '' ? 'null' :
            <>
              <ElTag type={row.row.detail === undefined ? 'warning' : 'success'}>
                {row.row.detail === undefined ? '未获取' : row.row.detail.platform_targeting === '' || row.row.detail.platform_targeting === 'All' ? '全部' : row.row.detail.platform_targeting}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'campaignId',
    label: 'cpId',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      width: '100px',
      align: 'center',
    }
  },
  {
    field: 'pacing',
    label: '速度',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      width: '100px',
      align: 'center',
      formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
        return (payload.accountId === '' ? 'null' :
          <ElTag
            type={cellValue == 0 ? 'success' : 'warning'}>
            {cellValue == 0 ? `加速` : `匀速`}
          </ElTag>
        )
      }
    }
  },
  {
    field: 'cpa_format',
    label: 'cpa',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      width: '110px',
      align: 'center',
      slots: {
        default: (row: any) => {
          return (payload.accountId === '' ? 'null' :
            <>
              <ElTag type={row.row.detail === undefined ? 'warning' : 'success'}>
                {row.row.detail === undefined ? '未获取' : row.row.cpa_format === undefined ? row.row.detail.cpa : row.row.cpa_format}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'chargeType',
    label: '出价',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      width: '100px',
      align: 'center',
      slots: {
        default: (row: any) => {
          return (payload.accountId === '' ? 'null' :
            <>
              <ElTag type={row.row.detail === undefined ? 'danger' : row.row.detail.charge_type === 'cpc' ? 'success' : 'warning'}>
                {row.row.detail === undefined ? '未获取' : row.row.detail.charge_type === 'cpc' ? '固定' : 'Smart Bit'}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'day_parting',
    label: '投放时间段',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      width: '220px',
      align: 'center',
      slots: {
        default: (row: any) => {
          return (payload.accountId === '' ? 'null' :
            <>
              <ElTag type={row.row.detail === undefined ? 'warning' : 'success'}>
                {row.row.detail === undefined ? '未获取' : row.row.detail.day_parting[0]}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    fixed: 'right',
    field: 'action',
    label: t('tableDemo.action'),
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElButton type="primary" disabled={payload.accountId === ''} onClick={() => campaign_id_detail(data.row)}> 素材 </ElButton>
            </>
          )
        }
      }
    }
  }
])

let campaign_id_tableDataList = ref<TableData[]>([])

const campaign_id_detail_columns = reactive<TableColumn[]>([
  {
    field: 'mongo_id',
    type: 'selection'
  },
  {
    field: 'title',
    label: t('tableDemo.title'),
    table: {
      width: '100px',
      align: 'left',
      formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
        return (`$${parseFloat(cellValue).toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      }
    }
  },
  {
    field: 'image',
    label: '素材图片',
    table: {
      width: '120px',
      align: 'center',
    }
  },
  {
    field: 'url',
    label: '落地页',
    table: {
      width: '120px',
      align: 'center',
    }
  },
  {
    field: 'created_at',
    label: '创建时间'
  }
])

// @ts-ignore
const { allSchemas } = useCrudSchemas(crudSchemas)

// 这里是对多选框选中删除还是点击数据里面的删除做了判断并做不同的处理
const delLoading = ref(false)
const delData = async (row: TableData | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.campaignId]
    : elTableExpose?.getSelectionRows().map((v: TableData) => v.campaignId) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
// 根据传入的参数 type 和 row，设置对话框的标题、类型和内容，然后显示对话框

const status_bid_cap = async () => {
  status_bid_cap_loading.value = true

  // 遍历dataList,更新详情
  let campaign_ids: any = []
  let campaign_accountCurrency: any = []
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()

  for (let i = 0; i < selections.length; i++) {
    if (selections[i].campaignId == undefined) continue
    //   把campaignId放进一个数组
    campaign_ids.push(selections[i].campaignId)
    campaign_accountCurrency.push(selections[i].accountCurrency)
  }
  // 如无数据则不执行
  if (campaign_ids.length === 0) {
    ElMessage.error('请先选择数据')
    return
  }
  form['campaign_ids'] = campaign_ids
  form['campaign_account_currency'] = campaign_accountCurrency
  let _res = await PostPopinApi({
    fn: 'campaign_edit',
    row: form
  })
    .catch(() => {
    })
    .finally(() => {
      status_bid_cap_loading.value = false
    })
  if (_res) {
    if (_res.code == '0') {
      ElMessageBox.confirm(
        '操作完毕，是否刷新?',
        '提示',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'info',
        }
      )
        .then(() => {
          get_campaigns()
        })
        .catch(() => { })
        .finally(() => {
          dialogFormVisible.value = false
        })
    } else {
      ElMessage.error('操作失败:' + _res.message)
    }
  }
}

const status_bid_cap1 = async () => {
  status_bid_cap_loading.value = true
  // 遍历dataList,更新详情
  let campaign_ids: any = []
  let campaign_accountCurrency: any = []
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()
  for (let i = 0; i < selections.length; i++) {
    if (selections[i].campaignId == undefined) continue
    //   把campaignId放进一个数组
    campaign_ids.push(selections[i].campaignId)
    campaign_accountCurrency.push(selections[i].accountCurrency)
  }
  // 如无数据则不执行
  if (campaign_ids.length === 0) {
    ElMessage.error('请先选择数据')
    return
  }
  form2['campaign_ids'] = campaign_ids
  form2['campaign_account_currency'] = campaign_accountCurrency
  let _res = await PostPopinApi({
    fn: 'campaign_edit_ads',
    row: form2
  })
    .catch(() => {
    })
    .finally(() => {
      status_bid_cap_loading.value = false
    })
  if (_res) {
    if (_res.code == '0') {
      ElMessageBox.confirm(
        '操作完毕，是否刷新?',
        '提示',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'info',
        }
      )
        .then(() => {
          get_campaigns()
        })
        .catch(() => { })
        .finally(() => {
          dialogFormVisible.value = false
        })
    } else {
      ElMessage.error('操作失败:' + _res.message)
    }
  }
}

const campaign_edit_diy_act = async () => {
  status_bid_cap_loading.value = true

  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()

  // 如无数据则不执行
  if (selections.length === 0) {
    ElMessage.error('请先选择数据')
    status_bid_cap_loading.value = false
    return
  }
  form1['rows'] = selections
  let _res = await PostPopinApi({
    fn: 'campaign_edit_diy',
    row: form1
  })
    .catch(() => {
    })
    .finally(() => {
      status_bid_cap_loading.value = false
    })
  if (_res) {
    if (_res.code == '0') {
      // ElMessage.success('操作成功')
      dialogFormVisible1.value = false
      ElMessageBox.confirm(
        '操作完毕，是否刷新?',
        '提示',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'info',
        }
      )
        .then(() => {
          get_campaigns()
        })
        .catch(() => { })
    } else {
      ElMessage.error('操作失败:' + _res.message)
    }
  }
}

// const campaign_edit_cpa = async () => {
//   const elTableRef = await getElTableExpose()
//   const selections = elTableRef?.getSelectionRows()
//   // 遍历dataList,更新详情
//   for (let i = 0; i < selections.length; i++) {
//     if(selections[i].detail === undefined) {
//       ElMessage.error('点击[深层获取]数据后再进行更新')
//       break
//     }
//     loading.value = true
//     let _res = await PostPopinApi({fn: 'campaign_edit_cpa', campaignId: selections[i].campaignId, row: selections[i].detail})
//         .catch(() => {
//         })
//         .finally(() => {
//           loading.value = false
//         })
//     if (_res) {
//       if (_res.code == '0') {
//         for (let o = 0; o < dataList.value.length; o++) {
//           if(dataList.value[o].campaignId === selections[i].campaignId) {
//             ElMessage.success(selections[i].campaignId + '修改成功')
//             break
//           }
//         }
//       }
//     }
//   }
// }
const campaign_list_btn = ref(false)

const get_campaigns = async () => {
  dataList.value = []
  campaign_list_btn.value = true
  // 遍历dataList,更新详情
  loading.value = true
  let _res = await PostPopinApi({ fn: 'get_campaigns', deep: form1.ReadMode, row: payload })
    .catch(() => {
    })
    .finally(() => {
      loading.value = false
      campaign_list_btn.value = false
    })
  if (_res) {
    if (_res.code != '0') {
      ElMessage.error('获取失败:' + _res.message)
    } else {
      dataList.value = _res.data.detail
    }
  }
}

const campaign_edit_ico = useIcon({ icon: 'tdesign:edit' })
const refresh = useIcon({ icon: 'tdesign:chart-ring-1' })
const payload = reactive({
  searchTime: '',
  accountId: '',
  dateType: '1',
  timezone: 'UTC+9',
  status: '1',
})
const DataType = ref()
const Datanum = ref()
const campaign_color = ref()
const campaign_name_filter = ref('')

const shortcuts = [
  {
    text: '今天',
    value: [
      new Date(),
      new Date()
    ],
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      const d2 = date.setTime(date.getTime() - 3600 * 1000 * 24)
      return [d2, d2]
    },
  },
  {
    text: '前天',
    value: () => {
      const date = new Date()
      const d3 = date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
      return [d3, d3]
    },
  },
  {
    text: '一周内',
    value: () => {
      const date = new Date()
      const d7 = date.getTime() - 3600 * 1000 * 24 * 7
      return [d7, date]
    },
  },
]

const accountList = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '28833',
    label: 'JP_01',
  },
  {
    value: '29078',
    label: 'JP_02',
  },
  {
    value: '29164',
    label: 'JP_03',
  },

]
const dateTypeList = [
  {
    value: '1',
    label: '天',
  },
  {
    value: '2',
    label: '小时',
  }
]
const timezoneList = [
  {
    value: 'UTC+8',
    label: 'UTC+8',
  },
  {
    value: 'UTC+9',
    label: 'UTC+9',
  }
]

const dialogFormVisible = ref(false)
const dialogFormVisible1 = ref(false)
const dialogFormVisible2 = ref(false)
const campaign_id_Visible = ref(false)
const campaign_id_loading = ref(false)

const campaign_id_detail = async (row: any) => {
  campaign_id_Visible.value = true
  campaign_id_tableDataList.value = []
  campaign_id_loading.value = true
  const _res = await PostPopinApi({ fn: 'campaign_id_detail', campaignId: row.campaignId, accountId: row.accountId })
    .catch(() => {
    })
    .finally(() => {
      campaign_id_loading.value = false
    })
  if (_res) {
    if (_res.code == '0') {
      campaign_id_tableDataList.value = _res.data
    } else {
      ElMessage.error('获取失败:' + _res.message)
    }
  }
}

const campaign_edit_fun = async () => {
  form.status = ''
  form.daily_cap = 0
  form.target_bid = 0
  form.total_cap = 0

  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()
  if (selections.length === 0) {
    ElMessage.error('请先选择数据')
    return
  }
  dialogFormVisible.value = true
}

const campaign_edit_diy = async () => {
  form1.chargeType = ''
  form1.cpa = 0
  form1.pacing = ''
  form1.day_parting = ''
  form1.platform_targeting = []

  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()
  if (selections.length === 0) {
    ElMessage.error('请先选择数据')
    return
  }
  dialogFormVisible1.value = true
}
const campaign_edit_url = async () => {
  form2.landing_page = ''
  form2.brand_name = '하나증권 주식회사',
    form2.utm_tracking = ''
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()
  if (selections.length === 0) {
    ElMessage.error('请先选择数据')
    return
  }
  dialogFormVisible2.value = true
}

const form = reactive({
  status: '',
  daily_cap: 0,
  target_bid: 0,
  total_cap: 0,
})
const form1 = reactive({
  chargeType: '',
  cpa: 0,
  pacing: '',
  day_parting: '',
  ReadMode: '1',
  platform_targeting: [],
})
const form2 = reactive({
  landing_page: '',
  brand_name: '하나증권 주식회사',
  utm_tracking: ''
})

const status_bid_cap_loading = ref(false)


const DataTypeChange = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
  if (DataType.value == '') {
    // 勾选全部
    return
  } else if (DataType.value == 'ocpc') {
    // 勾选已关闭
    for (let i = 0; i < dataList.value.length; i++) {
      if (i == dataList.value.length - 1) {
        return
      }
      if (dataList.value[i].detail.charge_type == 'ocpc') {
        elTableRef?.toggleRowSelection(dataList.value[i], true)
      }
    }
  } else if (DataType.value == 'cpc') {
    for (let i = 0; i < dataList.value.length; i++) {
      if (i == dataList.value.length - 1) {
        return
      }
      if (dataList.value[i].detail.charge_type == 'cpc') {
        elTableRef?.toggleRowSelection(dataList.value[i], true)
      }
    }
  }
}

const CampaignColorChoose = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
  if (campaign_color.value == '') {
    // 勾选全部
    return
  } else {
    console.log(campaign_color.value)
    // 勾选已关闭
    for (let i = 0; i < dataList.value.length; i++) {
      if (i == dataList.value.length - 1) {
        return
      }
      if (dataList.value[i].display_status == campaign_color.value) {
        elTableRef?.toggleRowSelection(dataList.value[i], true)
      }
    }
  }
}

const handleSpend = async (v: any) => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()

  for (let i = 0; i < dataList.value.length; i++) {
    if (i == dataList.value.length - 1) {
      return
    }
    if (dataList.value[i].spend < parseInt(v)) {
      elTableRef?.toggleRowSelection(dataList.value[i], true)
    }
  }
}

const campaign_name_focus = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()

  if (campaign_name_filter.value === '') {
    return
  }

  for (let i = 0; i < dataList.value.length; i++) {
    if (i == dataList.value.length - 1) {
      return
    }
    if ((dataList.value[i].campaignName.toUpperCase()).indexOf(campaign_name_filter.value.toUpperCase()) != -1) {
      elTableRef?.toggleRowSelection(dataList.value[i], true)
    }
  }
}

function getRowClassName({ row, rowIndex }) {
  if (row.istatus == 1) {
    return 'highlight-row';
  } else if (row.istatus == 0) {
    return 'highlight-row1';
  } else {
    return 'highlight-row2';
  }
}
</script>

<template>
  <ElDialog v-model="dialogFormVisible" draggable title="批量编辑 (*谨慎操作)" width="600px">
    <ElForm :model="form">
      <ElFormItem label="活动开关" label-width="100px">
        <ElSelect v-model="form.status" placeholder="-">
          <el-option label="选择" value="" />
          <el-option label="开启" value="1" />
          <el-option label="关闭" value="0" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="出价(CPC)" label-width="100px">
        <ElInputNumber v-model="form.target_bid" :precision="2" :step="0.01" />
        <ElText v-if="form.target_bid >= 1" class="mx-1" type="danger" style="margin-left: 10px"> * 预算太高?</ElText>
      </ElFormItem>
      <ElFormItem label="单日预算" label-width="100px">
        <ElInputNumber v-model="form.daily_cap" :step="100" />
        <ElText v-if="form.daily_cap > 0 && form.daily_cap < 100" class="mx-1" type="warning" style="margin-left: 10px">
          * 预算太低?</ElText>
      </ElFormItem>
      <ElFormItem label="总预算" label-width="100px">
        <ElInputNumber v-model="form.total_cap" :step="100" />
        <ElText v-if="form.total_cap > 0 && form.total_cap < 100" class="mx-1" type="warning" style="margin-left: 10px">
          * 预算太低?</ElText>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="dialogFormVisible = false">取消</ElButton>
        <ElButton type="primary" @click="status_bid_cap" :loading="status_bid_cap_loading">确认</ElButton>
      </span>
    </template>
  </ElDialog>

  <ElDialog v-model="dialogFormVisible2" draggable title="批量修改投放链接 (*谨慎操作)" width="600px">
    <ElForm :model="form2">
      <ElFormItem label="投放地址" label-width="100px">
        <ElInput v-model="form2.landing_page" :step="100" />
      </ElFormItem>
      <ElFormItem label="PR" label-width="100px">
        <ElInput v-model="form2.brand_name" :step="100" />
      </ElFormItem>
      <ElFormItem label="UTM跟踪" label-width="100px">
        <ElInput v-model="form2.utm_tracking" :step="100" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="dialogFormVisible2 = false">取消</ElButton>
        <ElButton type="primary" @click="status_bid_cap1" :loading="status_bid_cap_loading">确认</ElButton>
      </span>
    </template>
  </ElDialog>



  <ElDialog v-model="dialogFormVisible1" draggable title="批量编辑/CPA/出价方式/投放时间等 (*谨慎操作)" width="600px">
    <ElForm :model="form">
      <ElFormItem label="出价方式" label-width="100px">
        <ElSelect v-model="form1.chargeType" placeholder="-" style="width: 150px;">
          <el-option label="默认" value="" />
          <el-option label="固定CPC" value="cpc" />
          <el-option label="Smart Bit" value="ocpc" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="CPA" label-width="100px">
        <ElInputNumber v-model="form1.cpa" />
        <ElText v-if="form1.cpa > 20" class="mx-1" type="danger" style="margin-left: 10px"> * CPA太高?</ElText>
        <ElText v-if="form1.cpa < 5 && form1.cpa > 0" class="mx-1" type="warning" style="margin-left: 10px"> * CPA太低?
        </ElText>
      </ElFormItem>

      <ElFormItem label="加速模式" label-width="100px">
        <ElSelect v-model="form1.pacing" placeholder="-" style="width: 150px;">
          <el-option label="默认" value="" />
          <el-option label="加速" value="0" />
          <el-option label="匀速" value="1" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="投放平台" label-width="100px">
        <ElSelect v-model="form1.platform_targeting" multiple placeholder="-" style="width: 380px;">
          <el-option label="全部" value="ALL" />
          <el-option label="电脑端" value="Desktop" />
          <el-option label="平板" value="Tablet" />
          <el-option label="移动端" value="Mobile" />
          <el-option label="Xbox" value="Xbox" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="投放时间" label-width="100px">
        <ElInput v-model="form1.day_parting" maxlength="24" placeholder="24小时制" show-word-limit type="text"
          style="width: 280px" pattern="[01]{24}" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="dialogFormVisible1 = false">取消</ElButton>
        <ElButton type="primary" @click="campaign_edit_diy_act" :loading="status_bid_cap_loading">确认</ElButton>
      </span>
    </template>
  </ElDialog>

  <ElDialog v-model="campaign_id_Visible" draggable title="素材列表" width="1600px">
    <Table :columns="campaign_id_detail_columns" :data="campaign_id_tableDataList" :loading="campaign_id_loading"
      :preview="['image']" :row-class-name="getRowClassName" />
  </ElDialog>

  <ContentWrap>
    <div class="mb-10px">
      <ElButton :loading="delLoading" type="danger" @click="delData(null)" :disabled="payload.accountId === ''">
        {{ t('exampleDemo.del') }}
      </ElButton>
      <ElDivider direction="vertical" />
      <ElText style="margin-left: 10px">投放状态: </ElText>
      <ElSelect v-model="payload.status" :disabled="campaign_list_btn" placeholder="-" style="width: 100px">
        <el-option label="全部状态" value="" />
        <el-option label="已关闭" value="0" />
        <el-option label="投放中" value="1" />
      </ElSelect>
      <ElSelect v-model="payload.accountId" class="m-2" placeholder="Select" :onChange="get_campaigns">
        <ElOption v-for="item in accountList" :key="item.value" :label="item.label" :value="item.value" />
      </ElSelect>
      <ElSelect v-model="payload.timezone" class="m-2" placeholder="Select" style="width: 90px">
        <ElOption v-for="item in timezoneList" :key="item.value" :label="item.label" :value="item.value" />
      </ElSelect>
      <ElDatePicker v-model="payload.searchTime" type="daterange" value-format="YYYYMMDD" start-placeholder="开始时间"
        end-placeholder="结束时间" :shortcuts="shortcuts" @change="get_campaigns"
        style="margin: 0 10px 0 5px;top: 3px; width: 220px" />

      <ElSelect v-model="payload.dateType" class="m-2" placeholder="Select" style="width: 80px">
        <ElOption v-for="item in dateTypeList" :key="item.value" :label="item.label" :value="item.value" />
      </ElSelect>
      <ElButton type="success" :icon="refresh" @click="get_campaigns" :disabled="campaign_list_btn">活动列表</ElButton>
      <ElText style="margin-left: 10px">数据深度: </ElText>
      <ElSelect v-model="form1.ReadMode" :disabled="campaign_list_btn" placeholder="-" style="width: 100px">
        <el-option label="正常-" value="0" />
        <el-option label="深度+" value="1" />
      </ElSelect>
      <el-divider content-position="left">批量操作</el-divider>
      <ElButton type="warning" plain :icon="campaign_edit_ico" @click="campaign_edit_fun"
        :disabled="payload.accountId === ''">开关/出价/预算</ElButton>
      <ElButton type="warning" plain :icon="campaign_edit_ico" @click="campaign_edit_diy"
        :disabled="payload.accountId === ''">批量CPA</ElButton>
      <ElButton type="warning" plain :icon="campaign_edit_ico" @click="campaign_edit_url"
        :disabled="payload.accountId === ''">批量修改投广链接</ElButton>
      <ElSelect v-model="DataType" class="m-2" placeholder="出价筛选" size="default" style="width: 120px"
        @change="DataTypeChange" :disabled="payload.accountId === ''">
        <ElOption label="清空选项" value="" />
        <ElOption label="Smart Bit" value="ocpc" />
        <ElOption label="固定" value="cpc" />
      </ElSelect>
      <ElSelect v-model="campaign_color" class="m-2" placeholder="颜色筛选" size="default" style="width: 120px"
        @change="CampaignColorChoose" :disabled="payload.accountId === ''">
        <ElOption label="清空选项" value="" />
        <ElOption label="绿" value="3" />
        <ElOption label="黄" value="2" />
        <ElOption label="红" value="1" />
      </ElSelect>
      <ElInput class="m-1" v-model="Datanum" :min="1" @change="handleSpend" placeholder="消耗筛选" style="width: 50px" />
      <ElInput class="m-1" v-model="campaign_name_filter" :min="1" @change="campaign_name_focus" placeholder="活动名称筛选"
        style="width: 120px" />
    </div>
    <Table height="800" v-model:pageSize="pageSize" v-model:currentPage="currentPage" :columns="allSchemas.tableColumns"
      :data="dataList" :loading="loading" :pagination="{
        total: total,
        pageSizes: [10, 20, 50, 100, 500]
      }" @register="tableRegister" />


  </ContentWrap>
</template>


<style>
.el-table .el-table__row.highlight-row>td:nth-child(2) {
  color: rgb(16, 146, 70);
}

.el-table .el-table__row.highlight-row1>td:nth-child(2) {
  color: rgb(151, 2, 2);
}

.el-table__row.highlight-row2>td:nth-child(2) {
  color: rgb(160, 160, 6);
}
</style>
