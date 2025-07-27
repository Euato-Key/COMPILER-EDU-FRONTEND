<script setup lang="ts">
import { ref, type Ref,type CSSProperties, type PropType } from 'vue';

const props = defineProps({
  text: String,
  category: String, // blank待填槽，onlyRead只读槽，已填槽
  state: String, // waitWriteIn待填入状态， normal正常未被操作状态
  check: String, // normal待校验状态，isCorrect校验正确状态，isError校验错误状态
  width: String,
  height: String,
  inpStyle: Object as PropType<CSSProperties>
})
const emit = defineEmits(["update:text","focus-input"])

let writingState:Ref<boolean> = ref(false)
const handerFocus = ()=>{
  emit('focus-input')
  writingState.value = true
}
</script>

<template>
  <div id="container" :style="{width:width,height:height}">
    <input
      id="box"
      autocomplete="off"
      :class="{
        blank: category == 'blank',
        onlyRead: category == 'onlyRead',
        isCorrect: check == 'isCorrect',
        isError: check == 'isError',
        writing: category == 'blank' && check == 'normal' && writingState,
      }"
      :style="inpStyle"
      :readonly=" category === 'onlyRead' || check === 'isCorrect' "
      :value="text"
      @input="emit('update:text', ($event.target as HTMLInputElement).value)"
      @focus="handerFocus"
      @blur="writingState = false"
    />
      <!-- {{ text }} -->
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/variable.module.scss" as *;

#container{
  width: 80px;
  height: 30px;
  // background-color: pink;
  box-sizing: border-box;
  #box{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    text-align: center;
    box-shadow: 0 2px 8px 3px #999999;
    border-radius:15px;
    font-family: "shuya";
  }
  #box:focus{
    outline: none;
    // box-shadow: 0 0 5px rgba(130, 186, 229, 0.901); /* 可选：添加阴影效果 */
  }
  .blank{
    background-color: $waitCheck_bgColor;
    border: 1px solid rgb(164, 155, 71);
  }
  .onlyRead{
    background-color: $onlyRead_bgColor;
    border: none;
  }
  .isCorrect{
    background-color: $isCorrect_bgColor;
  }
  .isError{
    background-color: $isError_bgColor;
  }
  .writing{
    border: 5px dashed rgb(255, 255, 255);
  }
}
</style>
