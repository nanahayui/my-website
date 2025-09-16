import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { getCaptionData, extractFileNameFromUrl } from '../lib/captionService'

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
            // 現在表示中の画像のデータを取得
            const currSlide = lightbox?.pswp?.currSlide
            if (!currSlide || !currSlide.data || !currSlide.data.src) {
              return
            }

            // 画像URLからファイル名を抽出
            const imageUrl = currSlide.data.src
            const fileName = extractFileNameFromUrl(imageUrl)

            // キャプションデータを取得
            const captionData = getCaptionData(fileName)

            // キャプションHTMLを構築
            let captionHTML = ''

            // ワールド情報がある場合のみ表示
            if (captionData.world) {
              captionHTML += `
                <div class="caption-line">
                  <img src="/icons/icon_world.svg" alt="World" class="caption-icon" />
                  <span>${captionData.world}</span>
                </div>
              `
            }

            // 人数情報がある場合のみ表示
            if (captionData.people) {
              captionHTML += `
                <div class="caption-line">
                  <img src="/icons/icon_people.svg" alt="People" class="caption-icon" />
                  <span>${captionData.people}</span>
                </div>
              `
            }

            // どちらも空の場合は何も表示しない
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
