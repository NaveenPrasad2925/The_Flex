import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SplitTextProps {
  children: string
  className?: string
  delay?: number
}

const SplitText = ({ children, className = '', delay = 0 }: SplitTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chars = children.split('').map((char) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.style.verticalAlign = 'middle'
      span.style.opacity = '0'
      span.style.transform = 'translateY(20px)'
      return span
    })

    containerRef.current.innerHTML = ''
    chars.forEach((char) => containerRef.current?.appendChild(char))

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    chars.forEach((char, index) => {
      timeline.to(
        char,
        {
          opacity: 1,
          y: 0,
          duration: 0.05,
          ease: 'power2.out',
        },
        delay + index * 0.02
      )
    })

    return () => {
      timeline.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [children, delay])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: 'visible' }}
    />
  )
}

export default SplitText

