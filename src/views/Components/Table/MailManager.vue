<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ref } from 'vue'
import { ElButton, ElInput, ElMessage, ElTag } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { apiPost } from '@/api/request'


const createNewEmail = async () => {
  // 邮件格式正确
  let data = {
    fn : 'add_email_user',
  }
  apiPost('/BT/', data).then((res) => {
      if(res.data['status'] == true){
        ElMessage.success('成功：' + res.data['email'])
        InputValue.value = res.data['email']
      } else {
        ElMessage.warning('失败：' + res.data['message'])
      }
    }).catch((error) => {
      ElMessage.error('网络错误：' + error)
    })
}

// 创建函数，检查email是否正确
const CheckEmail = (_mail = '') => {
  // 邮件格式验证的正则表达式
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // 使用正则表达式进行验证
  return emailRegex.test(_mail)
}

const getEmail = async () => {
  let email = InputValue.value
  // 使用正则表达式进行验证
  if (CheckEmail(email)) {
    // 邮件格式正确
    let data = {
      fn : 'get_mails',
      email : email,
    }
    apiPost('/BT/', data).then((res) => {
      if(res.data['status'] == true){
        tags.value =  res.data['message']
        ElMessage.success('获取到新邮件')
      } else {
        tags.value =  res.data['message']
        ElMessage.warning('' + res.data['message'])
      }
    }).catch((error) => {
      ElMessage.error('网络错误：' + error)
    })
  }
}
const getHotmailEmail = async () => {
  hotmail_tags.value = []
  let user = hotmail_adr_pass.value
  // 使用正则表达式进行验证
  if (user.indexOf('hotmail') >= 0) {
    // 邮件格式正确
    let data = {
      fn : 'get_hotmail',
      user : user,
    }
    apiPost('/api/', data).then((res) => {
      if(res.data['status'] == true){
        hotmail_tags.value =  res.data['message']
        ElMessage.success('获取到新邮件')
      } else {
        hotmail_tags.value =  res.data['message']
      }
    }).catch((error) => {
      ElMessage.error('网络错误：' + error)
    })
  }
}

const hotmail_adr_pass = ref('')
const InputValue = ref('')
const add = useIcon({ icon: 'tdesign:add' })
const search = useIcon({ icon: 'tdesign:search' })
const tags = ref(['无'])
const hotmail_tags = ref(['无'])
</script>

<template>
  <ContentWrap title="内部邮箱" message="查询或生成新的邮箱">
    <el-input class="t_class" v-model="InputValue" @change="tags = []" placeholder="请输入邮箱地址">
      <template #append>
        <el-button @click="getEmail" :icon="search" />
      </template>
    </el-input>
    <ElButton @click="createNewEmail" :icon="add" type="warning">生成新的邮件地址</ElButton>
    <ElButton @click="InputValue=''">清空</ElButton>
  </ContentWrap>
  <ContentWrap style="margin-top: 2px" v-if="CheckEmail(InputValue)" title="内部新邮件" message="">
    <ElTag
        v-for="tag in tags"
        :key="tag"
        class="mx-3"
        size="large"
        type="success"
    >
      {{ tag }}
    </ElTag>
  </ContentWrap>
  <ContentWrap style="margin-top: 20px" title="hotmail邮件读取" message="读取hotmail最新邮件">
    <el-input class="t_class" v-model="hotmail_adr_pass" @change="hotmail_tags = []" placeholder="abc@hotmail.com|123456">
      <template #append>
        <el-button @click="getHotmailEmail" :icon="search" />
      </template>
    </el-input>
  </ContentWrap>
  <ContentWrap style="margin-top: 2px" v-if="hotmail_adr_pass.indexOf('hotmail') >= 0" title="hotmail" message="">
    <ElTag
        v-for="tag in hotmail_tags"
        :key="tag"
        class="mx-3"
        size="large"
        type="danger"
    >
      {{ tag }}
    </ElTag>
  </ContentWrap>
</template>

<style lang="less" scoped>
.t_class {
  height: 35px;
  margin: 0 10px 0 10px;
  width: 400px;
}
</style>
