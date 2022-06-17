<template>
  <div ref="wrapRef"></div>
</template>
<script lang="ts">
import type { Ref } from 'vue'
import {
  defineComponent,
  ref,
  unref,
  nextTick,
  computed,
  watch,
  onBeforeUnmount,
  onDeactivated,
} from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { useLocale } from '/@/locales/useLocale'
import { useModalContext } from '../../Modal'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated'

type Lang = 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' | undefined

export default defineComponent({
  name: 'MarkDown',
  inheritAttrs: false,
  props: {
    height: { type: String, default: 'calc(100vh - 80px)' },
    value: { type: String, default: '' },
  },
  emits: ['change', 'get', 'update:value'],
  setup(props, { attrs, emit }) {
    const wrapRef = ref<ElRef>(null)
    const vditorRef = ref(null) as Ref<Nullable<Vditor>>
    const initedRef = ref(false)

    const modalFn = useModalContext()

    const { getLocale } = useLocale()
    const { getDarkMode } = useRootSetting()
    const valueRef = ref(props.value || '')

    watch(
      [() => getDarkMode.value, () => initedRef.value],
      ([val, inited]) => {
        if (!inited) {
          return
        }
        const theme = val === 'dark' ? 'dark' : 'classic'
        instance.getVditor()?.setTheme(theme)
        if (theme === 'dark') {
          instance.getVditor()?.setTheme('dark', 'vue-dark')
        } else {
          instance.getVditor()?.setTheme('classic', 'vue')
        }
      },
      {
        immediate: true,
        flush: 'post',
      }
    )

    watch(
      () => props.value,
      (v) => {
        if (v !== valueRef.value) {
          instance.getVditor()?.setValue(v)
        }
        valueRef.value = v
      }
    )

    const getCurrentLang = computed((): 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' => {
      let lang: Lang
      switch (unref(getLocale)) {
        case 'en':
          lang = 'en_US'
          break
        case 'ja':
          lang = 'ja_JP'
          break
        case 'ko':
          lang = 'ko_KR'
          break
        default:
          lang = 'zh_CN'
      }
      return lang
    })
    function init() {
      const wrapEl = unref(wrapRef) as HTMLElement
      if (!wrapEl) return
      const bindValue = { ...attrs, ...props }
      const insEditor = new Vditor(wrapEl, {
        theme: getDarkMode.value === 'dark' ? 'dark' : 'classic',
        lang: unref(getCurrentLang),
        mode: 'ir',
        typewriterMode: true,
        fullscreen: {
          index: 800,
        },
        preview: {
          // actions: [],
          maxWidth: 1700,
          theme: {
            current: 'vue',
            list: { vue: 'vue', 'vue-dark': 'vue-dark' },
            path: 'https://cdn.jsdelivr.net/gh/Caval1er/vditor-theme@0.8',
          },
          hljs: {
            enable: true,
            lineNumber: true,
            style: 'solarized-dark256',
          },
          markdown: {
            toc: true,
          },
        },
        counter: {
          enable: true,
          type: 'markdown',
        },
        outline: {
          enable: true,
          position: 'left',
        },
        input: (v) => {
          valueRef.value = v
          emit('update:value', v)
          emit('change', v)
        },
        after: () => {
          nextTick(() => {
            modalFn?.redoModalHeight?.()
            insEditor.setValue(valueRef.value)
            vditorRef.value = insEditor
            initedRef.value = true
            emit('get', instance)
          })
        },
        blur: () => {
          //unref(vditorRef)?.setValue(props.value);
        },
        ...bindValue,
        cache: {
          enable: false,
        },
      })
    }

    const instance = {
      getVditor: (): Vditor => vditorRef.value!,
    }

    function destroy() {
      const vditorInstance = unref(vditorRef)
      if (!vditorInstance) return
      try {
        vditorInstance?.destroy?.()
      } catch (error) {}
      vditorRef.value = null
      initedRef.value = false
    }

    onMountedOrActivated(init)

    onBeforeUnmount(destroy)
    onDeactivated(destroy)
    return {
      wrapRef,
      ...instance,
    }
  },
})
</script>
