"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./slideShow.css";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { ProductImage } from "@/components";

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
  return (
    <div className={className}>
      <Swiper
        style={{
          width: "100%",
          height: "500px",
        }}
        pagination
        autoplay={{ delay: 2500 }}
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductImage
              className="object-fill"
              url={image}
              width={500}
              height={600}
              title={title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
