<template>
  <el-dialog v-model="model" title="配音员详情" draggable overflow>
    <!-- 信息 -->
    <div class="d-flex flex-wrap">
      <div v-if="info.headerImage" class="header-image">
        <img :src="info.headerImage" alt="" />
      </div>
      <div class="ms-2">
        <div class="" style="font-size: 18px" v-if="info.name">{{ info.name }}</div>
        <div class="mt-1" v-if="info.behavior">{{ info.behavior }}</div>
      </div>
    </div>
    <!-- 领域 -->
    <div class="mt-2 d-flex gap-2">
      <div
        class="mt-1 d-flex flex-column align-items-center"
        v-for="(item, index) in domainSet"
        :key="index"
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <!-- 情绪 -->
    <div class="d-flex flex-wrap">
      <div class="mt-1 d-flex flex-column align-items-center emotion-set">
        <img :src="info.headerImage" alt="" syule="width:40px;height:40px;" />
        <div>默认</div>
      </div>
      <div
        class="mt-1 d-flex flex-column align-items-center emotion-set"
        v-for="(item, index) in emotionSet"
        :key="index"
        @click="onEmotionSelect(item)"
      >
        <img :src="item.imageUrl" alt="" syule="width:40px;height:40px;" />
        <div>{{ item.emotionName }}</div>
      </div>
    </div>
    <div class="mt-1">
      <div>配音师详情</div>
    </div>
    <!-- 语速、语调 -->
    <div class="mt-3">
      语速 {{ speed }} px
      <a-slider v-model="speed" class="mt-2" :min="0" :max="2" :step="0.05" />
    </div>
    <div class="mt-3">
      语调 {{ intonation }}
      <a-slider v-model="intonation" class="mt-2" :min="-10" :max="10" :step="0.2" />
    </div>
    <template #footer>
      <a-button @click="handleOk" type="primary">确定</a-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  defineModel,
  defineProps,
  onMounted,
  onUpdated,
  ref,
  onBeforeUpdate,
  onBeforeMount,
} from "vue";
import { useDubbingStore } from "@/stores";
import { storeToRefs } from "pinia";

const dubbingStore = useDubbingStore();
const {
  speakerEmotionList,
  domainList,
  globalSpeaker,
  globalSpeed,
  globalIntonation,
} = storeToRefs(dubbingStore);

/**
 * 用来控制dialog是否显示
 */
const model = defineModel({
  type: Boolean,
  required: true,
});

/**
 * 传递配音员信息
 */
const props = defineProps({
  info: {
    type: Object,
  },
});

/**
 *
 */
const speakerEmotionCacheVOList = ref([]);
/**
 * 情绪列表
 */
const emotionSet = ref([]);
/**
 * 领域列表
 */
const domainSet = ref([]);
/**
 * 语速
 */
const speed = ref(1);
/**
 * 语调
 */
const intonation = ref(0);

onBeforeUpdate(async () => {
  if (model.value) {
    console.log("得到的参数3", props.info);

    speakerEmotionCacheVOList.value = props.info?.speakerEmotionCacheVOList || [];
    // await dubbingStore.getSpeakerEmotionList();
    // await dubbingStore.getStoreSearchCriteria();

    const emotionNameSet = props.info?.emotionSet || [];
    emotionSet.value = speakerEmotionList.value.filter((emotion) =>
      emotionNameSet.includes(emotion.emotion)
    );

    const domainIdSet = props.info.domainIdSet || [];
    domainSet.value = domainList.value.filter((domain) =>
      domainIdSet.includes(domain.value)
    );
    console.log("领域集合", domainIdSet, domainList.value, domainSet.value);
  }
});

const handleOk = () => {
  model.value = false;
  globalSpeaker.value = props.info;
  globalSpeed.value = speed.value;
  globalIntonation.value = intonation.value;
  console.log(globalSpeaker.value, globalSpeed.value, globalIntonation.value);
};

const onEmotionSelect = (item) => {
  let speaker = props.info.name + "|" + item.emotionName;
  let speakerEmotionCacheVOList = props.info.speakerEmotionCacheVOList;

  // 从情绪列表中筛选出符合条件的数据
  let speakerInfoList = speakerEmotionCacheVOList.filter(
    (speakerEmotion) => speakerEmotion.name == speaker
  );

  // 如果筛选的数据为空
  if (speakerInfoList.length == 0) {
    return;
  }

  // 播放数据
  let speakerInfo = speakerInfoList[0];

  console.log(speakerInfo);
  const audio = new Audio(speakerInfo.demoUrl);
  audio.play();
};
</script>

<style lang="scss" scoped>
.header-image {
  width: 40px;
  height: 40px;
  background-color: red;
  img {
    width: 100%;
    height: 100%;
  }
}

.emotion-set {
  img {
    width: 40px;
    height: 40px;
  }
}
</style>
