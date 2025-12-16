import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { HeroHighlight, Highlight } from "./hero-highlight";

interface StickyScrollProps {
  content: Array<{
    title: string;
    description: string;
    content: React.ReactNode;
  }>;
  contentClassName?: string;
}

export const StickyScroll = ({
  content,
  contentClassName,
}: StickyScrollProps) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const cardsBreakpoints = content.map((_, index) => index / cardLength);
      const closestBreakpointIndex = cardsBreakpoints.reduce(
        (acc, breakpoint, index) => {
          const distance = Math.abs(latest - breakpoint);
          if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
            return index;
          }
          return acc;
        },
        0
      );
      setActiveCard(closestBreakpointIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress, cardLength, content]);

  // Unused but kept for potential future use
  // const backgroundColors = [
  //   "var(--slate-900)",
  //   "var(--black)",
  //   "var(--neutral-900)",
  // ];
  // const linearGradients = [
  //   "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
  //   "linear-gradient(to bottom right, var(--pink-500), var(--violet-500))",
  //   "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",
  // ];

  // Function to parse description and highlight important words
  const parseDescriptionWithHighlights = (description: string) => {
    const highlightPhrases = [
      "multi-layered donut chart",
      "View by Type",
      "View by Status",
      "revenue share",
      "high-performing assets",
      "optimize pricing",
      "underperforming units",
      "dual-ring visualization",
      "real-time health metrics",
      "total volume",
    ];

    // Create a regex pattern that matches any of the phrases
    const pattern = new RegExp(
      `(${highlightPhrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
      'gi'
    );

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // Reset regex
    pattern.lastIndex = 0;

    while ((match = pattern.exec(description)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(description.substring(lastIndex, match.index));
      }

      // Add highlighted match
      parts.push(
        <Highlight key={`highlight-${match.index}`}>
          {match[0]}
        </Highlight>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < description.length) {
      parts.push(description.substring(lastIndex));
    }

    return parts.length > 0 ? parts : description;
  };

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <div className="flex justify-center relative space-x-10 p-10 pr-32">
        <div className="relative flex items-start px-4 flex-1">
          <div className="max-w-4xl w-full flex flex-col">
            {content.map((item, index) => (
              <div key={item.title + index} className={index === 0 ? "my-20 min-h-[60vh] flex flex-col justify-start" : index === content.length - 1 ? "my-40 min-h-[60vh] flex flex-col justify-center" : "my-60 min-h-[80vh] flex flex-col justify-center"}>
                <motion.h2
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                  }}
                  className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 text-left w-full"
                >
                  {item.title}
                </motion.h2>
                <HeroHighlight containerClassName="bg-transparent w-full flex justify-start items-start">
                  <motion.p
                    key={`para-${index}-${activeCard}`}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: activeCard === index ? 1 : 0.3,
                      y: activeCard === index ? 0 : 20,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.4, 0.0, 0.2, 1],
                    }}
                    className="text-xl md:text-2xl text-gray-600 max-w-2xl text-justify leading-relaxed w-full"
                  >
                    {parseDescriptionWithHighlights(item.description)}
                  </motion.p>
                </HeroHighlight>
              </div>
            ))}
            <div className="h-20" />
          </div>
        </div>
        <motion.div
          className={cn(
            "hidden lg:block h-[60vh] w-[500px] rounded-lg bg-white/80 backdrop-blur-sm sticky top-20 overflow-visible shadow-xl flex items-center justify-center border-4 border-gray-300",
            contentClassName
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center"
            >
              {content[activeCard]?.content ?? null}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

