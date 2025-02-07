<template>
  <div :class="bem.b()">
    <NvVirtualList :items="flattenTree">
      <template #default="{ node }">
        <NvTreeNode
          :key="node.key"
          :node="node"
          :expanded="isExpanded(node)"
          :loading-keys="loadingKeysRef"
          :selected-keys="selectKeysRef"
          :show-checkbox="showCheckbox"
          :checked="isChecked(node)"
          :disabled="isDisabled(node)"
          :indeterminate="isIndeterminate(node)"
          @toggle="toggleExpand"
          @select="handleSelect"
          @check="handleCheck"
        />
      </template>
    </NvVirtualList>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, provide, ref, useSlots, watch } from 'vue'
import {
  TreeNode,
  TreeOption,
  treeProps,
  Key,
  treeEmitts,
  treeInjectKey
} from './tree'
import { createNamespace } from '@nova-ui/utils/create'
import NvTreeNode from './treeNode.vue'
import NvVirtualList from '@nova-ui/components/virtual-list'

provide(treeInjectKey, {
  slots: useSlots()
})

const bem = createNamespace('tree')

defineOptions({
  name: 'nv-tree'
})

const props = defineProps(treeProps)

const emit = defineEmits(treeEmitts)

// 有了 props 要对用户的数据进行格式化，格式化一个固定的结果

//  我们将 props.data 格式化后放到 tree 中
const tree = ref<TreeNode[]>([])

const allTreeMap = ref<Map<Key, TreeNode>>(new Map())

// 1) 用户来获取对应字段
const createOptions = (key: string, label: string, children: string) => {
  return {
    getKey(node: TreeOption) {
      return node[key] as string // 用户获得的 key
    },
    getLabel(node: TreeOption) {
      return node[label] as string // 用户传递 label
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[] // 用户传递的 children
    }
  }
}

const treeOptions = createOptions(
  props.keyField,
  props.labelField,
  props.childrenField
)

// 2) 将用户传递的数据进行格式化操作
const createTree = (data: TreeOption[], parent?: TreeNode) => {
  function traversal(data: TreeOption[], parent?: TreeNode) {
    return data.map(node => {
      const children = treeOptions.getChildren(node) || []
      const treeNode: TreeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        children: [], // 默认为空
        rawNode: node,
        level: parent ? parent.level + 1 : 0,
        parentKey: parent?.key,
        // 判断节点是否自带 isLeaf，如果自带了，以自带的为准，如果没有自带的则看一下有没有 children 属性
        isLeaf: node.isLeaf ?? children.length === 0,
        disabled: !!node.disabled
      }
      allTreeMap.value.set(treeNode.key, treeNode)

      if (children.length) {
        // 有孩子再去递归，将其格式化成 TreeNode 类型
        treeNode.children = traversal(children, treeNode)
      }
      return treeNode
    })
  }
  const res: TreeNode[] = traversal(data, parent)

  return res
}

// 需要展开的 key 有哪些
const expandedKeySet = ref(new Set(props.defaultExpandedKeys))

// 3) 将树拍平 这里需要依赖当前展开的节点，动态计算
const flattenTree = computed(() => {
  const expandedKeys = expandedKeySet.value // 要展开的 keys 有哪些
  const flattenNodes: TreeNode[] = [] // 这个就是拍平后的结果

  const nodes = tree.value || [] // 被格式化后的节点

  const stack: TreeNode[] = [] // 用于遍历树的栈

  for (let i = nodes.length - 1; i >= 0; --i) {
    stack.push(nodes[i])
  }

  // 深度遍历
  while (stack.length) {
    const node = stack.pop()
    if (!node) continue
    flattenNodes.push(node)
    if (expandedKeys.has(node.key)) {
      const children = node.children
      if (children) {
        for (let i = children.length - 1; i >= 0; --i) {
          stack.push(children[i])
        }
      }
    }
  }
  return flattenNodes
})

const isExpanded = (node: TreeNode): boolean => {
  return expandedKeySet.value.has(node.key)
}

// 折叠
const collapse = (node: TreeNode) => {
  expandedKeySet.value.delete(node.key)
}

const loadingKeysRef = ref(new Set<Key>())

const triggerLoading = (node: TreeNode) => {
  // 这个节点需要异步加载
  if (!node.children.length && !node.isLeaf) {
    // 如果没有加载过这个节点 就加载这个节点
    if (!loadingKeysRef.value.has(node.key)) {
      loadingKeysRef.value.add(node.key)
      if (props.onLoad) {
        props.onLoad(node.rawNode).then(children => {
          // 修改原来的节点
          node.rawNode.children = children
          // 更新自定义的 node
          node.children = createTree(children, node)
          loadingKeysRef.value.delete(node.key)
        })
      }
    }
  }
}

// 展开
const expand = (node: TreeNode) => {
  expandedKeySet.value.add(node.key)

  // 这里应该实现对应的加载逻辑
  triggerLoading(node)
}

// 点击展开/折叠
// 4) 让用户点击展开
const toggleExpand = (node: TreeNode) => {
  const expandKeys = expandedKeySet.value
  // 如果当前这个节点 正在加载中 不能收起
  if (expandKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collapse(node)
  } else {
    expand(node)
  }
}

// 5) 实现选中节点
const selectKeysRef = ref<Key[]>([])

watch(
  () => props.selectedKeys,
  value => {
    if (value) {
      selectKeysRef.value = value
    }
  },
  {
    immediate: true
  }
)

// 处理选中的节点
const handleSelect = (node: TreeNode) => {
  let keys = Array.from(selectKeysRef.value)
  // 如果不能选择什么都不用做了
  if (!props.selectable) {
    return
  }
  if (props.multiple) {
    const index = keys.findIndex(key => key === node.key)
    if (index > -1) {
      keys.splice(index, 1)
    } else {
      keys.push(node.key)
    }
  } else {
    if (keys.includes(node.key)) {
      keys = []
    } else {
      keys = [node.key]
    }
  }
  emit('update:selectedKeys', keys)
}

const checkedKeysRefs = ref(new Set(props.defaultCheckedKeys))

const isChecked = (node: TreeNode) => {
  return checkedKeysRefs.value.has(node.key)
}

const isDisabled = (node: TreeNode) => {
  return !!node.disabled
}

const indeterminateRefs = ref<Set<Key>>(new Set())

const isIndeterminate = (node: TreeNode) => {
  return indeterminateRefs.value.has(node.key)
}

const findNode = (key: Key) => {
  return allTreeMap.value.get(key)
}

// 自上而下选中
const toggle = (node: TreeNode, checked: boolean) => {
  const checkedKeys = checkedKeysRefs.value
  if (checked) {
    // 选中的时候去掉半选状态
    indeterminateRefs.value.delete(node.key)
  }
  // 维护当前的 key 列表
  checkedKeys[checked ? 'add' : 'delete'](node.key)

  if (node.children) {
    node.children.forEach(child => {
      if (!child.disabled) {
        toggleCheck(child, checked)
      }
    })
  }
}

// 自下而上的更新
const updateCheckedKeys = (node: TreeNode) => {
  if (node.parentKey) {
    const parentNode = findNode(node.parentKey)
    if (parentNode) {
      let allChecked = true // 默认儿子应该全选
      let hasChecked = false // 儿子有没有被选中
      const nodes = parentNode.children
      for (const node of nodes) {
        if (checkedKeysRefs.value.has(node.key)) {
          hasChecked = true
        } else if (indeterminateRefs.value.has(node.key)) {
          allChecked = false
          hasChecked = true
        } else {
          allChecked = false
        }
      }
      if (allChecked) {
        checkedKeysRefs.value.add(parentNode.key)
        indeterminateRefs.value.delete(parentNode.key)
      } else if (hasChecked) {
        indeterminateRefs.value.add(parentNode.key)
        checkedKeysRefs.value.delete(parentNode.key)
      } else {
        indeterminateRefs.value.delete(parentNode.key)
      }
      updateCheckedKeys(parentNode)
    }
  }
}

const toggleCheck = (node: TreeNode, checked: boolean) => {
  toggle(node, checked)
}

const handleCheck = (node: TreeNode, checked: boolean) => {
  toggle(node, checked)
  updateCheckedKeys(node)
}

const initCheck = () => {
  new Set([...checkedKeysRefs.value]).forEach(key => {
    const node = findNode(key)!
    if (!node) return
    toggleCheck(node, true)
    updateCheckedKeys(node)
  })
}

// 监控数据变化，调用格式化方法
watch(
  () => props.data,
  (data: TreeOption[]) => {
    tree.value = createTree(data)
  },
  {
    immediate: true
  }
)

onMounted(() => {
  initCheck()
})
</script>

<style lang="scss" scoped></style>
