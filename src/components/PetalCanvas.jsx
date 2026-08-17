import { useEffect, useRef } from 'react'

const PETAL_COUNT = 28

function randomBetween(a, b) { return a + Math.random() * (b - a) }

class Petal {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }
  reset() {
    const c = this.canvas
    this.x = randomBetween(0, c.width)
    this.y = randomBetween(-200, -10)
    this.size = randomBetween(4, 11)
    this.speedY = randomBetween(0.4, 1.2)
    this.speedX = randomBetween(-0.4, 0.4)
    this.rotation = randomBetween(0, Math.PI * 2)
    this.rotationSpeed = randomBetween(-0.015, 0.015)
    this.opacity = randomBetween(0.35, 0.75)
    this.sway = randomBetween(0.3, 1.0)
    this.swayAngle = randomBetween(0, Math.PI * 2)
    this.swaySpeed = randomBetween(0.005, 0.02)
    this.hue = randomBetween(340, 360)
    this.sat = randomBetween(30, 60)
    this.light = randomBetween(80, 92)
  }
  update() {
    this.swayAngle += this.swaySpeed
    this.x += this.speedX + Math.sin(this.swayAngle) * this.sway
    this.y += this.speedY
    this.rotation += this.rotationSpeed
    if (this.y > this.canvas.height + 20) this.reset()
  }
  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = `hsl(${this.hue}, ${this.sat}%, ${this.light}%)`
    ctx.beginPath()
    // Petal shape using bezier
    const s = this.size
    ctx.moveTo(0, -s)
    ctx.bezierCurveTo(s * 0.6, -s * 0.8, s * 0.6, s * 0.8, 0, s)
    ctx.bezierCurveTo(-s * 0.6, s * 0.8, -s * 0.6, -s * 0.8, 0, -s)
    ctx.fill()
    ctx.restore()
  }
}

export default function PetalCanvas() {
  const canvasRef = useRef(null)
  const petalsRef = useRef([])
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    petalsRef.current = Array.from({ length: PETAL_COUNT }, () => {
      const p = new Petal(canvas)
      p.y = randomBetween(0, canvas.height) // start spread on load
      return p
    })

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      petalsRef.current.forEach(p => { p.update(); p.draw(ctx) })
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  )
}
