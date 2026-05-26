import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ICONS = {
  biology: [
    <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, // DNA mock
    <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h3"/></svg> // Cell mock
  ],
  chemistry: [
    <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3v2M15 3v2M10 5v14c0 .6-.4 1-1 1H7a2 2 0 0 1-2-2V5h5zM14 5v14c0 .6.4 1 1 1h2a2 2 0 0 0 2-2V5h-5z"/></svg>, // Flask mock
    <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/></svg> // Atom mock
  ],
  physics: [
    <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M12 12l8.5 8.5M12 12L3.5 3.5M12 12l8.5-8.5M12 12L3.5 20.5"/></svg>, // Force vectors
    <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> // Gravity/Planet
  ]
};

const SubjectBackground = ({ subject }) => {
  const [particles] = useState(() => {
    const icons = ICONS[subject?.toLowerCase()] || ICONS.physics;
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5,
      drift: Math.random() * 10 - 5
    }));
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-[2px] z-10" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-slate-300/30 dark:text-slate-600/30"
          initial={{ opacity: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
          animate={{
            opacity: [0, 0.5, 0],
            y: [`${p.y}vh`, `${p.y - 20}vh`],
            x: [`${p.x}vw`, `${p.x + p.drift}vw`],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          style={{ width: p.size, height: p.size }}
        >
          {p.icon}
        </motion.div>
      ))}
    </div>
  );
};

export default SubjectBackground;
