<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ref } from 'vue'
import {ElButton, ElInput, ElForm, ElFormItem, ElMessage} from 'element-plus'
import { TOTP } from 'otpauth'
import {useIcon} from "@/hooks/web/useIcon";

const secret = ref({secret: '', digits: 6, period: 30})
const otp = ref({v: '', time: 0})
const getOTP = () => {
  if(secret.value.secret == '') return
  try {
    let otp_obj = new TOTP(secret.value);
    otp.value.v = otp_obj.generate();
    otp.value.time = 30 - Math.floor((Date.now() / 1000) % 30);
  } catch (e) {
    otp.value.v = 'ERROR'
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(otp.value.v).then(() => {
    ElMessage.success('验证码已复制到剪贴板')
  });
}
const copy = useIcon({ icon: 'tdesign:copy' })
setInterval(getOTP, 1000);
</script>

<template>
  <ContentWrap title="2FA密钥转换" message="">
    <ElForm ref="form" label-width="120px">
      <ElFormItem label="原始密钥">
        <ElInput v-model="secret.secret"></ElInput>
      </ElFormItem>
      <ElFormItem label="密钥长度" class="txt_200with">
        <ElInput v-model="secret.digits"></ElInput>
      </ElFormItem>
      <ElFormItem label="有效时间" class="txt_200with">
        <ElInput v-model="secret.period"></ElInput>
      </ElFormItem>
      <ElFormItem v-if="secret.secret.length > 0" label="验证码">
        <ElInput v-model="otp.v" readonly class="txt_150with">
          <template #append>
            <ElButton :icon="copy" @click="copyToClipboard" />
          </template>
        </ElInput>
        <ElButton class="btn1">剩余 {{ otp.time }} 秒</ElButton>
       </ElFormItem>
    </ElForm>
  </ContentWrap>
</template>

<style lang="less" scoped>
.t_class {
  height: 35px;
  margin: 0 10px 0 10px;
  width: 400px;
}
.v_style {
  width: 200px;
}
.txt_500with {
  width: 400px;
}
.txt_200with {
  width: 200px;
}
.txt_150with {
  width: 150px;
}
.btn1 {
  margin: 0 0 0 4px;
}
</style>
