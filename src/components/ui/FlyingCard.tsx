import { motion } from "framer-motion";

type Props = {
  start: DOMRect;
  end: DOMRect;
  onComplete: () => void;
  children: React.ReactNode;
};

export default function FlyingCard({ start, end, onComplete, children }: Props) {
  const deltaX = end.left - start.left;
  const deltaY = end.top - start.top;

  return (
    <motion.div
      initial={{
        position: "fixed",
        left: start.left,
        top: start.top,
        width: start.width,
        height: start.height,
        zIndex: 9999,
      }}
      animate={{
        x: deltaX,
        y: deltaY,
        scale: 0.9,
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
      onAnimationComplete={onComplete}
    >
      {children}
    </motion.div>
  );
}