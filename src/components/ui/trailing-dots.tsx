import { motion } from 'framer-motion'

const DOTS = [0, 1, 2, 3, 4]

const SIZES = {
  md: { container: 'h-10 w-10', dot: 'h-2 w-2 -ml-1' },
  sm: { container: 'h-5 w-5', dot: 'h-1 w-1 -ml-0.5' },
} as const

export function TrailingDots({
  size = 'md',
  tone = 'default',
}: {
  size?: keyof typeof SIZES
  tone?: 'default' | 'inverted'
}) {
  const leadColor = tone === 'inverted' ? 'bg-accent-ink' : 'bg-ink'
  const trailColor = tone === 'inverted' ? 'bg-accent-ink' : 'bg-muted'
  const { container, dot } = SIZES[size]

  return (
    <div role="status" aria-label="Loading" className={`relative ${container}`}>
      {DOTS.map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        >
          <div
            className={`absolute left-1/2 top-0 rounded-full ${dot} ${i === 0 ? leadColor : trailColor}`}
            style={{ opacity: 1 - i * 0.2 }}
          />
        </motion.div>
      ))}
    </div>
  )
}
