<script setup lang="ts">
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow ,getSmoothStepPath, type Position} from '@vue-flow/core'
import { computed,type PropType } from 'vue';

import type { dfa_gotoVt } from '@/types/lr0';
import selectButton from '@/components/dev/selectButton.vue';

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
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
  edgeLabel:{
    type: Object as PropType<dfa_gotoVt>,
    required: true,
  }
})
const emit = defineEmits({
  removeEdge: (id:string) => true
})

const path = computed(() => getBezierPath(props))


</script>

<template>
  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" :tabindex="0"  class="edgeLine"/>
  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }"
      id="EdgeLabelRenderer"
    >
     <selectButton
        v-model:text="edgeLabel.text"
        height="20px"
        width="40px"
        :category="edgeLabel.category"
        :check="edgeLabel.check"
        :state="edgeLabel.state"
        :inpStyle="{'border-radius':'0px'}"
      ></selectButton>
      <!-- <button @click="emit('removeEdge',id)">x</button> -->
    </div>
  </EdgeLabelRenderer>
</template>

<style lang="scss" scoped>
.edgeLine{
  cursor:default;
  // border: 1px solid red;

}
#EdgeLabelRenderer{
  z-index: 999999;

  input{
    width: 20px;
    text-align: center;
  }
  button{
    width: 10px;
    height: 15px;
    border-radius:50%;
    font-size: 10px;
    cursor:pointer;
    &:hover{
      transform:scale(1.1);
      transition:all ease .5s;
      box-shadow:0 0 0 2px #10b98180,0 0 0 2px #10b981
    }
  }
}
</style>
