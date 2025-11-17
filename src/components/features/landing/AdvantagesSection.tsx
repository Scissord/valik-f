"use client";

import { FaTruck, FaCreditCard, FaHeadset } from "react-icons/fa";
import { motion, Variants } from "framer-motion";

const advantages = [
  {
    icon: <FaTruck className="w-8 h-8" />,
    title: "Доставка по всему Казахстану",
    description: "Быстрая и надежная доставка в любой город"
  },
  {
    icon: <FaCreditCard className="w-8 h-8" />,
    title: "Удобная оплата",
    description: "Наличные, банковские карты, онлайн-платежи"
  },
  {
    icon: <FaHeadset className="w-8 h-8" />,
    title: "Профессиональная консультация",
    description: "Эксперты помогут с выбором товаров"
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const iconVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    rotate: [0, -10, 10, -5, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 0.7 }
  }
};

export const AdvantagesSection = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.section
        className="py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-4 text-gray-900">
          Почему выбирают нас
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-600 text-center max-w-3xl mx-auto mb-16">
          Мы поставляем качественные строительные материалы и инструменты по всему Казахстану
        </motion.p>
        <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="rounded-2xl p-8 shadow-sm border border-gray-100 hover:border-orange-100 transition-all duration-300"
            >
              <motion.div
                className="bg-orange-50 text-orange-500 p-4 rounded-2xl inline-flex mb-6"
                variants={iconVariants}
              >
                {advantage.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
};
