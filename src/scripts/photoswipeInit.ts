import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

let lightbox: PhotoSwipeLightbox | null = null

export function initPhotoSwipe() {
  // 既存のlightboxがあれば破棄
  if (lightbox) {
    lightbox.destroy()
  }

  // ギャラリー要素が存在するかチェック
  const galleryElement = document.querySelector('#pswp-gallery')
  if (!galleryElement) {
    return
  }

  lightbox = new PhotoSwipeLightbox({
    gallery: '#pswp-gallery',
    children: 'a',
    arrowPrev: false,
    arrowNext: false,
    counter: false,
    pswpModule: () => import('photoswipe'),
  })

  lightbox.init()
}

// ページ読み込み時とナビゲーション時に初期化
document.addEventListener('DOMContentLoaded', initPhotoSwipe)
document.addEventListener('astro:page-load', initPhotoSwipe)
