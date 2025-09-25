<template>
  <div class="qr-wrapper">
    <!-- Başlık / Opsiyonel açıklama -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>

      <!-- Butonlar: indir & kopyala -->
      <div class="flex items-center gap-2">
        <button @click="downloadPng" class="btn">PNG indir</button>
        <button @click="copyToClipboard" class="btn-outline">Link kopyala</button>
      </div>
    </div>

    <!-- QR Görseli (canvas veya svg) -->
    <div class="qr-area" :style="{ width: size + 'px', height: size + 'px' }">
      <!-- canvas render -->
      <canvas ref="canvasRef" :width="size" :height="size" class="block w-full h-full"></canvas>

      <!-- fallback (SVG) gösterme tercihi -> kullanmak istersen showSvg prop'unu true yap -->
      <div v-if="showSvg" ref="svgContainer" class="sr-only"></div>
    </div>

    <!-- opsiyonel açıklama alt -->
    <p v-if="caption" class="text-xs text-gray-500 mt-3">{{ caption }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

/**
 * Props
 * - value: string -> QR kod içeriği (URL, metin vs.)
 * - size: number -> piksel
 * - fgColor/bgColor -> renkler
 * - level -> hata düzeyi 'L','M','Q','H'
 * - title, subtitle, caption -> opsiyonel metinler
 * - showSvg -> ayrıca svg üretmek istersen true yap (hidden by default)
 */
const props = defineProps({
  value: { type: String, required: true },
  size: { type: Number, default: 320 },
  fgColor: { type: String, default: '#1f2937' }, // koyu gri (uyumlu, okunaklı)
  bgColor: { type: String, default: '#ffffff00' }, // şeffaf arka plan (00 alfa)
  level: { type: String, default: 'H' }, // H -> en yüksek hata düzeyi
  title: { type: String, default: 'QR Kod' },
  subtitle: { type: String, default: '' },
  caption: { type: String, default: '' },
  showSvg: { type: Boolean, default: false }
})

const canvasRef = ref(null)
const svgContainer = ref(null)

const options = () => ({
  errorCorrectionLevel: props.level,
  margin: 1, // kenar boşluğu (kare birim)
  color: {
    dark: props.fgColor,
    light: props.bgColor
  },
  // scale param handled by `toCanvas` via canvas size
})

/** render canvas */
async function renderCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  try {
    // clear canvas
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // QR kodu canvas'a bas
    await QRCode.toCanvas(canvas, props.value, {
      ...options(),
      width: props.size,
      margin: 1
    })
  } catch (err) {
    console.error('QR render error:', err)
  }
}

/** optionally render SVG (hidden by default) */
async function renderSvg() {
  if (!props.showSvg || !svgContainer.value) return
  try {
    const svgString = await QRCode.toString(props.value, { ...options(), type: 'svg' })
    svgContainer.value.innerHTML = svgString
  } catch (err) {
    console.error('SVG render error:', err)
  }
}

/** indirme fonksiyonu (PNG) */
function downloadPng(filename = 'qrcode.png') {
  const canvas = canvasRef.value
  if (!canvas) return
  const dataUrl = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/** kopyala -> QR içeriğini panoya kopyalar */
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.value)
    // küçük görsel bildirim istersen buraya event/emit ekleyebilirsin
    // örn: emit('copied')
    window.alert('Link panoya kopyalandı!')
  } catch (e) {
    console.error('Kopyalama başarısız', e)
  }
}

// render on mount and when value or color changes
onMounted(async () => {
  await renderCanvas()
  await renderSvg()
})

watch(
  () => [props.value, props.fgColor, props.bgColor, props.size, props.level, props.showSvg],
  async () => {
    await renderCanvas()
    await renderSvg()
  }
)
</script>

<style scoped>
.qr-wrapper {
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.qr-area {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  overflow: hidden;
  /* hafif glass kenar */
  border: 1px solid rgba(0,0,0,0.04);
  background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6));
  box-shadow: 0 6px 18px rgba(16,24,40,0.06);
}
.btn {
  padding: 8px 12px;
  border-radius: 10px;
  background: linear-gradient(90deg,#FDE3A7,#FFF5E1);
  color: #2b2b2b;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.btn-outline {
  padding: 8px 12px;
  border-radius: 10px;
  background: transparent;
  color: #5A4631;
  border: 1px solid rgba(90,70,49,0.12);
  font-weight: 600;
  cursor: pointer;
}
</style>
