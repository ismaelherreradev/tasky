"use client";

import { motion, useInView } from "framer-motion";
import { Calendar, Users, Zap } from "lucide-react";
import { useRef } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const iconMap = {
  Calendar,
  Users,
  Zap,
} as const;

interface AnimatedFeaturesProps {
  features: Feature[];
}

export function AnimatedFeatures({ features }: AnimatedFeaturesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 gap-12 md:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {features.map((feature, index) => {
        const Icon = iconMap[feature.icon as keyof typeof iconMap];

        return (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: index * 0.1,
            }}
            className="group text-center"
          >
            <motion.div
              className="mb-6 flex justify-center text-muted-foreground"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon size={32} />
            </motion.div>

            <h3 className="mb-4 font-light text-foreground text-xl">
              {feature.title}
            </h3>

            <p className="font-light text-base text-muted-foreground leading-relaxed">
              {feature.description}
            </p>

            <motion.div
              className="mx-auto mt-6 h-px w-12 bg-muted-foreground/20"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
