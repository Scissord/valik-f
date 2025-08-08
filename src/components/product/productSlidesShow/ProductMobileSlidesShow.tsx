"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./slideShow.css";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { ProductImage } from "@/components";
import { IoExpand, IoClose } from "react-icons/io5";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlidesShow = ({
  images,
  title,
  className,
}: Props) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openFullscreen = (index: number) => {
    setCurrentImageIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className={className}>
        <Swiper
          style={{
            width: "100%",
            height: "300px",
          }}
          pagination
          autoplay={{ delay: 2500 }}
          modules={[FreeMode, Autoplay, Pagination]}
          className="mySwiper2"
          onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image}>
              <div className="relative cursor-pointer h-full" onClick={() => openFullscreen(index)}>
                <ProductImage
                  className="object-cover w-full h-full"
                  url={image}
                  width={800}
                  height={600}
                  title={title}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all">
                  <IoExpand className="w-4 h-4" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Полноэкранный просмотр */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[99999] flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Кнопка закрытия */}
            <button
              onClick={closeFullscreen}
              className="absolute top-6 right-6 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
            >
              <IoClose className="w-6 h-6" />
            </button>

            {/* Навигация для мобильных */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-all z-10 text-xl"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-all z-10 text-xl"
                >
                  →
                </button>
              </>
            )}

            {/* Изображение */}
            <div className="max-w-full max-h-full flex items-center justify-center px-12 py-16">
              <ProductImage
                className="max-w-full max-h-full object-contain"
                url={images[currentImageIndex]}
                width={1920}
                height={1080}
                title={title}
              />
            </div>

            {/* Индикатор */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
