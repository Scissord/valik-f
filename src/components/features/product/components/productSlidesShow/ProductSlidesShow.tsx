"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperObject } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./slideShow.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
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
        <div className="flex gap-4">
          {/* Thumbnails on the left */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2 w-20">
              {images.map((image, index) => {
                if (index === currentImageIndex) return null;
                return (
                  <div
                    key={image}
                    className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-orange-400 transition-all"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <ProductImage
                      className="rounded-lg object-cover w-20 h-20"
                      url={image}
                      width={80}
                      height={80}
                      title={title}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1">
            <div className="relative">
              <div
                className="relative cursor-pointer flex items-center justify-center bg-gray-50 rounded-lg"
                style={{ height: '400px' }}
                onClick={() => openFullscreen(currentImageIndex)}
              >
                <ProductImage
                  className="rounded-lg max-w-full max-h-full"
                  url={images[currentImageIndex]}
                  width={1200}
                  height={900}
                  title={title}
                />
                <div
                  className="absolute top-2 right-2 p-2 rounded-full transition-all"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: '#ffffff'
                  }}
                >
                  <IoExpand className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Полноэкранный просмотр */}
      {isFullscreen && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 2147483647
          }}
        >
          <div className="relative w-full max-h-[70vh] flex items-center justify-center">
            {/* Кнопка закрытия */}
            <button
              onClick={closeFullscreen}
              className="absolute top-6 right-6 p-2 rounded-full transition-all z-10"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <IoClose className="w-6 h-6" />
            </button>

            {/* Навигация */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 p-2 rounded-full transition-all z-10"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 p-2 rounded-full transition-all z-10"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  →
                </button>
              </>
            )}

            {/* Изображение */}
            <div className="max-w-full max-h-full flex items-center justify-center px-16 py-12">
              <ProductImage
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                url={images[currentImageIndex]}
                width={1920}
                height={1080}
                title={title}
              />
            </div>

            {/* Индикатор */}
            {images.length > 1 && (
              <div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
