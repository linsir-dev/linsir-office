import DefaultTheme from 'vitepress/theme'
import { h, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

// 等待 Mermaid 加载完成
const waitForMermaid = () => {
  return new Promise((resolve) => {
    const checkMermaid = () => {
      if (typeof window !== 'undefined' && window.mermaid && typeof window.mermaid.initialize === 'function') {
        resolve(window.mermaid)
      } else {
        setTimeout(checkMermaid, 100)
      }
    }
    checkMermaid()
  })
}

// 转换代码块为 Mermaid 格式
const convertMermaidBlocks = () => {
  if (typeof document === 'undefined') return
  
  // 查找所有语言为 mermaid 的代码块（尝试多种可能的选择器）
  let codeBlocks = document.querySelectorAll('pre code.language-mermaid')
  console.log('Found code blocks (language-mermaid):', codeBlocks.length)
  
  // 如果没找到，尝试其他选择器
  if (codeBlocks.length === 0) {
    codeBlocks = document.querySelectorAll('pre[class*="mermaid"]')
    console.log('Found code blocks (pre[class*="mermaid"]):', codeBlocks.length)
  }
  
  if (codeBlocks.length === 0) {
    codeBlocks = document.querySelectorAll('code.language-mermaid')
    console.log('Found code blocks (code.language-mermaid):', codeBlocks.length)
  }
  
  // 尝试查找所有 code 元素并检查内容
  const allCodes = document.querySelectorAll('code')
  console.log('Total code elements:', allCodes.length)
  allCodes.forEach((code, i) => {
    const text = code.textContent?.substring(0, 50) || ''
    console.log(`Code ${i}: class="${code.className}", text="${text}..."`)
  })
  
  // 打印所有 pre 元素帮助调试
  const allPres = document.querySelectorAll('pre')
  console.log('Total pre elements:', allPres.length)
  allPres.forEach((pre, i) => {
    const codeText = pre.querySelector('code')?.textContent?.substring(0, 50) || ''
    console.log(`Pre ${i}: class="${pre.className}", codeText="${codeText}..."`)
  })
  
  // 如果没有找到 mermaid 代码块，尝试检测包含 flowchart/graph 等关键词的代码块
  if (codeBlocks.length === 0) {
    console.log('Trying to detect mermaid blocks by content...')
    allPres.forEach((pre) => {
      const code = pre.querySelector('code')
      if (code) {
        const text = code.textContent || ''
        const isMermaid = /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|requirementDiagram|gitgraph|C4Context|mindmap|timeline)/.test(text.trim())
        if (isMermaid) {
          console.log('Detected mermaid block by content:', text.substring(0, 50))
          // 创建 mermaid div
          const mermaidDiv = document.createElement('div')
          mermaidDiv.className = 'mermaid'
          mermaidDiv.textContent = text
          
          // 替换 pre 元素
          if (pre.parentElement) {
            pre.parentElement.replaceChild(mermaidDiv, pre)
          }
        }
      }
    })
    
    // 重新查询
    codeBlocks = document.querySelectorAll('.mermaid')
    console.log('Found mermaid blocks after content detection:', codeBlocks.length)
  }
  
  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement
    const code = codeBlock.textContent
    
    // 创建 mermaid div
    const mermaidDiv = document.createElement('div')
    mermaidDiv.className = 'mermaid'
    mermaidDiv.textContent = code
    
    // 替换 pre 元素
    if (pre && pre.parentElement) {
      pre.parentElement.replaceChild(mermaidDiv, pre)
    }
  })
}

// Mermaid 渲染函数
const renderMermaid = async () => {
  console.log('Starting Mermaid render...')
  
  const mermaid = await waitForMermaid()
  console.log('Mermaid loaded:', mermaid)
  
  // 初始化 Mermaid（如果还没初始化）
  if (!mermaid._initialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    })
    mermaid._initialized = true
    console.log('Mermaid initialized')
  }
  
  // 转换代码块
  convertMermaidBlocks()
  
  // 渲染所有 mermaid 代码块
  const elements = document.querySelectorAll('.mermaid')
  console.log('Found mermaid elements:', elements.length)
  
  if (elements.length > 0) {
    try {
      await mermaid.run({
        querySelector: '.mermaid'
      })
      console.log('Mermaid rendered successfully')
    } catch (err) {
      console.error('Mermaid render error:', err)
    }
  }
}

// 创建布局组件
const Layout = {
  setup() {
    const route = useRoute()
    
    onMounted(() => {
      console.log('Layout mounted')
      // 页面加载完成后渲染 Mermaid
      nextTick(() => {
        setTimeout(renderMermaid, 1000)
      })
    })
    
    watch(() => route.path, () => {
      console.log('Route changed:', route.path)
      // 路由切换后重新渲染 Mermaid
      nextTick(() => {
        setTimeout(renderMermaid, 1000)
      })
    })
    
    return () => h(DefaultTheme.Layout)
  }
}

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app, router, siteData }) {
    // 不需要在这里初始化
  }
}
