import {
  RangeOptions,
  UpdateFuncType,
  VirtualOptions
} from './virtual-scroll-list-prop'

const enum CALC_TYPE {
  INIT = 'INIT',
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC'
}

export const initVirtual = (param: VirtualOptions, update: UpdateFuncType) => {
  let offsetValue = 0 // 没有滚动前的偏移量

  let calcType = CALC_TYPE.INIT
  let firstRangeAvg = 0
  let fixedSizeVal = 0 // 默认值是 0
  const sizes = new Map<string | number, number>()

  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0
  }

  function isFixed() {
    return calcType === CALC_TYPE.FIXED
  }

  function getEsitimateSize() {
    if (isFixed()) {
      return fixedSizeVal
    } else {
      return firstRangeAvg || param.estimateSize
    }
  }

  function getIndexOffset(idx: number) {
    if (!idx) {
      return 0
    }
    let offset = 0
    for (let i = 0; i < idx; i++) {
      const size = sizes.get(param.uniqueIds[i])
      if (typeof size === 'number') {
        offset += size
      } else {
        offset += getEsitimateSize()
      }
    }
    return offset
  }

  function getPadFront() {
    // 准确计算上偏移量
    if (isFixed()) {
      return getEsitimateSize() * range.start
    } else {
      // 将滚动后的元素累加一边，计算上高度
      return getIndexOffset(range.start)
    }
  }

  function getPadBehind() {
    const lastIndex = param.uniqueIds.length - 1
    return (lastIndex - range.end) * getEsitimateSize()
  }

  function updateRange(start: number, end: number) {
    range.start = start
    range.end = end
    range.padFront = getPadFront()
    range.padBehind = getPadBehind()
    update({ ...range })
  }

  function checkRange(start: number, end: number) {
    const total = param.uniqueIds.length // 数据总量
    const keeps = param.keeps
    if (total < keeps) {
      start = 0
      end = total - 1
    } else if (end - start < keeps - 1) {
      // 比如 start 90 end 100 只有十条数据，前面需要补齐数据到30条
      start = end - keeps + 1
    }
    updateRange(start, end)
  }

  function getEndByStart(start: number) {
    const computedEnd = start + param.keeps - 1
    const end = Math.min(computedEnd, param.uniqueIds.length - 1)
    return end
  }

  function getScrollOvers() {
    // 根据划过的偏移量 / 每项的高度，就是划过的个数

    // getEsitimateSize() 这个值是预估的，我们要精确的找到滚动了多少个
    if (isFixed()) {
      return Math.floor(offsetValue / getEsitimateSize())
    } else {
      // 获取最接近的滚动的那一项，计算每一项的偏移量，看与哪一项最接近
      // [10,30,50,200,900,1200] -> 1300 二分查找
      let low = 0
      let high = param.uniqueIds.length
      let middle = 0
      let middleOffset = 0
      while (low <= high) {
        middle = low + Math.floor((high - low) / 2)
        middleOffset = getIndexOffset(middle)
        if (middleOffset === offsetValue) {
          return middle
        } else if (middleOffset < offsetValue) {
          low = middle + 1
        } else if (middleOffset > offsetValue) {
          high = middle - 1
        }
      }
      return low > 0 ? --low : 0
    }
  }

  function handleFront() {
    // 核心就是向上滑动要不要更新 start
    // 获取划过了多少个
    const overs = getScrollOvers()
    console.log('overs: ', overs)
    console.log('range.start: ', range.start)

    if (overs > range.start) {
      // 如果划过多少个大于范围开始值，则代表上面还有可显示的数据，无需更新范围
      // 如果小于，则需要更新范围了
      // 相当于向上的缓冲区
      return
    }
    // 同样需要减 buffer 生成缓冲区
    const start = Math.max(overs - param.buffer, 0)
    checkRange(start, getEndByStart(start))
  }

  function handleBehind() {
    // 获取划过了多少个
    const overs = getScrollOvers()
    console.log('overs: ', overs)
    console.log('range.start: ', range.start)

    if (overs < range.start + param.buffer) {
      // 向下加载的时候，看一下是否在缓存区中
      // 超出缓冲区，就需要更新范围
      return
    }
    checkRange(overs, getEndByStart(overs))
  }

  function handleScroll(offset: number) {
    // 先看一下向上滚动，还是向下滚动
    const direction = offset < offsetValue ? 'FRONT' : 'BEHIND'
    offsetValue = offset
    if (direction === 'FRONT') {
      handleFront()
    } else if (direction === 'BEHIND') {
      handleBehind()
    }
  }

  function saveSize(id: string | number, size: number) {
    sizes.set(id, size)
    if (calcType === CALC_TYPE.INIT) {
      // 第一个元素加载完毕后默认认为是固定高度
      fixedSizeVal = size
      calcType = CALC_TYPE.FIXED
    } else if (calcType === CALC_TYPE.FIXED && fixedSizeVal !== size) {
      calcType = CALC_TYPE.DYNAMIC
      fixedSizeVal = 0 // 默认采用 editimateSize
    }
    // 尽可能不要采用 estimateSize 来进行操作
    // 有固定高度 动态高度

    if (calcType === CALC_TYPE.DYNAMIC) {
      // 根据已经加载的数据算一个平均值 来撑高滚动条
      // 根据当前展示的数据 来计算滚动条的值
      if (sizes.size < Math.min(param.keeps, param.uniqueIds.length)) {
        firstRangeAvg = Math.round(
          [...sizes.values()].reduce((acc, val) => acc + val, 0) / sizes.size
        )
      }
    }
  }

  checkRange(0, param.keeps - 1)

  return {
    handleScroll,
    saveSize
  }
}

// 总结
// 1. 固定高度的上 padding 可以利用：开始范围前面的个数 * 每项的高度
// 2. 下 padding 可以利用：总个数 - 当前显示到的个数 * 每项的高度

// 动态高度（默认要先计算一下滚动条大致多高，根据已经加载的数据尽可能的预估一个滚动条）
// 1. 上 padding（默认会记录每一项的高度），根据当前的 start 来累计 start 之前的每一项的高度
// 3. 下 padding 用：总个数 - 当前显示到的个数 * 预估的高度

// 当前开始滚动，固定高度可以直接采用 偏移量 / 每项的高度来计算要展现的开始
// 动态的开始位置，需要采用二分查找找到已经加载的哪一项的偏移量和当前的最接近，找到后返回当前的开始