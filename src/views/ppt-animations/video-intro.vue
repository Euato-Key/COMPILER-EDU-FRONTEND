<template>
  <div class="video-intro-page min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- 背景动画元素 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="floating-elements">
        <div class="floating-element" style="--delay: 0s; --duration: 20s; --x: 10%; --y: 20%">
          <div class="w-4 h-4 bg-blue-400 rounded-full opacity-20"></div>
        </div>
        <div class="floating-element" style="--delay: 2s; --duration: 25s; --x: 80%; --y: 60%">
          <div class="w-6 h-6 bg-purple-400 rounded-full opacity-15"></div>
        </div>
        <div class="floating-element" style="--delay: 4s; --duration: 18s; --x: 20%; --y: 80%">
          <div class="w-3 h-3 bg-green-400 rounded-full opacity-25"></div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
      <div class="text-center max-w-6xl mx-auto">
        <!-- Logo和标题区域 -->
        <div class="mb-16">
          <div class="logo-container mb-8">
            <div class="logo-circle">
              <Icon icon="lucide:code" class="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 class="main-title text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            <span class="title-line">编译原理</span>
            <span class="title-line">可视化平台</span>
          </h1>
          <p class="subtitle text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            让抽象的编译原理变得直观易懂
          </p>
        </div>

        <!-- 核心概念展示 -->
        <div class="concepts-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="concept-card">
            <div class="concept-icon">
              <Icon icon="lucide:git-branch" class="w-12 h-12" />
            </div>
            <h3 class="concept-title">有限自动机</h3>
            <p class="concept-desc">状态转换的可视化演示</p>
          </div>
          <div class="concept-card">
            <div class="concept-icon">
              <Icon icon="lucide:layers" class="w-12 h-12" />
            </div>
            <h3 class="concept-title">语法分析</h3>
            <p class="concept-desc">LL1/LR算法的交互式学习</p>
          </div>
          <div class="concept-card">
            <div class="concept-icon">
              <Icon icon="lucide:bot" class="w-12 h-12" />
            </div>
            <h3 class="concept-title">AI助手</h3>
            <p class="concept-desc">智能化的学习指导</p>
          </div>
        </div>

        <!-- 问题陈述 -->
        <div class="problem-section bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-white/20">
          <h2 class="text-3xl font-bold text-white mb-6">为什么需要可视化？</h2>
          <div class="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
            <p class="mb-4">
              编译原理作为计算机科学的核心基石，是连接高级编程语言与机器语言的桥梁，更是理解计算机系统底层逻辑的关键。
            </p>
            <p class="mb-4">
              然而，这门课程中充斥着大量抽象概念 —— 从有限自动机的状态跳转，到语法树的层级构建，再到分析表的规则推导，这些内容往往让初学者望而生畏，难以通过静态文字或图片建立直观认知。
            </p>
          </div>
        </div>

        <!-- 解决方案 -->
        <div class="solution-section">
          <h2 class="text-3xl font-bold text-white mb-8">我们的解决方案</h2>
          <div class="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="feature-item">
              <div class="feature-icon">
                <Icon icon="lucide:eye" class="w-8 h-8" />
              </div>
              <h4 class="feature-title">可视化步骤</h4>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <Icon icon="lucide:mouse-pointer-click" class="w-8 h-8" />
              </div>
              <h4 class="feature-title">交互式学习</h4>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <Icon icon="lucide:zap" class="w-8 h-8" />
              </div>
              <h4 class="feature-title">实时反馈</h4>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <Icon icon="lucide:bot" class="w-8 h-8" />
              </div>
              <h4 class="feature-title">AI教学助手</h4>
            </div>
          </div>
        </div>

        <!-- 开始体验按钮 -->
        <div class="cta-section mt-16">
          <router-link
            to="/"
            class="cta-button inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <Icon icon="lucide:play" class="w-6 h-6 mr-3" />
            开始体验
            <Icon icon="lucide:arrow-right" class="w-6 h-6 ml-3" />
          </router-link>
        </div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="fixed bottom-8 right-8 z-20">
      <div class="flex gap-4">
        <button
          @click="replayAnimation"
          class="control-btn"
          title="重新播放"
        >
          <Icon icon="lucide:refresh-cw" class="w-5 h-5" />
        </button>
        <button
          @click="toggleFullscreen"
          class="control-btn"
          title="全屏"
        >
          <Icon icon="lucide:maximize" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'VideoIntroPage'
})

const replayAnimation = () => {
  window.location.reload()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style scoped>
.floating-elements {
  position: absolute;
  inset: 0;
}

.floating-element {
  position: absolute;
  animation: float var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  left: var(--x);
  top: var(--y);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(-40px) rotate(180deg); }
  75% { transform: translateY(-20px) rotate(270deg); }
}

.logo-container {
  animation: logoAppear 2s ease-out;
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

@keyframes logoAppear {
  from { opacity: 0; transform: scale(0.5) rotate(-180deg); }
  to { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes logoPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 50px rgba(102, 126, 234, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 80px rgba(102, 126, 234, 0.8); }
}

.main-title {
  animation: titleSlideIn 1.5s ease-out 0.5s both;
}

.title-line {
  display: block;
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleSlideIn {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes titleGlow {
  0%, 100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
  50% { text-shadow: 0 0 40px rgba(255, 255, 255, 0.6); }
}

.subtitle {
  animation: subtitleFadeIn 2s ease-out 1s both;
}

@keyframes subtitleFadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.concept-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-blur-sm;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  animation: cardAppear 1s ease-out both;
}

.concept-card:nth-child(1) { animation-delay: 1.5s; }
.concept-card:nth-child(2) { animation-delay: 1.7s; }
.concept-card:nth-child(3) { animation-delay: 1.9s; }

.concept-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
  color: white;
}

.concept-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.concept-desc {
  color: #cbd5e1;
  font-size: 0.9rem;
}

@keyframes cardAppear {
  from { opacity: 0; transform: translateY(50px) scale(0.8); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.problem-section {
  animation: sectionSlideIn 1s ease-out 2.5s both;
}

.solution-section {
  animation: sectionSlideIn 1s ease-out 3s both;
}

@keyframes sectionSlideIn {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

.features-grid {
  animation: featuresAppear 1s ease-out 3.5s both;
}

.feature-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-5px);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
}

.feature-title {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

@keyframes featuresAppear {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.cta-section {
  animation: ctaAppear 1s ease-out 4s both;
}

@keyframes ctaAppear {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.control-btn {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-blur-sm;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .main-title { font-size: 3rem; }
  .subtitle { font-size: 1.1rem; }
  .concepts-grid { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>

