<script setup lang="tsx">
import { reactive, ref, watch } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElLink, ElMessage, ElInput, ElImage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi, getTestRoleApi, getAdminRoleApi } from '@/api/login'
import { useStorage } from '@/hooks/web/useStorage'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { Icon } from '@/components/Icon'
import { onMounted } from 'vue'

onMounted(() => {
  getCode()
})

const getCode = async () => {
  const res = await loginApi()
  document.querySelector('.imgUrl').src = res.image_url
  captchaKey.value = res.key
}

const { required } = useValidator()

const emit = defineEmits(['to-register'])

const appStore = useAppStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { setStorage } = useStorage()

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()]
}
const captchaValue = ref('')
const captchaKey = ref('')

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.login')}</h2>
        }
      }
    }
  },
  {
    field: 'username',
    label: t('login.username'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'captchaValue',
    label: '验证码',
    value: '',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElInput v-model={captchaValue.value} placeholder='请输入验证码' style="max-width: 300px;width:100%" />
                <img style="width: 100px; height: 40px;margin-left:10px" src="" class="imgUrl" onClick={getCode} />
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" />
                <ElLink type="primary" underline={false}>
                  {t('login.forgetPassword')}
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <ElButton loading={loading.value} type="primary" class="w-[100%]" onClick={signIn}>
                  {t('login.login')}
                </ElButton>
              </div>
              <div class="w-[100%] mt-15px">
                <ElButton class="w-[100%]" onClick={toRegister}>
                  {t('login.register')}
                </ElButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'other',
    component: 'Divider',
    label: t('login.otherLogin'),
    componentProps: {
      contentPosition: 'center'
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between w-[100%]">
                <Icon
                  icon="ant-design:github-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:wechat-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:alipay-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
                <Icon
                  icon="ant-design:weibo-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const iconSize = 30

const remember = ref(false)

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const loading = ref(false)

const iconColor = '#999'

const hoverColor = 'var(--el-color-primary)'

const redirect = ref<string>('')


watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

import { login } from '@/api/login'
import { TokenStore } from '@/store/modules/login'
const store = TokenStore()

// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<UserType>()
      const data = { ...formData, act: 'cx', captchaKey: captchaKey.value, captchaValue: captchaValue.value }
      try {
        const res: any = await login(data)
        if (res.code === 0) {
          store.token = res.token
          setStorage(appStore.getUserInfo, res)
          // 是否使用动态路由
          if (appStore.getDynamicRouter) {
            getRole()
          } else {
            await permissionStore.generateRoutes('static').catch(() => { })
            permissionStore.getAddRouters.forEach((route) => {
              addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })
            permissionStore.setIsAddRouters(true)
            push({ path: redirect.value || permissionStore.addRouters[0].path })
          }
        } else {
          getCode()
          captchaValue.valu = ''
          ElMessage.error(res.message);
          return
        }
      } finally {
        getCode()
        captchaValue.valu = ''
        loading.value = false
      }
    }
  })
}

// 获取角色信息
const getRole = async () => {
  const formData = await getFormData<UserType>()
  const params = {
    roleName: formData.username
  }
  const res =
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await getAdminRoleApi(params)
      : await getTestRoleApi(params)
  if (res) {
    const routers = res.data || []
    setStorage('roleRouters', routers)
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await permissionStore.generateRoutes('server', routers).catch(() => { })
      : await permissionStore.generateRoutes('frontEnd', routers).catch(() => { })

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}

console.log(appStore.getDynamicRouter, appStore.getServerDynamicRouter)

// 去注册页面
const toRegister = () => {
  emit('to-register')
}

</script>

<template>
  <Form :schema="schema" :rules="rules" label-position="top" hide-required-asterisk size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)" @register="formRegister" />
</template>
