<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
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
import { PostPopinApi, updateAppFieldApi, getAdAppListApi, delTableListApi, postAdAppListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { reactive, ref, unref, onMounted } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useIcon } from '@/hooks/web/useIcon'
import router from '@/router'
import { FBStore } from '@/store/modules/fbstore'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const store = FBStore()
const ids = ref<string[]>([])
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getAdAppListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      fn: unref('statistics_client_main'),
      ...unref(searchParams)
    })

    if (res) {
      if (!res.status) {
        ElMessage.error('操作失败:' + res.message)
      }
    }
    return {
      list: res.data,
      total: res.data.length
    }
  },
  fetchDelApi: async () => {
    const res = await delTableListApi(unref(ids))
    return !!res
  }
})

const { getList, getElTableExpose, delList } = tableMethods

const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

// getElTableExpose - 获取单个数据下来
// delList - 删除列表数据
const { loading, dataList, total, currentPage, pageSize } = tableState
// pageSize.value = 500

// 编辑Table
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'agent_name',
    label: '客户昵称',
    search: {
      hidden: false
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      width: '180px',
      align: 'center',
      slots: {
        default: ({ row }) => {
          // 2黄，1红，3绿
          return (
            <ElTag
              type='success'
              onClick={() => {

                router.push({
                  path: `/fbmeter/fbAdmin_list/${row.agent_name}`,
                })
                store.fbData = row.agent_name

              }}
              size='large'>
              {row.agent_name}
            </ElTag>
          )
        }
      }
    }
  },
  {
    field: 'total_count',
    label: '总上粉',
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
    field: 'phone_duplicate_rate',
    label: '重粉率',
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
    field: 'reply_rate',
    label: '回复率',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {

      width: '110px',
      align: 'center',

    }
  },
  {
    field: 'join_group_rate',
    label: '加群率',
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

    },

  },
  {
    field: 'is_stock_rate',
    label: '股民率',
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
    field: 'avg_price',
    label: '均价',
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
])


// @ts-ignore
const payload = reactive({
  searchTime: [],
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

const get_campaigns = async () => {
  dataList.value = []
  loading.value = true
  try {
    let _res = await postAdAppListApi({
      fn: 'statistics_client_main', ...payload,
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
    })
    if (!_res.status) {
      ElMessage.error('获取失败:' + _res.message)
    } else {
      dataList.value = _res.data
    }
  } catch (err) {
    console.error('获取数据失败:', err)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}


const { allSchemas } = useCrudSchemas(crudSchemas)

</script>

<template>

  <ContentWrap>
    <div class="mb-10px">
      <ElText style="margin-left: 10px">时间范围: </ElText>
      <ElDatePicker v-model="payload.searchTime" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始时间"
        end-placeholder="结束时间" :shortcuts="shortcuts" @change="get_campaigns"
        style="margin: 0 10px 0 5px;top: 3px; width: 220px" />
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
