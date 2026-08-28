import { useEffect, useRef } from 'react'

const REGULAR_PETAL_COUNT = 28
const POPPER_PETAL_COUNT = 30 // 60 total popper petals + 28 regular = 88 permanent screen petals

function randomBetween(a, b) { return a + Math.random() * (b - a) }

class Petal {
  constructor(canvas) {
    this.canvas = canvas
    this.isBurst = false
    this.dead = false
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
    this.isBurst = false
    this.dead = false
  }

  initBurst(x, y, angleMin, angleMax) {
    this.x = x
    this.y = y
    this.size = randomBetween(5, 13)
    const angle = randomBetween(angleMin, angleMax)
    const force = randomBetween(12, 28) // Strong popper burst speed
    this.speedX = Math.cos(angle) * force
    this.speedY = Math.sin(angle) * force
    this.gravity = randomBetween(0.18, 0.28)
    this.friction = randomBetween(0.91, 0.95) // Air resistance slowing them down
    this.rotation = randomBetween(0, Math.PI * 2)
    this.rotationSpeed = randomBetween(-0.18, 0.18)
    this.opacity = randomBetween(0.85, 1.0)
    this.hue = randomBetween(338, 360)
    this.sat = randomBetween(40, 70)
    this.light = randomBetween(75, 90)
    this.isBurst = true
    this.dead = false
    this.life = Math.floor(randomBetween(70, 120)) // Drift lifetime before turning normal
  }

  update() {
    if (this.isBurst) {
      this.speedX *= this.friction
      this.speedY = (this.speedY + this.gravity) * this.friction
      this.x += this.speedX
      this.y += this.speedY
      this.rotation += this.rotationSpeed
      this.rotationSpeed *= 0.97
      
      this.life--
      if (this.life <= 0) {
        // Softly transition into a regular falling petal
        this.isBurst = false
        this.speedY = randomBetween(0.4, 1.2)
        this.speedX = randomBetween(-0.4, 0.4)
        this.rotationSpeed = randomBetween(-0.015, 0.015)
        this.opacity = randomBetween(0.35, 0.75)
        this.sway = randomBetween(0.3, 1.0)
        this.swayAngle = randomBetween(0, Math.PI * 2)
        this.swaySpeed = randomBetween(0.005, 0.02)
      }
    } else {
      this.swayAngle += this.swaySpeed
      this.x += this.speedX + Math.sin(this.swayAngle) * this.sway
      this.y += this.speedY
      this.rotation += this.rotationSpeed
      if (this.y > this.canvas.height + 20) this.reset()
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.globalAlpha = Math.max(0, this.opacity)
    ctx.fillStyle = `hsl(${this.hue}, ${this.sat}%, ${this.light}%)`
    ctx.beginPath()
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

    // 1. Initialize regular falling petals (spread across heights initially)
    const regularPetals = Array.from({ length: REGULAR_PETAL_COUNT }, () => {
      const p = new Petal(canvas)
      p.y = randomBetween(0, canvas.height)
      return p
    })

    // 2. Initialize popper burst petals (originating from top corners)
    const burstPetals = []

    // Top-Left popper (shoots down and rightwards)
    for (let i = 0; i < POPPER_PETAL_COUNT; i++) {
      const p = new Petal(canvas)
      p.initBurst(0, 0, Math.PI / 20, Math.PI / 2.2)
      burstPetals.push(p)
    }

    // Top-Right popper (shoots down and leftwards)
    for (let i = 0; i < POPPER_PETAL_COUNT; i++) {
      const p = new Petal(canvas)
      p.initBurst(canvas.width, 0, Math.PI / 1.82, Math.PI * 19 / 20)
      burstPetals.push(p)
    }

    petalsRef.current = [...regularPetals, ...burstPetals]

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
