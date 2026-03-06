---
layout: home
blog:
  name: 我的旅游手账
  motto: 用脚步丈量世界，用文字记录时光
  inspiring:
    - 旅行不仅是看风景，更是发现新的自己
    - 世界那么大，我想去看看
    - 每一次旅行，都是一次心灵的洗礼
    - 在路上，遇见更好的自己
    - 最好的时光在路上
  pageSize: 8
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 添加页面加载动画
  document.body.classList.add('travel-theme')
})
</script>

<style>
.travel-theme {
  --vp-c-brand: #ff6b6b;
  --vp-c-brand-light: #ff8585;
  --vp-c-brand-dark: #e55a5a;
}

.VPHero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.VPHero .name,
.VPHero .text {
  color: #fff !important;
}

.VPHero .tagline {
  color: rgba(255,255,255,0.9) !important;
}
</style>
