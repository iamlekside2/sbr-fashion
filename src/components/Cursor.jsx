import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const ringX = useRef(0)
  const ringY = useRef(0)

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 4 + 'px'
        cursorRef.current.style.top = e.clientY - 4 + 'px'
      }
    }

    const animate = () => {
      ringX.current += (mouseX.current - ringX.current - 16) * 0.12
      ringY.current += (mouseY.current - ringY.current - 16) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ringX.current + 'px'
        ringRef.current.style.top = ringY.current + 'px'
      }
      requestAnimationFrame(animate)
    }

    const handleEnter = () => {
      if (cursorRef.current) cursorRef.current.style.transform = 'scale(2.5)'
      if (ringRef.current) { ringRef.current.style.transform = 'scale(1.5)'; ringRef.current.style.borderColor = '#E8C97A' }
    }
    const handleLeave = () => {
      if (cursorRef.current) cursorRef.current.style.transform = 'scale(1)'
      if (ringRef.current) { ringRef.current.style.transform = 'scale(1)'; ringRef.current.style.borderColor = '#C9A84C' }
    }

    document.addEventListener('mousemove', moveCursor)
    document.querySelectorAll('a, button, [role=button]').forEach(el => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })
    animate()

    return () => document.removeEventListener('mousemove', moveCursor)
  }, [])

  return (
    <>
      <div ref={cursorRef} style={{
        width:8, height:8, background:'#C9A84C', borderRadius:'50%',
        position:'fixed', pointerEvents:'none', zIndex:9999,
        transition:'transform 0.1s ease', mixBlendMode:'difference'
      }} />
      <div ref={ringRef} style={{
        width:32, height:32, border:'1px solid #C9A84C', borderRadius:'50%',
        position:'fixed', pointerEvents:'none', zIndex:9998,
        transition:'transform 0.15s ease', opacity:0.6
      }} />
    </>
  )
}
