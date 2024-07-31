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
import { PostPopinApi, updateAppFieldApi, getAdAppListApi, postAdAppListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { reactive, ref, unref, onMounted, watch } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter, useRoute } from 'vue-router'
import { useTagsView } from '@/hooks/web/useTagsView'
import { FBStore } from '@/store/modules/fbstore'
const store = FBStore()
const titleName = ref({})
const { setTitle } = useTagsView()

onMounted(() => {
  titleName.value = store.fbData
  console.log(titleName.value, '123');
  setTitle(`客户-${store.fbData}`)
})



// getPopinCampaigns()是获取Popin活动数据的Api
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getAdAppListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      fn: unref('agent_sale_traffic_count'),
      agent_name: titleName.value,
      ...unref(searchParams)
    })
    console.log(res);

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
// getElTableExpose - 获取单个数据下来
// delList - 删除列表数据
const { loading, dataList, total, currentPage, pageSize } = tableState
// pageSize.value = 500
const { getList, getElTableExpose, delList } = tableMethods
const ids = ref<string[]>([])
const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}
// 编辑Table
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    type: 'index',
    align: 'center'
  },
  {
    field: 'sales',
    label: '业务',
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
    field: 'operator',
    label: '投手',
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
    field: 'app_nickname',
    label: '人设名字',
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
    field: 'app_link',
    label: '上粉链接',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '400px',
      align: 'center',
    }
  },
  {
    field: 'phone',
    label: '上粉号码',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '200px',
      align: 'center',
    }
  },
  {
    field: 'today_add_count',
    label: '今日新增',
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
      align: 'center',
      width: '100px',
    },
  },
  {
    field: 'all_add_count',
    label: '全部数量',
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
    field: 'today_reply_count',
    label: '今日回复',
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
    field: 'all_reply_count',
    label: '总回复',
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
    detail: {
      hidden: true
    },
    table: {

      width: '100px',
      align: 'center',

    }
  },
  {
    field: 'today_is_stock_count',
    label: '今日股民',
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
    field: 'all_is_stock_count',
    label: '总股民',
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
    field: 'phone_duplicate_rate',
    label: '重复率',
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
    field: 'app_status',
    label: '状态',
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
      width: '200px',
      align: 'center',
      slots: {
        default: ({ row }) => {
          // 2黄，1红，3绿
          return (
            <ElTag
              type={row.app_status == 'active' ? 'success' : row.app_status == 'pause' ? 'info' : 'danger'}
              size='large'>
              {row.app_status == 'active' ? '✅️正常上粉' : row.app_status == 'pause' ? '⏸️已暂停' : '🚫已封号'}
            </ElTag>
          )
        }
      }
    }
  },
])
// @ts-ignore
const { allSchemas } = useCrudSchemas(crudSchemas)


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
      fn: 'agent_sale_traffic_count',
      ...payload,
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      agent_name: titleName.value
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

const get_details = async () => {
  dataList.value = []
  loading.value = true
  try {
    let _res = await postAdAppListApi({
      fn: 'agent_sale_traffic_count',
      row: payload,
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      agent_name: titleName.value
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


const Personality = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '人设',
    type: 'index',
    align: 'center'
  },
  {
    field: 'sales',
    label: '总粉量',
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
    field: 'operator',
    label: '股民',
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
    field: 'app_nickname',
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
    field: 'app_link',
    label: '优先级',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '400px',
      align: 'center',
    }
  },
])
const pitcher = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '投手',
    type: 'index',
    align: 'center'
  },
  {
    field: 'sales',
    label: '总粉量',
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
    field: 'operator',
    label: '总无效',
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
    field: 'app_nickname',
    label: '总回复',
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
    field: 'app_link',
    label: '总有效',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '400px',
      align: 'center',
    }
  },
  {
    field: 'app_link',
    label: '总有效',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '400px',
      align: 'center',
    }
  },
  {
    field: 'app_link',
    label: '总股民',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '400px',
      align: 'center',
    }
  },
  {
    field: 'app_link',
    label: '股民率',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '400px',
      align: 'center',
    }
  },
  {
    field: 'app_link',
    label: '精准排名',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '400px',
      align: 'center',
    }
  },
  {
    field: 'app_link',
    label: '有效排名',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '400px',
      align: 'center',
    }
  },
])

const tableColmde = ref([])
const ElDialogData = ref(false)
const handcloseElDialogData = () => {
  ElDialogData.value = true
}
const DialogTitle = ref('')
const modelDataList = ref()
const modelLoading = ref(false)

</script>

<template>
  <ContentWrap>
    <ElDialog v-model="ElDialogData" draggable :title="DialogTitle" width="1200px" @close="handcloseElDialogData">
      <Table height="800" :columns="tableColmde" :data="modelDataList" :loading="modelLoading" />
    </ElDialog>
    <div style="display: flex;align-items: center;flex-wrap: wrap;">
      <div style="margin-bottom: 5px;">
        <ElText style="margin-left: 10px">时间范围: </ElText>
        <ElDatePicker v-model="payload.searchTime" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始时间"
          end-placeholder="结束时间" :shortcuts="shortcuts" @change="get_campaigns"
          style="margin: 0 10px 0 5px;top: 3px; width: 220px" />
      </div>

      <ElButton type="success" @click="get_details">业务</ElButton>
      <ElButton type="success" @click="get_details">投手</ElButton>
      <ElButton type="success" @click="get_details">人设</ElButton>
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

.lableStyle {
  color: aqua;
}
</style>
