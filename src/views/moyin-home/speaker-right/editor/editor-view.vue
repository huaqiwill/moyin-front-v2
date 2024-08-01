<template>
  <div
    ref="boxRef"
    class="ssml-editor-root editor-view"
    @click="handleClick"
    style="width: 100%; height: 100%"
  >
    <div class="editor-box">
      <div class="d-flex justify-content-between">
        <EditorBar></EditorBar>

        <a-dropdown v-if="isLogin" trigger="hover">
          <div class="login-in d-flex flex-row me-2">
            <img
              src="https://peiyinshenqi-1254161078.cos.ap-shanghai.myqcloud.com/avatar/mFcMn2"
              alt=""
            />
            <div class="ms-1">
              <div class="">
                <span>也不凡</span>
                <!-- <el-tag class="ms-1">包终生VIP</el-tag> -->
              </div>
              <!-- <div class="mt-1">到期时间：永久</div> -->
            </div>
          </div>
          <template #content>
            <!-- <a-doption @click="handleAccount">我的账户</a-doption> -->
            <!-- <a-doption>绑定手机号 15576364885</a-doption> -->
            <!-- <a-doption @click="handleLayout">布局管理</a-doption> -->
            <a-doption @click="handleLogout" style="padding: 0 66px">退出登录</a-doption>
          </template>
        </a-dropdown>
        <div class="d-flex align-items-center me-2" v-else>
          <a-button type="primary" @click="handleLogin">登录</a-button>
        </div>
      </div>
      <div class="editor-core-container pt-1">
        <EditorCore @change="handleChange" @created="handleCreated"></EditorCore>
        <slot name="sidebar"></slot>
      </div>
      <slot name="footer">
        <DubbingFooter />
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-in {
  align-items: center;
  padding: 0 10px;
  margin: 10px 0;
  img {
    width: 44px;
    height: 44px;
    display: block;
    line-height: 44px;
  }
  &:hover {
    box-shadow: 0 10px 30px 0 rgba(12, 43, 66, 0.1);
  }
}

.editor-view {
  background-color: var(--tool-bg-color);
  width: 100%;
  height: 100%;

  .editor-box {
    background-color: var(--tool-bg-grey-color);
    width: 100%;
    height: calc(100% - 60px);

    .editor-core-container {
      margin: 0 auto;
      width: 100%;
      background-color: #fff;
      padding: 5px 0 5px 0;
      height: calc(100% - 75px);
      display: flex;
    }
  }

  .dubbing-footer {
    height: 50px;
    background-color: #f4f6f7;
  }
}
</style>

<script setup lang="ts">
import { DubbingFooter } from '@/components'
import EditorCore from './editor-core.vue'
import EditorBar from './editor-bar.vue'
import { type IDomEditor } from '@wangeditor/editor'
import { emitter } from '@/event-bus'
import { ref, provide, onMounted, onUnmounted, toRaw } from 'vue'
import { type PartialSSMLEditorConfig, setConfig } from '@/config'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useDubbingStore } from '@/stores'
import { useUserStore } from '@/stores'
import { ElMessageBox } from 'element-plus'
import { getToken } from '@/utils/auth'

const userStore = useUserStore()
const userInfo = userStore.getUserInfo()
const isLogin = ref(false)
const router = useRouter()
const dubbingStore = useDubbingStore()
const boxRef = ref<HTMLDivElement>()
const props = withDefaults(
  defineProps<{ config?: PartialSSMLEditorConfig; editorKey?: symbol }>(),
  {
    editorKey: () => Symbol('editorKey'),
  },
)
setConfig(props.editorKey, toRaw(props.config))
console.log('editorKey', props.editorKey)
dubbingStore.setGlobaleEditorKey(props.editorKey)

// 设置拖拽容器盒子,如果想要在整个页面可拖拽,将boxRef换为ref(document.body)即可
provide('dragContainerBox', boxRef)
provide('editorKey', props.editorKey)

const emit = defineEmits<{ created: [editor: IDomEditor]; change: [editor: IDomEditor] }>()

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)

  console.log('用户信息：', userInfo.value)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

function handleCreated(editor: IDomEditor) {
  emit('created', editor)
}

function handleChange(editor: IDomEditor) {
  emit('change', editor)
  let count = editor.getText().length || 0
  emitter.emit('editor:change:count', count)
}

function handleClick(ev: MouseEvent) {
  emitter.emit('view-click', ev)
}

function handleKeyDown(ev: KeyboardEvent) {
  emitter.emit('view-keydown', ev)
}

function handleLogin() {
  router.push({
    name: 'login',
  })
}

onMounted(() => {
  if (getToken()) {
    isLogin.value = true
  }
})

const handleAccount = () => {
  // router.push({
  //   name: "profile",
  // });
  ElMessage({
    message: '暂不需要',
  })
}
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userStore.logout()
    isLogin.value = false
  })
}

const handleLayout = () => {
  ElMessage({
    message: '暂不需要',
  })
}
</script>
