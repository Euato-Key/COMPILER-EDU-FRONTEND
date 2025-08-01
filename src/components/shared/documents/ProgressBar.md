# ProgressBar 进度条组件

一个通用的进度条组件，支持多种颜色主题和配置选项。

## 基本用法

```vue
<template>
  <ProgressBar :percentage="75" />
</template>

<script setup>
import { ProgressBar } from '@/components/shared'
</script>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| percentage | number | - | 进度百分比 (0-100) |
| label | string | '完成进度' | 进度条标签 |
| showLabel | boolean | true | 是否显示标签和百分比 |
| theme | 'blue' \| 'green' \| 'purple' \| 'orange' \| 'red' | 'blue' | 颜色主题 |
| showCompletionMessage | boolean | false | 是否显示完成提示 |
| completionMessage | string | '完成！' | 完成提示文字 |
| completionIcon | string | 'lucide:check-circle' | 完成提示图标 |

## 使用示例

### 1. 基本进度条
```vue
<ProgressBar :percentage="50" />
```

### 2. 自定义标签
```vue
<ProgressBar 
  :percentage="75" 
  label="下载进度" 
/>
```

### 3. 不同颜色主题
```vue
<!-- 蓝色主题 -->
<ProgressBar :percentage="60" theme="blue" />

<!-- 绿色主题 -->
<ProgressBar :percentage="80" theme="green" />

<!-- 紫色主题 -->
<ProgressBar :percentage="90" theme="purple" />

<!-- 橙色主题 -->
<ProgressBar :percentage="40" theme="orange" />

<!-- 红色主题 -->
<ProgressBar :percentage="20" theme="red" />
```

### 4. 隐藏标签
```vue
<ProgressBar 
  :percentage="65" 
  :show-label="false" 
/>
```

### 5. 显示完成提示
```vue
<ProgressBar 
  :percentage="100" 
  :show-completion-message="true"
  completion-message="上传完成！"
  completion-icon="lucide:upload"
/>
```

### 6. 完整示例
```vue
<template>
  <div class="space-y-4">
    <!-- 总体进度 -->
    <ProgressBar
      :percentage="overallProgress"
      label="总体完成度"
      theme="blue"
      :show-completion-message="true"
      completion-message="恭喜！所有任务完成"
      completion-icon="lucide:trophy"
    />
    
    <!-- 子任务进度 -->
    <ProgressBar
      :percentage="taskProgress"
      label="任务进度"
      theme="green"
      :show-completion-message="true"
      completion-message="任务完成！"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ProgressBar } from '@/components/shared'

const overallProgress = ref(75)
const taskProgress = ref(90)
</script>
```

## 特性

- ✅ 完全使用 Tailwind CSS 样式
- ✅ 支持多种颜色主题
- ✅ 平滑的过渡动画
- ✅ 可自定义完成提示
- ✅ 响应式设计
- ✅ TypeScript 支持

## 在其他页面中使用

1. 导入组件：
```javascript
import { ProgressBar } from '@/components/shared'
```

2. 在模板中使用：
```vue
<ProgressBar 
  :percentage="yourProgressValue"
  label="你的标签"
  theme="blue"
/>
``` 