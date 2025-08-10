<template>
  <div class="video-intro-container">
    <!-- 16:9 容器 -->
    <div class="slide-container" :class="{ 'fullscreen': isFullscreen }">
      <!-- 背景 -->
      <div class="background-animation">
                 <div class="particles">
           <div v-for="i in 35" :key="i" class="particle" :style="getParticleStyle()"></div>
         </div>
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
                <span class="title-line">编译原理</span>
                <span class="title-line">可视化平台</span>
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

        <!-- 第3页：抽象概念 -->
        <div class="slide slide-3" :class="{ 'active': currentSlide === 2 }">
          <div class="slide-content">
            <div class="problem-section">
              <h2 class="slide-title">抽象概念的挑战</h2>
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

        <!-- 第4页：学习困境 -->
        <div class="slide slide-4" :class="{ 'active': currentSlide === 3 }">
          <div class="slide-content">
            <div class="challenge-section">
              <h2 class="slide-title">初学者的困境</h2>
              <div class="challenge-grid">
                <div class="challenge-item">
                  <div class="challenge-icon">
                    <Icon icon="lucide:eye-off" class="icon" />
                  </div>
                  <h3>算法步骤难理解</h3>
                  <p>静态文字和图片的局限性</p>
                </div>
                <div class="challenge-item">
                  <div class="challenge-icon">
                    <Icon icon="lucide:zap-off" class="icon" />
                  </div>
                  <h3>缺乏交互性</h3>
                  <p>无法动态体验算法过程</p>
                </div>
                <div class="challenge-item">
                  <div class="challenge-icon">
                    <Icon icon="lucide:help-circle" class="icon" />
                  </div>
                  <h3>概念抽象</h3>
                  <p>望而生畏的复杂理论</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第5页：现有工具的局限性 -->
        <div class="slide slide-5" :class="{ 'active': currentSlide === 4 }">
          <div class="slide-content">
            <div class="limitation-section">
              <h2 class="slide-title">现有工具的局限性</h2>
              <div class="limitation-content">
                <div class="limitation-text">
                  <p class="main-text">
                    目前网络上许多学习工具局限于静态学习资料，结论式编译原理工具，学生只需勾选答案却难以深入理解原理
                  </p>
                  <p class="highlight-text">
                    而我们团队打造的可视化综合做题平台，从根本上打破了这一局限
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

        <!-- 第6页：解决方案 -->
        <div class="slide slide-6" :class="{ 'active': currentSlide === 5 }">
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

        <!-- 第7页：开始体验 -->
        <div class="slide slide-7" :class="{ 'active': currentSlide === 6 }">
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

                <!-- 第8页：核心需求与学习流程 -->
        <div class="slide slide-8" :class="{ 'active': currentSlide === 7 }">
          <div class="slide-content">
            <div class="concept-section">
              <h2 class="slide-title">聚焦综合大题与主观操作</h2>

              <div class="concept-content">
                <div class="concept-section">
                  <h3 class="concept-title">我们不满足于让学生通过课本或者静态教材来学习编译原理这门课程</h3>
                  <p class="concept-description">而是直击编译原理学习的核心需求，我们的网站提供了交互式做题平台，用户通过输入实例，以体验完整流程解决综合性问题。</p>
                </div>

                <div class="concept-highlight">
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

        <!-- 第9页：主观大题 -->
        <div class="slide slide-9" :class="{ 'active': currentSlide === 8 }">
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



      </div>

            <!-- 顶部导航控制 -->
      <div class="top-slide-controls">
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

      <!-- 左上角控制按钮 -->
      <div class="top-control-panel">
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
  name: 'VideoIntroPage'
})

const currentSlide = ref(0)
const isFullscreen = ref(false)
const isTransitioning = ref(false)
const autoPlayEnabled = ref(false) // 自动播放开关
let autoPlayTimer: number | null = null

// 粒子样式生成
const getParticleStyle = () => {
  const delay = Math.random() * 10
  const duration = 15 + Math.random() * 10
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = 6 + Math.random() * 8 // 6-14px 随机大小
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
      currentSlide.value = 0 // 回到首页
    }
    console.log('Next slide:', currentSlide.value)
    setTimeout(() => {
      isTransitioning.value = false
    }, 800) // 等待转场动画完成
  }
}

const previousSlide = () => {
  if (!isTransitioning.value) {
    isTransitioning.value = true
    if (currentSlide.value > 0) {
      currentSlide.value--
    } else {
      currentSlide.value = 8 // 从首页回到最后一页
    }
    console.log('Previous slide:', currentSlide.value)
    setTimeout(() => {
      isTransitioning.value = false
    }, 800) // 等待转场动画完成
  }
}

const goToSlide = (index: number) => {
  if (index >= 0 && index <= 8 && index !== currentSlide.value && !isTransitioning.value) {
    isTransitioning.value = true
    currentSlide.value = index
    console.log('Go to slide:', currentSlide.value)
    setTimeout(() => {
      isTransitioning.value = false
    }, 800) // 等待转场动画完成
  }
}



// 自动播放
const startAutoPlay = () => {
  autoPlayTimer = window.setInterval(() => {
    if (currentSlide.value < 8) {
      currentSlide.value++
    } else {
      currentSlide.value = 0 // 回到首页
    }
  }, 5000) // 每5秒切换一页
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
  // startAutoPlay() // 注释掉自动播放
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
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.slide-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

.slide-container.fullscreen {
  width: 100vw;
  height: 100vh;
}

/* 背景动画 */
.background-animation {
  position: absolute;
  inset: 0;
  z-index: 1;
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
  opacity: 0.8;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
    opacity: 0.8;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
  }
  25% {
    transform: translateY(-30px) translateX(15px) scale(1.5) rotate(90deg);
    opacity: 1;
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
  }
  50% {
    transform: translateY(-60px) translateX(-10px) scale(0.6) rotate(180deg);
    opacity: 0.3;
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
  }
  75% {
    transform: translateY(-30px) translateX(25px) scale(1.3) rotate(270deg);
    opacity: 0.9;
    box-shadow: 0 0 15px rgba(102, 126, 234, 0.7);
  }
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
  transform: scale(0.8);
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
  color: white;
}

/* 第1页：标题页 */
.slide-1 {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: logoPulse 3s ease-in-out infinite;
  box-shadow: 0 0 50px rgba(102, 126, 234, 0.5);
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
    box-shadow: 0 0 50px rgba(102, 126, 234, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 80px rgba(102, 126, 234, 0.8);
  }
}

.main-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(50px);
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
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
  50% {
    text-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
  }
}

.subtitle {
  font-size: 1.5rem;
  color: #cbd5e1;
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
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
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

.slide-2.active .concept-item:nth-child(1) .concept-icon {
  animation: iconBounce 0.8s ease-out 1.7s forwards;
}

.slide-2.active .concept-item:nth-child(2) .concept-icon {
  animation: iconBounce 0.8s ease-out 2s forwards;
}

.slide-2.active .concept-item:nth-child(3) .concept-icon {
  animation: iconBounce 0.8s ease-out 2.3s forwards;
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.concept-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(50px) scale(0.8);
}

.concept-item:hover {
  transform: translateY(-15px) scale(1.05) rotateY(5deg);
  background: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.concept-item:hover .concept-icon {
  animation: iconGlow 2s ease-in-out infinite;
}

.concept-item:hover h3 {
  animation: textGlow 2s ease-in-out infinite;
}

.concept-content {
  margin-top: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  transform: translateY(30px);
}

.concept-section {
  text-align: center;
  margin-bottom: 3rem;
}

.concept-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.concept-description {
  font-size: 1.2rem;
  color: #cbd5e1;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.concept-highlight {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(30px);
}

.highlight-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  transition: all 0.3s ease;
}

.highlight-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.highlight-text {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.highlight-arrow {
  display: flex;
  align-items: center;
  color: #667eea;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}

.concept-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  opacity: 0;
  transform: scale(0);
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
}

.concept-item p {
  color: #cbd5e1;
  font-size: 1rem;
}

@keyframes itemFlyIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

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

@keyframes iconGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8);
    transform: scale(1.1);
  }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
  }
}

@keyframes iconBounce {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-90deg);
    opacity: 0.8;
  }
  75% {
    transform: scale(0.9) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* 第3页：抽象概念 */
.slide-3.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-3.active .concept-flow-item:nth-child(1) { animation: flowItemSlide 1s ease-out 0.5s forwards; }
.slide-3.active .concept-flow-item:nth-child(3) { animation: flowItemSlide 1s ease-out 0.9s forwards; }
.slide-3.active .concept-flow-item:nth-child(5) { animation: flowItemSlide 1s ease-out 1.3s forwards; }

.slide-3.active .flow-arrow:nth-child(2) { animation: arrowPulse 2s ease-in-out 0.7s infinite; }
.slide-3.active .flow-arrow:nth-child(4) { animation: arrowPulse 2s ease-in-out 1.1s infinite; }

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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  opacity: 0;
  transform: translateX(-50px);
}

.flow-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
}

.flow-content p {
  color: #cbd5e1;
  font-size: 0.9rem;
}

.flow-arrow {
  animation: arrowPulse 2s ease-in-out infinite;
}

.arrow-icon {
  width: 30px;
  height: 30px;
  color: #667eea;
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

/* 第4页：学习困境 */
.slide-4.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-4.active .challenge-item:nth-child(1) { animation: challengeAppear 1s ease-out 0.5s forwards; }
.slide-4.active .challenge-item:nth-child(2) { animation: challengeAppear 1s ease-out 1.5s forwards; }
.slide-4.active .challenge-item:nth-child(3) { animation: challengeAppear 1s ease-out 2.5s forwards; }

.challenge-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.challenge-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  opacity: 0;
  transform: scale(0.8) rotateY(90deg);
}

.challenge-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.challenge-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.challenge-item h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.challenge-item p {
  color: #cbd5e1;
  font-size: 1rem;
}

@keyframes challengeAppear {
  from {
    opacity: 0;
    transform: scale(0.8) rotateY(90deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
  }
}

/* 第5页：现有工具的局限性 */
.slide-5.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-5.active .main-text {
  animation: textSlideIn 1s ease-out 0.5s forwards;
}

.slide-5.active .highlight-text {
  animation: textSlideIn 1s ease-out 1.5s forwards;
}

.slide-5.active .limitation-card:nth-child(1) { animation: cardSlideIn 1s ease-out 2s forwards; }
.slide-5.active .limitation-card:nth-child(2) { animation: cardSlideIn 1s ease-out 2.5s forwards; }
.slide-5.active .limitation-card:nth-child(3) { animation: cardSlideIn 1s ease-out 3s forwards; }

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

.main-text {
  font-size: 1.3rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(30px);
}

.highlight-text {
  font-size: 1.5rem;
  color: #667eea;
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  opacity: 0;
  transform: translateY(50px);
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
}

.limitation-card p {
  color: #cbd5e1;
  font-size: 1rem;
}

/* 第6页：解决方案 */
.slide-6.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-6.active .feature-item:nth-child(1) { animation: featureZoomIn 1s ease-out 0.5s forwards; }
.slide-6.active .feature-item:nth-child(2) { animation: featureZoomIn 1s ease-out 1.5s forwards; }
.slide-6.active .feature-item:nth-child(3) { animation: featureZoomIn 1s ease-out 2.5s forwards; }
.slide-6.active .feature-item:nth-child(4) { animation: featureZoomIn 1s ease-out 3.5s forwards; }

.solution-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.feature-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  opacity: 0;
  transform: scale(0.5);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
}

.feature-item p {
  color: #cbd5e1;
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

/* 第7页：开始体验 */
.slide-7.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-7.active .cta-icon {
  animation: rocketFloat 3s ease-in-out 0.5s infinite;
}

.slide-7.active .cta-text {
  animation: textFadeIn 1s ease-out 0.7s forwards;
}

.slide-7.active .cta-button {
  animation: buttonAppear 1s ease-out 1s forwards;
}

/* 第8页：核心需求与学习流程 - 炫酷渐显动画 */
.slide-8.active .slide-title {
  animation: slide8TitleAppear 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
}

.slide-8.active .concept-content {
  animation: slide8ContentReveal 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
}

.slide-8.active .concept-section {
  animation: slide8SectionFloat 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s forwards;
}

.slide-8.active .concept-title {
  animation: slide8TextGlow 6s ease-in-out 2s infinite;
}

.slide-8.active .concept-description {
  animation: slide8TextReveal 1s ease-out 1.8s forwards;
}

.slide-8.active .learning-flow {
  animation: slide8FlowContainer 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.4s forwards;
}

.slide-8.active .flow-title {
  animation: slide8FlowTitle 1s ease-out 2.8s forwards;
}

.slide-8.active .flow-step:nth-child(1) {
  animation: slide8StepCard1 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 3s forwards;
}

.slide-8.active .flow-step:nth-child(3) {
  animation: slide8StepCard2 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 3.3s forwards;
}

.slide-8.active .flow-step:nth-child(5) {
  animation: slide8StepCard3 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 3.6s forwards;
}

.slide-8.active .flow-step:nth-child(1) .step-icon {
  animation: slide8IconPulse1 1s ease-out 3.8s forwards, slide8IconGlow 5s ease-in-out 4.5s infinite;
}

.slide-8.active .flow-step:nth-child(3) .step-icon {
  animation: slide8IconPulse2 1s ease-out 4.1s forwards, slide8IconGlow 5s ease-in-out 4.8s infinite;
}

.slide-8.active .flow-step:nth-child(5) .step-icon {
  animation: slide8IconPulse3 1s ease-out 4.4s forwards, slide8IconGlow 5s ease-in-out 5.1s infinite;
}

.slide-8.active .flow-step:nth-child(1) .step-content h4 {
  animation: slide8TextSlide1 0.8s ease-out 4s forwards;
}

.slide-8.active .flow-step:nth-child(3) .step-content h4 {
  animation: slide8TextSlide2 0.8s ease-out 4.3s forwards;
}

.slide-8.active .flow-step:nth-child(5) .step-content h4 {
  animation: slide8TextSlide3 0.8s ease-out 4.6s forwards;
}

.slide-8.active .flow-step:nth-child(1) .step-content p {
  animation: slide8TextFade1 0.8s ease-out 4.2s forwards;
}

.slide-8.active .flow-step:nth-child(3) .step-content p {
  animation: slide8TextFade2 0.8s ease-out 4.5s forwards;
}

.slide-8.active .flow-step:nth-child(5) .step-content p {
  animation: slide8TextFade3 0.8s ease-out 4.8s forwards;
}

.slide-8.active .flow-arrow:nth-child(2) {
  animation: slide8ArrowFlow1 4s ease-in-out 3.2s infinite;
}

.slide-8.active .flow-arrow:nth-child(4) {
  animation: slide8ArrowFlow2 4s ease-in-out 3.5s infinite;
}

/* 第9页：学习流程 */
.slide-9.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-9.active .learning-flow {
  animation: flowSlideIn 1s ease-out 0.5s forwards;
}

.slide-9.active .flow-step:nth-child(1) {
  animation: stepSlideIn 1s ease-out 0.8s forwards;
}

.slide-9.active .flow-step:nth-child(3) {
  animation: stepSlideIn 1s ease-out 1.1s forwards;
}

.slide-9.active .flow-step:nth-child(5) {
  animation: stepSlideIn 1s ease-out 1.4s forwards;
}

.slide-9.active .flow-arrow:nth-child(2) {
  animation: arrowFlow 2s ease-in-out 1s infinite;
}

.slide-9.active .flow-arrow:nth-child(4) {
  animation: arrowFlow 2s ease-in-out 1.3s infinite;
}

/* 第9页：主观大题 - 增强动画效果 */
.slide-9.active .slide-title {
  animation: titleSlideIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s forwards;
}

.slide-9.active .subjective-intro {
  animation: subjectiveIntroSlide 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.8s forwards;
}

.slide-9.active .subjective-intro h3 {
  animation: textGlowPulse 5s ease-in-out 2s infinite;
}

.slide-9.active .subjective-grid {
  animation: gridAppear 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.5s forwards;
}

.slide-9.active .subjective-item:nth-child(1) {
  animation: subjectiveItemFlyIn 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards;
}

.slide-9.active .subjective-item:nth-child(2) {
  animation: subjectiveItemFlyIn 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2.3s forwards;
}

.slide-9.active .subjective-item:nth-child(3) {
  animation: subjectiveItemFlyIn 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2.6s forwards;
}

.slide-9.active .subjective-item:nth-child(1) .subjective-icon {
  animation: iconBounceRotate 1s ease-out 3.2s forwards, iconGlowPulse 4s ease-in-out 4s infinite;
}

.slide-9.active .subjective-item:nth-child(2) .subjective-icon {
  animation: iconBounceRotate 1s ease-out 3.5s forwards, iconGlowPulse 4s ease-in-out 4.2s infinite;
}

.slide-9.active .subjective-item:nth-child(3) .subjective-icon {
  animation: iconBounceRotate 1s ease-out 3.8s forwards, iconGlowPulse 4s ease-in-out 4.4s infinite;
}

.slide-9.active .subjective-item:nth-child(1) h4 {
  animation: textSlideInUp 0.8s ease-out 3.4s forwards;
}

.slide-9.active .subjective-item:nth-child(2) h4 {
  animation: textSlideInUp 0.8s ease-out 3.7s forwards;
}

.slide-9.active .subjective-item:nth-child(3) h4 {
  animation: textSlideInUp 0.8s ease-out 4s forwards;
}

.slide-9.active .subjective-item:nth-child(1) p {
  animation: textFadeIn 0.8s ease-out 3.6s forwards;
}

.slide-9.active .subjective-item:nth-child(2) p {
  animation: textFadeIn 0.8s ease-out 3.9s forwards;
}

.slide-9.active .subjective-item:nth-child(3) p {
  animation: textFadeIn 0.8s ease-out 4.2s forwards;
}

.slide-10 .slide-content > div:nth-child(3) > div {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}







/* 第10页样式 */
.subjective-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  height: 100%;
}

.subjective-intro {
  text-align: center;
  max-width: 800px;
  opacity: 0;
  transform: translateY(30px);
  position: relative;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.subjective-intro:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.subjective-intro h3 {
  color: #667eea;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.subjective-intro p {
  color: white;
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.8rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  opacity: 0;
  transform: translateY(50px) scale(0.8);
  position: relative;
  overflow: hidden;
}

.subjective-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.6s ease;
}

.subjective-item:hover::before {
  left: 100%;
}

.subjective-item:hover {
  transform: translateY(-12px) scale(1.05) rotateY(5deg);
  background: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(102, 126, 234, 0.2),
    0 0 40px rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.5);
}

.subjective-item:hover .subjective-icon {
  animation: iconSpin 1s ease-in-out infinite;
}

.subjective-item:hover h4 {
  animation: textGlow 2s ease-in-out infinite;
}

.subjective-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.subjective-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.subjective-item:hover .subjective-icon::before {
  transform: translateX(100%);
}

.subjective-icon .icon {
  width: 25px;
  height: 25px;
  color: white;
}

.subjective-item h4 {
  color: white;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.subjective-item p {
  color: #cbd5e1;
  font-size: 1rem;
}

.subjective-conclusion {
  text-align: center;
  max-width: 800px;
  opacity: 0;
  transform: translateY(30px);
}

.subjective-conclusion h3 {
  color: #667eea;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.subjective-conclusion p {
  color: white;
  font-size: 1.2rem;
  line-height: 1.6;
}

/* 第8-10页样式 */
.subjective-operation-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  height: 100%;
}

/* 第一层：核心理念 */
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

/* 第二层：交互平台 */
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

/* 第三层：学习流程 */
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
  color: white;
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  min-width: 200px;
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.3s ease;
}

.flow-step:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
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

/* 第四层：主观大题 */
.subjective-highlight {
  text-align: center;
  max-width: 800px;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(50px);
}

.subjective-highlight .highlight-text h3 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: white;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subjective-highlight .highlight-text p {
  font-size: 1.3rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.subjective-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  opacity: 0;
  transform: translateY(50px);
}

.feature-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
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

.final-highlight {
  text-align: center;
  max-width: 800px;
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(50px);
}

.final-highlight .highlight-text h3 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #10b981;
}

.final-highlight .highlight-text p {
  font-size: 1.2rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.need-highlight {
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
  transition: all 0.3s ease;
}

.highlight-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.highlight-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.highlight-text h3 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.highlight-text p {
  font-size: 1.2rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.solution-preview {
  opacity: 0;
  transform: translateY(50px);
}

.solution-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  max-width: 600px;
}

.solution-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.solution-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.solution-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.solution-card p {
  font-size: 1.1rem;
  color: #cbd5e1;
  line-height: 1.6;
}

/* 第9页样式 */
.learning-process-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
}

.process-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.process-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  min-width: 200px;
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.3s ease;
}

.process-step:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.process-step .step-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.process-step .step-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
}

.process-step .step-content h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
}

.process-step .step-content p {
  font-size: 0.9rem;
  color: #cbd5e1;
}

.process-arrow {
  animation: arrowPulse 2s ease-in-out infinite;
}

/* 第10页样式 */
.subjective-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
}

.subjective-highlight {
  text-align: center;
  max-width: 800px;
  opacity: 0;
  transform: translateY(50px);
}

.subjective-highlight .highlight-text h3 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: white;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subjective-highlight .highlight-text p {
  font-size: 1.3rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.subjective-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  opacity: 0;
  transform: translateY(50px);
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
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.core-concept::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s ease;
}

.slide-8.active .core-concept::before {
  animation: shimmer 2s ease-in-out 1s infinite;
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
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.flow-step::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(240, 147, 251, 0.1), transparent);
  transition: left 0.6s ease;
}

.flow-step:hover::before {
  left: 100%;
}

.flow-step:hover {
  transform: translateY(-8px) scale(1.02) rotateY(3deg);
  background: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 15px rgba(240, 147, 251, 0.2),
    0 0 30px rgba(240, 147, 251, 0.1);
  border-color: rgba(240, 147, 251, 0.4);
}

.flow-step:hover .step-icon {
  animation: slide8IconHover 1s ease-in-out infinite;
}

.flow-step:hover .step-content h4 {
  animation: slide8TextHover 2s ease-in-out infinite;
}

.flow-step::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #f093fb, #f5576c);
  transition: width 0.3s ease;
}

.flow-step:hover::after {
  width: 100%;
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
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.step-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.flow-step:hover .step-icon::before {
  transform: translateX(100%);
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
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-item:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(250, 112, 154, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.feature-item:hover::before {
  transform: translateX(100%);
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
  color: #667eea;
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
  color: #cbd5e1;
  max-width: 600px;
  line-height: 1.6;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.button-icon {
  width: 24px;
  height: 24px;
}

@keyframes buttonPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
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

/* 左上角导航控制 */
.top-slide-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slide-indicators {
  display: flex;
  gap: 0.25rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #667eea;
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
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

/* 左上角控制面板 */
.top-control-panel {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: 12rem; /* 给导航控制留出空间，并排放置 */
}

.top-control-panel .control-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.top-control-panel .control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.top-control-panel .control-btn.active {
  background: rgba(102, 126, 234, 0.3);
  border-color: #667eea;
}



/* 第8页专用动画关键帧 */
@keyframes conceptSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes platformSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) rotateX(15deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

@keyframes flowSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.8);
  }
}

@keyframes iconRotate {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
}

@keyframes stepHighlight {
  0%, 100% {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: scale(1);
  }
  50% {
    background: rgba(240, 147, 251, 0.2);
    border-color: rgba(240, 147, 251, 0.4);
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(240, 147, 251, 0.3);
  }
}

@keyframes arrowFlow {
  0%, 100% {
    transform: scale(1) translateX(0);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.3) translateX(5px);
    opacity: 1;
    filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.8));
  }
}

@keyframes featureIconBounce {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1) translateY(-5px);
  }
  50% {
    transform: scale(1.05);
  }
  75% {
    transform: scale(1.1) translateY(-3px);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes needSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes solutionSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) rotateX(15deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

@keyframes processStepSlide {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes highlightSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes featuresSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes layerFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes stepSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 第9页专用动画关键帧 */
@keyframes subjectiveIntroSlide {
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

@keyframes textGlowPulse {
  0%, 100% {
    text-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
    color: #667eea;
  }
  50% {
    text-shadow: 0 0 25px rgba(102, 126, 234, 0.6), 0 0 40px rgba(102, 126, 234, 0.3);
    color: #8b5cf6;
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

@keyframes subjectiveItemFlyIn {
  0% {
    opacity: 0;
    transform: translateY(100px) translateX(-50px) scale(0.3) rotateZ(-15deg);
  }
  30% {
    opacity: 0.3;
    transform: translateY(70px) translateX(-30px) scale(0.5) rotateZ(-10deg);
  }
  60% {
    opacity: 0.7;
    transform: translateY(30px) translateX(-10px) scale(0.8) rotateZ(-5deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1) rotateZ(0deg);
  }
}

@keyframes iconBounceRotate {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(-90deg);
    opacity: 0.8;
  }
  75% {
    transform: scale(0.9) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes iconGlowPulse {
  0%, 100% {
    box-shadow: 0 0 12px rgba(102, 126, 234, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 25px rgba(102, 126, 234, 0.6), 0 0 40px rgba(102, 126, 234, 0.2);
    transform: scale(1.05);
  }
}

@keyframes textSlideInUp {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  50% {
    opacity: 0.5;
    transform: translateY(10px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes iconSpin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(90deg) scale(1.1);
  }
  50% {
    transform: rotate(180deg) scale(1);
  }
  75% {
    transform: rotate(270deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

/* 第8页专用动画关键帧 */
@keyframes slide8TitleAppear {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.8) rotateX(-15deg);
    filter: blur(10px);
  }
  50% {
    opacity: 0.5;
    transform: translateY(-25px) scale(0.9) rotateX(-7deg);
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0px);
  }
}

@keyframes slide8ContentReveal {
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

@keyframes slide8SectionFloat {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.85);
  }
  60% {
    opacity: 0.8;
    transform: translateY(20px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide8TextGlow {
  0%, 100% {
    text-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
    color: white;
  }
  50% {
    text-shadow: 0 0 20px rgba(102, 126, 234, 0.6), 0 0 30px rgba(102, 126, 234, 0.3);
    color: #f1f5f9;
  }
}

@keyframes slide8TextReveal {
  0% {
    opacity: 0;
    transform: translateX(-30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slide8FlowContainer {
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

@keyframes slide8FlowTitle {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide8StepCard1 {
  0% {
    opacity: 0;
    transform: translateX(-80px) translateY(30px) scale(0.6) rotateY(-20deg);
  }
  50% {
    opacity: 0.6;
    transform: translateX(-40px) translateY(15px) scale(0.8) rotateY(-10deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1) rotateY(0deg);
  }
}

@keyframes slide8StepCard2 {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.6) rotateX(20deg);
  }
  50% {
    opacity: 0.6;
    transform: translateY(30px) scale(0.8) rotateX(10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

@keyframes slide8StepCard3 {
  0% {
    opacity: 0;
    transform: translateX(80px) translateY(30px) scale(0.6) rotateY(20deg);
  }
  50% {
    opacity: 0.6;
    transform: translateX(40px) translateY(15px) scale(0.8) rotateY(10deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1) rotateY(0deg);
  }
}

@keyframes slide8IconPulse1 {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-90deg);
    opacity: 0.7;
  }
  75% {
    transform: scale(0.9) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes slide8IconPulse2 {
  0% {
    transform: scale(0) rotate(180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(90deg);
    opacity: 0.7;
  }
  75% {
    transform: scale(0.9) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes slide8IconPulse3 {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-90deg);
    opacity: 0.7;
  }
  75% {
    transform: scale(0.9) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes slide8IconGlow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(240, 147, 251, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 20px rgba(240, 147, 251, 0.6), 0 0 30px rgba(240, 147, 251, 0.2);
    transform: scale(1.02);
  }
}

@keyframes slide8TextSlide1 {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide8TextSlide2 {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide8TextSlide3 {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide8TextFade1 {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide8TextFade2 {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide8TextFade3 {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide8ArrowFlow1 {
  0%, 100% {
    transform: scale(1) translateX(0);
    opacity: 0.7;
    filter: drop-shadow(0 0 3px rgba(102, 126, 234, 0.2));
  }
  50% {
    transform: scale(1.2) translateX(5px);
    opacity: 1;
    filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
  }
}

@keyframes slide8ArrowFlow2 {
  0%, 100% {
    transform: scale(1) translateX(0);
    opacity: 0.7;
    filter: drop-shadow(0 0 3px rgba(102, 126, 234, 0.2));
  }
  50% {
    transform: scale(1.2) translateX(5px);
    opacity: 1;
    filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
  }
}

@keyframes slide8IconHover {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(5deg);
  }
  50% {
    transform: scale(1.05) rotate(0deg);
  }
  75% {
    transform: scale(1.1) rotate(-5deg);
  }
}

@keyframes slide8TextHover {
  0%, 100% {
    text-shadow: 0 0 5px rgba(240, 147, 251, 0.2);
    color: white;
  }
  50% {
    text-shadow: 0 0 12px rgba(240, 147, 251, 0.4), 0 0 20px rgba(240, 147, 251, 0.2);
    color: #fdf2f8;
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
  .challenge-grid {
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

  /* 第8-10页响应式优化 */
  .subjective-operation-section {
    gap: 1.5rem;
  }

  .core-concept {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .flow-steps {
    flex-direction: column;
    gap: 1rem;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .subjective-features {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .learning-flow {
    gap: 1.5rem;
  }
}
</style>
