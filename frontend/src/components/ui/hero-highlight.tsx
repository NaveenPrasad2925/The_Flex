"use client";
import { cn } from "@/lib/utils";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["40%", "60%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline rounded-md bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-[length:200%_100%] bg-clip-text text-transparent transition-colors duration-300 font-semibold",
        className
      )}
      style={{
        backgroundPosition: isHovered ? "100% 0" : "0% 0",
      }}
    >
      {children}
    </motion.span>
  );
};

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full",
        containerClassName
      )}
    >
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};
