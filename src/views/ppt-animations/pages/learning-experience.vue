<template>
  <div class="learning-experience-container">
    <!-- 16:9 容器 -->
    <div class="slide-container" :class="{ 'fullscreen': isFullscreen }">
      <!-- 背景 -->
      <div class="background-animation">
        <div class="particles">
          <div v-for="i in 35" :key="i" class="particle" :style="getParticleStyle()"></div>
        </div>
      </div>

      <!-- 幻灯片内容 -->
      <div class="slides-wrapper" :style="{ transform: `translateX(-${currentSlide * (100/2)}%)` }">

        <!-- 第1页：核心特性 -->
        <div class="slide slide-1" :class="{ 'active': currentSlide === 0 }">
          <div class="slide-content">
            <div class="header-section">
              <h1 class="main-title">多样性的可视化学习体验</h1>
              <p class="subtitle">个性化学习体验围绕用户输入与操作轨迹展开，同时融入直观的可视化动画演示</p>
            </div>

            <div class="features-section">
              <div class="feature-card">
                <div class="feature-icon">
                  <Icon icon="lucide:user-check" class="icon" />
                </div>
                <h3>个性化学习</h3>
                <p>基于用户输入的正则式、文法等信息，提供完全个性化的练习内容</p>
                <div class="feature-examples">
                  <div class="example-item">
                    <span class="example-label">不同正则式</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">不同的NFA结构</span>
                  </div>
                  <div class="example-item">
                    <span class="example-label">不同文法</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">不同的First集</span>
                  </div>
                </div>
              </div>

              <div class="feature-card">
                <div class="feature-icon">
                  <Icon icon="lucide:activity" class="icon" />
                </div>
                <h3>操作轨迹记录</h3>
                <p>平台会记录用户操作过程，实现学习轨迹的完整追踪</p>
                <div class="feature-examples">
                  <div class="example-item">
                    <span class="example-label">绘制NFA</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">节点添加顺序</span>
                  </div>
                  <div class="example-item">
                    <span class="example-label">计算分析表</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">填写修改记录</span>
                  </div>
                </div>
              </div>

              <div class="feature-card">
                <div class="feature-icon">
                  <Icon icon="lucide:eye" class="icon" />
                </div>
                <h3>动态可视化</h3>
                <p>LL1、LR0、SLR1等模块中，字符串分析等过程都有动态可视化动画演示</p>
                <div class="feature-examples">
                  <div class="example-item">
                    <span class="example-label">每一步操作</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">清晰观察</span>
                  </div>
                  <div class="example-item">
                    <span class="example-label">算法流程</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">直观理解</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第2页：AI助手和设计理念 -->
        <div class="slide slide-2" :class="{ 'active': currentSlide === 1 }">
          <div class="slide-content">
            <div class="header-section">
              <h1 class="main-title">多样性的可视化学习体验</h1>
              <p class="subtitle">个性化学习体验围绕用户输入与操作轨迹展开，同时融入直观的可视化动画演示</p>
            </div>

            <div class="ai-assistant-section">
              <div class="ai-header">
                <div class="ai-icon">
                  <Icon icon="lucide:bot" class="icon" />
                </div>
                <h2>AI教学助手</h2>
              </div>
              <div class="ai-content">
                <div class="ai-feature">
                  <h3>可视化引擎</h3>
                  <p>融进了含有可视化引擎的AI教学助手，基于用户的答题轨迹与平台的知识库精准答疑</p>
                </div>
                <div class="ai-feature">
                  <h3>定制化反馈</h3>
                  <p>提供定制化反馈，让练习和指导与学习轨迹绑定，实现"千人千面"的定制化学习</p>
                </div>
              </div>
            </div>

            <div class="design-philosophy">
              <h2>设计理念</h2>
              <div class="philosophy-content">
                <div class="philosophy-item">
                  <div class="philosophy-icon">
                    <Icon icon="lucide:target" class="icon" />
                  </div>
                  <div class="philosophy-text">
                    <h3>用户输入为起点</h3>
                    <p>每个用户的练习内容都基于其独特的输入信息</p>
                  </div>
                </div>
                <div class="philosophy-item">
                  <div class="philosophy-icon">
                    <Icon icon="lucide:map" class="icon" />
                  </div>
                  <div class="philosophy-text">
                    <h3>操作轨迹为依据</h3>
                    <p>学习轨迹的完整记录为个性化指导提供依据</p>
                  </div>
                </div>
                <div class="philosophy-item">
                  <div class="philosophy-icon">
                    <Icon icon="lucide:users" class="icon" />
                  </div>
                  <div class="philosophy-text">
                    <h3>千人千面</h3>
                    <p>确保每个用户的练习内容和辅导方案多样化</p>
                  </div>
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
            v-for="i in 2"
            :key="i"
            @click="goToSlide(i - 1)"
            class="indicator"
            :class="{ active: currentSlide === i - 1 }"
            :disabled="isTransitioning"
          ></button>
        </div>
        <div class="control-buttons">
          <button @click="previousSlide" class="control-btn" :disabled="currentSlide === 0 || isTransitioning">
            <Icon icon="lucide:chevron-left" class="control-icon" />
          </button>
          <button @click="nextSlide" class="control-btn" :disabled="currentSlide === 1 || isTransitioning">
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
  name: 'LearningExperiencePage'
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
  if (currentSlide.value < 1 && !isTransitioning.value) {
    isTransitioning.value = true
    currentSlide.value++
    console.log('Next slide:', currentSlide.value)
    setTimeout(() => {
      isTransitioning.value = false
    }, 800)
  }
}

const previousSlide = () => {
  if (currentSlide.value > 0 && !isTransitioning.value) {
    isTransitioning.value = true
    currentSlide.value--
    console.log('Previous slide:', currentSlide.value)
    setTimeout(() => {
      isTransitioning.value = false
    }, 800)
  }
}

const goToSlide = (index: number) => {
  if (index >= 0 && index <= 1 && index !== currentSlide.value && !isTransitioning.value) {
    isTransitioning.value = true
    currentSlide.value = index
    console.log('Go to slide:', currentSlide.value)
    setTimeout(() => {
      isTransitioning.value = false
    }, 800)
  }
}



// 自动播放
const startAutoPlay = () => {
  autoPlayTimer = window.setInterval(() => {
    if (currentSlide.value < 1) {
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
.learning-experience-container {
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
  width: 200%;
  height: 100%;
  display: flex;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.slide {
  width: calc(100% / 2);
  min-width: calc(100% / 2);
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

/* 第1页：核心特性 */
.slide-1.active .main-title {
  animation: titleSlideInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-1.active .subtitle {
  animation: subtitleFadeInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1s forwards;
}

.slide-1.active .feature-card:nth-child(1) {
  animation: featureCardSlideEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards, featureCardFloat 3s ease-in-out 4.5s infinite;
}

.slide-1.active .feature-card:nth-child(2) {
  animation: featureCardSlideEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2.5s forwards, featureCardFloat 3s ease-in-out 5s infinite;
}

.slide-1.active .feature-card:nth-child(3) {
  animation: featureCardSlideEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 3s forwards, featureCardFloat 3s ease-in-out 5.5s infinite;
}

.slide-1.active .feature-icon:nth-child(1) {
  animation: featureIconSpin 1.5s ease-out 3.5s forwards, featureIconGlow 2s ease-in-out 5s infinite;
}

.slide-1.active .feature-icon:nth-child(2) {
  animation: featureIconSpin 1.5s ease-out 4s forwards, featureIconGlow 2s ease-in-out 5.5s infinite;
}

.slide-1.active .feature-icon:nth-child(3) {
  animation: featureIconSpin 1.5s ease-out 4.5s forwards, featureIconGlow 2s ease-in-out 6s infinite;
}

.header-section {
  margin-bottom: 3rem;
}

.main-title {
  font-size: 3.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(50px);
}

.subtitle {
  font-size: 1.3rem;
  color: #cbd5e1;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(30px);
}

.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
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

.feature-card:hover {
  transform: translateY(-15px) scale(1.05) rotateY(5deg);
  background: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.feature-card p {
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-examples {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.example-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.example-label {
  color: #667eea;
  font-weight: 600;
}

.example-arrow {
  color: #764ba2;
  font-weight: bold;
}

.example-result {
  color: #f093fb;
  font-weight: 600;
}

/* 第2页：AI助手和设计理念 */
.slide-2.active .main-title {
  animation: titleSlideInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-2.active .subtitle {
  animation: subtitleFadeInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1s forwards;
}

.slide-2.active .ai-assistant-section {
  animation: sectionSlideInEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards;
}

.slide-2.active .ai-header {
  animation: aiHeaderGlow 3s ease-in-out 3.5s infinite;
}

.slide-2.active .ai-icon {
  animation: aiIconRotate 2s ease-out 2.5s forwards, aiIconPulse 2s ease-in-out 4.5s infinite;
}

.slide-2.active .design-philosophy {
  animation: sectionSlideInEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4s forwards;
}

.slide-2.active .philosophy-item:nth-child(1) {
  animation: philosophyItemSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 5.5s forwards, philosophyItemFloat 3s ease-in-out 7.5s infinite;
}

.slide-2.active .philosophy-item:nth-child(2) {
  animation: philosophyItemSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 6s forwards, philosophyItemFloat 3s ease-in-out 8s infinite;
}

.slide-2.active .philosophy-item:nth-child(3) {
  animation: philosophyItemSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 6.5s forwards, philosophyItemFloat 3s ease-in-out 8.5s infinite;
}

.slide-2.active .philosophy-icon:nth-child(1) {
  animation: iconSpin 1.5s ease-out 6s forwards, iconGlow 2s ease-in-out 7.5s infinite;
}

.slide-2.active .philosophy-icon:nth-child(2) {
  animation: iconSpin 1.5s ease-out 6.5s forwards, iconGlow 2s ease-in-out 8s infinite;
}

.slide-2.active .philosophy-icon:nth-child(3) {
  animation: iconSpin 1.5s ease-out 7s forwards, iconGlow 2s ease-in-out 8.5s infinite;
}

.ai-assistant-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(50px);
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.ai-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
}

.ai-header h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
}

.ai-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.ai-feature h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
}

.ai-feature p {
  color: #cbd5e1;
  line-height: 1.6;
}

.design-philosophy {
  opacity: 0;
  transform: translateY(50px);
}

.design-philosophy h2 {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.philosophy-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.philosophy-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-50px);
}

.philosophy-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(10px) translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.philosophy-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.philosophy-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
}

.philosophy-text h3 {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.philosophy-text p {
  color: #cbd5e1;
  line-height: 1.5;
}

/* 控制面板 */
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
  margin-left: 12rem;
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



/* 动画关键帧 */
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

@keyframes sectionSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes itemSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 第二页增强动画关键帧 */
@keyframes titleSlideInEnhanced {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.5) rotateX(90deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-20px) scale(1.1) rotateX(-10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

@keyframes subtitleFadeInEnhanced {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.8);
  }
  50% {
    opacity: 0.5;
    transform: translateY(-10px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes sectionSlideInEnhanced {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.8) rotateY(45deg);
  }
  50% {
    opacity: 0.6;
    transform: translateY(-30px) scale(1.05) rotateY(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateY(0deg);
  }
}

@keyframes aiHeaderGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4);
    transform: scale(1.02);
  }
}

@keyframes aiIconRotate {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(-90deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes aiIconPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.8), 0 0 50px rgba(118, 75, 162, 0.6);
  }
}

@keyframes philosophyItemSlide {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.5) rotateY(-45deg);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-20px) scale(1.1) rotateY(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateY(0deg);
  }
}

@keyframes philosophyItemFloat {
  0%, 100% {
    transform: translateY(0) rotateY(0deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  25% {
    transform: translateY(-8px) rotateY(2deg);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.2);
  }
  50% {
    transform: translateY(-5px) rotateY(-1deg);
    box-shadow: 0 10px 25px rgba(118, 75, 162, 0.2);
  }
  75% {
    transform: translateY(-10px) rotateY(3deg);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }
}

@keyframes iconSpin {
  0% {
    transform: scale(0) rotate(-360deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes iconGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
    transform: scale(1.1);
  }
}

/* 第一页增强动画关键帧 */
@keyframes featureCardSlideEnhanced {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.5) rotateX(45deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-30px) scale(1.1) rotateX(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

@keyframes featureCardFloat {
  0%, 100% {
    transform: translateY(0) rotateX(0deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  25% {
    transform: translateY(-10px) rotateX(3deg);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: translateY(-5px) rotateX(-2deg);
    box-shadow: 0 15px 30px rgba(118, 75, 162, 0.3);
  }
  75% {
    transform: translateY(-12px) rotateX(4deg);
    box-shadow: 0 25px 50px rgba(102, 126, 234, 0.4);
  }
}

@keyframes featureIconSpin {
  0% {
    transform: scale(0) rotate(-360deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(-180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes featureIconGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
    transform: scale(1.15);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .features-section {
    grid-template-columns: 1fr;
  }

  .ai-content {
    grid-template-columns: 1fr;
  }

  .philosophy-content {
    grid-template-columns: 1fr;
  }


}
</style>


