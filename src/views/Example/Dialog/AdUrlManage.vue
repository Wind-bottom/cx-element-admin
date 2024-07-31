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
import { ref, unref, reactive, onMounted, onUnmounted } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const PlatformList = ref([{ label: 'PoPin', value: 'PoPin', }, { label: 'MediaGo', value: 'MediaGo' }, { label: 'Taboola', value: 'Taboola' }, { label: 'OutBrain', value: 'OutBrain' }, { label: 'FaceBook', value: 'FaceBook' }])
// 平台列表

// onMounted(() => {
//   generateData()
// })

const generateData = async () => {
  const res = await getAdAppListApi({
    pageIndex: 1,
    pageSize: 1000,
    app_enable: 1,
    app_status: 'active',
    is_count: 'no',
    fn: unref('app_list'),
  })
  edit_link_data.value = res.data.list.map((item: any) => {
    return {
      key: item.app_id,
      label: `${item.app_owner} | ${item.app_type} | ${item.app_nickname} (${item.app_count})`,
      disabled: item.app_enable == 0
    }
  })
  // PlatformList.value = res.data.list.map((item: any) => {
  //   return {
  //     label: item.app_type,
  //     value: item.app_type
  //   }
  // })
  link_data.value = res.data.list.map((item: any) => {
    return {
      name: item.app_nickname,
      link: item.app_link
    }
  })
}

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
      fn: unref('ad_url_list'),
      ...unref(searchParams)
    })
    if (res) {
      if (res.code != '0') {
        ElMessage.error('操作失败:' + res.message)
      }
    }
    await generateData()
    res.data.list.map((item) => {
      let linkName = item.talk_link.split('\n');
      const list = linkName
        .map((item2) => {
          const filteredNames = link_data.value
            .filter((item3) => item2 === item3.link)
            .map((filteredItem) => filteredItem.name);

          return filteredNames.join(',');
        });

      item.app_name = list.join(',');
      // console.log(list);
    });
    // console.log(res.data.list);
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
    field: 'talk_id',
    label: '主模板',
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
      width: '90px',
      align: 'center',
      slots: {
        default: ({ row }) => {
          return (
            <ElButton onClick={() => jump_url(row.talk_id, 0)}>
              斗篷
            </ElButton>
          )
        }
      }
    }
  }, {
    field: 'talk_id',
    label: '模拟调试',
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
      width: '90px',
      align: 'center',
      slots: {
        default: ({ row }) => {
          return (
            <ElButton onClick={() => jump_url(row.talk_id, 1)}>
              {row.talk_id.substring(row.talk_id.length - 2)}
            </ElButton>
          )
        }
      }
    }
  },
  {
    field: 'talk_id',
    label: '正式投放',
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
      width: '90px',
      align: 'center',
      slots: {
        default: ({ row }) => {
          return (
            <ElButton onClick={() => jump_url(row.talk_id, 2)}>
              正式
            </ElButton>
          )
        }
      }
    }
  },
  {
    field: 'talk_enable',
    label: '开关',
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
            label: '开启',
            value: '1'
          },
          {
            label: '关闭',
            value: '0'
          }
        ]
      }
    },
    table: {
      width: '80px',
      slots: {
        default: ({ row }) => {
          return (
            <ElSwitch
              modelValue={row.talk_enable}
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              onChange={(newValue) => {
                const oldValue = row.talk_enable
                row.talk_enable = newValue
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue + '',
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_Ad_Url('update_ad_url_field', 'talk_enable', row, oldValue)
                      done()
                    } else {
                      row.talk_enable = oldValue
                      done()
                    }
                  }
                })
                update_Ad_Url('update_ad_url_field', 'talk_enable', row, oldValue)
              }}
            />
          )
        }
      }
    }
  },
  {
    field: 'cloak',
    label: '斗篷开关',
    search: {
      hidden: true // 不使用该字段进行查询
    },
    form: {
      hidden: true // 将字段隐藏，使其在表单编辑中不可见
    },
    table: {
      width: '90px',
      slots: {
        default: ({ row }) => {
          return (
            <ElSwitch
              modelValue={row.cloak}
              inline-prompt
              active-text="斗"
              onChange={(newValue) => {
                const oldValue = row.cloak
                row.cloak = newValue
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue + '',
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_Ad_Url('update_ad_url_field', 'cloak', row, oldValue)
                      done()
                    } else {
                      row.cloak = oldValue
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
    field: 'talk_country',
    label: '投放国家',
    form: {
      hidden: true // 将字段隐藏，使其在表单编辑中不可见
    },
    search: {
      hidden: true
    },
    table: {
      width: '200px',
      slots: {
        default: ({ row }) => {
          return (
            <ElSelect
              modelValue={row.talk_country}
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              onChange={(newValue) => {
                chooseData.value = newValue;
                row.talk_country = chooseData.value;
              }}
              onFocus={() => {
                chooseFirstData.value = row.talk_country;
              }}

              onBlur={async () => {
                if (row.talk_country === chooseFirstData.value) {
                  chooseData.value = '';
                  chooseFirstData.value = '';
                  return;
                }
                ElMessageBox({
                  title: '确认修改',
                  message: `确定将国家从 "${chooseFirstData.value}" 修改为 "${row.talk_country}"?`,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      try {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '正在提交...';
                        await update_Ad_Url('update_ad_url_field', 'talk_country', row, row.talk_country);
                        done();
                        ElMessage.success('更新成功');
                      } catch (error) {
                        console.error('更新失败:', error);
                        ElMessage.error('更新失败');
                        instance.confirmButtonLoading = false;
                        instance.confirmButtonText = '确认';
                      } finally {
                        chooseData.value = '';
                        chooseFirstData.value = '';
                      }
                    } else {
                      row.talk_country = chooseFirstData.value;
                      chooseData.value = '';
                      chooseFirstData.value = '';
                      done();
                    }
                  }
                });
              }}
            >
              <ElOption label="空值" value=""></ElOption>
              <ElOption label="韩国" value="ko-KR"></ElOption>
              <ElOption label="美国" value="en-US"></ElOption>
              <ElOption label="英国" value="en-GB"></ElOption>
              <ElOption label="荷兰" value="nl-NL"></ElOption>
              <ElOption label="德国" value="de-DE"></ElOption>
              <ElOption label="法国" value="fr-FR"></ElOption>
              <ElOption label="中国" value="zh-CN"></ElOption>

            </ElSelect>
          )
        }
      }
    }
  },
  {
    field: 'talk_title',
    label: t('tableDemo.title'),
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
      width: '240px'
    }
  },
  {
    field: 'talk_template',
    label: 'PC模板',
    search: {
      hidden: true
    },
    form: {
      component: 'Input'
    },
    detail: {
      span: 24
    },
    table: {
      width: '200px',
      slots: {
        default: ({ row }) => {
          return (
            <ElInput
              modelValue={row.talk_template}
              onInput={(newValue) => {
                const oldValue = row.talk_template
                row.talk_template = newValue
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_Ad_Url('update_ad_url_field', 'talk_template', row, oldValue)
                      done()
                    } else {
                      row.talk_template = oldValue
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
    field: 'mobile_template',
    label: '移动模板',
    search: {
      hidden: true
    },
    form: {
      component: 'Input'
    },
    detail: {
      span: 24
    },
    table: {
      width: '200px',
      slots: {
        default: ({ row }) => {
          return (
            <ElInput
              modelValue={row.mobile_template}
              onInput={(newValue) => {
                const oldValue = row.mobile_template
                row.mobile_template = newValue
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_Ad_Url('update_ad_url_field', 'mobile_template', row, oldValue)
                      done()
                    } else {
                      row.mobile_template = oldValue
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
    field: 'talk_template_B',
    label: '审核模板',
    search: {
      hidden: true
    },
    form: {
      component: 'Input'
    },
    detail: {
      span: 24
    },
    table: {
      width: '200px',
      slots: {
        default: ({ row }) => {
          return (
            <ElInput
              modelValue={row.talk_template_B}
              onInput={(newValue) => {
                const oldValue = row.talk_template_B
                row.talk_template_B = newValue
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_Ad_Url('update_ad_url_field', 'talk_template_B', row, oldValue)
                      done()
                    } else {
                      row.talk_template_B = oldValue
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
    field: 'talk_template_1',
    label: '模板1',
    search: {
      hidden: true
    },
    form: {
      component: 'Input'
    },
    detail: {
      span: 24
    },
    table: {
      width: '150px',
      hidden: true,
      slots: {
        default: ({ row }) => {
          return (
            <ElInput
              modelValue={row.talk_template_1}
              onInput={(newValue) => {
                const oldValue = row.talk_template_1
                row.talk_template_1 = newValue
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_Ad_Url('update_ad_url_field', 'talk_template_1', row, oldValue)
                      done()
                    } else {
                      row.talk_template_1 = oldValue
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
    field: 'talk_template_2',
    label: '模板2',
    search: {
      hidden: true
    },
    form: {
      component: 'Input'
    },
    detail: {
      span: 24
    },
    table: {
      width: '150px',
      hidden: true,
      slots: {
        default: ({ row }) => {
          return (
            <ElInput
              modelValue={row.talk_template_2}
              onInput={(newValue) => {
                const oldValue = row.talk_template_2
                row.talk_template_2 = newValue
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_Ad_Url('update_ad_url_field', 'talk_template_2', row, oldValue)
                      done()
                    } else {
                      row.talk_template_2 = oldValue
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
    field: 'talk_template_3',
    label: '模板3',
    hidden: true,
    search: {
      hidden: true
    },
    form: {
      component: 'Input'
    },
    detail: {
      span: 24
    },
    table: {
      width: '150px',
      slots: {
        default: ({ row }) => {
          return (
            <ElInput
              modelValue={row.talk_template_3}
              onInput={(newValue) => {
                const oldValue = row.talk_template_3
                row.talk_template_3 = newValue
                ElMessageBox({
                  title: '确认修改为:',
                  message: newValue,
                  showCancelButton: true,
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      instance.confirmButtonText = 'Loading...'
                      await update_Ad_Url('update_ad_url_field', 'talk_template_3', row, oldValue)
                      done()
                    } else {
                      row.talk_template_3 = oldValue
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
    field: 'talk_id',
    label: '链接名称1',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    table: {
      width: '220px',
      slots: {
        default: ({ row }) => {
          // talk_id
          return (
            row.app_link_res.map(item => {
              return <ElTag class="ml-2" type="info" size="large" onClick={async () => {
                edit_link_dialog.value = true
                formMobanData.value.edit_link_choose = [row.app_link_res[0].app_id]

                form.edit_link_choose = row.app_link_res.map((item: any) => item.app_id)
                // 选中当前行
                const elTableRef = await getElTableExpose()
                elTableRef?.clearSelection()
                const index = dataList.value.findIndex(obj => obj.talk_id === row.talk_id)
                elTableRef?.toggleRowSelection(dataList.value[index], true)
              }}>
                【{item.app_owner}】{item.app_nickname}
              </ElTag>
            })
          )
        }
      }
    }
  },
  // {
  //   field: 'talk_id',
  //   label: '链接名称',
  //   search: {
  //     hidden: true
  //   },
  //   form: {
  //     hidden: true
  //   },
  //   table: {
  //     width: '220px',
  //     slots: {
  //       default: ({ row }) => {
  //         // talk_id
  //         // console.log(row.app_name)
  //         return (
  //           row.app_name.split(',').map(item => {
  //             return <ElTag class="ml-2" type="info" size="large" onClick={async () => {
  //               edit_link_dialog.value = true
  //               form.edit_link_choose = row.talk_link.split('\n')
  //               const elTableRef = await getElTableExpose()
  //               elTableRef?.clearSelection()
  //               const index = dataList.value.findIndex(obj => obj.talk_id === row.talk_id)
  //               elTableRef?.toggleRowSelection(dataList.value[index], true)
  //             }}>
  //               {item}
  //             </ElTag>
  //           })
  //         )
  //       }
  //     }
  //   }
  // },
  {
    field: 'app_count_err',
    label: '有效性',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: '100px',
      align: 'center',
      slots: {
        default: (row: any) => {
          return (
            <>
              <ElTag type={row.row.app_count_err === null ? 'success' : 'danger'}>
                {row.row.app_count_err === null ? '正常' : row.row.app_count_err}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'ad_platform',
    label: '投放平台',
    form: {
      component: 'Select',
      componentProps: {
        style: {
          width: '100%'
        },
        options: PlatformList
      }
    },
    search: {
      component: 'Select',
      componentProps: {
        style: {
          width: '100px'
        },
        options: PlatformList,
      }
    },
    table: {
      width: '100px',
      align: 'center'
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'pixel_code',
    label: 'Code',
    search: {
      hidden: true
    },
    table: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 10,
      },
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'popin_mcv',
    label: 'mcv',
    search: {
      hidden: true
    },
    table: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 5,
      },
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'popin_cv',
    label: 'cv',
    search: {
      hidden: true
    },
    table: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 8,
      },
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  // {
  //   field: 'talk_click',
  //   label: '浏览',
  //   search: {
  //     hidden: true
  //   },
  //   table: {
  //     width: '70px'
  //   },
  //   form: {
  //     hidden: true
  //   }
  // },
  {
    fixed: 'right',
    field: 'action',
    width: '240px',
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
// 多选框初始值
const chooseFirstData = ref('')
// 多选框暂存值
const chooseData = ref('')

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
const status_bid_cap_loading = ref(false)
const form = reactive({
  talk_ids: '',
  app_link: '',
  edit_link_choose: []
})
const edit_link_data = ref([])

const edit_link_dialog_fn = async () => {
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()

  if (selections.length === 0) {
    ElMessage.error('请先选择数据')
    return
  }

  edit_link_dialog.value = true
}

const bat_edit_app_link = async () => {
  // 遍历dataList,收集要更新的uuid
  let talk_ids: any = []
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()

  if (!form.edit_link_choose.length) {
    ElMessage.error('请先选择数据')
    return
  }

  for (let i = 0; i < selections.length; i++) {
    //   把campaignId放进一个数组
    talk_ids.push(selections[i].talk_id)
  }
  // 如无数据则不执行
  if (talk_ids.length === 0) {
    ElMessage.error('请先选择数据')
    return
  }
  let formApp = {}
  formApp['talk_ids'] = talk_ids
  formApp['app_ids'] = form.edit_link_choose
  loading.value = true
  // console.log(formApp)
  let _res = await updateAppFieldApi({
    fn: 'bat_edit_app_link',
    row: formApp
  })
    .catch(() => {
    })
    .finally(() => {
      loading.value = false
      edit_link_dialog.value = false
      form.edit_link_choose = []

    })
  if (_res) {
    if (_res.code == '0') {
      ElMessage.success(_res.message)
      await getList()
    } else {
      ElMessage.error('操作失败:' + _res.message)
    }
  }
}


// const bat_edit_app_template_a = async () => {
//   // 遍历dataList,收集要更新的uuid
//   let talk_ids: any = []
//   const elTableRef = await getElTableExpose()
//   const selections = elTableRef?.getSelectionRows()

//   for (let i = 0; i < selections.length; i++) {
//     //   把campaignId放进一个数组
//     talk_ids.push(selections[i].talk_id)
//   }
//   // 如无数据则不执行
//   if (talk_ids.length === 0) {
//     ElMessage.error('请先选择数据')
//     return
//   }

//   ElMessageBox.prompt('确认修改主模板', 'Tip', {
//     confirmButtonText: 'OK',
//     cancelButtonText: 'Cancel',
//     inputPattern: /\.html/,
//   })
//     .then(async ({ value }) => {
//       let form = {}
//       form['talk_ids'] = talk_ids
//       form['talk_template'] = value
//       loading.value = true
//       let _res = await updateAppFieldApi({
//         fn: 'bat_edit_app_template_a',
//         row: form
//       })
//         .catch(() => {
//         })
//         .finally(() => {
//           loading.value = false
//         })
//       if (_res) {
//         if (_res.code == '0') {
//           await getList()
//         } else {
//           ElMessage.error('操作失败:' + _res.message)
//         }
//       }
//     })
//     .catch(() => { })
// }

// const bat_edit_app_mobile_template = async () => {
//   // 遍历dataList,收集要更新的uuid
//   let talk_ids: any = []
//   const elTableRef = await getElTableExpose()
//   const selections = elTableRef?.getSelectionRows()

//   for (let i = 0; i < selections.length; i++) {
//     //   把campaignId放进一个数组
//     talk_ids.push(selections[i].talk_id)
//   }
//   // 如无数据则不执行
//   if (talk_ids.length === 0) {
//     ElMessage.error('请先选择数据')
//     return
//   }

//   ElMessageBox.prompt('确认修改移动模板', 'Tip', {
//     confirmButtonText: 'OK',
//     cancelButtonText: 'Cancel',
//     inputPattern: /\.html/,
//   })
//     .then(async ({ value }) => {
//       let form = {}
//       form['talk_ids'] = talk_ids
//       form['mobile_template'] = value
//       loading.value = true
//       let _res = await updateAppFieldApi({
//         fn: 'bat_edit_app_mobile_template',
//         row: form
//       })
//         .catch(() => {
//         })
//         .finally(() => {
//           loading.value = false
//         })
//       if (_res) {
//         if (_res.code == '0') {
//           await getList()
//         } else {
//           ElMessage.error('操作失败:' + _res.message)
//         }
//       }
//     })
//     .catch(() => { })
// }

//更新一条的数据
const renewData = async (id) => {
  const res = await updateAdFieldApi({ talk_id: id, fn: 'ad_url_detail' })
  const forData = [...dataList.value]
  forData.forEach(item => {
    if (item.talk_id === id) {
      item = res.row
    }
  })
  dataList.value = forData
}





const delData = async (row: TableData | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.talk_id]
    : elTableExpose?.getSelectionRows().map((v: TableData) => v.talk_id) || []
  // delLoading.value = true

  await ElMessageBox({
    title: '确认删除？:',
    message: '删除后将无法恢复',
    showCancelButton: true,
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Loading...'
        let _payload = { "fn": "del_ad_url", "talk_ids": ids.value }
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
  if (type === 'edit' || 'detail') {
    renewData(row.talk_id)
  }
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)
// 更新封装
const update_Ad_Url = async (fn: string, field: string, row: object, oldValue: any) => {
  // 发送请求到服务器保存更改
  loading.value = true
  const res = await updateAdFieldApi({ fn: fn, field: field, row: row })
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
  // console.log('save')
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    delete formData.index
    const payload = { fn: actionType.value == 'edit' ? 'edit_ad' : 'add_ad', row: formData }
    saveLoading.value = true
    const res: any = await updateAdFieldApi(payload)
      .catch(() => { })
      .finally(() => {
        saveLoading.value = false
      })
    ElMessage.warning(res.message)
    if (res || res.code == 0) {
      saveLoading.value = false
      dialogVisible.value = false
      currentPage.value = 1
      getList()
    } else if (res.code == 1) {
      saveLoading.value = false
      dialogVisible.value = false
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


const rules = ref({
  talk_template: [{ message: '请输PC模版', trigger: 'blur' }, { pattern: /\.html$/, message: '请输入以 .html 结尾的移动模版', trigger: 'blur' }],
  mobile_template: [{ message: '请输入移动模版', trigger: 'blur' }, { pattern: /\.html$/, message: '请输入以 .html 结尾的移动模版', trigger: 'blur' }],
  talk_template_B: [{ message: '请输入审核模版', trigger: 'blur' }, { pattern: /\.html$/, message: '请输入以 .html 结尾的审核模版', trigger: 'blur' }]
});

const formMobanData = ref({
  edit_link_choose: [],
  talk_template: '',
  mobile_template: '',
  talk_template_B: '',
  talk_template_1: '',
  talk_template_2: '',
  talk_template_3: '',
})

const transferRef = ref(null); // 创建一个对 ElTransfer 组件的引用

const ruleFormRef = ref(null);

const submitForm = async () => {
  let talk_ids: any = []
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()

  for (let i = 0; i < selections.length; i++) {
    //   把campaignId放进一个数组
    talk_ids.push(selections[i].talk_id)
  }

  ruleFormRef.value.validate(async (valid) => {

    if (valid) {
      formMobanData.value.talk_ids = talk_ids
      // 在这里执行提交逻辑
      loading.value = true
      let _res = await updateAppFieldApi({
        fn: 'bat_edit_app_fields',
        row: formMobanData.value
      })
        .catch(() => {
        })
        .finally(() => {
          loading.value = false
        })
      if (_res) {
        if (_res.code == '0') {
          await getList()
          edit_link_dialog.value = false
          formMobanData.value = {
            edit_link_choose: [],
            talk_template: '',
            mobile_template: '',
            talk_template_B: ''
          }
          // transferRef.value.clearQuery('left'); // 调用 clearQuery 方法清除查询条件

        } else {
          ElMessage.error('操作失败:' + _res.message)
        }
      }
    } else {
      console.log('表单验证失败');
    }
  });
};

const handcloseDialog = () => {
  formMobanData.value = {
    edit_link_choose: [],
    talk_template: '',
    mobile_template: '',
    talk_template_B: ''
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
      <!-- <ElButton :loading="delLoading" type="warning" @click="bat_edit_app_template_a">批量主模板</ElButton> -->
      <!-- <ElButton :loading="delLoading" type="warning" @click="bat_edit_app_mobile_template">批量移动模板</ElButton> -->
      <ElButton :loading="delLoading" type="warning" @click="edit_link_dialog_fn">批量修改数据</ElButton>
      <ElTag type="success" style="margin-left: 20px"> 勾选了{{ titleSetle.length }}条数据 </ElTag>
    </div>

    <Table v-model:pageSize="pageSize" v-model:currentPage="currentPage" :columns="allSchemas.tableColumns"
      :data="dataList" :loading="loading" :pagination="{
        total: total
      }" @register="tableRegister" @selection-change="handleSelectionChange" />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" maxHeight="750px">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema"
      :current-row="currentRow" />

    <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" :current-row="currentRow" />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ actionType === 'add' ? '添加' : actionType === 'edit' ? '编辑' : '复制' }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>

  <ElDialog v-model="edit_link_dialog" draggable title="批量修改数据" width="1200px" @close="handcloseDialog">
    <ElForm :model="formMobanData" :rules="rules" ref="ruleFormRef">
      <ElFormItem prop="edit_link_choose">
        <ElTransfer v-model="formMobanData.edit_link_choose" :data="edit_link_data" :filterable="true"
          ref="transferRef" />
      </ElFormItem>
      <ElFormItem prop="talk_template" style="">
        <span style="width: 60px">主模版</span>
        <ElInput v-model="formMobanData.talk_template" style="width: 240px" placeholder="请输入主模版" />
        <span style="width: 60px; padding: 0 5px 0 10px">移动模版</span>
        <ElInput v-model="formMobanData.mobile_template" style="width: 240px" placeholder="请输入主模版" />
        <span style="width: 60px; padding: 0 5px 0 10px">审核模版</span>
        <ElInput v-model="formMobanData.talk_template_B" style="width: 240px" placeholder="请输入审核模版" />
      </ElFormItem>
      <ElFormItem prop="talk_template" style="">
        <span style="width: 60px">模版1</span>
        <ElInput v-model="formMobanData.talk_template_1" style="width: 240px" placeholder="请输入模版1" />
      </ElFormItem>
      <ElFormItem prop="talk_template" style="">
        <span style="width: 60px">模版1</span>
        <ElInput v-model="formMobanData.talk_template_2" style="width: 240px" placeholder="请输入模版1" />
      </ElFormItem>
      <ElFormItem prop="talk_template" style="">
        <span style="width: 60px">模版1</span>
        <ElInput v-model="formMobanData.talk_template_3" style="width: 240px" placeholder="请输入模版1" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="submitForm"> 提交 </ElButton>
        <!-- <ElButton> Cancel </ElButton> -->
      </ElFormItem>
    </ElForm>
  </ElDialog>
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