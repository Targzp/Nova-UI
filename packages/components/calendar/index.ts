import { withInstall } from '@nova-ui/utils/with-install'
import _Calendar from './src/calendar.vue'

const Calendar = withInstall(_Calendar)

export { Calendar }
export default Calendar

export type { CalendarProps, CalendarEmits } from './src/calendar'

declare module 'vue' {
  export interface GlobalComponents {
    NvCalendar: typeof Calendar
  }
}
