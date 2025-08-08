"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperObject } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./slideShow.css";
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";
import { ProductImage } from "@/components";
import { IoExpand, IoClose } from "react-icons/io5";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductSlidesShow = ({ images, title, className }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();
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
        <div className="relative">
          <Swiper
            style={
              {
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
              } as React.CSSProperties
            }
            spaceBetween={10}
            navigation={true}
            autoplay={{ delay: 2500 }}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs, Autoplay]}
            className="mySwiper2"
            onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image}>
                <div className="relative cursor-pointer" onClick={() => openFullscreen(index)}>
                  <ProductImage
                    className="rounded-lg object-cover w-full h-64"
                    url={image}
                    width={1200}
                    height={900}
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
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image}>
              <div className="cursor-pointer" onClick={() => openFullscreen(index)}>
                <ProductImage
                  className="rounded-lg object-fill"
                  url={image}
                  width={1024}
                  height={800}
                  title={title}
                />
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
              className="absolute top-6 right-6 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
            >
              <IoClose className="w-6 h-6" />
            </button>

            {/* Навигация */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
                >
                  →
                </button>
              </>
            )}

            {/* Изображение */}
            <div className="max-w-full max-h-full flex items-center justify-center px-16 py-12">
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
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
