<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { ElButton, ElMessage, ElInput, ElIcon, ElUpload, ElResult, ElCol, ElRow, ElImage, ElFormItem, ElSelect, ElOption, ElCheckbox } from "element-plus";
import { ref, onMounted, reactive } from 'vue'
import { PostPopinApi } from '@/api/table'

// accountCurrency
interface accountDemo {
    accountCurrency: string;
    id: number;
    name: string;
}

const popinData = ref<accountDemo[]>([]);

interface imgBaseDataDictDemo {
    img: string;
    checkPass: boolean;
    asset_names: string;
}

const imgBaseData = ref<imgBaseDataDictDemo[]>([]);


interface CampaignPayload {
    accountId: string; // 账户ID
    campaign_name: string; // 活动名称
    brandName: string; // 品牌名称
    landing_page: string; // 落地页地址
    spend_mode: string; // 投放速度 int 0: 加速 1: 均速
    daily_cap: number; // 每日预算
    cpa: number; // cpa
    region: string; // 投放国家
}

const ruleForm = reactive<CampaignPayload>({
    accountId: "",
    brandName: "하나증권 주식회사",
    landing_page: "",
    campaign_name: '活动名1',
    spend_mode: "0",
    daily_cap: 205,
    cpa: 15,
    region: 'KR'
})

const memoryData = ref([])

onMounted(async () => {
    try {
        const res: any = await PostPopinApi({ fn: 'get_campaigns' });
        if (res.code == 1) {
            ElMessage.error('获取数据失败');
        } else {
            // 在数组开头插入初始值
            popinData.value = [
                ...res.data.detail.map(item => ({
                    name: item.accountName,
                    id: item.accountId + '|' + item.accountCurrency
                }))
            ];
            popinData.value = popinData.value.filter(item => {
                return !item.id.includes('undefined');
            });
            memoryData.value = popinData.value.map(item => ({
                name: item.name,
                id: item.id,
                landing_page: ''
            }));


        }
    } catch (error) {
        console.error('获取数据失败:', error);
        ElMessage.error('获取数据失败');
    }
});



const dialogVisible = ref(false)
const AddAction = () => {
    if (ruleForm.accountId) {
        dialogVisible.value = true
        upIndex.value = 999
    } else {
        ElMessage.warning('请选择KR活动')
    }
}

const beforeUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('Avatar picture must be either JPG or PNG format!');
        return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!');
        return false;
    }
    return true;
};

const httpRequest = (data: any) => {
    const fileReader = new FileReader();
    const file = data.file;
    fileReader.readAsDataURL(file);
    fileReader.onloadend = function () {
        uploadFileToServer(file)
        // console.log(file)
        // let payload = { image: file }
        // let res = PostPopinApi(payload)
        // console.log(res)
    };
}


const uploadFileToServer = (fileData) => {
    const formData = new FormData();

    formData.append('fn', 'upload_popin_image');
    formData.append('image', fileData);
    formData.append('accountId', ruleForm.accountId)
    // 执行上传文件到服务器的操作，例如使用 fetch 或者 axios 发送 POST 请求
    fetch('/popin_api', {
        method: 'POST',
        body: formData,
        // headers: {
        //     'Authorization': 'Basic MTU2MDpZV05qYjNWdWRGOHlOalE1TVY5VWNtbDFiWEJvSUZSb1pYSnRZV3hmUzFJOjY1OQ=='
        // }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 将响应转换为 JSON 格式
        })
        .then(data => {
            if (data.img == '' || data.img == null) {
                return;
            }
            // 在这里处理 JSON 数据
            if (upIndex.value != 999) {

                imgBaseData.value[upIndex.value] = { img: data.img, checkPass: true, asset_names: imgBaseData.value[upIndex.value]?.asset_names }

            } else {
                imgBaseData.value.push({ img: data.img, checkPass: true, asset_names: '' });

            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


const clearAds = () => {
    imgBaseData.value.forEach(item => {
        item.checkPass = false;
    });
};


const activeUP = async () => {
    // 检查各个字段是否填写完整
    if (ruleForm.accountId == '') {
        ElMessage.warning('请选择账户');
        return;
    }
    if (ruleForm.campaign_name == '') {
        ElMessage.warning('请填写活动名称');
        return;
    }
    if (ruleForm.landing_page == '') {
        ElMessage.warning('请填写落地页');
        return;
    }
    if (ruleForm.brandName == '') {
        ElMessage.warning('请填写品牌名称');
        return;
    }
    if (ruleForm.daily_cap == 0) {
        ElMessage.warning('请填写日预算');
        return;
    }

    const upData = imgBaseData.value.filter(item => item.checkPass);

    if (upData.length == 0) {
        ElMessage.warning('请选择要上传的素材');
        return;
    }

    upData.forEach(item => {

        if (item.asset_names === '') {
            ElMessage.error('素材的标题不能为空');
            return;
        }
    });
    if (!ruleForm.landing_page.includes('https')) {
        ruleForm.landing_page = 'https://' + ruleForm.landing_page
    }
    // 开始提交数据
    let payload = {
        ...ruleForm,
        fn: 'add_campaigns',
        imgBaseData: upData
    }

    const res: any = await PostPopinApi(payload);
    console.log(res)
    if (res.code == 0) {
        payload.imgBaseData.forEach(item1 => {
            imgBaseData.value.forEach(item2 => {
                if (item1.img == item2.img) {
                    item1.checkPass = false;
                }
            });
        })

        memoryData.value.forEach((item, index) => {
            if (payload.accountId == item.id) {
                memoryData.value[index].landing_page = payload.landing_page
            }
        })
        console.log(memoryData.value);

        ElMessage.success('请求成功:' + res.message);
    } else {
        ElMessage.error('请求失败:' + res.message);
    }
};

const changeZT = (data) => {
    console.log(data);
    imgBaseData.value.forEach(element => {
        if (element.img == data.img) {
            element.checkPass = !element.checkPass
        }
    });
}


let ending: Item | null = null;
let dragging: Item | null = null;
// 拖拽开始时触发的事件
const handleDragStart = (e: DragEvent, item: Item) => {
    dragging = item;
};
// 拖拽结束时触发的事件
const handleDragEnd = (e: DragEvent, item: Item) => {
    if (ending && ending.img === dragging?.img) {
        return;
    }

    const newItems = [...imgBaseData.value];
    const src = newItems.indexOf(dragging!);
    const dst = newItems.indexOf(ending!);

    const ocld = newItems[src]

    newItems.splice(src, 1);
    newItems.splice(dst, 0, ocld);


    imgBaseData.value = newItems;
    dragging = null; //被拖拽元素
    ending = null; //目标元素
};
// 拖拽过程中在目标元素上移动时触发的事件
const handleDragOver = (e: DragEvent, item: Item) => {
    e.dataTransfer!.dropEffect = 'move';
};
// 拖拽进入目标元素时触发的事件
const handleDragEnter = (e: DragEvent, item: Item) => {
    e.dataTransfer!.effectAllowed = 'move';
    ending = item;
};

const upIndex = ref(999); // 或者其他有效的索引值

const handlereple = (index) => {
    upIndex.value = index

}

const handleDel = (data) => {
    console.log(data);
    imgBaseData.value.forEach((item, index) => {
        if (item.img == data.img) {
            imgBaseData.value.splice(index, 1);
        }
    });
}

const handlechange = (data) => {
    console.log(data);
    imgBaseData.value.forEach((item, index) => {
        if (item.img == data.img) {
            imgBaseData.value[index].checkPass = true;
        }
    });
};

const handChanfe = () => {
    memoryData.value.forEach((item) => {
        if (item.id == ruleForm.accountId) {
            ruleForm.landing_page = item.landing_page
        }
    })


}

</script>

<template>
    <div ref="fixedContainer" class="fixed-container fixed">
        <ContentWrap>
            <div class="mb-10px">
                <ElButton type="primary" @click="AddAction">{{ '批量上传素材' }}</ElButton>
                <ElSelect class="m-2" placeholder="Select" style="width: 190px" v-model="ruleForm.accountId"
                    @change="handChanfe">
                    <ElOption v-for="item in popinData" :key="item.id" :label="item.name" :value="item.id" />
                </ElSelect>
                <span class="ml-3 w-18 text-[#8e9698ff] inline-flex items-center">活动名称</span>
                <ElInput placeholder="2025/A/B/C" style="width: 260px" v-model="ruleForm.campaign_name"></ElInput>
                <span class="ml-3 w-12 text-[#8e9698ff] inline-flex items-center">落地页</span>
                <ElInput placeholder="https://" style="width: 240px;margin-left: 20px;" v-model="ruleForm.landing_page">
                </ElInput>
                <span class="ml-3 w-8 text-[#8e9698ff] inline-flex items-center">品牌</span>
                <ElInput placeholder="请输入品牌名" style="width: 190px;margin-left: 20px;" v-model="ruleForm.brandName">
                </ElInput>
                <ElSelect class="m-2" placeholder="投放速度" style="width: 70px" v-model="ruleForm.spend_mode">
                    <ElOption label="加速" value="0" />
                    <ElOption label="均速" value="1" />
                </ElSelect>
                <span class="ml-3 w-12 text-[#8e9698ff] inline-flex items-center">日预算</span>
                <ElInput placeholder="每天预算" style="width: 60px;margin-left: 10px;" v-model="ruleForm.daily_cap">
                </ElInput>
                <span class="ml-3 w-4 text-[#8e9698ff] inline-flex items-center">CPA</span>
                <ElInput placeholder="CPA" style="width: 40px;margin-left: 20px;" v-model="ruleForm.cpa"></ElInput>
                <ElSelect class="m-2" placeholder="投放国家" style="width: 80px" v-model="ruleForm.region">
                    <ElOption label="韩国" value="KR" />
                    <ElOption label="日本" value="JP" />
                    <ElOption label="台湾" value="TW" />
                </ElSelect>
                <ElButton type="primary" style="margin-left: 20px;" @click="activeUP()">{{ '提交' }}</ElButton>
                <ElButton type="warning" style="margin-left: 20px;" @click="clearAds()">反选素材</ElButton>
            </div>
        </ContentWrap>
    </div>

    <!-- 打开模态框 -->
    <Dialog v-model="dialogVisible" title="批量上传素材">
        <ElUpload class="upload-demo" drag multiple :action="'#'" :before-upload="beforeUpload"
            :http-request="httpRequest">
            <ElIcon class=" el-icon--upload"><upload-filled /></ElIcon>
            <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    jpg/png files with a size less than 500kb
                </div>
            </template>
        </ElUpload>
    </Dialog>
    <ContentWrap style="margin-top: 30px;">
        <div class="mb-10px mt-30px">
            <ElRow :gutter="20">
                <ElCol :span="4" v-for="(item, index) in imgBaseData" :key="item.img">
                    <ElResult sub-title="Sorry, request error" draggable="true"
                        @dragstart="handleDragStart($event, item)" @dragover.prevent="handleDragOver($event, item)"
                        @dragenter="handleDragEnter($event, item)" @dragend="handleDragEnd($event, item)">

                        <template #icon>
                            <ElImage :src="item.img" style="height: 200px;" @click="changeZT(imgBaseData[index])" />
                        </template>

                        <template #sub-title>
                            <ElRow>
                                <ElCol :span="12">
                                    <ElUpload class="upload-demo" :action="'#'" :before-upload="beforeUpload"
                                        :http-request="httpRequest" :show-file-list="false">
                                        <template #trigger>
                                            <ElButton type="primary" @click="handlereple(index)">替换图片</ElButton>
                                        </template>
                                    </ElUpload>
                                </ElCol>
                                <ElCol :span="12">
                                    <ElButton type="danger" @click="handleDel(item)">
                                        删除
                                    </ElButton>
                                </ElCol>
                            </ElRow>

                            <ElCheckbox v-model="imgBaseData[index].checkPass" label="是否上传" size="large" border
                                style="margin-top: 20px;" />
                            <ElFormItem label="标题" style="margin-top: 20px;">
                                <ElInput v-model="imgBaseData[index].asset_names" :style="{ width: '100%' }" :rows="4"
                                    type="textarea" @change="handlechange(item)" />
                            </ElFormItem>
                        </template>
                    </ElResult>

                </ElCol>


            </ElRow>

        </div>
    </ContentWrap>
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

::v-deep(.el-image__inner) {
    height: 200px;
}
</style>

<style scoped>
.fixed-container {
    width: 100%;
    transition: top 0.3s ease-in-out;
    /* 添加过渡效果 */
}

.fixed {
    position: sticky;
    top: 0;
    z-index: 999;
    /* 设置一个合适的 z-index */
}
</style>