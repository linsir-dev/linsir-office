<template>
  <TkPageCard title="关于">
    <div class="about-card">
      <p class="about-text">
        用脚步丈量世界，用文字记录时光。
      </p>
      <p class="about-text">
        分享旅途中的风景、故事与感悟。
      </p>
      <div class="about-footer">
        <a class="about-link" href="/about/">
          <span>了解更多</span>
          <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </TkPageCard>
</template>

<script setup lang="ts">
import { TkPageCard } from "vitepress-theme-teek";
</script>

<style scoped>
.about-card {
  padding: 0.5rem;
}

.about-text {
  margin: 0 0 0.8rem 0;
  color: var(--lofter-text-light, #8a8a8a);
  line-height: 1.6;
  font-size: 0.85rem;
}

.about-text:last-of-type {
  margin-bottom: 1rem;
}

.about-footer {
  display: flex;
  justify-content: flex-end;
}

.about-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--lofter-accent, #d4a574);
  font-size: 0.8rem;
  text-decoration: none;
  transition: color 0.3s;
}

.about-link:hover {
  color: var(--lofter-text, #4a4a4a);
}

.link-icon {
  width: 14px;
  height: 14px;
}
</style>
