'use client';

import { IoBusinessOutline, IoPeopleOutline, IoRocketOutline, IoWalletOutline, IoCubeOutline, IoShieldCheckmarkOutline, IoChatbubblesOutline, IoGitNetworkOutline, IoHardwareChipOutline, IoMegaphoneOutline, IoEyeOutline, IoHomeOutline, IoBuildOutline, IoColorPaletteOutline } from "react-icons/io5";
import { motion, Variants } from 'framer-motion';

export default function AboutPage() {
  const goals = [
    {
      icon: <IoWalletOutline className="w-8 h-8" />,
      title: "Экономия средств",
      description: "Предоставление конкурентных оптовых и розничных цен напрямую от поставщиков.",
    },
    {
      icon: <IoCubeOutline className="w-8 h-8" />,
      title: "Организация доставки",
      description: 'Логистика "до объекта", включая планирование маршрутов и контроль сроков.',
    },
    {
      icon: <IoShieldCheckmarkOutline className="w-8 h-8" />,
      title: "Удобство и прозрачность",
      description: "Цифровая среда с возможностью отслеживания каждого этапа сделки.",
    },
    {
        icon: <IoChatbubblesOutline className="w-8 h-8" />,
        title: "Консультирование",
        description: "Помощь покупателям при выборе материалов, технические консультации и подбор альтернатив.",
    }
  ];

  const features = [
    {
        icon: <IoGitNetworkOutline className="w-8 h-8" />,
        title: "Объединяет всех",
        description: "Поставщики и заказчики в одном цифровом пространстве.",
    },
    {
        icon: <IoHardwareChipOutline className="w-8 h-8" />,
        title: "Искусственный интеллект",
        description: "ИИ для персонализации, прогнозирования спроса и автоматизации.",
    },
    {
        icon: <IoMegaphoneOutline className="w-8 h-8" />,
        title: "Современное продвижение",
        description: "Каждый товар и услуга будут замечены своей целевой аудиторией.",
    },
    {
        icon: <IoEyeOutline className="w-8 h-8" />,
        title: "Прозрачный процесс",
        description: "Все участники видят статус сделки, доставки и коммуникаций.",
    }
  ];

  const audience = [
    { icon: <IoBusinessOutline className="w-7 h-7" />, name: "Строительные компании и подрядчики" },
    { icon: <IoHomeOutline className="w-7 h-7" />, name: "Частные застройщики" },
    { icon: <IoBuildOutline className="w-7 h-7" />, name: "Ремонтные бригады" },
    { icon: <IoColorPaletteOutline className="w-7 h-7" />, name: "Архитекторы и дизайнеры" },
    { icon: <IoPeopleOutline className="w-7 h-7" />, name: "Поставщики и дистрибьюторы" }
  ]

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
      rotate: [0, -10, 10, -5, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.7 }
    }
  };

  return (
    <div className="bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <motion.div 
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-extrabold text-gray-800 tracking-tight sm:text-5xl">
            Valik.kz — маркетплейс строительных материалов и услуг
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Инновационный маркетплейс, созданный для упрощения и оптимизации процесса закупки строительных товаров и услуг. Платформа объединяет поставщиков и потребителей, создавая прозрачную, удобную и экономически выгодную экосистему для всех участников строительного рынка.
          </motion.p>
        </motion.div>

        <motion.div 
          className="mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-4 text-gray-900">Основные цели сервиса</motion.h2>
            <motion.div variants={containerVariants} className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {goals.map((goal) => (
                    <motion.div key={goal.title} variants={itemVariants} whileHover="hover" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-100 transition-all duration-300">
                        <motion.div 
                            className="bg-orange-50 text-orange-500 p-4 rounded-2xl inline-flex mb-6"
                            variants={iconVariants}
                        >
                            {goal.icon}
                        </motion.div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">{goal.title}</h3>
                        <p className="text-gray-600">{goal.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
        
        <motion.div 
          className="mb-24 bg-white rounded-2xl shadow-lg p-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-4 text-gray-900">Что делает Valik.kz уникальным</motion.h2>
             <motion.div variants={containerVariants} className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                    <motion.div key={feature.title} variants={itemVariants} whileHover="hover" className="text-center flex flex-col items-center">
                        <motion.div 
                            className="bg-orange-50 text-orange-500 p-4 rounded-full inline-flex mb-4"
                            variants={iconVariants}
                        >
                            {feature.icon}
                        </motion.div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12 text-gray-900">Для кого создан Valik.kz</motion.h2>
            <motion.div variants={containerVariants} className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-6">
                {audience.map((item, index) => (
                    <motion.div key={item.name} variants={itemVariants} whileHover="hover" className={`bg-white p-6 rounded-xl shadow-sm flex items-center gap-4 border border-gray-100 md:col-span-2 ${index === 3 ? 'md:col-start-2' : ''}`}>
                        <motion.div 
                            className="text-orange-500"
                            variants={iconVariants}
                        >
                            {item.icon}
                        </motion.div>
                        <span className="font-medium text-gray-700">{item.name}</span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>

      </div>
    </div>
  );
}