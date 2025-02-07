import { defineComponent, onBeforeMount, ref } from 'vue'
import {
  RangeOptions,
  virtualScrollListProps
} from './virtual-scroll-list-prop'
import { initVirtual } from './utils'
import NvVirtualScrollItem from './virtual-scroll-item'

export default defineComponent({
  name: 'NvVirtualScrollList',
  props: virtualScrollListProps,
  setup(props, { slots }) {
    const range = ref<RangeOptions | null>(null)

    const update = (newRange: RangeOptions) => {
      range.value = newRange
    }

    const getUniqueIdFromDataSources = (): string[] => {
      const { dataSources, dataKey } = props

      return dataSources.map(dataSource => {
        return dataSource[dataKey] as string
      })
    }

    let virtual: ReturnType<typeof initVirtual>
    const installVirtual = () => {
      // 初始化逻辑
      virtual = initVirtual(
        {
          keeps: props.keeps,
          buffer: Math.round(props.keeps / 3),
          uniqueIds: getUniqueIdFromDataSources(),
          estimateSize: props.estimateSize
        },
        update
      )
    }

    onBeforeMount(() => {
      installVirtual()
    })

    const onItemResize = (id: string | number, size: number) => {
      console.log('id: ', id)
      console.log('size: ', size)
      virtual.saveSize(id, size)
    }

    const genRenderComponent = () => {
      const slots = []
      const { start, end } = range.value!
      const { dataSources, dataComponent, dataKey } = props
      for (let index = start; index < end; index++) {
        const dataSource = dataSources[index]
        const uniqueKey = dataSource[dataKey] as string
        if (dataSource) {
          slots.push(
            <NvVirtualScrollItem
              uniqueKey={uniqueKey}
              source={dataSource}
              component={dataComponent}
              onItemResize={onItemResize}
            ></NvVirtualScrollItem>
            // <dataComponent key={uniqueKey} source={dataSource}></dataComponent>
          )
        }
      }
      return slots
    }

    const root = ref<HTMLElement | null>()
    const onscroll = () => {
      if (root.value) {
        const offset = root.value.scrollTop
        virtual.handleScroll(offset)
      }
    }

    return () => {
      // 默认情况下我们希望显示30条数据，其它的要用“空白”来代替 -> 给内层盒子一个非常高的高度 + translate 来实现
      // 用上下 padding 来撑开
      // 需要先定义一下数据的显示范围，还有上 padding 和 下 padding 的一个大小
      const { padFront, padBehind } = range.value!
      // 后期可考虑横向还是纵向的
      const paddingStyle = {
        padding: `${padFront}px 0 ${padBehind}px`
      }
      return (
        <div onScroll={onscroll} ref={root}>
          <div style={paddingStyle}>{genRenderComponent()}</div>
        </div>
      )
    }
  }
})
