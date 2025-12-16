import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

type Card = {
  id: number;
  content: React.ReactNode | string;
  className: string;
  thumbnail: string | undefined;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setSelected(null);
  };

  return (
    <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
      {cards.map((card) => (
        <div key={card.id} className={cn(card.className)}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "relative overflow-hidden",
              "rounded-xl",
              "items-center justify-center flex",
              "cursor-pointer"
            )}
            layout
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            {card.content}
          </motion.div>
        </div>
      ))}
      {selected && (
        <motion.div
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
            layoutId={`card-${selected.id}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {selected.content}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

