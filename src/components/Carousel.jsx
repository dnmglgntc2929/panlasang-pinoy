import React, { useState, useEffect } from "react";
import "../css/Carousel.css";

export default function Carousel({ images }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) =>
        prevImage === images.length - 1 ? 0 : prevImage + 1
      );
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentImage(index);
  };

  return (
    <div className="carousel">
      <img src={images[currentImage]} alt="carousel" className="carousel-img" />
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`carousel-indicator ${currentImage === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
