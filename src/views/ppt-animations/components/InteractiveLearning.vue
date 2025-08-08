<template>
  <div class="interactive-learning">
    <!-- 第8页：聚焦综合大题与主观操作 -->
    <div class="slide slide-8" :class="{ 'active': currentSlide === 7 }">
      <div class="slide-content">
        <div class="interactive-section">
          <h2 class="slide-title">聚焦综合大题与主观操作</h2>

          <!-- 核心理念 -->
          <div class="core-concept">
            <div class="concept-icon">
              <Icon icon="lucide:target" class="icon" />
            </div>
            <div class="concept-text">
              <h3>直击编译原理学习的核心需求</h3>
              <p>我们不满足于让学生通过课本或者静态教材来学习编译原理这门课程</p>
            </div>
          </div>

          <!-- 交互式平台介绍 -->
          <div class="platform-intro">
            <div class="platform-card">
              <div class="platform-icon">
                <Icon icon="lucide:mouse-pointer-click" class="icon" />
              </div>
              <h3>交互式做题平台</h3>
              <p>用户通过输入实例，体验完整流程解决综合性问题</p>
            </div>
          </div>

          <!-- 学习流程展示 -->
          <div class="learning-flow">
            <h3 class="flow-title">完整学习流程</h3>
            <div class="flow-steps">
              <div class="flow-step">
                <div class="step-icon">
                  <Icon icon="lucide:input" class="icon" />
                </div>
                <div class="step-content">
                  <h4>输入实例</h4>
                  <p>从正则式构建 NFA</p>
                </div>
              </div>
              <div class="flow-arrow">
                <Icon icon="lucide:arrow-right" class="arrow-icon" />
              </div>
              <div class="flow-step">
                <div class="step-icon">
                  <Icon icon="lucide:git-branch" class="icon" />
                </div>
                <div class="step-content">
                  <h4>推导过程</h4>
                  <p>再到最小化 DFA</p>
                </div>
              </div>
              <div class="flow-arrow">
                <Icon icon="lucide:arrow-right" class="arrow-icon" />
              </div>
              <div class="flow-step">
                <div class="step-icon">
                  <Icon icon="lucide:layers" class="icon" />
                </div>
                <div class="step-content">
                  <h4>文法推导</h4>
                  <p>到 LL1 分析表生成</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 主观大题特点 -->
          <div class="subjective-features">
            <h3 class="features-title">环环相扣的主观大题</h3>
            <div class="features-grid">
              <div class="feature-item">
                <div class="feature-icon">
                  <Icon icon="lucide:hand" class="icon" />
                </div>
                <h4>亲手完成</h4>
                <p>从输入到推导</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <Icon icon="lucide:pen-tool" class="icon" />
                </div>
                <h4>绘图操作</h4>
                <p>从绘图到验证</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <Icon icon="lucide:graduation-cap" class="icon" />
                </div>
                <h4>做中学</h4>
                <p>全流程操作</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  currentSlide: number
}>()

defineOptions({
  name: 'InteractiveLearning'
})
</script>

<style scoped>
.interactive-learning {
  width: 100%;
  height: 100%;
}

/* 第8页：聚焦综合大题与主观操作 */
.slide-8.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-8.active .core-concept {
  animation: conceptSlideIn 1s ease-out 0.5s forwards;
}

.slide-8.active .platform-intro {
  animation: platformSlideIn 1s ease-out 1s forwards;
}

.slide-8.active .learning-flow {
  animation: flowSlideIn 1s ease-out 1.5s forwards;
}

.slide-8.active .subjective-features {
  animation: featuresSlideIn 1s ease-out 2s forwards;
}

.interactive-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

/* 核心理念 */
.core-concept {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 800px;
  opacity: 0;
  transform: translateY(50px);
}

.concept-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.concept-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.concept-text h3 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.concept-text p {
  font-size: 1.2rem;
  color: #cbd5e1;
  line-height: 1.6;
}

/* 交互式平台介绍 */
.platform-intro {
  opacity: 0;
  transform: translateY(50px);
}

.platform-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  max-width: 600px;
}

.platform-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.platform-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.platform-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.platform-card p {
  font-size: 1.1rem;
  color: #cbd5e1;
  line-height: 1.6;
}

/* 学习流程展示 */
.learning-flow {
  opacity: 0;
  transform: translateY(50px);
}

.flow-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.flow-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  min-width: 200px;
}

.step-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
}

.step-content h4 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
}

.step-content p {
  font-size: 0.9rem;
  color: #cbd5e1;
}

.flow-arrow {
  animation: arrowPulse 2s ease-in-out infinite;
}

.arrow-icon {
  width: 30px;
  height: 30px;
  color: #667eea;
}

/* 主观大题特点 */
.subjective-features {
  opacity: 0;
  transform: translateY(50px);
}

.features-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.feature-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.feature-item h4 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
}

.feature-item p {
  font-size: 1rem;
  color: #cbd5e1;
}

/* 动画关键帧 */
@keyframes conceptSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes platformSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes flowSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes featuresSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes arrowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .core-concept {
    flex-direction: column;
    text-align: center;
  }

  .flow-steps {
    flex-direction: column;
    gap: 1rem;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
