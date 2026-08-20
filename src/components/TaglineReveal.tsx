import { Fragment, useEffect, useRef } from 'react'

const words = ['Share', 'the', 'answer.', 'Keep', 'the', 'evidence', 'private.']

export function TaglineReveal() {
  const containerRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const elements = Array.from(container.querySelectorAll<HTMLElement>('[data-word]'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { rootMargin: '-28% 0px -32% 0px', threshold: 0.5 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="tagline-section" aria-labelledby="tagline-heading">
      <div className="tagline-trigger" aria-hidden="true"><span>‹</span><span>›</span></div>
      <p id="tagline-heading" className="tagline-copy" ref={containerRef}>
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            {index === 3 ? <br /> : null}
            <span
              className="tagline-word"
              data-word
              style={{ '--word-index': index } as React.CSSProperties}
            >
              {word}{' '}
            </span>
          </Fragment>
        ))}
      </p>
    </section>
  )
}
