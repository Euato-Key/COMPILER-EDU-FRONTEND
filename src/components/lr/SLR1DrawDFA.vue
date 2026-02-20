<script setup lang="ts">
import { ref, type PropType, type Ref, computed, watch } from 'vue';
import type { SLR1DataDfaType } from '@/types/slr1';
import { VueFlow, Handle, Position, useVueFlow, MarkerType, type NodeChange } from "@vue-flow/core"
import { Background } from '@vue-flow/background'
import { useSLR1StoreNew } from '@/stores'
const { onConnect, addEdges, addNodes, onNodeClick, onEdgeClick, findNode, findEdge, getNodes, getEdges,
  onNodesChange, onEdgesChange, applyNodeChanges, applyEdgeChanges, updateEdge, onEdgeUpdate, onPaneReady, setViewport, removeNodes } = useVueFlow()

import customEdge from '@/components/lr/custom-edge.vue';
import customNode from '@/components/lr/custom-node.vue';
import ModalDialog from '@/components/shared/ModalDialog.vue';

const slr1Store = useSLR1StoreNew()

const props = defineProps({
  check_DFA: {
    type: Array as PropType<SLR1DataDfaType[]>,
    required: true
  },
  savedNodes: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  savedEdges: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  savedDfaState: {
    type: Object as PropType<{
      addNodeLimit: number
      addNodeRemainCnt: number
      forEachEpochAllNum: number
      checkRightItems: string[]
      checkRightGotos: string[]
      checkRightLocalNode: string[]
      checkRightLocalEdge: string[]
      nodeIdMapItemId: Record<string, string>
      edgeIdMapGotosId: Record<string, string>
      nextStepOpen: boolean[]
    } | null>,
    default: null
  },
})

const answerItems = ref<SLR1DataDfaType[]>([])
// 检查数据是否存在
const hasValidData = computed(() => {
  return props.check_DFA && Array.isArray(props.check_DFA) && props.check_DFA.length > 0
})

// 只在有有效数据时才拷贝
if (hasValidData.value) {
  answerItems.value = props.check_DFA.slice() // 深拷贝，拷贝到该组件中
}
console.log('SLR1DrawDFA - check_DFA:', props.check_DFA)
console.log('SLR1DrawDFA - answerItems:', answerItems.value)

let checkRight_Items: string[] = [] //  close表：已经check Right的Answer_item的id
let checkRIght_Gotos: string[] = [] //  close表：已经check RIght的Answer_Gotos的连线（item_id + gotoV + next_id）
const answerItem_totalNum = computed(() => { // answer DFA 中 Item 的 的总个数
  return answerItems.value.length
})
const answerGotos_totalNum = computed(() => { // answer DFA 中 goto连线的 的总个数
  let cnt = 0;
  answerItems.value.forEach(item => cnt += Object.keys(item.next_ids).length)
  return cnt;
})
let checkRight_local_node: string[] = [] // close表： 已经check Right过的 本地 local_node
let checkRight_local_edge: string[] = [] // close表：已经check Right过的 本地 local_edge。
let everyEpooch_Items: Set<string> = new Set()
let addNodeLimit = 0 // 每轮可添加的item（node）数量
const addNode_remainCnt = ref(addNodeLimit)
let forEachEpoch_AllNum = 0
let NodeMatchRight_cnt = 0
let nodeId_Map_ItemId = {}
let edgeId_Map_GotosId = {}
const next_step_open: Ref<boolean[]> = ref([false, false])
let showAnswer_cnt = 3
const emit = defineEmits(["open_step4", "validate-complete"])

// 弹窗状态
const modalVisible = ref(false)
const modalConfig = ref({
  type: 'info' as 'success' | 'error' | 'warning' | 'info' | 'confirm',
  title: '',
  message: '',
  details: '',
  showCancel: false
})

// 显示弹窗函数
const showModal = (type: 'success' | 'error' | 'warning' | 'info' | 'confirm', title: string, message: string, details?: string, showCancel = false) => {
  modalConfig.value = { type, title, message, details: details || '', showCancel }
  modalVisible.value = true
}

// 关闭弹窗函数
const closeModal = () => {
  modalVisible.value = false
}

watch(next_step_open.value, (newValue: boolean[]) => {
  if (newValue.every(item => item === true)) {
    emit('open_step4')
    if (showAnswer_cnt <= 1) return

    showModal('success', 'DFA构造成功', '恭喜！您的DFA构造完全正确！', '所有项目集和转移关系都已正确验证。')
    for (const node of getNodes.value) { // 确保不能删除node，但能拖动 dragable
      node.selectable = false
    }
    for (const edge of getEdges.value) { // 确保不能删除edge，但能拖动 dragable
      edge.selectable = false
    }
  }
})

// 初始化节点 - 如果有数据则使用数据，否则使用空节点
const getInitialNodes = () => {
  if (hasValidData.value && answerItems.value[0]?.pros?.[0]?.text) {
    return [
      {
        id: 'node1',
        data: {
          label: "",
          pros: [
            {
              id: "node1" + "_pro" + Date.now(),
              category: "onlyRead",
              check: "normal",
              state: "normal",
              text: answerItems.value[0].pros[0]?.text
            }
          ],
        },
        type: 'custom',
        position: { x: 50, y: 50 },
        label: "",
      },
    ]
  }
  // 无数据时返回空数组
  return []
}

const nodes = ref(getInitialNodes())
const edges = ref([])

// 只在有数据时添加初始节点
if (hasValidData.value && nodes.value.length > 0) {
  addNodes(nodes.value)
}

// 监听保存的数据，恢复用户绘制的 DFA
watch(
  [() => props.savedNodes, () => props.savedEdges, () => props.savedDfaState],
  ([newNodes, newEdges, newDfaState]) => {
    console.log('[SLR1DrawDFA] watch触发:', { newNodesLength: newNodes?.length, newEdgesLength: newEdges?.length, hasDfaState: !!newDfaState })
    if (newNodes && newNodes.length > 0) {
      // 直接修改 nodes 和 edges，VueFlow 会自动同步
      nodes.value = JSON.parse(JSON.stringify(newNodes))
      if (newEdges && newEdges.length > 0) {
        edges.value = JSON.parse(JSON.stringify(newEdges))
      }
      console.log('[SLR1DrawDFA] 数据恢复完成，节点数:', nodes.value.length, '边数:', edges.value.length)
    }
    
    // 恢复DFA构造状态
    if (newDfaState) {
      addNodeLimit = newDfaState.addNodeLimit
      addNode_remainCnt.value = newDfaState.addNodeRemainCnt
      forEachEpoch_AllNum = newDfaState.forEachEpochAllNum
      checkRight_Items = [...newDfaState.checkRightItems]
      checkRIght_Gotos = [...newDfaState.checkRightGotos]
      checkRight_local_node = [...newDfaState.checkRightLocalNode]
      checkRight_local_edge = [...newDfaState.checkRightLocalEdge]
      nodeId_Map_ItemId = { ...newDfaState.nodeIdMapItemId }
      edgeId_Map_GotosId = { ...newDfaState.edgeIdMapGotosId }
      next_step_open.value = [...newDfaState.nextStepOpen]
      console.log('[SLR1DrawDFA] DFA状态恢复完成:', { addNodeLimit, addNodeRemainCnt: addNode_remainCnt.value })
    }
  },
  { immediate: true }
)
const initVar = () => {
  checkRight_Items = []
  checkRIght_Gotos = []
  checkRight_local_edge = []
  checkRight_local_node = []
  everyEpooch_Items = new Set()
  addNodeLimit = 0
  addNode_remainCnt.value = addNodeLimit
  forEachEpoch_AllNum = 0
  NodeMatchRight_cnt = 0
  nodeId_Map_ItemId = {}
  edgeId_Map_GotosId = {}
}

const addNode = () => {
  if (next_step_open.value[0] && next_step_open.value[1]) return

  if (addNode_remainCnt.value <= 0) {
    showModal('error', '添加失败', '添加次数不足，请确保当前 Item 校验正确')
    return
  }
  addNode_remainCnt.value--
  addNodes({
    id: "node" + Date.now(),
    data: {
      label: "",
      pros: [
        {
          id: "node" + Date.now() + "_pro" + Date.now(),
          category: "blank",
          check: "normal",
          state: "normal",
          text: ""
        }
      ],
    },
    position: { x: Math.random() * 200, y: Math.random() * 200 },
    type: 'custom',
  })
}

const checkItem = () => {
  if (next_step_open.value[0]) return

  // 检查是否有未检验的Item
  let uncheckedNodes = getNodes.value.filter(node => !checkRight_local_node.includes(node.id))
  if (uncheckedNodes.length === 0) {
    if (getNodes.value.length === 0) {
      showModal('warning', '请先添加Item', '您还没有添加任何Item节点', '请先点击"添加节点"按钮添加Item，然后再进行校验。')
    } else {
      showModal('info', '所有Item已校验', '当前所有Item已经通过校验', '您可以继续添加新的Item或进行Goto连线校验。')
    }
    emit('validate-complete')
    return
  }

  // ------------------将 node.pros 与 item.pros 匹配----------------------
  for (const node of getNodes.value) { // ===============遍历node
    // 筛除已经校验过的 node
    if (checkRight_local_node.includes(node.id)) continue // 已经Check Right过的 node

    const node_pros = node.data.pros.map(item => item.text.replace(/\s+/g, ''))
    for (let j = 0; j <= forEachEpoch_AllNum; j++) { // =============遍历answer，按轮次遍历出新Item
      const answerItem = answerItems.value[j]
      if (checkRight_Items.includes(answerItem.id)) continue // 已经check Right过的 AnswerItem，不需要再被匹对

      const answerItem_pros = answerItem.pros.map(item => item.text)
      if (new Set(node_pros).size === new Set(answerItem_pros).size &&
        node_pros.every(item => answerItem_pros.includes(item)) // 两列表所含元素种类相等(且值唯一)，顺序可不等
      ) {// check Right
        NodeMatchRight_cnt++
        for (const x of node.data.pros) {
          if (x.category === 'blank') x.check = 'isCorrect'
        }
        node.data.label = answerItem.id

        nodeId_Map_ItemId[node.id] = answerItem.id  // nodexxxx : Itemx
        checkRight_local_node.push(node.id)
        checkRight_Items.push(answerItem.id)

        Object.values(answerItem.next_ids).forEach(next_Item_id => {
          everyEpooch_Items.add("Item" + next_Item_id)
        })
        break
      }
    }
  }

  if (checkRight_Items.length >= answerItem_totalNum.value) {
    showModal('success', 'Item校验成功', '恭喜！所有 Item 校验正确！', '您可以继续进行Goto连线的校验。')
    next_step_open.value[0] = true
    emit('validate-complete')
    return
  }

  // 获取未校验的节点（校验失败的节点）- 重新计算，因为校验过程中可能有节点被标记为成功
  uncheckedNodes = getNodes.value.filter(node => !checkRight_local_node.includes(node.id))
  const failedCount = uncheckedNodes.length

  // 只有当所有当前节点都校验成功时，才开启下一轮
  if (NodeMatchRight_cnt > 0 && failedCount === 0 && (checkRight_Items.length === 1 || NodeMatchRight_cnt === addNodeLimit)) {
    let cnt = 0; // 下轮可添加的数量
    everyEpooch_Items.forEach(item => { // 找补集，确定下轮可添加的按钮数量
      if (!checkRight_Items.includes(item)) {
        cnt++
      }
    })
    addNodeLimit = cnt
    addNode_remainCnt.value = addNodeLimit
    forEachEpoch_AllNum += addNodeLimit
    NodeMatchRight_cnt = 0
    everyEpooch_Items.clear()
    showModal('success', 'Item校验成功', `当前所有 Item 检测成功，可继续添加${addNodeLimit}个 Item`)
    emit('validate-complete')
    return
  }

  if (NodeMatchRight_cnt > 0) {
    // 部分成功的情况：显示成功和失败的数量
    if (failedCount > 0) {
      showModal('warning', 'Item校验部分成功', `${NodeMatchRight_cnt}个 Item 校验成功，${failedCount}个 Item 校验失败。`, '请检查失败的Item产生式是否正确')

      // 为每个失败的Item节点记录错误日志
      uncheckedNodes.forEach((node, index) => {
        const nodePros = node.data.pros
          .filter((p: any) => p.text && p.text.trim())
          .map((p: any) => p.text.trim())
        
        const wrongValue = nodePros.length > 0 ? nodePros.join('; ') : '未填写产生式'
        
        slr1Store.addErrorLog({
          step: 'step3',
          type: 'dfaState',
          location: { 
            fieldKey: 'checkItem',
            row: index,
            col: node.id
          },
          wrongValue: wrongValue,
          correctValue: '', // Item校验不显示正确答案，因为产生式由用户输入
          hint: '请检查该项目集的产生式是否完整、正确，或是否属于当前轮次应添加的Item'
        })
      })
    } else {
      showModal('success', 'Item校验成功', `${NodeMatchRight_cnt}个 Item 校验成功！`)
    }
    emit('validate-complete')
    return
  } else {
    showModal('error', 'Item校验失败', '无 Item 校验成功，请检查您的输入。')
    
    // 为每个未校验的Item节点单独记录错误日志
    uncheckedNodes.forEach((node, index) => {
      const nodePros = node.data.pros
        .filter((p: any) => p.text && p.text.trim())
        .map((p: any) => p.text.trim())
      
      const wrongValue = nodePros.length > 0 ? nodePros.join('; ') : '未填写产生式'
      
      slr1Store.addErrorLog({
        step: 'step3',
        type: 'dfaState',
        location: { 
          fieldKey: 'checkItem',
          row: index,
          col: node.id
        },
        wrongValue: wrongValue,
        correctValue: '', // Item校验不显示正确答案，因为产生式由用户输入
        hint: '请检查该项目集的产生式是否完整、正确，或是否属于当前轮次应添加的Item'
      })
    })
    
    emit('validate-complete')
    return
  }
}

const checkGoto = () => {
  if (next_step_open.value[1]) return

  // 检查是否有未检验的Item
  const uncheckedNodes = getNodes.value.filter(node => !checkRight_local_node.includes(node.id))
  if (uncheckedNodes.length > 0) {
    const uncheckedNodeIds = uncheckedNodes.map(node => node.id).join(', ')
    showModal('warning', '请先校验Item', `您还有未校验的Item节点: ${uncheckedNodeIds}`, '请先点击"校验Item"按钮完成所有Item的校验，再进行Goto连线校验。')
    // 不记录错误日志，因为这只是操作流程的提示，不是真正的错误
    emit('validate-complete')
    return
  }

  // 检查是否有未检验的Goto连线
  const uncheckedEdges = getEdges.value.filter(edge => !checkRight_local_edge.includes(edge.id))
  if (uncheckedEdges.length === 0) {
    if (getEdges.value.length === 0) {
      showModal('warning', '请先添加Goto连线', '您还没有添加任何Goto连线', '请先绘制Item之间的转移连线，然后再进行校验。')
    } else {
      showModal('info', '所有Goto已校验', '当前所有Goto连线已经通过校验', '您的DFA构造已经完成或可以继续添加新的Goto连线。')
    }
    emit('validate-complete')
    return
  }

  // 检查是否存在连接未校验Item的连线（源节点或目标节点未通过校验）
  const edgesWithUnvalidatedItems = uncheckedEdges.filter(edge => {
    const sourceValidated = checkRight_local_node.includes(edge.source)
    const targetValidated = checkRight_local_node.includes(edge.target)
    return !sourceValidated || !targetValidated
  })
  
  if (edgesWithUnvalidatedItems.length > 0) {
    const invalidEdgeDetails = edgesWithUnvalidatedItems.map(edge => {
      const sourceValidated = checkRight_local_node.includes(edge.source)
      const targetValidated = checkRight_local_node.includes(edge.target)
      const sourceLabel = nodeId_Map_ItemId[edge.source] || edge.source
      const targetLabel = nodeId_Map_ItemId[edge.target] || edge.target
      if (!sourceValidated && !targetValidated) {
        return `${sourceLabel} → ${targetLabel}（源节点和目标节点都未校验）`
      } else if (!sourceValidated) {
        return `${sourceLabel} → ${targetLabel}（源节点未校验）`
      } else {
        return `${sourceLabel} → ${targetLabel}（目标节点未校验）`
      }
    }).join('; ')
    
    showModal('warning', '存在未校验Item的连线', `以下连线的Item节点尚未通过校验：${invalidEdgeDetails}`, '请先完成所有相关Item节点的校验，再进行Goto连线校验。')
    slr1Store.addErrorLog({
      step: 'step3',
      type: 'gotoTransition',
      location: { fieldKey: 'checkGoto' },
      wrongValue: '存在连接未校验Item的Goto连线',
      correctValue: '所有连线两端的Item都应通过校验',
      hint: '请先校验所有参与Goto连线的Item节点'
    })
    emit('validate-complete')
    return
  }

  // 将 edge 与 item.next_ids 匹配
  let edgeMatchRight_cnt = 0
  // 记录错误的Goto连线
  const wrongGotos: Array<{
    edgeId: string,
    sourceItemId: string,
    targetItemId: string,
    gotoChar: string
  }> = []

  for (const edge of getEdges.value) {
    if (checkRight_local_edge.includes(edge.id)) continue

    const sourceId_local = edge.source
    const targetId_local = edge.target
    const inpGotoCh_local = edge.data.text
    const sourceId_Answer = nodeId_Map_ItemId[sourceId_local] ?  nodeId_Map_ItemId[sourceId_local] : ""
    const targetId_Answer = nodeId_Map_ItemId[targetId_local] ?  nodeId_Map_ItemId[targetId_local] : ""

    if (!sourceId_Answer && !targetId_Answer) {
      // 源节点和目标节点都未通过Item校验，记录为错误
      wrongGotos.push({
        edgeId: edge.id,
        sourceItemId: sourceId_local,
        targetItemId: targetId_local,
        gotoChar: inpGotoCh_local || '(空)'
      })
      continue
    }

    if (!sourceId_Answer) {
      // 源节点未通过Item校验，记录为错误
      wrongGotos.push({
        edgeId: edge.id,
        sourceItemId: sourceId_local,
        targetItemId: targetId_Answer || targetId_local,
        gotoChar: inpGotoCh_local || '(空)'
      })
      continue
    }

    const sou_AnswerItem = answerItems.value[parseInt(sourceId_Answer[sourceId_Answer.length - 1])]
    let matched = false

    for (const key of Object.keys(sou_AnswerItem.next_ids)) {
      const answer_goto_id = sou_AnswerItem.id + "-> " + key + "-> " + "Item" + sou_AnswerItem.next_ids[key]
      if (checkRIght_Gotos.includes(answer_goto_id)) continue

      if (inpGotoCh_local === key && "Item" + sou_AnswerItem.next_ids[key] === targetId_Answer) {
        edgeMatchRight_cnt++
        edge.data.check = 'isCorrect'
        checkRIght_Gotos.push(answer_goto_id)
        checkRight_local_edge.push(edge.id)
        edgeId_Map_GotosId[edge.id] = answer_goto_id
        matched = true
        break
      }
    }

    if (!matched) {
      // 未匹配到正确的转移，记录为错误
      wrongGotos.push({
        edgeId: edge.id,
        sourceItemId: sourceId_Answer,
        targetItemId: targetId_Answer || targetId_local,
        gotoChar: inpGotoCh_local || '(空)'
      })
    }
  }

  if (checkRIght_Gotos.length >= answerGotos_totalNum.value) {
    showModal('success', 'Goto校验成功', '恭喜！所有 Goto 连线校验正确！', '您的DFA构造已经完成。')
    next_step_open.value[1] = true
    emit('validate-complete')
    return
  }

  // 计算失败的Goto连线数量
  const failedGotoCount = wrongGotos.length

  if (edgeMatchRight_cnt > 0) {
    // 部分成功的情况：显示成功和失败的数量
    if (failedGotoCount > 0) {
      showModal('warning', 'Goto校验部分成功', `${edgeMatchRight_cnt}条 Goto 连线校验成功，${failedGotoCount}条 Goto 连线校验失败。`, '请检查失败的Goto连线')

      // 记录失败的Goto连线错误日志
      const wrongGotoInfos: string[] = []
      const correctGotoInfos: string[] = []
      wrongGotos.forEach(wrongGoto => {
        const edge = getEdges.value.find(e => e.id === wrongGoto.edgeId)
        if (edge) {
          const sourceNode = findNode(edge.source)
          const targetNode = findNode(edge.target)
          const sourceItemId = wrongGoto.sourceItemId
          const targetItemId = wrongGoto.targetItemId
          const sourcePros = sourceNode?.data?.pros?.map((p: any) => p.text).filter((t: string) => t.trim()).join(', ') || '空'
          const targetPros = targetNode?.data?.pros?.map((p: any) => p.text).filter((t: string) => t.trim()).join(', ') || '空'
          wrongGotoInfos.push(`${sourceItemId}[${sourcePros}] --${wrongGoto.gotoChar}--> ${targetItemId}[${targetPros}]`)

          // 构建正确答案：找到从源Item到目标Item的正确转移字符
          const sourceIdAnswer = sourceItemId
          const targetIdAnswer = targetItemId
          if (sourceIdAnswer && sourceIdAnswer.startsWith('Item') && targetIdAnswer && targetIdAnswer.startsWith('Item')) {
            const itemIndex = parseInt(sourceIdAnswer.substring(4))
            const souAnswerItem = answerItems.value[itemIndex]
            if (souAnswerItem && souAnswerItem.next_ids) {
              // 查找哪个转移字符会到达目标Item
              const correctChar = Object.entries(souAnswerItem.next_ids)
                .find(([ch, nextId]) => `Item${nextId}` === targetIdAnswer)?.[0]
              if (correctChar) {
                // 找到了正确的转移字符
                correctGotoInfos.push(`${sourceIdAnswer} --${correctChar}--> ${targetIdAnswer}`)
              }
              // 如果correctChar不存在，说明目标Item无法从源Item直接到达，不记录正确答案
            }
          }
          // 如果源Item或目标Item未校验，不记录正确答案
        }
      })
      const wrongGotoInfo = wrongGotoInfos.join('; ')
      const correctGotoInfo = correctGotoInfos.join('; ')

      slr1Store.addErrorLog({
        step: 'step3',
        type: 'gotoTransition',
        location: { fieldKey: 'goto-check' },
        wrongValue: wrongGotoInfo,
        correctValue: correctGotoInfo,
        hint: '请检查Goto连线的源状态、目标状态和转移字符是否正确'
      })
    } else {
      showModal('success', 'Goto校验成功', `${edgeMatchRight_cnt}条 Goto 连线校验成功！`)
    }
    emit('validate-complete')
    return
  } else {
    showModal('error', 'Goto校验失败', '无 Goto 连线校验成功，请检查您的连线。')
    // 只收集错误的Goto连线信息
    const wrongGotoInfos: string[] = []
    const correctGotoInfos: string[] = []
    wrongGotos.forEach(wrongGoto => {
      const edge = getEdges.value.find(e => e.id === wrongGoto.edgeId)
      if (edge) {
        const sourceNode = findNode(edge.source)
        const targetNode = findNode(edge.target)
        const sourceItemId = wrongGoto.sourceItemId
        const targetItemId = wrongGoto.targetItemId
        const sourcePros = sourceNode?.data?.pros?.map((p: any) => p.text).filter((t: string) => t.trim()).join(', ') || '空'
        const targetPros = targetNode?.data?.pros?.map((p: any) => p.text).filter((t: string) => t.trim()).join(', ') || '空'
        wrongGotoInfos.push(`${sourceItemId}[${sourcePros}] --${wrongGoto.gotoChar}--> ${targetItemId}[${targetPros}]`)

        // 构建正确答案：找到从源Item到目标Item的正确转移字符
        const sourceIdAnswer = sourceItemId
        const targetIdAnswer = targetItemId
        if (sourceIdAnswer && sourceIdAnswer.startsWith('Item') && targetIdAnswer && targetIdAnswer.startsWith('Item')) {
          const itemIndex = parseInt(sourceIdAnswer.substring(4))
          const souAnswerItem = answerItems.value[itemIndex]
          if (souAnswerItem && souAnswerItem.next_ids) {
            // 查找哪个转移字符会到达目标Item
            const correctChar = Object.entries(souAnswerItem.next_ids)
              .find(([ch, nextId]) => `Item${nextId}` === targetIdAnswer)?.[0]
            if (correctChar) {
              // 找到了正确的转移字符
              correctGotoInfos.push(`${sourceIdAnswer} --${correctChar}--> ${targetIdAnswer}`)
            }
            // 如果correctChar不存在，说明目标Item无法从源Item直接到达，不记录正确答案
          }
        }
        // 如果源Item或目标Item未校验，不记录正确答案
      }
    })
    const wrongGotoInfo = wrongGotoInfos.join('; ') || '未绘制任何Goto连线'
    const correctGotoInfo = correctGotoInfos.join('; ')
    // 记录错误日志 - 只记录错误的Goto连线
    slr1Store.addErrorLog({
      step: 'step3',
      type: 'gotoTransition',
      location: { fieldKey: 'goto-check' },
      wrongValue: wrongGotoInfo,
      correctValue: correctGotoInfo,
      hint: '无Goto连线校验成功，请检查输入的转移关系'
    })
    emit('validate-complete')
    return
  }
}

const handleRemoveInput = (nodeId: string, index: number) => {
  const node = findNode(nodeId)
  node?.data.pros.splice(index, 1)
}

const handleAddInput = (nodeId: string, index: number) => {
  const node = findNode(nodeId)
  node?.data.pros.splice(index + 1, 0, {
    id: nodeId + "_pro" + Date.now(),
    category: "blank",
    check: "normal",
    state: "normal",
    text: "",
  })
}

const reset = () => {
  if (next_step_open.value[0] && next_step_open.value[1]) return

  showModal('confirm', '确认重置', '确定要初始化吗？这将清除所有已绘制的内容。', '此操作不可撤销。', true)
}

// 处理重置确认
const handleResetConfirm = () => {
  nodes.value = [
    {
      id: 'node1',
      data: {
        label: "",
        pros: [
          {
            id: "node1" + "_pro" + Date.now(),
            category: "onlyRead",
            check: "normal",
            state: "normal",
            text: answerItems.value[0].pros[0].text
          }
        ],
      },
      type: 'custom',
      position: { x: 50, y: 50 },
      label: ""
    },
  ]
  edges.value = []

  initVar()

  next_step_open.value[0] = false
  next_step_open.value[1] = false

  setViewport({ x: 0, y: 0, zoom: 1 })
  closeModal()
}

const showAnswer = () => {
  if (showAnswer_cnt > 1) return alert(`错误: 请再努力尝试！（剩余${--showAnswer_cnt}次直接展示答案）`)

  removeNodes(getNodes.value, true) // 删除当前所有node，true: 及它们的edges
  setViewport({ x: 0, y: 0, zoom: 1 })

  const ItemId_Map_nodeId = {}
  for (let i = 0; i < answerItems.value.length; i++) {
    const item = answerItems.value[i]
    const item_pros: any[] = []
    const node_id = "node" + Date.now() + i
    for (let j = 0; j < item.pros.length; j++) {
      item_pros.push({
        id: node_id + "_pro" + Date.now() + j,
        category: "onlyRead",
        check: i === 0 && j === 0 ? "normal" : "isCorrect",
        state: "normal",
        text: item.pros[j].text
      })
    }
    ItemId_Map_nodeId[item.id] = node_id
    addNodes({
      id: node_id,
      data: {
        label: item.id,
        pros: item_pros
      },
      position: { x: i == 0 ? 20 : Math.random() * 700, y: i == 0 ? 20 : Math.random() * 400 },
      type: 'custom',
      selectable: false
    })
  }

  for (let i = 0; i < answerItems.value.length; i++) {
    const item = answerItems.value[i]

    const source = ItemId_Map_nodeId[item.id]
    const sourceHandle = 'e'
    let targetHandle = 'd'
    Object.entries(item.next_ids).forEach(([gotoCh, next_id]) => {
      const target = ItemId_Map_nodeId["Item" + next_id]
      if (item.id == "Item" + next_id) targetHandle = 'g' // 如何是指向自己，则换另一个终结锚点g显示
      else targetHandle = 'd'
      addEdges({
        id: 'vueflow__edge-' + source + sourceHandle + '-' + target + targetHandle,
        source: source,
        sourceHandle: sourceHandle,
        target: target,
        targetHandle: targetHandle,
        type: 'button',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 30, // 增大箭头的宽度
          height: 30  // 增大箭头的高度
        },
        updatable: true,
        data: {
          id: 'vueflow__edge-' + source + sourceHandle + '-' + target + targetHandle,
          category: "onlyRead",
          check: "isCorrect",
          state: "normal",
          text: gotoCh
        },
        selectable: false
      })
    })
  }

  initVar()
  next_step_open.value[0] = true
  next_step_open.value[1] = true
}

onPaneReady((instance) => {
  instance.fitView()
})

onConnect(params => {
  if (next_step_open.value[0] && next_step_open.value[1]) return

  console.log(params)
  const newEdge = {
    ...params,
    id: 'vueflow__edge-' + params.source + params.sourceHandle + '-' + params.target + params.targetHandle,
    type: 'button',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 25,
      height: 25,
      color: '#ff0072',
      strokeWidth: 1,
    },
    data: {
      id: 'vueflow__edge-' + params.source + params.sourceHandle + '-' + params.target + params.targetHandle,
      category: "blank",
      check: "normal",
      state: "normal",
      text: ""
    },
    updatable: true
  }
  addEdges([newEdge])
})

onNodeClick(params => {
  // console.log('click')
  // console.log(params)
  // params.selected = true // 有自己的选择样式
})

onEdgeClick(params => console.log(params.edge))

onNodesChange(changes => { // 主要处理 删除 node 时的事件
  for (const change of changes) {
    if (change.type === 'remove') {
      addNode_remainCnt.value++
      const node_id = change.id
      const answerItem_id = nodeId_Map_ItemId[node_id]
      if (answerItem_id) { // 存在，说明被校验正确，需要重置close表
        checkRight_local_node = checkRight_local_node.filter(item => item != node_id) // 更新 Answer——items 的closed表
        checkRight_Items = checkRight_Items.filter(item => item != answerItem_id) // 更新 Answer——items 的closed表
        console.log(checkRight_local_node)
        console.log(checkRight_Items)
      }
    }
  }
})

onEdgesChange(changes => { // 主要处理 删除 edge 时的事件
  for (const change of changes) {
    if (change.type === 'remove') {
      const edge_id = change.id
      const answerGotos_id = edgeId_Map_GotosId[edge_id]
      if (answerGotos_id) { // 存在，说明被校验正确，需要重置close表
        checkRight_local_edge = checkRight_local_edge.filter(item => item != edge_id)
        checkRIght_Gotos = checkRIght_Gotos.filter(item => item != answerGotos_id)
        console.log(checkRight_local_edge)
        console.log(checkRIght_Gotos)
      }
    }
  }
})

onEdgeUpdate(params => { // 主要处理 更换edge 时的事件
  // 若 DFA 正确，不可进行更新 edge
  if (next_step_open.value.every(item => item === true)) return

  // ========更新后，原先edge被删除，但初始data被保留到新edge中=========
  updateEdge(params.edge, params.connection)
  const answerGotos_id = edgeId_Map_GotosId[params.edge.id]
  if (answerGotos_id) { // 更改close表
    console.log("This edge is CheckRight")
    checkRight_local_edge = checkRight_local_edge.filter(item => item != params.edge.id) // 删除close表中信息
    checkRIght_Gotos = checkRIght_Gotos.filter(item => item != answerGotos_id) // 删除close表中信息

    // ---------------------修改check信息：获取新连接后的 edge --------------------------
    const edge = findEdge('vueflow__edge-' + params.connection.source + params.connection.sourceHandle + '-' + params.connection.target + params.connection.targetHandle)
    if (edge) {
      edge.data.check = 'normal'
    }
  }
})

// 暴露方法供父组件调用
defineExpose({
  getNodes: () => {
    return getNodes.value.map(node => ({
      id: node.id,
      data: node.data,
      position: node.position,
      type: node.type,
    }))
  },
  getEdges: () => {
    return getEdges.value.map(edge => ({
      id: edge.id,
      source: edge.source,
      sourceHandle: edge.sourceHandle,
      target: edge.target,
      targetHandle: edge.targetHandle,
      type: edge.type,
      markerEnd: edge.markerEnd,
      data: edge.data,
    }))
  },
  getDfaState: (): {
    addNodeLimit: number
    addNodeRemainCnt: number
    forEachEpochAllNum: number
    checkRightItems: string[]
    checkRightGotos: string[]
    checkRightLocalNode: string[]
    checkRightLocalEdge: string[]
    nodeIdMapItemId: Record<string, string>
    edgeIdMapGotosId: Record<string, string>
    nextStepOpen: boolean[]
  } | null => {
    // 如果没有节点，返回null表示没有状态需要保存
    if (getNodes.value.length === 0) {
      return null
    }
    return {
      addNodeLimit,
      addNodeRemainCnt: addNode_remainCnt.value,
      forEachEpochAllNum: forEachEpoch_AllNum,
      checkRightItems: [...checkRight_Items],
      checkRightGotos: [...checkRIght_Gotos],
      checkRightLocalNode: [...checkRight_local_node],
      checkRightLocalEdge: [...checkRight_local_edge],
      nodeIdMapItemId: { ...nodeId_Map_ItemId },
      edgeIdMapGotosId: { ...edgeId_Map_GotosId },
      nextStepOpen: [...next_step_open.value],
    }
  }
})
</script>

<template>
  <div class="slr1-dfa-container">
    <!-- 按钮控制区域 -->
    <div class="button-controls">
      <div class="btn_box" id="addNode_wrapper">
        <button
          @click="addNode"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          添加 Item
        </button>
        <div class="icon" id="addLimit_remain" :style="{ 'backgroundColor': next_step_open[0] && next_step_open[1] ? 'rgb(133, 215, 61)' : 'rgb(237, 111, 111)' }">
          {{ addNode_remainCnt }}
        </div>
      </div>

      <div class="btn_box" id="checkItem_wrapper">
        <button
          @click="checkItem"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          校验 Item
        </button>
        <div class="icon" id="allItemRight" v-if="next_step_open[0] === true">√</div>
      </div>

      <div class="btn_box" id="checkGoto_wrapper">
        <button
          @click="checkGoto"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          校验 Goto
        </button>
        <div class="icon" id="allGotoRight" v-if="next_step_open[1] === true">√</div>
      </div>

      <button
        @click="reset"
        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        重置
      </button>
    </div>

    <!-- 画布容器 -->
    <div class="canvas-container">
      <div id="flow_wrapper">
        <!-- apply-default: 自动更新 useVueflow 和 user-opeartion 的change ，默认为true-->
        <VueFlow :nodes="nodes" :edges="edges" class="flow" fit-view-on-init :apply-default="true">
          <Background pattern="dots" :gap="20" />
          <template #node-custom="customNodeProps">
            <custom-node
              :node="customNodeProps"
              :inpArr="customNodeProps.data.pros"
              :class="{ active: customNodeProps.selected }"
              @removeInput="handleRemoveInput"
              @addInput="handleAddInput"
            >
            </custom-node>
          </template>
          <template #edge-button="customEdgeProps">
            <custom-edge
              :id="customEdgeProps.id"
              :source-x="customEdgeProps.sourceX"
              :source-y="customEdgeProps.sourceY"
              :target-x="customEdgeProps.targetX"
              :target-y="customEdgeProps.targetY"
              :source-position="customEdgeProps.sourcePosition"
              :target-position="customEdgeProps.targetPosition"
              :marker-end="customEdgeProps.markerEnd"
              :style="customEdgeProps.style"
              :edgeLabel="customEdgeProps.data"
            />
          </template>
        </VueFlow>
      </div>
    </div>
  </div>

  <!-- 弹窗组件 -->
  <ModalDialog
    :visible="modalVisible"
    :type="modalConfig.type"
    :title="modalConfig.title"
    :message="modalConfig.message"
    :details="modalConfig.details"
    :show-cancel="modalConfig.showCancel"
    @confirm="modalConfig.showCancel ? handleResetConfirm() : closeModal()"
    @cancel="closeModal()"
    @close="closeModal()"
  />
</template>

<style lang="scss">
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";

/* 主容器样式 */
.slr1-dfa-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

/* 按钮控制区域 */
.button-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

/* 画布容器 */
.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.vue-flow__handle {
  /* Handle样式 */
  width: 2px;
  /* 改变大小 */
  height: 2px;
  /* 改变大小 */
  background-color: rgb(129, 127, 127);
  /* 改变颜色 */
}

input {
  user-select: none;
  // 抵制移动鼠标的选择
}

#flow_wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  .flow {
    height: 100%;
    width: 100%;
  }

  .active {
    border: 2px solid rgb(238, 133, 133);
  }
}

.btn_box {
  position: relative;
  display: inline-block;
  margin-right: 20px;

  .icon {
    position: absolute;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 50%;
    font-size: 16px;
    color: white;
    text-align: center;
    top: -20%;
    right: -5%;
  }
}

#checkItem_wrapper {
  #allItemRight {
    background-color: rgb(133, 215, 61);
  }
}

#checkGoto_wrapper {
  #allGotoRight {
    background-color: rgb(133, 215, 61);
  }
}
</style>
