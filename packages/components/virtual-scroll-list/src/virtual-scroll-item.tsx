import { defineComponent, onMounted, onUpdated, ref } from 'vue'
import { virtualItemProps } from './virtual-scroll-list-prop'

export default defineComponent({
  name: 'NvVirtualScrollItem',
  props: virtualItemProps,
  emits: ['itemResize'],
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null)

    const dispatchEvent = () => {
      console.log('offsetHeight: ', root.value?.offsetHeight);

      emit('itemResize', props.uniqueKey, root.value?.offsetHeight)
    }

    onMounted(dispatchEvent)

    onUpdated(dispatchEvent)

    return () => {
      const { component: Comp, source, uniqueKey } = props
      return (
        Comp && (
          <div key={uniqueKey} ref={root}>
            <Comp source={source}></Comp>
          </div>
        )
      )
    }
  }
})
