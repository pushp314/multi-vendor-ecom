'use client';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

export function ProductImageCarousel({ images, title }) {
  return (
    <Carousel showArrows={true} showThumbs={true} infiniteLoop={true} autoPlay={true} interval={5000}>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`${title} - image ${index + 1}`} />
        </div>
      ))}
    </Carousel>
  );
}