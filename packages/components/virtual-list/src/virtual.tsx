import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { virtualProps } from './virtual-prop'
import { createNamespace } from '@nova-ui/utils/create'

export default defineComponent({
  name: 'NvVirtualList',
  props: virtualProps,
  setup(props, { slots }) {
    const bem = createNamespace('vl')

    const wrapperRef = ref<HTMLElement>()
    const barRef = ref<HTMLElement>()
    const state = reactive({
      // 计算显示的区域
      start: 0,
      end: props.remain
    })

    const prev = computed(() => {
      return Math.min(state.start, props.remain)
    })
    const next = computed(() => {
      return Math.min(props.remain, props.items.length - state.end)
    })

    // 这里应该多展示 上 8 条 和 下 8 条，保证用户在快速滚动的时候，不会白屏
    const visibleData = computed(() => {
      return props.items.slice(state.start - prev.value, state.end + next.value)
    })

    const offset = ref(0)

    const handleScroll = () => {
      // 根据当前滚动的距离，计算过去了几个数据
      const scrollTop = wrapperRef.value!.scrollTop
      state.start = Math.floor(scrollTop / props.size) // 滚上去了多少个
      state.end = state.start + props.remain
      // 多展示的前 8 个会重新算，start 后计算的部分中超过 remain 的部分，需往下偏移
      offset.value = state.start * props.size - props.size * prev.value // 偏移量
    }

    const initWrapper = () => {
      wrapperRef.value!.style.height = `${props.remain * props.size}px`
      barRef.value!.style.height = `${props.items.length * props.size}px`
    }

    watch(() => props.items, initWrapper)
    onMounted(initWrapper)
    return () => {
      return (
        <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
          {/* 模拟总长度 */}
          <div class={bem.e('scroll-bar')} ref={barRef}></div>
          {/* 更新列表从哪显示到哪里，一直只展示 8 条数据 */}
          <div
            class={bem.e('scroll-list')}
            style={{ transform: `translate3d(0, ${offset.value}px, 0)` }}
          >
            {visibleData.value.map(node => {
              return slots.default!({ node })
            })}
          </div>
        </div>
      )
    }
  }
})
