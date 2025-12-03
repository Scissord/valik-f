'use client';

import { motion, Variants } from 'framer-motion';

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: 'easeOut' },
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
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold text-gray-900"
          >
            О сервисе Valik.kz
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-3 text-sm text-gray-600 leading-relaxed"
          >
            Valik.kz — это онлайн‑маркетплейс строительных материалов и услуг. Мы
            помогаем профессионалам и частным клиентам быстро находить и
            заказывать всё необходимое для строительства и ремонта в одном месте.
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="mt-2 text-sm text-gray-600 leading-relaxed"
          >
            Платформа объединяет поставщиков и покупателей, делая процесс
            закупки более прозрачным, удобным и выгодным по времени и бюджету.
          </motion.p>
        </motion.div>

        <motion.div
          className="mb-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-base font-semibold text-gray-900"
          >
            Основные цели сервиса
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="mt-3 space-y-2 text-sm text-gray-700"
          >
            <p>
              • <span className="font-medium">Экономия средств.</span>{' '}
              Конкурентные оптовые и розничные цены напрямую от поставщиков.
            </p>
            <p>
              • <span className="font-medium">Организация доставки.</span>{' '}
              Логистика «до объекта» с планированием маршрутов и контролем
              сроков.
            </p>
            <p>
              •{' '}
              <span className="font-medium">Удобство и прозрачность.</span>{' '}
              Возможность отслеживать каждый этап сделки в цифровой среде.
            </p>
            <p>
              • <span className="font-medium">Консультирование.</span> Помощь в
              выборе материалов, технические консультации и подбор альтернатив.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-base font-semibold text-gray-900"
          >
            Что делает Valik.kz уникальным
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="mt-3 space-y-2 text-sm text-gray-700"
          >
            <p>
              • <span className="font-medium">Единая платформа.</span> Поставщики
              и заказчики работают в одном цифровом пространстве.
            </p>
            <p>
              • <span className="font-medium">Технологичность.</span> Используем
              современные технологии и элементы ИИ для рекомендаций и
              автоматизации.
            </p>
            <p>
              • <span className="font-medium">Современное продвижение.</span>{' '}
              Товары и услуги получают доступ к целевой аудитории по всей
              стране.
            </p>
            <p>
              • <span className="font-medium">Прозрачный процесс.</span> Видно
              статус заказа, доставки и коммуникаций на каждом этапе.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-base font-semibold text-gray-900"
          >
            Для кого создан Valik.kz
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="mt-3 space-y-1 text-sm text-gray-700"
          >
            <p>• Строительные компании и подрядчики</p>
            <p>• Частные застройщики</p>
            <p>• Ремонтные бригады</p>
            <p>• Архитекторы и дизайнеры</p>
            <p>• Поставщики и дистрибьюторы строительных материалов</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
