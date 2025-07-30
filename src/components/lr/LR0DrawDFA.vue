<script setup lang="ts">
import { ref, type PropType, type Ref, computed, watch } from 'vue';
import type { dataDfaType} from '@/utils/type/LR0type';
import { VueFlow,Handle,Position,useVueFlow,MarkerType, type NodeChange} from "@vue-flow/core"
import { Background } from '@vue-flow/background'
const { onConnect,addEdges,addNodes,onNodeClick,onEdgeClick,findNode,findEdge,getNodes,getEdges,
  onNodesChange,onEdgesChange,applyNodeChanges,applyEdgeChanges,updateEdge,onEdgeUpdate,onPaneReady,setViewport,removeNodes } = useVueFlow()

import customEdge from '@/components/lr/custom-edge.vue';
import customNode from '@/components/lr/custom-node.vue';
import ModalDialog from '@/components/shared/ModalDialog.vue';

const props = defineProps({
  check_DFA:{
    type: Array as PropType<dataDfaType[]>,
    required:true
  },
})

const answerItems = ref<dataDfaType[]>([])
answerItems.value = props.check_DFA.slice() // 深拷贝，拷贝到该组件中
console.log(answerItems.value)

let checkRight_Items:string[] = [] //  close表：已经check Right的Answer_item的id
let checkRIght_Gotos:string[] = [] //  close表：已经check RIght的Answer_Gotos的连线（item_id + gotoV + next_id）
const answerItem_totalNum = computed(()=>{ // answer DFA 中 Item 的 的总个数
  return answerItems.value.length
})
const answerGotos_totalNum = computed(()=>{ // answer DFA 中 goto连线的 的总个数
  let cnt = 0;
  answerItems.value.forEach(item => cnt+=Object.keys(item.next_ids).length)
  return cnt;
})
let checkRight_local_node:string[] = [] // close表： 已经check Right过的 本地 local_node
let checkRight_local_edge:string[] = [] // close表：已经check Right过的 本地 local_edge。
let everyEpooch_Items:Set<string> = new Set()
let addNodeLimit = 0 // 每轮可添加的item（node）数量
const addNode_remainCnt = ref(addNodeLimit)
let forEachEpoch_AllNum = 0
let NodeMatchRight_cnt = 0
let nodeId_Map_ItemId = {}
let edgeId_Map_GotosId = {}
const next_step_open:Ref<boolean[]> =  ref([false,false])
let showAnswer_cnt = 3
const emit = defineEmits(["open_step4"])

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

watch(next_step_open.value, (newValue:boolean[])=>{
  if(newValue.every(item=>item === true)){
    emit('open_step4')
    if(showAnswer_cnt<=1) return

    showModal('success', 'DFA构造成功', '恭喜！您的DFA构造完全正确！', '所有项目集和转移关系都已正确验证。')
    for(const node of getNodes.value){ // 确保不能删除node，但能拖动 dragable
      node.selectable = false
    }
    for(const edge of getEdges.value){ // 确保不能删除edge，但能拖动 dragable
      edge.selectable = false
    }
  }
})

const nodes = ref([
  {
    id: 'node1',
    data: {
      label:"",
      pros:[
        {
          id:"node1"+"_pro"+Date.now(),
          category:"onlyRead",
          check:"normal",
          state:"normal",
          text:answerItems.value[0].pros[0]?.text
        }
      ],
    },
    type: 'custom',
    position: { x: 50, y: 50 },
    label:"",
  },
])

const edges = ref([
  // default bezier edge
  // consists of an edge id, source node id and target node id
  // {
  //   id: "e1->2",
  //   source: "1",
  //   target: "2",
  // },

  // // set `animated: true` to create an animated edge path
  // {
  //   id: "e2->3",
  //   source: "2",
  //   target: "3",
  //   animated: true,
  // },

  // // a custom edge, specified by using a custom type name
  // // we choose `type: 'special'` for this example
  // {
  //   id: "e3->4",
  //   type: "special",
  //   source: "3",
  //   target: "4",

  //   // all edges can have a data object containing any data you want to pass to the edge
  //   data: {
  //     hello: "world",
  //   },
  // },
])

addNodes(nodes.value)
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
const addNode =  () => {
  if(next_step_open.value[0] && next_step_open.value[1]) return

  if(addNode_remainCnt.value<=0) {
    showModal('error', '添加失败', '添加次数不足，请确保当前 Item 校验正确')
    return
  }
  addNode_remainCnt.value--
  addNodes({
    id: "node" + Date.now(),
    data:{
      label:"",
      pros:[
        {
          id: "node"+ Date.now() + "_pro" + Date.now(),
          category: "blank",
          check: "normal",
          state: "normal",
          text: ""
        }
      ],
    },
    position: { x: Math.random() * 200, y: Math.random() * 200 },
    type:'custom',
  })
}
const checkItem = () => {
  if(next_step_open.value[0]) return

  // ------------------将 node.pros 与 item.pros 匹配----------------------
  for(const node of getNodes.value){ // ===============遍历node
    // 筛除已经校验过的 node
    if(checkRight_local_node.includes(node.id)) continue // 已经Check Right过的 node

    const node_pros = node.data.pros.map((item: any)=>item.text.replace(/\s+/g, ''))
    for(let j=0;j<=forEachEpoch_AllNum;j++){ // =============遍历answer，按轮次遍历出新Item
      const answerItem = answerItems.value[j]
      if(checkRight_Items.includes(answerItem.id)) continue // 已经check Right过的 AnswerItem，不需要再被匹对

      const answerItem_pros = answerItem.pros.map((item: any)=>item.text)
      if(new Set(node_pros).size === new Set(answerItem_pros).size &&
        node_pros.every((item: any) => answerItem_pros.includes(item)) // 两列表所含元素种类相等(且值唯一)，顺序可不等
        )
      {// check Right
        NodeMatchRight_cnt++
        for(const x of node.data.pros){
          if(x.category === 'blank') x.check='isCorrect'
        }
        node.data.label = answerItem.id

        nodeId_Map_ItemId[node.id]=answerItem.id  // nodexxxx : Itemx
        checkRight_local_node.push(node.id)
        checkRight_Items.push(answerItem.id)

        Object.values(answerItem.next_ids).forEach((next_Item_id: any) => {
          everyEpooch_Items.add("Item"+next_Item_id)
        })
        break
      }
    }
  }

  if(checkRight_Items.length>=answerItem_totalNum.value) {
    showModal('success', 'Item校验成功', '恭喜！所有 Item 校验正确！', '您可以继续进行Goto连线的校验。')
    next_step_open.value[0]=true
    return
  }

  if( NodeMatchRight_cnt !=0 && (checkRight_Items.length === 1 ||  NodeMatchRight_cnt === addNodeLimit) ){ // 当前校验正确，开启下一轮
    let cnt = 0; // 下轮可添加的数量
    everyEpooch_Items.forEach( (item: any)=> { // 找补集，确定下轮可添加的按钮数量
      if(!checkRight_Items.includes(item)) {
        cnt++
      }
    })
    addNodeLimit = cnt
    addNode_remainCnt.value = addNodeLimit
    forEachEpoch_AllNum += addNodeLimit
    NodeMatchRight_cnt = 0
    everyEpooch_Items.clear()
    showModal('success', 'Item校验成功', `当前所有 Item 检测成功，可继续添加${addNodeLimit}个 Item`)
    return
  }

  if(NodeMatchRight_cnt > 0){
    showModal('success', 'Item校验成功', `${NodeMatchRight_cnt}个 Item 校验成功！`)
    return
  }else{
    showModal('error', 'Item校验失败', '无 Item 校验成功，请检查您的输入。')
    return
  }
}
const checkGoto = () => {
  if(next_step_open.value[1]) return

  // 将 edge 与 item.next_ids 匹配
  let edgeMatchRight_cnt = 0

  for(const edge of getEdges.value){
    if(checkRight_local_edge.includes(edge.id)) continue

    const sourceId_local = edge.source
    const targetId_local = edge.target
    const inpGotoCh_local = edge.data.text
    const sourceId_Answer = nodeId_Map_ItemId[sourceId_local] ?  nodeId_Map_ItemId[sourceId_local] : ""
    const targetId_Answer = nodeId_Map_ItemId[targetId_local] ?  nodeId_Map_ItemId[targetId_local] : ""

    if(!sourceId_Answer && !targetId_Answer) continue

    const sou_AnswerItem = answerItems.value[parseInt(sourceId_Answer[sourceId_Answer.length-1])]
    for(const key of Object.keys(sou_AnswerItem.next_ids)){
      const answer_goto_id = sou_AnswerItem.id + "-> " + key + "-> " + "Item" + sou_AnswerItem.next_ids[key]
      if(checkRIght_Gotos.includes(answer_goto_id)) continue

      if(inpGotoCh_local === key && "Item"+sou_AnswerItem.next_ids[key] === targetId_Answer){
        edgeMatchRight_cnt++
        edge.data.check = 'isCorrect'
        checkRIght_Gotos.push(answer_goto_id)
        checkRight_local_edge.push(edge.id)
        edgeId_Map_GotosId[edge.id]=answer_goto_id
        break
      }
    }
  }

  if( checkRIght_Gotos.length>=answerGotos_totalNum.value ) {
    showModal('success', 'Goto校验成功', '恭喜！所有 Goto 连线校验正确！', '您的DFA构造已经完成。')
    next_step_open.value[1]=true
    return
  }

  if(edgeMatchRight_cnt > 0){
    showModal('success', 'Goto校验成功', `${edgeMatchRight_cnt}条 Goto 连线校验成功！`)
    return
  }else{
    showModal('error', 'Goto校验失败', '无 Goto 连线校验成功，请检查您的连线。')
    return
  }
}
const handleRemoveInput = (nodeId, index) =>{
  const node = findNode(nodeId)
  node?.data.pros.splice(index,1)
}
const handleAddInput = (nodeId, index) =>{
  const node = findNode(nodeId)
  node?.data.pros.splice(index+1,0,{
    id: nodeId + "_pro" + Date.now(),
    category: "blank",
    check: "normal",
    state: "normal",
    text: "",
   })
}
const reset = () => {
  if(next_step_open.value[0] && next_step_open.value[1]) return

  showModal('confirm', '确认重置', '确定要初始化吗？这将清除所有已绘制的内容。', '此操作不可撤销。', true)
}

// 处理重置确认
const handleResetConfirm = () => {
  nodes.value = [
    {
      id: 'node1',
      data: {
        label:"",
        pros:[
          {
            id:"node1"+"_pro"+Date.now(),
            category:"onlyRead",
            check:"normal",
            state:"normal",
            text:answerItems.value[0].pros[0].text
          }
        ],
      },
      type: 'custom',
      position: { x: 50, y: 50 },
      label:""
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
  if(showAnswer_cnt>1) {
    showModal('warning', '提示', `请再努力尝试！（剩余${--showAnswer_cnt}次直接展示答案）`)
    return
  }

  removeNodes(getNodes.value,true) // 删除当前所有node，true: 及它们的edges
  setViewport({ x: 0, y: 0, zoom: 1 })

  const ItemId_Map_nodeId: any = {}
  for(const i=0;i<answerItems.value.length;i++){
    const item = answerItems.value[i]
    const item_pros:any[] = []
    const node_id = "node"+Date.now()+i
    for(let j=0;j<item.pros.length;j++){
      item_pros.push({
        id:node_id+"_pro"+Date.now()+j,
        category: "onlyRead",
        check: i===0 && j===0 ? "normal":"isCorrect",
        state: "normal",
        text: item.pros[j].text
      })
    }
    ItemId_Map_nodeId[item.id]=node_id
    addNodes({
      id: node_id,
      data:{
        label:item.id,
        pros:item_pros
      },
      position: { x: i==0 ? 20 : Math.random() * 700, y: i==0 ? 20 : Math.random() * 400 },
      type:'custom',
      selectable:false
    })
  }

  for(const i=0;i<answerItems.value.length;i++){
    const item = answerItems.value[i]

    const source = ItemId_Map_nodeId[item.id]
    const sourceHandle = 'e'
    let targetHandle = 'd'
    Object.entries(item.next_ids).forEach(([gotoCh,next_id])=>{
      const target = ItemId_Map_nodeId["Item"+next_id]
      if(item.id == "Item"+next_id) targetHandle = 'g' // 如何是指向自己，则换另一个终结锚点g显示
      else targetHandle = 'd'
      addEdges({
        id:'vueflow__edge-' + source + sourceHandle + '-' + target + targetHandle,
        source:source,
        sourceHandle:sourceHandle,
        target:target,
        targetHandle:targetHandle,
        type:'button',
        markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 30, // 增大箭头的宽度
            height: 30  // 增大箭头的高度
          },
        updatable: true,
        data:{
          id:'vueflow__edge-' + source + sourceHandle + '-' + target + targetHandle,
          category:"onlyRead",
          check:"isCorrect",
          state:"normal",
          text:gotoCh
        },
        selectable:false
      })
    })
  }

  initVar()
  next_step_open.value[0]=true
  next_step_open.value[1]=true
}
onPaneReady((instance) => {
  instance.fitView()
  // console.log(instance.getViewport())
})
onConnect( params => {
  if(next_step_open.value[0] && next_step_open.value[1]) return

  console.log(params)
  // edges.value.push({
  //   id: 'vueflow__edge-' + params.source + params.sourceHandle + '-' + params.target + params.targetHandle,
  //   source: params.source,
  //   sourceHandle: params.sourceHandle,
  //   target: params.target,
  //   targetHandle: params.targetHandle,
  //   markerEnd: MarkerType.ArrowClosed,
  //   type:'button'
  // })
  const newEdge = {
    ...params,
    id:'vueflow__edge-' + params.source + params.sourceHandle + '-' + params.target + params.targetHandle,
    type:'button',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 25,
      height: 25,
      color: '#ff0072',
      strokeWidth: 1,
    },
    data:{
      id:'vueflow__edge-' + params.source + params.sourceHandle + '-' + params.target + params.targetHandle,
      category:"blank",
      check:"normal",
      state:"normal",
      text:""
    },
    updatable: true
  }
  addEdges([newEdge])
})
onNodeClick(params=>{
  // console.log('click')
  // console.log(params)
  // params.selected = true // 有自己的选择样式
})
onEdgeClick(params=>console.log(params.edge))
onNodesChange(changes => { // 主要处理 删除 node 时的事件
  // console.log(changes)
  // const nextChanges:NodeChange[] = []
  for(const change of changes){
    if(change.type === 'remove'){
      addNode_remainCnt.value++
      const node_id = change.id
      const answerItem_id = nodeId_Map_ItemId[node_id]
      if(answerItem_id) { // 存在，说明被校验正确，需要重置close表
        checkRight_local_node = checkRight_local_node.filter( item => item != node_id) // 更新 Answer——items 的closed表
        checkRight_Items = checkRight_Items.filter( item => item != answerItem_id) // 更新 Answer——items 的closed表
        console.log(checkRight_local_node)
        console.log(checkRight_Items)
      }
    }
    // nextChanges.push(change)
  }
  // applyNodeChanges(nextChanges)
})
onEdgesChange(changes => { // 主要处理 删除 edge 时的事件
  // console.log(changes)
  for(const change of changes){
    if(change.type === 'remove'){
      const edge_id = change.id
      const answerGotos_id = edgeId_Map_GotosId[edge_id]
      if(answerGotos_id){ // 存在，说明被校验正确，需要重置close表
        checkRight_local_edge = checkRight_local_edge.filter( item => item != edge_id)
        checkRIght_Gotos = checkRIght_Gotos.filter( item => item != answerGotos_id)
        console.log(checkRight_local_edge)
        console.log(checkRIght_Gotos)
      }
    }
  }
})
onEdgeUpdate(params => { // 主要处理 更换edge 时的事件
  // 若 DFA 正确，不可进行更新 edge
  if(next_step_open.value.every(item => item === true)) return

  // ========更新后，原先edge被删除，但初始data被保留到新edge中=========

  // console.log(params.edge)  // params.connection 是新连接后的信息， 而 params.edge 中 id、source、target 是旧连接的信息，但data则是 首次onconnnect时的数据
  updateEdge(params.edge, params.connection)
  const answerGotos_id = edgeId_Map_GotosId[params.edge.id]
  if(answerGotos_id){ // 更改close表
    console.log("This edge is CheckRight")
    checkRight_local_edge = checkRight_local_edge.filter( item => item != params.edge.id) // 删除close表中信息
    checkRIght_Gotos = checkRIght_Gotos.filter( item => item != answerGotos_id) // 删除close表中信息
    // console.log(checkRight_local_edge)
    // console.log(checkRIght_Gotos)

    // ---------------------修改check信息：获取新连接后的 edge --------------------------
    const edge = findEdge('vueflow__edge-' + params.connection.source + params.connection.sourceHandle + '-' + params.connection.target + params.connection.targetHandle)
    if(edge) {
      edge.data.check='normal'
    }
  }
  // console.log(getEdges.value) // 打印的 id、 source、target是新连接后的正确信息， 但data、sourceNode、targetNode有问题
})
</script>

<template>
  <div class="lr0-dfa-container">
    <!-- 按钮控制区域 -->
    <div class="button-controls">
      <div class="btn_box" id="addNode_wrapper">
        <button
          @click="addNode"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          添加 Item
        </button>
        <div class="icon" id="addLimit_remain" :style="{'backgroundColor':next_step_open[0] && next_step_open[1] ? 'rgb(133, 215, 61)':'rgb(237, 111, 111)'}">
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
          <Background pattern="dots" :gap="20"/>
          <template #node-custom="customNodeProps">
            <custom-node
              :node="customNodeProps"
              :inpArr="customNodeProps.data.pros"
              :class="{active:customNodeProps.selected}"
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

<style lang="scss"> // 不能scoped，否则覆盖不了vue-flow自带样式，同时注意子组件的样式继承
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";

/* 主容器样式 */
.lr0-dfa-container {
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

.vue-flow__handle { // Handle样式
  width: 2px; /* 改变大小 */
  height: 2px; /* 改变大小 */
  background-color: rgb(129, 127, 127); /* 改变颜色 */
}
input{
  user-select: none; // 抵制移动鼠标的选择
}
#flow_wrapper{
  position: relative;
  height: 100%;
  width: 100%;
  .flow{
    height: 100%;
    width: 100%;
  }
  .active{
    border: 2px solid rgb(238, 133, 133);
  }
}
.btn_box{
  position: relative;
  display: inline-block;
  margin-right: 20px;
  .icon{
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
#checkItem_wrapper{
    #allItemRight{
      background-color: rgb(133, 215, 61);
    }
}
#checkGoto_wrapper{
    #allGotoRight{
      background-color: rgb(133, 215, 61);
    }
}
</style>
