<template>
  <div
    :class="[
      bem.b(),
      bem.is('selected', isSelected),
      bem.is('disabled', node.disabled)
    ]"
  >
    <div
      :class="bem.e('content')"
      :style="{ paddingLeft: `${node.level * 16}px` }"
    >
      <span
        :class="[bem.e('icons'), bem.is('leaf', node.isLeaf)]"
        @click="handleExpand"
      >
        <NvIcon size="25">
          <Switcher
            v-if="!isLoading"
            :class="[
              bem.e('expand-icon'),
              { expanded: expanded && !node.isLeaf }
            ]"
          />
          <Loading v-else />
        </NvIcon>
      </span>
      <NvCheckbox
        v-if="showCheckbox"
        :model-value="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="handleCheckChange"
      />
      <div :class="bem.e('label')" @click="handleSelected">
        <NvTreeNodeContent :node="node" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Loading, Switcher } from '@nova-ui/components/internal-icon'
import NvIcon from '@nova-ui/components/icon'
import { createNamespace } from '@nova-ui/utils/create'
import { treeNodeEmitts, treeNodeProps } from './tree'
import NvTreeNodeContent from './tree-node-content'
import NvCheckbox from '@nova-ui/components/checkbox'

const bem = createNamespace('tree-node')

const props = defineProps(treeNodeProps)

const emit = defineEmits(treeNodeEmitts)

const handleExpand = () => {
  emit('toggle', props.node)
}

const isLoading = computed(() => {
  return !!props.loadingKeys?.has(props.node.key)
})

const isSelected = computed(() => {
  return !!props.selectedKeys?.includes(props.node.key)
})

const handleSelected = () => {
  if (props.node.disabled) {
    return
  }
  emit('select', props.node)
}

const handleCheckChange = (val: boolean) => {
  emit('check', props.node, val)
}
</script>

<style lang="scss" scoped></style>
