<template>
  <div class="video-intro-container">
    <!-- PPT动画框 -->
    <div class="ppt-frame" :class="{ 'fullscreen': isFullscreen }">
      <!-- 背景颗粒动画 -->
      <div class="background-animation">
        <div class="particles">
          <div v-for="i in 35" :key="i" class="particle" :style="getParticleStyle()"></div>
        </div>
      </div>

      <!-- 广州大学Logo - 右上角固定 -->
      <div class="university-logo">
        <img src="/广州大学-logo.svg" alt="广州大学Logo" class="logo-svg" />
        <img src="/广州大学文字.png" alt="广州大学" class="logo-text" />
      </div>

      <!-- 幻灯片内容 -->
      <div class="slides-wrapper" :style="{ transform: `translateX(-${currentSlide * (100/9)}%)` }">

        <!-- 第1页：标题页 -->
        <div class="slide slide-1" :class="{ 'active': currentSlide === 0 }">
          <div class="slide-content">
            <div class="title-section">
              <div class="logo-animation">
                <div class="logo-circle">
                  <Icon icon="lucide:code" class="logo-icon" />
                </div>
              </div>
              <h1 class="main-title">
                <span class="title-line">《编译原理》智能管控综合题</span>
                <span class="title-line">可视化线上学习系统</span>
              </h1>
              <p class="subtitle">让抽象的编译原理变得直观易懂</p>
            </div>
          </div>
        </div>

        <!-- 第2页：核心基石 -->
        <div class="slide slide-2" :class="{ 'active': currentSlide === 1 }">
          <div class="slide-content">
            <div class="concept-section">
              <h2 class="slide-title">编译原理作为计算机科学的核心基石</h2>
              <div class="concept-text">
                <p class="main-text">
                  编译原理作为计算机科学的核心基石，是连接高级编程语言与机器语言的桥梁，更是理解计算机系统底层逻辑的关键。
                </p>
                <div class="concept-grid">
                  <div class="concept-item">
                    <div class="concept-icon">
                      <Icon icon="lucide:arrow-left-right" class="icon" />
                    </div>
                    <h3>连接桥梁</h3>
                    <p>高级编程语言 ↔ 机器语言</p>
                  </div>
                  <div class="concept-item">
                    <div class="concept-icon">
                      <Icon icon="lucide:brain" class="icon" />
                    </div>
                    <h3>底层逻辑</h3>
                    <p>理解计算机系统核心</p>
                  </div>
                  <div class="concept-item">
                    <div class="concept-icon">
                      <Icon icon="lucide:layers" class="icon" />
                    </div>
                    <h3>系统架构</h3>
                    <p>软件与硬件的桥梁</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第3页：抽象概念挑战 -->
        <div class="slide slide-3" :class="{ 'active': currentSlide === 2 }">
          <div class="slide-content">
            <div class="problem-section">
              <h2 class="slide-title">抽象概念的挑战</h2>
              <div class="concept-text">
                <p class="main-text">
                  然而，这门课程中充斥着大量抽象概念 —— 从有限自动机的状态跳转，到语法树的层级构建，再到分析表的规则推导，这些内容往往让初学者望而生畏，难以通过静态文字或图片建立直观认知。
                </p>
                <div class="concepts-flow">
                  <div class="concept-flow-item">
                    <div class="flow-icon">
                      <Icon icon="lucide:git-branch" class="icon" />
                    </div>
                    <div class="flow-content">
                      <h3>有限自动机</h3>
                      <p>状态跳转算法步骤</p>
                    </div>
                  </div>
                  <div class="flow-arrow">
                    <Icon icon="lucide:arrow-right" class="arrow-icon" />
                  </div>
                  <div class="concept-flow-item">
                    <div class="flow-icon">
                      <Icon icon="lucide:tree-pine" class="icon" />
                    </div>
                    <div class="flow-content">
                      <h3>语法树</h3>
                      <p>语法分析算法步骤</p>
                    </div>
                  </div>
                  <div class="flow-arrow">
                    <Icon icon="lucide:arrow-right" class="arrow-icon" />
                  </div>
                  <div class="concept-flow-item">
                    <div class="flow-icon">
                      <Icon icon="lucide:table" class="icon" />
                    </div>
                    <div class="flow-content">
                      <h3>分析表</h3>
                      <p>LR分析算法步骤</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第4页：现有工具的局限性 -->
        <div class="slide slide-4" :class="{ 'active': currentSlide === 3 }">
          <div class="slide-content">
            <div class="limitation-section">
              <h2 class="slide-title">现有工具的局限性</h2>
              <div class="limitation-content">
                <div class="limitation-text">
                  <p class="main-text">
                    目前市面上许多学习工具局限于客观题的简单判断与选择，学生只需勾选答案却难以深入理解原理；
                  </p>
                  <p class="highlight-text">
                    而我们团队打造的《编译原理》智能管控综合题可视化线上学习系统，从根本上打破了这些局限：
                  </p>
                </div>
                <div class="limitation-cards">
                  <div class="limitation-card">
                    <div class="limitation-icon">
                      <Icon icon="lucide:file-text" class="icon" />
                    </div>
                    <h3>静态资料</h3>
                    <p>缺乏动态演示</p>
                  </div>
                  <div class="limitation-card">
                    <div class="limitation-icon">
                      <Icon icon="lucide:check-square" class="icon" />
                    </div>
                    <h3>结论式工具</h3>
                    <p>只给答案不解释</p>
                  </div>
                  <div class="limitation-card">
                    <div class="limitation-icon">
                      <Icon icon="lucide:help-circle" class="icon" />
                    </div>
                    <h3>难以理解</h3>
                    <p>无法深入原理</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第5页：解决方案 -->
        <div class="slide slide-5" :class="{ 'active': currentSlide === 4 }">
          <div class="slide-content">
            <div class="solution-section">
              <h2 class="slide-title">我们的解决方案</h2>
              <div class="solution-features">
                <div class="feature-item">
                  <div class="feature-icon">
                    <Icon icon="lucide:eye" class="icon" />
                  </div>
                  <h3>算法步骤可视化</h3>
                  <p>动态展示编译过程</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <Icon icon="lucide:mouse-pointer-click" class="icon" />
                  </div>
                  <h3>交互式学习</h3>
                  <p>实时操作和反馈</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <Icon icon="lucide:bot" class="icon" />
                  </div>
                  <h3>AI智能助手</h3>
                  <p>个性化学习指导</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <Icon icon="lucide:zap" class="icon" />
                  </div>
                  <h3>实时反馈</h3>
                  <p>即时验证学习效果</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第6页：开始体验 -->
        <div class="slide slide-6" :class="{ 'active': currentSlide === 5 }">
          <div class="slide-content">
            <div class="cta-section">
              <h2 class="slide-title">开始您的编译原理之旅</h2>
              <div class="cta-content">
                <div class="cta-icon">
                  <Icon icon="lucide:rocket" class="rocket-icon" />
                </div>
                <p class="cta-text">探索编译原理的奥秘，让学习变得简单有趣</p>
                <router-link to="/" class="cta-button">
                  <Icon icon="lucide:play" class="button-icon" />
                  立即开始体验
                  <Icon icon="lucide:arrow-right" class="button-icon" />
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- 第7页：核心需求与学习流程 -->
        <div class="slide slide-7" :class="{ 'active': currentSlide === 6 }">
          <div class="slide-content">
            <div class="concept-section">
              <h2 class="slide-title">聚焦综合大题与主观操作</h2>

              <div class="concept-content">
                <div class="concept-text">
                  <h3 class="concept-title">我们不满足于让学生通过课本或者静态教材来学习编译原理这门课程</h3>
                  <p class="concept-description">而是直击编译原理学习的核心需求，我们的网站提供了交互式做题平台，用户通过输入实例，以体验完整流程解决综合性问题。</p>
                </div>
              </div>

              <div class="learning-flow">
                <h3 class="flow-title">完整学习流程体验</h3>
                <div class="flow-steps">
                  <div class="flow-step">
                    <div class="step-icon">
                      <Icon icon="lucide:keyboard" class="icon" />
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
            </div>
          </div>
        </div>

        <!-- 第8页：主观大题 -->
        <div class="slide slide-8" :class="{ 'active': currentSlide === 7 }">
          <div class="slide-content">
            <div class="subjective-section">
              <h2 class="slide-title">聚焦综合大题与主观操作</h2>

              <div class="subjective-intro">
                <h3>每个模块都是一道"主观大题"</h3>
                <p>无论是从正则式构建 NFA 再到最小化 DFA，还是从文法推导到 LL1 分析表的逐步生成，每个模块都是一道环环相扣的"主观大题"</p>
              </div>

              <div class="subjective-grid">
                <div class="subjective-item">
                  <div class="subjective-icon">
                    <Icon icon="lucide:hand" class="icon" />
                  </div>
                  <h4>亲手完成</h4>
                  <p>从输入到推导</p>
                </div>
                <div class="subjective-item">
                  <div class="subjective-icon">
                    <Icon icon="lucide:pen-tool" class="icon" />
                  </div>
                  <h4>绘图操作</h4>
                  <p>从绘图到验证</p>
                </div>
                <div class="subjective-item">
                  <div class="subjective-icon">
                    <Icon icon="lucide:graduation-cap" class="icon" />
                  </div>
                  <h4>做中学</h4>
                  <p>全流程操作</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第9页：感谢页 -->
        <div class="slide slide-9" :class="{ 'active': currentSlide === 8 }">
          <div class="slide-content">
            <div class="thank-you-section">
              <h2 class="slide-title">感谢聆听</h2>
              <div class="thank-you-content">
                <div class="thank-you-icon">
                  <Icon icon="lucide:heart" class="heart-icon" />
                </div>
                <p class="thank-you-text">感谢各位老师、同学的关注与支持</p>
                <div class="team-info">
                  <h3>项目团队</h3>
                  <p>广州大学计算机科学与网络工程学院</p>
                  <p>指导老师：吴昱老师</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- 全屏时隐藏的控制按钮 -->
      <div v-if="!isFullscreen" class="top-slide-controls">
        <div class="slide-indicators">
          <button
            v-for="i in 9"
            :key="i"
            @click="goToSlide(i - 1)"
            class="indicator"
            :class="{ active: currentSlide === i - 1 }"
            :disabled="isTransitioning"
          ></button>
        </div>
        <div class="control-buttons">
          <button @click="previousSlide" class="control-btn" :disabled="isTransitioning">
            <Icon icon="lucide:chevron-left" class="control-icon" />
          </button>
          <button @click="nextSlide" class="control-btn" :disabled="isTransitioning">
            <Icon icon="lucide:chevron-right" class="control-icon" />
          </button>
        </div>
      </div>

      <!-- 全屏时隐藏的控制面板 -->
      <div v-if="!isFullscreen" class="top-control-panel">
        <button @click="toggleAutoPlay" class="control-btn" :class="{ active: autoPlayEnabled }">
          <Icon :icon="autoPlayEnabled ? 'lucide:pause' : 'lucide:play'" class="control-icon" />
        </button>
        <button @click="toggleFullscreen" class="control-btn">
          <Icon :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'" class="control-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'VideoIntroNewPage'
})

const currentSlide = ref(0)
const isFullscreen = ref(false)
const isTransitioning = ref(false)
const autoPlayEnabled = ref(false)
let autoPlayTimer: number | null = null

// 粒子样式生成
const getParticleStyle = () => {
  const delay = Math.random() * 10
  const duration = 15 + Math.random() * 10
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = 6 + Math.random() * 8
  const colors = [
    'linear-gradient(45deg, #667eea, #764ba2)',
    'linear-gradient(45deg, #f093fb, #f5576c)',
    'linear-gradient(45deg, #4facfe, #00f2fe)',
    'linear-gradient(45deg, #43e97b, #38f9d7)',
    'linear-gradient(45deg, #fa709a, #fee140)'
  ]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--x': `${x}%`,
    '--y': `${y}%`,
    '--color': randomColor,
    '--size': `${size}px`
  }
}

// 幻灯片控制
const nextSlide = () => {
  if (!isTransitioning.value) {
    isTransitioning.value = true
    if (currentSlide.value < 8) {
      currentSlide.value++
    } else {
      currentSlide.value = 0
    }
    setTimeout(() => {
      isTransitioning.value = false
    }, 800)
  }
}

const previousSlide = () => {
  if (!isTransitioning.value) {
    isTransitioning.value = true
    if (currentSlide.value > 0) {
      currentSlide.value--
    } else {
      currentSlide.value = 8
    }
    setTimeout(() => {
      isTransitioning.value = false
    }, 800)
  }
}

const goToSlide = (index: number) => {
  if (index >= 0 && index <= 8 && index !== currentSlide.value && !isTransitioning.value) {
    isTransitioning.value = true
    currentSlide.value = index
    setTimeout(() => {
      isTransitioning.value = false
    }, 800)
  }
}

// 自动播放
const startAutoPlay = () => {
  autoPlayTimer = window.setInterval(() => {
    if (currentSlide.value < 8) {
      currentSlide.value++
    } else {
      currentSlide.value = 0
    }
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

const toggleAutoPlay = () => {
  autoPlayEnabled.value = !autoPlayEnabled.value
  if (autoPlayEnabled.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

// 全屏控制
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 键盘控制
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowRight':
    case ' ':
      event.preventDefault()
      nextSlide()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousSlide()
      break
    case 'Escape':
      if (document.fullscreenElement) {
        document.exitFullscreen()
        isFullscreen.value = false
      }
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  stopAutoPlay()
})
</script>

<style scoped>
.video-intro-container {
  width: 100vw;
  height: 100vh;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* PPT动画框 */
.ppt-frame {
  width: 90vw;
  height: 90vh;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%);
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
  transition: all 0.3s ease;
}

.ppt-frame.fullscreen {
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  box-shadow: none;
}

/* 背景颗粒动画 */
.background-animation {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.3;
}

.particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  animation: particleFloat var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  left: var(--x);
  top: var(--y);
  opacity: 0.6;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.4);
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-20px) translateX(10px) scale(1.2) rotate(90deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-40px) translateX(-5px) scale(0.8) rotate(180deg);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-20px) translateX(15px) scale(1.1) rotate(270deg);
    opacity: 0.7;
  }
}

/* 广州大学Logo */
.university-logo {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 8px 12px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.logo-svg {
  width: 32px;
  height: 32px;
}

.logo-text {
  height: 24px;
  width: auto;
}

/* 幻灯片容器 */
.slides-wrapper {
  position: relative;
  width: 900%;
  height: 100%;
  display: flex;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.slide {
  width: calc(100% / 9);
  min-width: calc(100% / 9);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide.active {
  opacity: 1;
  transform: scale(1);
}

.slide-content {
  width: 100%;
  max-width: 1200px;
  text-align: center;
  color: #1e293b;
}

/* 第1页：标题页 */
.slide-1 {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
}

.slide-1.active .logo-animation {
  animation: logoAppear 2s ease-out forwards;
}

.slide-1.active .main-title {
  animation: titleSlideIn 1.5s ease-out 0.5s forwards;
}

.slide-1.active .subtitle {
  animation: subtitleFadeIn 2s ease-out 1s forwards;
}

.logo-animation {
  margin-bottom: 3rem;
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
}

.logo-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: logoPulse 3s ease-in-out infinite;
  box-shadow: 0 0 50px rgba(59, 130, 246, 0.3);
}

.logo-icon {
  width: 60px;
  height: 60px;
  color: white;
}

@keyframes logoAppear {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(-180deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 50px rgba(59, 130, 246, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 80px rgba(59, 130, 246, 0.5);
  }
}

.main-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(50px);
  color: #1e293b;
}

.title-line {
  display: block;
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  }
  50% {
    text-shadow: 0 0 40px rgba(59, 130, 246, 0.4);
  }
}

.subtitle {
  font-size: 1.5rem;
  color: #64748b;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes subtitleFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 通用幻灯片样式 */
.slide-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 第2页：核心基石 */
.slide-2.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-2.active .concept-item:nth-child(1) {
  animation: cardSlideInLeft 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-2.active .concept-item:nth-child(2) {
  animation: cardSlideInUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.8s forwards;
}

.slide-2.active .concept-item:nth-child(3) {
  animation: cardSlideInRight 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.1s forwards;
}

.concept-text {
  margin-top: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.main-text {
  font-size: 1.3rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: left;
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.concept-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(50px) scale(0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.concept-item:hover {
  transform: translateY(-10px) scale(1.02);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.concept-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.concept-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.concept-item h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.concept-item p {
  color: #64748b;
  font-size: 1rem;
}

/* 第3页：抽象概念挑战 */
.slide-3.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-3.active .concept-flow-item:nth-child(1) { animation: flowItemSlide 1s ease-out 0.5s forwards; }
.slide-3.active .concept-flow-item:nth-child(3) { animation: flowItemSlide 1s ease-out 0.9s forwards; }
.slide-3.active .concept-flow-item:nth-child(5) { animation: flowItemSlide 1s ease-out 1.3s forwards; }

.concepts-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.concept-flow-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  opacity: 0;
  transform: translateX(-50px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.flow-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.flow-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
}

.flow-content h3 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.flow-content p {
  color: #64748b;
  font-size: 0.9rem;
}

.flow-arrow {
  animation: arrowPulse 2s ease-in-out infinite;
}

.arrow-icon {
  width: 30px;
  height: 30px;
  color: #3b82f6;
}

@keyframes flowItemSlide {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

/* 第4页：现有工具的局限性 */
.slide-4.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-4.active .main-text {
  animation: textSlideIn 1s ease-out 0.5s forwards;
}

.slide-4.active .highlight-text {
  animation: textSlideIn 1s ease-out 1.5s forwards;
}

.slide-4.active .limitation-card:nth-child(1) { animation: cardSlideIn 1s ease-out 2s forwards; }
.slide-4.active .limitation-card:nth-child(2) { animation: cardSlideIn 1s ease-out 2.5s forwards; }
.slide-4.active .limitation-card:nth-child(3) { animation: cardSlideIn 1s ease-out 3s forwards; }

.limitation-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.limitation-text {
  text-align: center;
  max-width: 800px;
}

.highlight-text {
  font-size: 1.5rem;
  color: #3b82f6;
  font-weight: bold;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(30px);
}

.limitation-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.limitation-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  opacity: 0;
  transform: translateY(50px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.limitation-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.limitation-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.limitation-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.limitation-card p {
  color: #64748b;
  font-size: 1rem;
}

/* 第5页：解决方案 */
.slide-5.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-5.active .feature-item:nth-child(1) { animation: featureZoomIn 1s ease-out 0.5s forwards; }
.slide-5.active .feature-item:nth-child(2) { animation: featureZoomIn 1s ease-out 1.5s forwards; }
.slide-5.active .feature-item:nth-child(3) { animation: featureZoomIn 1s ease-out 2.5s forwards; }
.slide-5.active .feature-item:nth-child(4) { animation: featureZoomIn 1s ease-out 3.5s forwards; }

.solution-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.feature-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  opacity: 0;
  transform: scale(0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
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

.feature-item h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.feature-item p {
  color: #64748b;
  font-size: 1rem;
}

@keyframes featureZoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 第6页：开始体验 */
.slide-6.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-6.active .cta-icon {
  animation: rocketFloat 3s ease-in-out 0.5s infinite;
}

.slide-6.active .cta-text {
  animation: textFadeIn 1s ease-out 0.7s forwards;
}

.slide-6.active .cta-button {
  animation: buttonAppear 1s ease-out 1s forwards;
}

.cta-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.cta-icon {
  opacity: 0;
  transform: translateY(20px);
}

.cta-text {
  opacity: 0;
  transform: translateY(20px);
}

.cta-button {
  opacity: 0;
  transform: scale(0.8);
}

.rocket-icon {
  width: 100px;
  height: 100px;
  color: #3b82f6;
}

@keyframes rocketFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.cta-text {
  font-size: 1.5rem;
  color: #64748b;
  max-width: 600px;
  line-height: 1.6;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  text-decoration: none;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  animation: buttonPulse 2s ease-in-out infinite;
}

.cta-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

.button-icon {
  width: 24px;
  height: 24px;
}

@keyframes buttonPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
  }
}

/* 第7页：核心需求与学习流程 */
.slide-7.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-7.active .concept-content {
  animation: contentReveal 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
}

.slide-7.active .learning-flow {
  animation: flowContainer 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.4s forwards;
}

.concept-content {
  margin-top: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  transform: translateY(30px);
}

.concept-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.concept-description {
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.learning-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  opacity: 0;
  transform: translateY(50px);
}

.flow-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  color: #1e293b;
  margin-bottom: 1rem;
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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  min-width: 200px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.flow-step:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.step-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
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
  color: #1e293b;
}

.step-content p {
  font-size: 0.9rem;
  color: #64748b;
}

/* 第8页：主观大题 */
.slide-8.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-8.active .subjective-intro {
  animation: introSlide 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.8s forwards;
}

.slide-8.active .subjective-grid {
  animation: gridAppear 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.5s forwards;
}

.subjective-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
}

.subjective-intro {
  text-align: center;
  max-width: 800px;
  opacity: 0;
  transform: translateY(30px);
  position: relative;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.subjective-intro:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
}

.subjective-intro h3 {
  color: #3b82f6;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.subjective-intro p {
  color: #475569;
  font-size: 1.2rem;
  line-height: 1.6;
}

.subjective-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  opacity: 0;
  transform: translateY(30px);
}

.subjective-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.8rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  opacity: 0;
  transform: translateY(50px) scale(0.8);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.subjective-item:hover {
  transform: translateY(-12px) scale(1.05);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.subjective-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.subjective-icon .icon {
  width: 25px;
  height: 25px;
  color: white;
}

.subjective-item h4 {
  color: #1e293b;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.subjective-item p {
  color: #64748b;
  font-size: 1rem;
}

/* 第9页：感谢页 */
.slide-9.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-9.active .thank-you-content {
  animation: thankYouAppear 1.5s ease-out 0.5s forwards;
}

.thank-you-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.thank-you-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  opacity: 0;
  transform: translateY(30px);
}

.thank-you-icon {
  animation: heartBeat 2s ease-in-out infinite;
}

.heart-icon {
  width: 80px;
  height: 80px;
  color: #ef4444;
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.thank-you-text {
  font-size: 1.5rem;
  color: #64748b;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
}

.team-info {
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.team-info h3 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1e293b;
}

.team-info p {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

/* 控制按钮 */
.top-slide-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.slide-indicators {
  display: flex;
  gap: 0.25rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #3b82f6;
  transform: scale(1.2);
}

.indicator:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.control-buttons {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-icon {
  width: 16px;
  height: 16px;
}

.top-control-panel {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-left: 12rem;
}

.top-control-panel .control-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.top-control-panel .control-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.top-control-panel .control-btn.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
}

/* 动画关键帧 */
@keyframes cardSlideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-100px) rotateY(-15deg) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-20px) rotateY(-5deg) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotateY(0deg) scale(1);
  }
}

@keyframes cardSlideInUp {
  0% {
    opacity: 0;
    transform: translateY(100px) rotateX(15deg) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateY(20px) rotateX(5deg) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg) scale(1);
  }
}

@keyframes cardSlideInRight {
  0% {
    opacity: 0;
    transform: translateX(100px) rotateY(15deg) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateX(20px) rotateY(5deg) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotateY(0deg) scale(1);
  }
}

@keyframes textSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes textFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes buttonAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes contentReveal {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9) rotateY(10deg);
  }
  50% {
    opacity: 0.6;
    transform: translateY(15px) scale(0.95) rotateY(5deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateY(0deg);
  }
}

@keyframes flowContainer {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.8) rotateZ(-5deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(25px) scale(0.9) rotateZ(-2deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateZ(0deg);
  }
}

@keyframes introSlide {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.8) rotateX(15deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(25px) scale(0.9) rotateX(7deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

@keyframes gridAppear {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.7) rotateY(15deg);
  }
  50% {
    opacity: 0.5;
    transform: translateY(25px) scale(0.85) rotateY(7deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateY(0deg);
  }
}

@keyframes thankYouAppear {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .slide-title {
    font-size: 2rem;
  }

  .concept-grid,
  .limitation-cards {
    grid-template-columns: 1fr;
  }

  .concepts-flow {
    flex-direction: column;
    gap: 1rem;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .solution-features {
    grid-template-columns: 1fr;
  }

  .subjective-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .flow-steps {
    flex-direction: column;
    gap: 1rem;
  }

  .university-logo {
    top: 10px;
    right: 10px;
    padding: 6px 8px;
  }

  .logo-svg {
    width: 24px;
    height: 24px;
  }

  .logo-text {
    height: 18px;
  }
}
</style>