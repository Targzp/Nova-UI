import { onMounted, onUnmounted, Ref } from 'vue'

export const useClickOutside = (
  element: Ref<HTMLElement | undefined>,
  callback: (e: MouseEvent) => void
) => {
  const handler = (e: MouseEvent) => {
    if (element.value && e.target) {
      if (!element.value.contains(e.target as HTMLElement)) {
        callback(e)
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handler)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}
