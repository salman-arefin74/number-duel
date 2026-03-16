import { motion } from 'framer-motion';

const orbs = [
  { x: '10%', y: '20%', size: 300, color: 'rgba(0, 245, 255, 0.06)', duration: 20 },
  { x: '80%', y: '70%', size: 400, color: 'rgba(255, 0, 229, 0.05)', duration: 25 },
  { x: '50%', y: '10%', size: 250, color: 'rgba(99, 102, 241, 0.05)', duration: 18 },
  { x: '20%', y: '80%', size: 350, color: 'rgba(0, 245, 255, 0.04)', duration: 22 },
  { x: '70%', y: '30%', size: 280, color: 'rgba(255, 0, 229, 0.04)', duration: 30 },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            left: orb.x,
            top: orb.y,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 15, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,245,255,0.03)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,229,0.03)_0%,transparent_50%)]" />
    </div>
  );
}
