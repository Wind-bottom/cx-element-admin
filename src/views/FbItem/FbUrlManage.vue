<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElButton,
  ElSwitch,
  ElMessage,
  ElInput,
  ElMessageBox,
  ElDialog,
  ElTransfer,
  ElForm,
  ElFormItem,
  ElTag,
  ElOption, ElSelect
} from "element-plus";
import { Table } from '@/components/Table'
import {
  delTableListApi,
  getAdUrlListApi,
  updateAdFieldApi,
  postAdAppListApi,
  updateAppFieldApi,
  getAdAppListApi
} from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { ref, unref, reactive, onMounted, onUnmounted, watch } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const link_data = ref()
const ids = ref<string[]>([])
// 这里是链接管理的Table部分
// getAdUrlListApi()是获取Table数据的Api
// tableState()是表格的页码状态
// tableMethods()主要是对页面的一些请求Api进行了统一在里面
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getAdUrlListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      fn: unref('fb_ad_white_list'),
      ...unref(searchParams)
    })
    if (res) {
      if (res.code != '0') {
        ElMessage.error('操作失败:' + res.message)
      }
    }
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await delTableListApi(unref(ids))
    return !!res
  }
})

// getList - 获取列表数据
// getElTableExpose - 获取单个数据下来
// delList - 删除列表数据
const { loading, dataList, total, currentPage, pageSize } = tableState

const { getList, getElTableExpose, delList } = tableMethods

const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { t } = useI18n()

function jump_url(uuid: string, _t: number) {
  if (_t == 0) {
    window.open('http://38.180.95.46:15053/page/' + uuid + '/0/?1')
  } else if (_t == 1) {
    window.open('http://38.180.95.46:15053/page/' + uuid + '/0/')
  } else if (_t == 2) {
    window.open('https://kakaokr.net/page/' + uuid + '/0/')
  }
}

// 编辑Table
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'talk_id',
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
      type: 'selection'
    }
  },

  {
    field: 'owner',
    label: ('归属人'),
    search: {
      hidden: false
    },
    form: {
      hidden: false,
      colProps: {
        span: 24
      }    
    },
    detail: {
      hidden: false
    },
    table: {
      width: '100px',
      align: 'center'
    }
  },
  {
    field: 'fb_id',
    label: ('Fb广告ID'),
    search: {
      hidden: false
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 4,
      },
      colProps: {
        span: 24
      }
    },
    detail: {
      hidden: true
    },
    table: {
      width: '400px',
      align: 'center'
    }
  },
  {
    fixed: 'right',
    field: 'action',
    width: '90px',
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
              <ElButton type="danger" onClick={() => delData(data.row)}>
                {t('exampleDemo.del')}
              </ElButton>
            </>
          )
        }
      }
    }
  }
])
// 多选框初始值
const chooseFirstData = ref([])
// 多选框暂存值
const chooseData = ref([])

// @ts-ignore
const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<TableData | null>(null)
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = null
  dialogVisible.value = true
  actionType.value = 'add'
}

const edit_link_dialog = ref(false);
const delLoading = ref(false)


const delData = async (row: TableData | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: TableData) => v.id) || []
  // delLoading.value = true

  await ElMessageBox({
    title: '确认删除？:',
    message: '删除后将无法恢复',
    showCancelButton: true,
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Loading...'
        let _payload = { "fn": "del_fb_ad_id", "ids": ids.value }
        await postAdAppListApi(_payload).then((_res) => {
          if (_res.code == '0') {
            ElMessage.success(_res.message)
            getList()
            done()
          } else {
            ElMessage.error('操作失败:' + _res.message)
          }
          delLoading.value = false
        })

      } else {
        done()
      }
    }
  })

}


const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

// 进行保存操作，将表单数据提交给后端并根据返回结果进行相应的处理
// getList()是获取链接列表的数据的，并对Table的页码归1
const save = async () => {
  // console.log('save')
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    delete formData.index
    const payload = { fn: actionType.value == 'edit' ? 'edit_ad' : 'add_fb_ad_id', row: formData }
    saveLoading.value = true
    const res: any = await updateAdFieldApi(payload)
      .catch(() => { })
      .finally(() => {
        saveLoading.value = false
      })
    ElMessage.warning(res.message)
    if (res || res.code == 0) {
      saveLoading.value = false
      currentPage.value = 1
      getList()
      // write?.reset()
    } else if (res.code == 1) {
      saveLoading.value = false
      currentPage.value = 1
    }

   }
}



const handleKeyDown = async (event) => {
  if (event.key === 'Enter') {
    // console.log(123);

  }
};

const titleSetle = ref([])

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown);

});



const handleSelectionChange = async () => {
  const elTableRef = await getElTableExpose()
  titleSetle.value = elTableRef?.getSelectionRows()
}


onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null)">
        {{ t('exampleDemo.del') }}
      </ElButton>
      <ElTag type="success" style="margin-left: 20px"> 勾选了{{ titleSetle.length }}条数据 </ElTag>
    </div>

    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
      @selection-change="handleSelectionChange"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" maxHeight="200px" width="600px">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ actionType === 'add' ? '添加' : actionType === 'edit' ? '编辑' : '复制' }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>

<style scoped>
::v-deep(.el-form-item__content) {
  display: flex;
  justify-content: center;
}

::v-deep(.el-transfer-panel) {
  width: 400px;
}

.el-dialog__body {
  max-height: none;
  overflow: visible;
}
</style>