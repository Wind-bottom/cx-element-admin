<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import {
    ElButton,
    ElMessage,
    ElTag,
    ElDatePicker,
} from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { PostPopinApi, updateAppFieldApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { reactive, ref, unref } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const ids = ref<string[]>([])
// getPopinCampaigns()是获取Popin活动数据的Api
const { tableRegister, tableState } = useTable({
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

const { t } = useI18n()

// 编辑Table
const crudSchemas = reactive<CrudSchema[]>([
 
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


// @ts-ignore
const { allSchemas } = useCrudSchemas(crudSchemas)

// 这里是对多选框选中删除还是点击数据里面的删除做了判断并做不同的处理



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


const payload = reactive({
    searchTime: '',
    accountId: '',
    dateType: '1',
    timezone: 'UTC+9',
    status: '1',
})


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




const form1 = reactive({
    chargeType: '',
    cpa: 0,
    pacing: '',
    day_parting: '',
    ReadMode: '1',
    platform_targeting: [],
})



</script>

<template>

    <ContentWrap>
        <div class="mb-10px">
            <ElDatePicker v-model="payload.searchTime" type="daterange" value-format="YYYYMMDD" start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" @change="get_campaigns" style="margin: 0 10px 0 5px;top: 3px; width: 220px" />
        </div>
        <Table height="800" v-model:pageSize="pageSize" v-model:currentPage="currentPage" :columns="allSchemas.tableColumns" :data="dataList" :loading="loading" :pagination="{
                total: total,
                pageSizes: [10, 20, 50, 100, 500]
            }" @register="tableRegister" />


    </ContentWrap>
</template>
