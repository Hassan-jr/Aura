// "use client";

// import { useRef } from "react";
// import { AnimatePresence, motion, useInView, Variants } from "framer-motion";

// type MarginType = number | string | { top?: number | string; right?: number | string; bottom?: number | string; left?: number | string };

// interface BlurFadeProps {
//   children: React.ReactNode;
//   className?: string;
//   variant?: {
//     hidden: { y: number };
//     visible: { y: number };
//   };
//   duration?: number;
//   delay?: number;
//   yOffset?: number;
//   inView?: boolean;
//   inViewMargin?: MarginType;
//   blur?: string;
// }

// export default function BlurFade({
//   children,
//   className,
//   variant,
//   duration = 0.4,
//   delay = 0,
//   yOffset = 6,
//   inView = false,
//   inViewMargin = "-50px",
//   blur = "6px",
// }: BlurFadeProps) {
//   const ref = useRef(null);
//   const inViewResult = useInView(ref, { once: true, margin: undefined });
//   const isInView = !inView || inViewResult;
//   const defaultVariants: Variants = {
//     hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
//     visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
//   };
//   const combinedVariants = variant || defaultVariants;
//   return (
//     <AnimatePresence>
//       <motion.div
//         ref={ref}
//         initial="hidden"
//         animate={isInView ? "visible" : "hidden"}
//         exit="hidden"
//         variants={combinedVariants}
//         transition={{
//           delay: 0.04 + delay,
//           duration,
//           ease: "easeOut",
//         }}
//         className={className}
//       >
//         {children}
//       </motion.div>
//     </AnimatePresence>
//   );
// }

"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useInView, Variants } from "framer-motion";

type MarginType = number | string | { top?: number | string; right?: number | string; bottom?: number | string; left?: number | string };

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
}

export default function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Suppress the type error using type assertion here
  const inViewResult = useInView(ref as React.RefObject<Element>, { once: true, margin: undefined });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <AnimatePresence>
      <div className={className}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          exit="hidden"
          variants={combinedVariants}
          transition={{
            delay: 0.04 + delay,
            duration,
            ease: "easeOut",
          }}

        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
