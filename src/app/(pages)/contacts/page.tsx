'use client';

import { IoMailOutline, IoPhonePortraitOutline, IoLocationOutline, IoLogoInstagram, IoLogoTiktok } from "react-icons/io5";
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
      scale: 1.1,
      transition: { duration: 0.3 }
    }
  };


  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-extrabold text-gray-800 tracking-tight">Наши контакты</motion.h1>
          <motion.p variants={itemVariants} className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Мы всегда на связи и готовы ответить на ваши вопросы.
          </motion.p>
          <motion.p variants={itemVariants} className="mt-2 text-sm text-gray-500">
            Товарищество с ограниченной ответственностью "1R-tech"
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={itemVariants} whileHover="hover" className="bg-white rounded-2xl shadow-sm p-8 text-center flex flex-col items-center">
            <motion.div variants={iconVariants} className="bg-orange-100 text-orange-500 rounded-full p-5 mb-5 inline-flex">
              <IoLocationOutline className="w-8 h-8" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Наш адрес</h3>
            <p className="text-gray-600 text-sm">Казахстан, Туркестанская область, Сайрамский район, село Айтеке Би, улица №1, дом 1078, п.и. 160806</p>
          </motion.div>
          <motion.div variants={itemVariants} whileHover="hover" className="bg-white rounded-2xl shadow-sm p-8 text-center flex flex-col items-center">
            <motion.div variants={iconVariants} className="bg-orange-100 text-orange-500 rounded-full p-5 mb-5 inline-flex">
              <IoPhonePortraitOutline className="w-8 h-8" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Телефон</h3>
            <a href="tel:+77758616810" className="text-gray-600 hover:text-orange-500 transition-colors">+7 (775) 861-68-10</a>
          </motion.div>
          <motion.div variants={itemVariants} whileHover="hover" className="bg-white rounded-2xl shadow-sm p-8 text-center flex flex-col items-center">
            <motion.div variants={iconVariants} className="bg-orange-100 text-orange-500 rounded-full p-5 mb-5 inline-flex">
              <IoMailOutline className="w-8 h-8" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
            <a href="mailto:valik.kazakhstan@gmail.com" className="text-gray-600 hover:text-orange-500 transition-colors">valik.kazakhstan@gmail.com</a>
          </motion.div>
        </motion.div>
        
        <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-800">Мы в социальных сетях</motion.h2>
            <motion.div variants={itemVariants} className="flex justify-center gap-6 mt-6">
                <motion.a whileHover={{y: -5}} href="https://www.instagram.com/valik_kazakhstan?igsh=MXh1cHp3NDg2eTNzcw==" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors">
                    <IoLogoInstagram className="w-10 h-10" />
                </motion.a>
                <motion.a whileHover={{y: -5}} href="https://www.tiktok.com/@valik.kz?_t=ZM-8yLfIXHnYfe&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors">
                    <IoLogoTiktok className="w-10 h-10" />
                </motion.a>
            </motion.div>
        </motion.div>

        <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{duration: 0.7, ease: 'easeOut'}}
        >
          <div className="h-96 bg-gray-200">
            {/* Карта обновлена на основе нового адреса */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23789.54472919875!2d69.9546258414009!3d42.1895857991583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38a8f1a81235b2e5%3A0x1d4a6de1f6b1e2e3!2sAkzhar%2C%20Turkistan%20Region%2C%20Kazakhstan!5e0!3m2!1sen!2sde!4v1722022802058!5m2!1sen!2sde"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Карта расположения офиса"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 