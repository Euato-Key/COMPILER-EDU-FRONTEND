<template>
  <footer class="theme-footer-bg border-t theme-footer-border py-6 mt-16">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- 左侧：学院图标和版权信息 -->
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0">
            <img
              src="/OIP-C.webp"
              alt="计算机科学与网络工程学院"
              class="w-full h-full object-contain"
            />
          </div>
          <div class="flex flex-col">
            <span class="text-sm theme-footer-text">
              © 2026 广州大学计算机科学与网络工程学院 版权所有
            </span>
            <span class="text-xs theme-footer-text opacity-75">
              软件著作权登记号：2026SR0059602
            </span>
          </div>
        </div>

        <!-- 右侧：链接 -->
        <div class="flex items-center gap-6">
          <router-link
            to="/terms"
            class="text-sm theme-footer-text hover:opacity-80 transition-colors"
          >
            用户协议
          </router-link>
          <router-link
            to="/privacy"
            class="text-sm theme-footer-text hover:opacity-80 transition-colors"
          >
            隐私政策
          </router-link>
          <router-link
            to="/disclaimer"
            class="text-sm theme-footer-text hover:opacity-80 transition-colors"
          >
            免责声明
          </router-link>
          <router-link
            to="/about"
            class="text-sm theme-footer-text hover:opacity-80 transition-colors"
          >
            关于我们
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppFooter'
})
</script>
