'use client';

import { IoLogoInstagram, IoLogoTiktok } from "react-icons/io5";
import { motion, Variants } from 'framer-motion';

export default function ContactsPage() {

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-2xl md:text-3xl font-semibold text-gray-900">
            Контакты
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-3 text-sm text-gray-600 max-w-xl">
            Мы всегда на связи и готовы ответить на ваши вопросы.
          </motion.p>
          <motion.p variants={itemVariants} className="mt-2 text-xs text-gray-500">
            Товарищество с ограниченной ответственностью &quot;1R-tech&quot;
          </motion.p>
        </motion.div>

        <motion.div 
          className="mb-12 space-y-3 text-sm text-gray-700"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p variants={itemVariants}>
            <span className="font-medium">Адрес:</span>{" "}
            Казахстан, Туркестанская область, Сайрамский район, село Айтеке Би,
            улица №1, дом 1078, п.и. 160806.
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className="font-medium">Телефон:</span>{" "}
            <a
              href="tel:+77758616810"
              className="hover:text-orange-500 transition-colors"
            >
              +7 (775) 861-68-10
            </a>
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className="font-medium">Email:</span>{" "}
            <a
              href="mailto:valik.kazakhstan@gmail.com"
              className="hover:text-orange-500 transition-colors"
            >
              valik.kazakhstan@gmail.com
            </a>
          </motion.p>
        </motion.div>
        
        <motion.div 
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <motion.h2 variants={itemVariants} className="text-base font-semibold text-gray-900">
              Социальные сети
            </motion.h2>
            <motion.div variants={itemVariants} className="flex gap-4 mt-4">
                <motion.a whileHover={{y: -2}} href="https://www.instagram.com/valik_kazakhstan?igsh=MXh1cHp3NDg2eTNzcw==" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors">
                    <IoLogoInstagram className="w-7 h-7" />
                </motion.a>
                <motion.a whileHover={{y: -2}} href="https://www.tiktok.com/@valik.kz?_t=ZM-8yLfIXHnYfe&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors">
                    <IoLogoTiktok className="w-7 h-7" />
                </motion.a>
            </motion.div>
        </motion.div>

        <motion.div 
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{duration: 0.7, ease: 'easeOut'}}
        >
          <div className="h-96 bg-gray-200">
            {/* Карта обновлена на основе нового адреса */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2959.444738596681!2d69.7691883770416!3d42.45738817119254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDLCsDI3JzI2LjYiTiA2OcKwNDYnMTYuOSJF!5e0!3m2!1sru!2skz!4v1722204523996!5m2!1sru!2skz"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Наше местоположение"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
