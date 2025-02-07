<template>
  <div :class="bem.b()">
    <div :class="bem.e('header')">
      <div :class="bem.e('title')">{{ currentDate }}</div>
      <div :class="bem.e('button-group')">
        <nv-button @click="selectDate('prev-year')"> 前一年 </nv-button>
        <nv-button @click="selectDate('prev-month')"> 上个月 </nv-button>
        <nv-button @click="selectDate('today')"> 今天 </nv-button>
        <nv-button @click="selectDate('next-month')"> 下个月 </nv-button>
        <nv-button @click="selectDate('next-year')"> 下一年 </nv-button>
      </div>
    </div>
    <div :class="bem.e('body')">
      <table :class="tableBem.b()" cellpadding="0">
        <thead>
          <tr>
            <th v-for="day in weekDays" :key="day">
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rid) in rows" :key="rid">
            <td
              v-for="(cell, cid) in row"
              :key="cid"
              :class="[dayBem.b(), getCellCalss(cell)]"
              @click="handlePick(cell)"
            >
              <slot name="date-cell" :data="getSlotData(cell)">
                {{ cell.text }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@nova-ui/utils/create'
import {
  CalendarDateCell,
  CalendarDateCellType,
  CalendarDateType,
  calendarEmits,
  calendarProps
} from './calendar'
import NvButton from '@nova-ui/components/button'
import dayjs, { Dayjs } from 'dayjs'
import { computed, ref } from 'vue'

const bem = createNamespace('calendar')
const tableBem = createNamespace('calendar-table')
const dayBem = createNamespace('calendar-day')

const props = defineProps(calendarProps)

const emit = defineEmits(calendarEmits)

defineOptions({
  name: 'nv-calendar'
})

const currentDate = computed(() => {
  return `${date.value.year()}年${
    date.value.month() + 1
  }月${date.value.date()}日`
})

const selectDay = ref<Dayjs>() // 用于标示当前用户选择的是哪一个

const getCellCalss = ({ text, type }: CalendarDateCell) => {
  const classList: string[] = [type]
  const date = formatter(text, type)
  if (date.isSame(selectDay.value, 'day')) {
    // 如果选中的日期和当前循环的日期相同，就表示选中了
    classList.push(dayBem.is('selected', true))
  }
  if (date.isSame(now, 'day')) {
    classList.push(dayBem.is('today', true))
  }
  return classList
}

const getSlotData = ({ text, type }: CalendarDateCell) => {
  const date = formatter(text, type)
  return {
    isSelected: date.isSame(selectDay.value, 'day'),
    day: date.format('YYYY-MM-DD'),
    date: date.toDate(),
    type
  }
}

const now = dayjs() // 当前日期
const date = computed(() => {
  if (!props.modelValue) {
    return now
  } else {
    return dayjs(props.modelValue)
  }
})

const firstOfWeek =
  dayjs().startOf('week').day() === 0 ? 7 : dayjs().startOf('week').day()

// 表头部分
const weekMaping = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
]
const weekDays = computed(() => {
  return [...weekMaping.slice(firstOfWeek), ...weekMaping.slice(0, firstOfWeek)]
})

// 面板部分
const rows = computed(() => {
  // 根据用户提供的日期 计算出 42 个来
  // 1.获取本月的第一天是星期几
  let list: CalendarDateCell[] = []
  const firstDay =
    date.value.startOf('month').day() === 0
      ? 7
      : date.value.startOf('month').day()
  const lastDay = date.value.subtract(1, 'month').endOf('month').date()
  const count = Math.abs(firstDay - firstOfWeek) // 前面需要补多少天
  const prevMonthDays: CalendarDateCell[] = Array.from({ length: count })
    .map((_, index) => {
      return lastDay - (count - index - 1)
    })
    .map(day => ({
      text: day,
      type: 'prev'
    }))
  const days = date.value.daysInMonth() // 获取当前月有多少天
  const currentMonthDays: CalendarDateCell[] = Array.from({ length: days }).map(
    (_, index) => {
      return {
        text: index + 1,
        type: 'current'
      }
    }
  )
  list = [...prevMonthDays, ...currentMonthDays]
  const remaining = 42 - list.length
  const nextMonthDays: CalendarDateCell[] = Array.from({
    length: remaining
  }).map((_, index) => ({
    text: index + 1,
    type: 'next'
  }))
  list = [...list, ...nextMonthDays]
  return Array.from({ length: 6 }).map((_, index) => {
    const start = index * 7
    return list.slice(start, start + 7)
  })
})

const prevMonthDay = computed(() => date.value.subtract(1, 'month').date(1))
const nextMonthDay = computed(() => date.value.add(1, 'month').date(1))
const prevYearDay = computed(() => date.value.subtract(1, 'year').date(1))
const nextYearDay = computed(() => date.value.add(1, 'year').date(1))

const pickDay = (day: Dayjs) => {
  selectDay.value = day // 选中保存
  emit('update:modelValue', day.toDate())
}

const selectDate = (type: CalendarDateType) => {
  // 采用策略来优化
  const dateMap: Record<CalendarDateType, Dayjs> = {
    'prev-year': prevYearDay.value,
    'prev-month': prevMonthDay.value,
    today: now,
    'next-month': nextMonthDay.value,
    'next-year': nextYearDay.value
  }
  const day = dateMap[type] // 找到日期
  pickDay(day)
}

const formatter = (text: number, type: CalendarDateCellType): Dayjs => {
  switch (type) {
    case 'prev':
      return date.value.startOf('month').subtract(1, 'month').date(text)
    case 'next':
      return date.value.startOf('month').add(1, 'month').date(text)
    case 'current':
      return date.value.date(text)
  }
}

const handlePick = ({ text, type }: CalendarDateCell) => {
  // 获取 text 和 type 获取日期来更新 date
  const day = formatter(text, type)
  pickDay(day)
}
</script>
