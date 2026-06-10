import gsap from 'gsap'

export function runPageEnter() {
  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: reduce)', () => {
    const el = document.querySelector('.content')
    if (el) gsap.from(el, { autoAlpha: 0, duration: 0.15, ease: 'none' })
  })

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (document.querySelector('.hdr')) {
      tl.from('.hdr', { y: -18, autoAlpha: 0, duration: 0.4 })
    }

    if (document.querySelector('.content > *')) {
      tl.from('.content > *', { y: 24, opacity: 0, duration: 0.5, stagger: 0.07 }, '-=0.2')
    }

    const childSel = '.grid-3 > *, .grid-2 > *, .grid-fit > *, .grid-fit-sm > *, .grid-auto > *'
    if (document.querySelector(childSel)) {
      tl.from(childSel, {
        y: 14, autoAlpha: 0, scale: 0.98, duration: 0.38, stagger: 0.04, clearProps: 'scale',
      }, '-=0.38')
    }
  })
}
