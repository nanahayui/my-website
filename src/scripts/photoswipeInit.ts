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

  // キャプション機能を追加
  lightbox.on('uiRegister', function () {
    if (lightbox?.pswp?.ui) {
      lightbox.pswp.ui.registerElement({
        name: 'custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: 'サンプルキャプション',
        onInit: (el, pswp) => {
          lightbox?.pswp?.on('change', () => {
            // 2行のアイコン付きキャプションを設定
            const captionHTML = `
              <div class="caption-line">
                <img src="/icons/icon_world.svg" alt="World" class="caption-icon" />
                <span>サンプルワールド名</span>
              </div>
              <div class="caption-line">
                <img src="/icons/icon_people.svg" alt="People" class="caption-icon" />
                <span>サンプル人数情報</span>
              </div>
            `
            el.innerHTML = captionHTML
          })
        },
      })
    }
  })

  lightbox.init()
}

// ページ読み込み時とナビゲーション時に初期化
document.addEventListener('DOMContentLoaded', initPhotoSwipe)
document.addEventListener('astro:page-load', initPhotoSwipe)
