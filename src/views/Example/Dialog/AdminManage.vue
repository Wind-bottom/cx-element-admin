<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getAdAppListApi, updateAppFieldApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const ids = ref<string[]>([])
// 这里是链接管理的Table部分
// getAdAppListApi()是获取Table数据的Api
// tableState()是表格的页码状态
// tableMethods()主要是对页面的一些请求Api进行了统一在里面
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getAdAppListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      fn: unref('admin_list'),
      ...unref(searchParams)
    })
    console.log(res)
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
  // 删除功能
  fetchDelApi: async () => {
    const res = await updateAppFieldApi({ fn: 'delete_admin', row: unref(ids) })
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

// 编辑Table
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
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
    field: 'index',
    label: t('tableDemo.index'),
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
      width: '55px',
      align: 'center'
    }
  },
  {
    field: 'username',
    label: '账号',
    search: {
      component: 'Input',
      componentProps: {
        style: {
          width: '150px'
        }
      }
    },
    form: {
      component: 'Input',
      colProps: {
        span: 6
      }
    },
    table: {
      width: '120px',
      align: 'center'
    }
  },
  {
    field: 'password',
    label: '密码',
    search: {
      hidden: true
    },
    form: {
      component: 'InputPassword',
      colProps: {
        span: 6
      }
    },
    table: {
      hidden: true
    }
  },
  {
    field: 'nickname',
    label: '昵称:',
    search: {
      component: 'Input',
      componentProps: {
        style: {
          width: '100px'
        }
      }
    },
    form: {
      component: 'Input',
      colProps: {
        span: 6
      }
    },
    detail: {
      hidden: true
    },
    table: {
      width: '100px',
      align: 'center'
    }
  },
  {
    field: 'is_enable',
    label: '状态',
    form: {
      hidden: true // 将字段隐藏，使其在表单编辑中不可见
    },
    search: {
      hidden: true
    },
    table: {
      width: '80px',
    }
  },
  {
    fixed: 'right',
    field: 'action',
    width: '320px',
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
              <ElButton type="primary" onClick={() => action(data.row, 'edit')}>
                {t('exampleDemo.edit')}
              </ElButton>
              <ElButton type="info" onClick={() => action(data.row, 'copy')}>
                {t('exampleDemo.copy')}
              </ElButton>
              <ElButton type="success" onClick={() => action(data.row, 'detail')}>
                {t('exampleDemo.detail')}
              </ElButton>
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
  actionType.value = ''
}
// 这里是对多选框选中删除还是点击数据里面的删除做了判断并做不同的处理
const delLoading = ref(false)
const delData = async (row: TableData | null) => {

  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.username]
    : elTableExpose?.getSelectionRows().map((v: TableData) => v.username) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
// 根据传入的参数 type 和 row，设置对话框的标题、类型和内容，然后显示对话框
// 打开对话框
const action = (row: TableData, type: string) => {
  dialogTitle.value = t(
    type === 'edit'
      ? 'exampleDemo.edit'
      : type === 'detail'
        ? 'exampleDemo.detail'
        : 'exampleDemo.copy'
  )
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

// 进行保存操作，将表单数据提交给后端并根据返回结果进行相应的处理
// getList()是获取链接列表的数据的，并对Table的页码归1
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    console.log(formData);
    let res: any
    if (dialogTitle.value == t('exampleDemo.edit')) {
      delete formData.index
      res = await updateAppFieldApi({ fn: 'update_admin_field', row: formData })
    } else if (dialogTitle.value == t('exampleDemo.copy') || t('exampleDemo.add')) {
      delete formData.index
      delete formData.id
      res = await updateAppFieldApi({ fn: 'add_admin', row: formData })
    }
    if (res) {
      if (res.code != 0) {
        ElMessage.error(res.message)
        saveLoading.value = false
      } else {
        saveLoading.value = false
        dialogVisible.value = false
        currentPage.value = 1
        getList()
      }
    } else {
      ElMessage.error('操作失败，未知错误！')
      saveLoading.value = false
      saveLoading.value = false
    }
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />
    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null)">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </div>
    <Table v-model:pageSize="pageSize" v-model:currentPage="currentPage" :columns="allSchemas.tableColumns" :data="dataList" :loading="loading" :pagination="{
      total: total
    }" @register="tableRegister" :preview="['app_qr_code']" />
  </ContentWrap>
  <!-- 打开模态框 -->
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <!--编辑 -->
    <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema" :current-row="currentRow" />
    <!-- 详情 -->
    <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" :current-row="currentRow" />
    <!-- 模态框按钮 -->
    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>


<style scoped>
::v-deep(.el-upload) {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

::v-deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

::v-deep(.el-icon.avatar-uploader-icon) {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

::v-deep(.h-100px) {
  height: 50px;
}

::v-deep(.el-image__inner) {
  width: 100%;
  height: 50px;
  object-fit: contain !important;
}
</style>