<script setup lang="ts">
import { Handle,Position, useVueFlow } from '@vue-flow/core'
import { ref,type PropType } from 'vue';
import type { dfa_item } from '@/types/lr0';
import selectButton from '@/components/dev/selectButton.vue';

const isActive = ref(false)
const props = defineProps({
  node:{
    type:Object,
    required:true
  },
  inpArr:{
    type:Array as PropType<dfa_item[]>,
    required:true
  },
})
const emit = defineEmits(["removeInput","addInput"])

</script>

<template>
  <div id="node_wrapper" class="custom-node" :class="{active: isActive}">
    <div class="label" v-show="node.data.label != '' ">{{ node.data.label }}</div>

    <div class="inp_wrapper" v-for="(item,index) in inpArr" :key="index">
      <selectButton
        v-model:text="item.text"
        height="20px"
        :category="item.category"
        :check="item.check"
        :state="item.state"
        class="inp_formulas"
      >
      </selectButton>
      <div class="btn_wrapper">
        <div @click="emit('removeInput', node.id, index)" class="remove" v-show="node.data.label == '' ">x</div>
        <div @click="emit('addInput', node.id, index)" class="add" v-show="node.data.label == '' ">+</div>
      </div>
    </div>
    <button
            v-if="inpArr.length === 0"
            @click="emit('addInput', node.id, 0)"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
          Add Input
    </button>
    <!-- {{ node.data.label }} -->
    <Handle id="a" type="source" :position="Position.Top" style="left: 0%;"/>
    <Handle id="b" type="source" :position="Position.Top" style="left: 50%;"/>
    <Handle id="c" type="source" :position="Position.Top" style="left: 100%;"/>
    <Handle id="d" type="source" :position="Position.Left" style="top: 50%;"/>
    <Handle id="e" type="source" :position="Position.Right" style="top: 50%;"/>
    <Handle id="f" type="source" :position="Position.Bottom" style="left: 0%;"/>
    <Handle id="g" type="source" :position="Position.Bottom" style="left: 50%;"/>
    <Handle id="h" type="source" :position="Position.Bottom" style="left: 100%;"/>
  </div>
</template>

<style lang="scss" scoped>
#node_wrapper{
  position: relative;
  padding: 10px;
  border: 1px solid rgb(230, 196, 196);
  background-color: rgb(253, 214, 174);
  border-radius: 30px;
  cursor:default;
  width: 120px;
  .label{
    position: absolute;
    top:-20px;
    background-color: rgb(242, 147, 242);
    padding: 2px;
    border-radius: 5px;
  }
  .inp_wrapper{
    // display: flex;
    // justify-content: center;
    // border:1px solid red;
    margin: auto;
    position: relative;
    width: 90%;
    height:30px;
    margin-bottom: 5px;
    .inp_formulas{
      margin: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
    }
    .btn_wrapper{
      .remove{
        // border: 1px solid red;
        background-color: #ea9a92;
        border-radius: 50%;
        text-align: center;
        font-size: 12px;
        line-height: 12px;
        width: 13px;
        height: 13px;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        &:hover{
          background-color: #dd786f;
        }
      }
      .add{
        // border: 1px solid red;
        background-color: #6be19c;
        text-align: center;
        font-size: 12px;
        line-height: 12px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: pointer;
        &:hover{
          background-color: #5afa7a;
        }
      }
    }
  }
}
</style>


