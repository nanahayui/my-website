import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

export function initPhotoSwipe() {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#pswp-gallery',
    children: 'a',
    arrowPrev: false,
    arrowNext: false,
    counter: false,
    pswpModule: () => import('photoswipe'),
  })

  lightbox.init()
}
