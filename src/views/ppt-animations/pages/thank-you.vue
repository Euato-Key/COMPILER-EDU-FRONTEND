<template>
  <div class="thank-you-container">
    <!-- 16:9 容器 -->
    <div class="slide-container" :class="{ 'fullscreen': isFullscreen }">
      <!-- 背景 -->
      <div class="background-animation">
        <div class="particles">
          <div v-for="i in 35" :key="i" class="particle" :style="getParticleStyle()"></div>
        </div>
      </div>

      <!-- 幻灯片内容 -->
      <div class="slide-content">
        <!-- 感谢标题 -->
        <div class="thank-you-title">
          <h1 class="main-title">感谢各位评委</h1>
          <p class="subtitle">Thank You for Your Attention</p>
        </div>

        <!-- 团队和指导老师信息 -->
        <div class="team-advisor-section">
          <!-- 指导老师 -->
          <div class="advisor-section">
            <h2 class="section-title">指导老师</h2>
            <div class="advisor-info">
              <div class="advisor-avatar">
                <Icon icon="lucide:graduation-cap" class="advisor-icon" />
              </div>
              <span class="advisor-name">吴昱</span>
            </div>
          </div>

          <!-- 开发团队信息 -->
          <div class="team-section">
            <h2 class="section-title">开发小组</h2>
            <div class="team-members">
              <div class="member-item">
                <div class="member-avatar">
                  <Icon icon="lucide:file-text" class="avatar-icon" />
                </div>
                <span class="member-name">罗浩加</span>
              </div>
              <div class="member-item">
                <div class="member-avatar">
                  <Icon icon="lucide:layers" class="avatar-icon" />
                </div>
                <span class="member-name">杨竣淇</span>
              </div>
              <div class="member-item">
                <div class="member-avatar">
                  <Icon icon="lucide:video" class="avatar-icon" />
                </div>
                <span class="member-name">陈梓涛</span>
              </div>
              <div class="member-item">
                <div class="member-avatar">
                  <Icon icon="lucide:search" class="avatar-icon" />
                </div>
                <span class="member-name">吴俊安</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 学校信息 -->
        <div class="school-section">
          <div class="school-content">
            <div class="school-logo">
              <img src="/广州大学-logo.svg" alt="广州大学" class="logo-image" />
            </div>
            <h2 class="school-name">广州大学</h2>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-panel">
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
  name: 'ThankYouPage'
})

const isFullscreen = ref(false)

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
  if (event.key === 'Escape' && document.fullscreenElement) {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.thank-you-container {
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

/* 幻灯片内容 */
.slide-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: white;
  text-align: center;
  gap: 2rem;
}

/* 感谢标题 */
.thank-you-title {
  opacity: 0;
  transform: translateY(-50px);
  animation: titleAppear 2s ease-out 0.5s forwards;
  margin-bottom: 1rem;
}

.main-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite;
}

.subtitle {
  font-size: 1.3rem;
  color: #cbd5e1;
  opacity: 0.8;
}

@keyframes titleAppear {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    text-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
  }
}

/* 开发团队 */
.team-section {
  opacity: 0;
  transform: translateY(30px);
  animation: teamAppear 1.5s ease-out 1.5s forwards;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.team-members {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  flex: 1;
  align-items: center;
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);
}

.member-item:nth-child(1) { animation: memberAppear 1s ease-out 2s forwards; }
.member-item:nth-child(2) { animation: memberAppear 1s ease-out 2.3s forwards; }
.member-item:nth-child(3) { animation: memberAppear 1s ease-out 2.6s forwards; }
.member-item:nth-child(4) { animation: memberAppear 1s ease-out 2.9s forwards; }

.member-item:hover {
  transform: translateY(-10px) scale(1.05);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 30px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.member-avatar {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  transition: all 0.3s ease;
}

.member-item:hover .member-avatar {
  animation: avatarPulse 2s ease-in-out infinite;
}

.avatar-icon {
  width: 35px;
  height: 35px;
  color: white;
}

.member-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
}



@keyframes teamAdvisorAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes teamAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes memberAppear {
  from {
    opacity: 0;
    transform: scale(0.8) rotateY(-15deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
  }
}

@keyframes avatarPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.8);
    transform: scale(1.1);
  }
}

/* 团队和指导老师容器 */
.team-advisor-section {
  display: flex;
  gap: 3rem;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(30px);
  animation: teamAdvisorAppear 1.5s ease-out 1.5s forwards;
}

/* 开发团队 */
.team-section {
  opacity: 1;
  transform: none;
  animation: none;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

/* 指导老师 */
.advisor-section {
  opacity: 1;
  transform: none;
  animation: none;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.advisor-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

.advisor-info:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3);
  border-color: rgba(16, 185, 129, 0.5);
}

.advisor-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.6);
  transition: all 0.3s ease;
}

.advisor-info:hover .advisor-avatar {
  animation: advisorAvatarPulse 2s ease-in-out infinite;
}

.advisor-icon {
  width: 40px;
  height: 40px;
  color: white;
}

.advisor-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

@keyframes advisorAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes advisorAvatarPulse {
  0%, 100% {
    box-shadow: 0 0 25px rgba(16, 185, 129, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(16, 185, 129, 0.9);
    transform: scale(1.1);
  }
}

/* 学校信息 */
.school-section {
  opacity: 0;
  transform: translateY(30px);
  animation: schoolAppear 1.5s ease-out 3s forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.school-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.school-logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.school-logo:hover {
  transform: scale(1.1) rotate(5deg);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.4);
  animation: logoGlow 2s ease-in-out infinite;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  filter: brightness(1.2) contrast(1.1);
}

.school-name {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  animation: schoolNameGlow 3s ease-in-out infinite;
}

@keyframes schoolAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes logoGlow {
  0%, 100% {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
    transform: scale(1.1) rotate(5deg);
  }
  50% {
    box-shadow: 0 0 60px rgba(255, 255, 255, 0.6);
    transform: scale(1.15) rotate(0deg);
  }
}

@keyframes schoolNameGlow {
  0%, 100% {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    color: white;
  }
  50% {
    text-shadow: 0 0 25px rgba(255, 255, 255, 0.8), 0 0 35px rgba(255, 255, 255, 0.4);
    color: #f8fafc;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .team-advisor-section {
    flex-direction: column;
    gap: 2rem;
  }

  .school-content {
    flex-direction: column;
    gap: 1rem;
  }

  .team-members {
    gap: 1rem;
  }

  .member-item {
    padding: 1rem;
  }

  .member-avatar {
    width: 60px;
    height: 60px;
  }

  .avatar-icon {
    width: 30px;
    height: 30px;
  }

  .member-name {
    font-size: 1rem;
  }



  .advisor-info {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .advisor-avatar {
    width: 80px;
    height: 80px;
  }

  .advisor-icon {
    width: 40px;
    height: 40px;
  }

  .advisor-name {
    font-size: 1.5rem;
  }

  .school-logo {
    width: 100px;
    height: 100px;
  }

  .school-name {
    font-size: 2rem;
  }
}

/* 控制面板 */
.control-panel {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.control-icon {
  width: 16px;
  height: 16px;
}
</style>
