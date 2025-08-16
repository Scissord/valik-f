"use client";

import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { motion, Variants } from "framer-motion";

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

export const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-20 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            Всё для <span className="text-orange-500">строительства</span> и <span className="text-orange-500">ремонта</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Качественные материалы и инструменты от ведущих производителей с доставкой по всему Казахстану
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/categories"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hidden md:inline-flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/20"
            >
              <IoCartOutline className="w-5 h-5" />
              Каталог товаров
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-[-1px] left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};
