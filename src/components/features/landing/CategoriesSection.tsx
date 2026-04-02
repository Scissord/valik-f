"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoAppsOutline,
  IoConstructOutline,
  IoHammerOutline,
  IoBriefcaseOutline,
  IoBuildOutline,
  IoFlashOutline,
  IoWaterOutline,
  IoFlameOutline,
  IoColorPaletteOutline,
  IoBulbOutline,
  IoGridOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import { GoodCategory } from "@/lib/legacy";
import {
  MdWallpaper,
  MdOutlineLayers,
  MdRoofing,
  MdOutlineWindow,
  MdOutlineDoorFront,
  MdOutlineAir,
} from "react-icons/md";
import { useEffect, useRef, useState } from "react";

interface CategoriesSectionProps {
  categories: GoodCategory[];
  isLoadingCategories: boolean;
}


const getCategoryIcon = (category: GoodCategory): IconType => {
  const title = category.name.toLowerCase();

  if (title.includes("электро") || title.includes("электрик")) return IoFlashOutline;
  if (title.includes("светотехник") || title.includes("освещени")) return IoBulbOutline;
  if (title.includes("водоснабж")) return IoWaterOutline;
  if (title.includes("отоплени")) return IoFlameOutline;
  if (title.includes("вентиляц")) return MdOutlineAir;
  if (title.includes("кровельн")) return MdRoofing;
  if (title.includes("окна") || title.includes("окно")) return MdOutlineWindow;
  if (title.includes("двери") || title.includes("дверь") || title.includes("фурнитур")) return MdOutlineDoorFront;
  if (title.includes("лаки") || title.includes("краски") || title.includes("краска") || title.includes("клей")) return IoColorPaletteOutline;
  if (title.includes("плитк") || title.includes("кафель")) return IoGridOutline;
  if (title.includes("покрытия для пола")) return MdOutlineLayers;
  if (title.includes("отделочн")) return MdOutlineLayers;
  if (title.includes("обои")) return MdWallpaper;
  if (title.includes("сантехник")) return IoBuildOutline;
  if (title.includes("строительн") || title.includes("цемент") || title.includes("бетон")) return IoConstructOutline;
  if (title.includes("инструменты") || title.includes("крепёж")) return IoHammerOutline;

  return IoBriefcaseOutline;
};


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const CategoriesSection = ({ categories, isLoadingCategories }: CategoriesSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mobileScrollProgress, setMobileScrollProgress] = useState(0); // 0, 1, or 2

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // -10 for tolerance
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories, isLoadingCategories]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = 160 + 16;
    const currentScroll = container.scrollLeft;

    container.scrollTo({
      left: direction === "left" ? currentScroll - cardWidth : currentScroll + cardWidth,
      behavior: "smooth",
    });
  };

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = mobileScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setMobileScrollProgress(0);
      return;
    }
    const progress = scrollLeft / maxScroll;
    if (progress < 0.33) setMobileScrollProgress(0);
    else if (progress < 0.66) setMobileScrollProgress(1);
    else setMobileScrollProgress(2);
  };

  return (
    <section className="pt-4 sm:pt-10 pb-4 sm:pb-12">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Mobile categories strip with icons */}
          <div className="sm:hidden mb-4">
            <div className="relative">
              <div
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                className="grid grid-rows-2 auto-cols-max grid-flow-col gap-x-2 gap-y-2 overflow-x-auto pb-3 no-scrollbar px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* All categories item */}
                <Link
                  href="/categories"
                  className="flex-none w-20 flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 flex items-center justify-center">
                    <IoAppsOutline className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <span className="mt-1 text-[11px] leading-tight text-gray-600 group-hover:text-gray-900 line-clamp-2 h-7 flex items-center justify-center px-1">
                    Все категории
                  </span>
                </Link>

                {isLoadingCategories
                  ? Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex-none w-20 flex flex-col items-center text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-gray-100 animate-pulse" />
                      <div className="mt-2 h-3 w-12 rounded-full bg-gray-100 animate-pulse" />
                    </div>
                  ))
                  : categories.length > 0
                    ? [...categories].map((category) => {
                      const Icon = getCategoryIcon(category);
                      return (
                        <Link
                          key={category.id}
                          href={`/categories/${category.id}`}
                          className="flex-none w-20 flex flex-col items-center text-center group"
                        >
                          <div className="w-14 h-14 flex items-center justify-center">
                            <Icon className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                          </div>
                          <span className="mt-1 text-[11px] leading-tight text-gray-600 group-hover:text-gray-900 line-clamp-2 h-7 flex items-center justify-center px-1">
                            {category.name}
                          </span>
                        </Link>
                      );
                    })
                    : null}
              </div>

              {/* Scroll indicator */}
              <div className="flex justify-center mt-2">
                <div className="flex items-center gap-1">
                  <div className={`h-1 rounded-full transition-all duration-200 ${mobileScrollProgress === 0 ? 'w-6 bg-orange-400' : 'w-2 bg-gray-300'}`}></div>
                  <div className={`h-1 rounded-full transition-all duration-200 ${mobileScrollProgress === 1 ? 'w-6 bg-orange-400' : 'w-2 bg-gray-300'}`}></div>
                  <div className={`h-1 rounded-full transition-all duration-200 ${mobileScrollProgress === 2 ? 'w-6 bg-orange-400' : 'w-2 bg-gray-300'}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop card carousel */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-end mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  className={`p-2 rounded-full border transition-all duration-200 ${!canScrollLeft
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                    }`}
                  aria-label="Назад"
                >
                  <IoChevronBackOutline className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  className={`p-2 rounded-full border transition-all duration-200 ${!canScrollRight
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                    }`}
                  aria-label="Вперед"
                >
                  <IoChevronForwardOutline className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar scroll-px-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {isLoadingCategories ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex-none w-36 sm:w-40 lg:w-44 h-[168px] bg-gray-100 rounded-2xl animate-pulse"
                    />
                  ))
                ) : categories.length > 0 ? (
                  [...categories].map((category) => {
                    const Icon = getCategoryIcon(category);
                    return (
                      <motion.div key={category.id} variants={cardVariants} className="flex-none w-36 sm:w-40 lg:w-44 snap-start">
                        <Link
                          href={`/categories/${category.id}`}
                          className="group block h-full"
                        >
                          <div className="bg-white rounded-2xl border border-gray-100 group-hover:border-gray-200 group-hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 h-[168px] px-3">
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                              <Icon className="w-7 h-7 text-orange-400 group-hover:text-orange-500 transition-colors duration-200" />
                            </div>
                            <h3 className="font-medium text-[13px] text-center text-gray-600 group-hover:text-gray-900 leading-snug line-clamp-2 w-full transition-colors duration-200">
                              {category.name}
                            </h3>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="w-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl">
                    Категории не найдены
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
