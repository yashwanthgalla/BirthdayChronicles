import React, { useEffect, useRef, useState } from 'react';
import './Card.css';

const PHOTOS = [
  "/yashu/IMG-20250815-WA0001.jpg",
  "/yashu/IMG-20250815-WA0002.jpg",
  "/yashu/IMG-20250815-WA0004.jpg",
  "/yashu/IMG-20250815-WA0006.jpg",
  "/yashu/IMG_0311[1].JPG",
  "/yashu/IMG_0624[1].JPG",
  "/yashu/photo_2026-03-24_16-30-25.jpg"
];

// Duplicate photos array to enable seamless infinite continuous scrolling
const DUPLICATED_PHOTOS = [...PHOTOS, ...PHOTOS];

const Card: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 0.8; // scroll speed in pixels per frame

    const scrollLoop = () => {
      if (!isPaused && container) {
        container.scrollLeft += speed;
        const maxHalf = container.scrollWidth / 2;
        if (container.scrollLeft >= maxHalf) {
          container.scrollLeft -= maxHalf;
        }
      }
      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <div className="card-scroll-wrapper">
      <div 
        ref={containerRef}
        className="container scroll-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {DUPLICATED_PHOTOS.map((src, index) => (
          <div key={index} className="card">
            <div 
              className="card__image" 
              style={{ backgroundImage: `url(${src})` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
