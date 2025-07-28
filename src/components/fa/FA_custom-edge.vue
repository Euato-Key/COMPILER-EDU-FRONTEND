<script setup lang="ts">
import { BaseEdge, EdgeLabelRenderer, getBezierPath, Position, useVueFlow ,getSmoothStepPath} from '@vue-flow/core'
import { computed,type PropType } from 'vue';



const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String as PropType<Position>,
    required: true,
  },
  targetPosition: {
    type: String as PropType<Position>,
    required: true,
  },
  sourceHandleId:{
    type: String,
    required:true
  },
  targetHandleId:{
    type: String,
    required:true
  },
  sourceNode: {
    type: Object,
    required: true,
  },
  targetNode: {
    type: Object,
    required: true,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
  edgeLabel: {
    type: String,
    required: true,
  },
})


const path = computed(() => {

  // loopback path
  if (props.sourceNode && props.targetNode && props.sourceNode == props.targetNode) {


    let labelX = (props.sourceX + props.targetX) / 2
    let labelY = (props.sourceY + props.targetY) / 2
    console.log([props.sourceX,props.sourceY,props.targetX,props.targetY])
    if (
      (props.sourcePosition === Position.Bottom && props.targetPosition === Position.Top) ||
      (props.sourcePosition === Position.Top && props.targetPosition === Position.Bottom)
    ) {
      // for horizontal loopback edges
      const radiusX = 40
      const radiusY = props.sourceY - props.targetY

      labelX += props.sourceY < props.targetY ? -radiusX*1.85 : radiusX*1.85

      if(props.sourceHandleId == 'a' && props.targetHandleId == 'h'){
        labelY+=30
        labelX+=15
      }
      if(props.sourceHandleId == 'h' && props.targetHandleId == 'a'){
        labelY-=30
        labelX-=15
      }
      if(props.sourceHandleId == 'a' && props.targetHandleId == 'g'){
        labelY+=20
        labelX+=5
      }
      if(props.sourceHandleId == 'g' && props.targetHandleId == 'a'){
        labelY-=20
        labelX-=5
      }
      if(props.sourceHandleId == 'c' && props.targetHandleId == 'f'){
        labelY-=30
        labelX+=15
      }
      if(props.sourceHandleId == 'f' && props.targetHandleId == 'c'){
        labelY+=30
        labelX-=15
      }
      if(props.sourceHandleId == 'c' && props.targetHandleId == 'g'){
        labelY-=20
        labelX+=5
      }
      if(props.sourceHandleId == 'g' && props.targetHandleId == 'c'){
        labelY+=20
        labelX-=5
      }


      return [`M ${props.sourceX} ${props.sourceY} A ${radiusX} ${radiusY} 0 1 0 ${props.targetX} ${props.targetY}`, `${labelX}`,`${labelY}`]
    } else if (
      (props.sourcePosition === Position.Left && props.targetPosition === Position.Right) ||
      (props.sourcePosition === Position.Right && props.targetPosition === Position.Left)
    ) {
      // for vertical loopback edges
      const radiusX = (props.sourceX - props.targetX) * 0.6
      const radiusY = 30

      labelY += props.sourceX > props.targetX ? -radiusY*1.5 : radiusY*1.5


      return [`M ${props.sourceX} ${props.sourceY} A ${radiusX} ${radiusY} 0 1 0 ${props.targetX} ${props.targetY}`,`${labelX}`,`${labelY}`]
    }
  }

  // default to bezier path
  return getBezierPath(props)
})
const emit = defineEmits(['update:edgeLabel'])
console.log(path)

</script>

<template>
  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" :tabindex="0" class="edgeLine"/>
  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }"
      id="EdgeLabelRenderer"
    >
      <input type="text"
        :value="edgeLabel"
        @input="emit('update:edgeLabel', ($event.target as HTMLInputElement).value)"
      >
    </div>
  </EdgeLabelRenderer>
</template>

<style lang="scss" scoped>
.edgeLine{
  cursor: default;
  stroke: #34495e;
  stroke-width: 2px;
  filter: drop-shadow(0 1px 2px rgba(52, 73, 94, 0.3));
}

#EdgeLabelRenderer{
  z-index: 999999;

  input{
    width: 20px;
    height: 20px;
    text-align: center;
    border: 1px solid #34495e;
    border-radius: 4px;
    background-color: #ffffff;
    color: #2c3e50;
    font-weight: 600;
    font-size: 12px;
    user-select: none; // 抵制移动鼠标的选中
    box-shadow: 0 2px 4px rgba(52, 73, 94, 0.2);
  }

  input:focus{
    outline: none;
    border: 2px solid #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
  }
}
</style>
