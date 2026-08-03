import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export const ChromaGrid = ({
  items,
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo = [
    {
      image: '/yashu/IMG-20250815-WA0001.jpg',
      title: 'Moments',
      subtitle: 'Memories & Frequencies',
      handle: 'SVR-01',
      borderColor: '#E8913C',
      gradient: 'linear-gradient(145deg, #E8913C, #0A0C0E)',
      location: 'BDAY ARCHIVE'
    },
    {
      image: '/yashu/IMG-20250815-WA0002.jpg',
      title: 'Golden Hour',
      subtitle: 'Sunset Cadence',
      handle: 'SVR-02',
      borderColor: '#2E6B72',
      gradient: 'linear-gradient(210deg, #2E6B72, #0A0C0E)',
      location: 'TOKYO, JP'
    },
    {
      image: '/yashu/IMG-20250815-WA0004.jpg',
      title: 'Reflections',
      subtitle: 'Stillness in Motion',
      handle: 'SVR-03',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(165deg, #4F46E5, #0A0C0E)',
      location: 'PARIS, FR'
    },
    {
      image: '/yashu/IMG-20250815-WA0006.jpg',
      title: 'Souvenir',
      subtitle: 'Aura of Her',
      handle: 'SVR-04',
      borderColor: '#10B981',
      gradient: 'linear-gradient(195deg, #10B981, #0A0C0E)',
      location: 'AMALFI, IT'
    },
    {
      image: '/yashu/IMG_0311[1].JPG',
      title: 'Harmony',
      subtitle: 'Echoes of Summer',
      handle: 'SVR-05',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(225deg, #8B5CF6, #0A0C0E)',
      location: 'NEW YORK, US'
    },
    {
      image: '/yashu/IMG_0624[1].JPG',
      title: 'Velvet Nights',
      subtitle: 'Midnight Echoes',
      handle: 'SVR-06',
      borderColor: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4, #0A0C0E)',
      location: 'LONDON, UK'
    }
  ];
  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = e => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true
    });
  };

  const handleCardClick = (url, onClick) => {
    if (onClick) {
      onClick();
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        '--r': `${radius}px`,
        '--cols': columns,
        '--rows': rows
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url, c.onClick)}
          style={{
            '--card-border': c.borderColor || 'transparent',
            '--card-gradient': c.gradient || 'linear-gradient(145deg, #2E6B72, #0A0C0E)',
            cursor: (c.url || c.onClick) ? 'pointer' : 'default'
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
