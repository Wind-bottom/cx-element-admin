<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElMessage, ElInput, ElMessageBox, ElIcon, ElSelect, ElOption, ElTag, } from "element-plus";
import { Table } from '@/components/Table'
import { updateAppFieldApi, postAdAppListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const ids = ref<string[]>([])
// 这里是链接管理的Table部分
// getAdAppListApi()是获取Table数据的Api
// tableState()是表格的页码状态
// tableMethods()主要是对页面的一些请求Api进行了统一在里面
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await postAdAppListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      fn: unref('app_list'),
      ...unref(searchParams)
    })
    if (res) {
      console.log(111, res)
      if (res.code != '0') {
        ElMessage.error('操作失败1:' + res.message)
      }
    }
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  // 删除功能
  fetchDelApi: async () => {
    const res = await updateAppFieldApi({ fn: 'delete_app', row: unref(ids) })
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
    field: 'app_id',
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
    field: 'app_nickname',
    label: '昵称',
    search: {
      component: 'Input',
      componentProps: {
        style: {
          width: '150px'
        }
      }
    },
    form: {
      component: 'Input'
    },
    table: {
      width: '120px',
      align: 'left'
    }
  },
  {
    field: 'client_count',
    label: '上粉量',
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
      align: 'center'
    }
  },
  {
    field: 'app_id',
    label: 'AppId:',
    hidden: true,
    search: {
      hidden: true
      // component: 'Input',
      // componentProps: {
      //   style: {
      //     width: '100px'
      //   }
      // }
    },
    form: {
      hidden: true
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
    field: 'app_type',
    label: t('tableDemo.app_type'),
    search: {
      hidden: true
      // component: 'Input',
      // componentProps: {
      //   style: {
      //     width: '100px'
      //   }
      // }
    },
    form: {
      component: 'Select',
      componentProps: {
        style: {
          width: '100px'
        },
        options: [
          {
            label: 'kakao',
            value: 'kakao'
          },
          {
            label: 'line',
            value: 'line'
          },
          {
            label: 'whatsapp',
            value: 'whatsapp'
          },
          {
            label: 'Band',
            value: 'Band'
          }
        ]
      }
    },
    table: {
      width: '120px',
      align: 'center'
    }
  },
  {
    field: 'app_status',
    label: '状态',
    form: {
      hidden: true // 将字段隐藏，使其在表单编辑中不可见
    },
    search: {
      component: 'Select',
      componentProps: {
        style: {
          width: '100px'
        },
        options: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '✅️正常上粉',
            value: 'active'
          },
          {
            label: '⏸️已暂停',
            value: 'pause'
          },
          {
            label: '🚫已封号',
            value: 'disable'
          }
        ]
      }
    },
    table: {
      width: '150px',
      slots: {
        default: ({ row }) => {
          return (
            // <ElSwitch
            //   modelValue={row.app_enable}
            //   style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            //   onChange={(newValue) => {
            //     const oldValue = row.app_enable
            //     row.app_enable = newValue
            //     update_App_Url('update_app_field', 'app_enable', row, oldValue)
            //   }}
            // />
            <ElSelect
              modelValue={row.app_status}
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              onChange={(newValue) => {
                const oldValue = row.app_status
                row.app_status = newValue
                update_App_Url('update_app_field', 'app_status', row, oldValue)
              }}
            >
              <ElOption label="✅️正常上粉" value="active"></ElOption>
              <ElOption label="⏸️已暂停" value="pause"></ElOption>
              <ElOption label="🚫已封号" value="disable"></ElOption>
            </ElSelect>
          )
        }
      }
    }
  },

  {
    field: 'app_link',
    label: 'APP链接',
    search: {
      componentProps: {
        style: {
          width: '150px'
        }
      }
    },
    form: {
      component: 'Input'
    },
    detail: {
      span: 24
    },
    table: {
      width: '440px',
      slots: {
        default: ({ row }) => {
          return (
            <ElInput
              modelValue={row.app_link}
              onInput={(newValue) => {
                const oldValue = row.app_link
                row.app_link = newValue
                console.log('newValue:' + newValue)
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_App_Url('update_app_field', 'app_link', row, oldValue)
                      done()
                    } else {
                      row.app_link = oldValue
                      done()
                    }
                  }
                })
              }}
            />
          )
        }
      }
    }
  },
  {
    field: 'operator',
    label: '投手',
    search: {
      componentProps: {
        style: {
          width: '150px'
        }
      }
    },
    form: {
      component: 'Input'
    },
    detail: {
      span: 24
    },
    table: {
      width: '100px',
      slots: {
        default: ({ row }) => {
          return (
            <ElInput
              modelValue={row.operator}
              onInput={(newValue) => {
                const oldValue = row.operator
                row.operator = newValue
                console.log('newValue:' + newValue)
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_App_Url('update_app_field', 'operator', row, oldValue)
                      done()
                    } else {
                      row.operator = oldValue
                      done()
                    }
                  }
                })
              }}
            />
          )
        }
      }
    }
  },
  {
    field: 'sales',
    label: '销售员',
    search: {
      componentProps: {
        style: {
          width: '150px'
        }
      }
    },
    form: {
      component: 'Input'
    },
    detail: {
      span: 24
    },
    table: {
      width: '100px',
      slots: {
        default: ({ row }) => {
          return (
            <ElInput
              modelValue={row.sales}
              onInput={(newValue) => {
                const oldValue = row.sales
                row.sales = newValue
                console.log('newValue:' + newValue)
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_App_Url('update_app_field', 'sales', row, oldValue)
                      done()
                    } else {
                      row.sales = oldValue
                      done()
                    }
                  }
                })
              }}
            />
          )
        }
      }
    }
  },
  {
    field: 'talk_title',
    label: '被谁使用',
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
      width: '300px',
      align: 'left',
      slots: {
        default: ({ row }) => {
          // talk_id
          return (
            row.talk_title.map(item => {
              return <ElTag class="ml-2" type="success" size="large">
                {item}
              </ElTag>
            })
          )
        }
      }
    }
  },

  {
    field: 'app_count',
    label: '展示量',
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
      align: 'center'
    }
  },
  {
    field: 'app_owner',
    label: '归属人',
    search: {
      component: 'Input',
      componentProps: {
        style: {
          width: '100px'
        }
      }
    },
    form: {
      hidden: false
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
    field: 'add_time',
    label: '上粉时间',
    search: {
      component: 'DatePicker',
      componentProps: {
        style: {
          width: '200px'
        },
        type: "daterange",
        placeholder: "选择日期",
        valueFormat: "YYYY-MM-DD"
      }
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      hidden: true
    }
  },
  {
    field: 'app_qr_code',
    label: t('tableDemo.preview'),
    table: {
      width: '100px',
    },
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      slots: {
        default: (row) => (
          <>
            <img src={row.app_qr_code} alt="Preview" />
          </>
        )
      }
    },
  },
  {
    field: 'field84',
    table: {
      hidden: true
    },
    form: {
      component: 'Upload',
      label: `${t('formDemo.userAvatar')}`,
      componentProps: {
        action: '#',
        showFileList: false,
        beforeUpload: (rawFile) => {
          if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
            ElMessage.error('Avatar picture must be either JPG or PNG format!');
            return false;
          } else if (rawFile.size / 1024 / 1024 > 2) {
            ElMessage.error('Avatar picture size can not exceed 2MB!');
            return false;
          }
          return true;

        },
        httpRequest: (data) => {
          const fileReader = new FileReader();
          const file = data.file;

          fileReader.readAsDataURL(file);
          fileReader.onloadend = function () {
            const base64Data = fileReader.result;
            // 此处可以将 base64Data 上传到服务器
            // 例如使用 fetch 或 axios 发送 POST 请求
            // 注意：在实际应用中，请替换为真实的服务器上传逻辑
            // 模拟上传过程
            imageUrl.value = base64Data
          };
        },
        slots: {
          default: () => (
            <>
              <div class='iconBox'>
                {imageUrl.value ? <img src={imageUrl.value} class="avatar" /> : null}
                {!imageUrl.value ? (
                  <ElIcon class="avatar-uploader-icon" size="large">
                    add
                  </ElIcon>
                ) : null}
              </div>

            </>
          )
        }
      }
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
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

const imageUrl = ref()
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
    ? [row.app_id]
    : elTableExpose?.getSelectionRows().map((v: TableData) => v.app_id) || []
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
  console.log(row);

  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)
// 更新封装f
const update_App_Url = async (fn: string, field: string, row: object, oldValue: any) => {
  // 发送请求到服务器保存更改
  loading.value = true
  const res = await updateAppFieldApi({ fn: fn, row: row })
    .catch(() => { })
    .finally(() => {
      loading.value = false
    })
  if (res) {
    if (res.code != '0') {
      ElMessage.error('操作失败:' + res.message)
      // 回滚旧值
      row[field] = oldValue
    }
  }
}

// 进行保存操作，将表单数据提交给后端并根据返回结果进行相应的处理
// getList()是获取链接列表的数据的，并对Table的页码归1
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    formData.app_img_qr_base = imageUrl.value
    saveLoading.value = true
    console.log(formData);
    let res: any
    if (dialogTitle.value == t('exampleDemo.edit')) {
      delete formData.index
      res = await updateAppFieldApi({ fn: 'update_app_field', row: formData })
      ElMessage.warning(res.message)

    } else if (dialogTitle.value == t('exampleDemo.copy') || t('exampleDemo.add')) {
      delete formData.index
      delete formData.app_id
      res = await updateAppFieldApi({ fn: 'add_app', row: formData })
      ElMessage.warning(res.message)

    }


    if (res || res.code == 0) {
      saveLoading.value = false
      dialogVisible.value = false
      // currentPage.value = 1
      getList()
      imageUrl.value = null
    } else if (res.code == 1) {
      saveLoading.value = false
      dialogVisible.value = false
      // currentPage.value = 1
      imageUrl.value = null
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
    <Table v-model:pageSize="pageSize" v-model:currentPage="currentPage" :columns="allSchemas.tableColumns"
      :data="dataList" :loading="loading" :pagination="{
        total: total
      }" @register="tableRegister" :preview="['app_qr_code']" />
  </ContentWrap>
  <!-- 打开模态框 -->
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <!--编辑 -->
    <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema"
      :current-row="currentRow" />

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