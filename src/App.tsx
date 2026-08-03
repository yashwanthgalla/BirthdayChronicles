import { useState, useEffect, useRef } from 'react';
import './App.css';
import { GF_PHOTOS } from './photos';
import Card from './Card';
import GalleryView from './GalleryView';
import SpecialPage from './SpecialPage';
import { ArrowUp } from 'lucide-react';

// Shuffles an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Parses dates from filename or generates a stable date using path hash
function getStableDateForPhoto(path: string): string {
  const dateRegex = /(\d{4})[-_]?(\d{2})[-_]?(\d{2})/;
  const match = path.match(dateRegex);
  if (match) {
    const [_, y, m, d] = match;
    return `${m}.${d}.${y}`;
  }
  
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = path.charCodeAt(i) + ((hash << 5) - hash);
  }
  const year = 2023 + Math.abs(hash % 4);
  const month = 1 + Math.abs((hash >> 3) % 12);
  const day = 1 + Math.abs((hash >> 7) % 28);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(month)}.${pad(day)}.${year}`;
}

const MILESTONE_TITLES = [
  "THE FIRST MEETING", "GOLDEN HOUR FLIGHTS", "MIDNIGHT WALK ECHOES", "VELVET CHRISTMAS",
  "ECHOES OF SUMMER", "THE GOLDEN CHAPTER", "STILLNESS IN MOTION", "AURA OF HER",
  "SOUVENIR FOREVER", "VELVET NIGHTS", "FIRST LIGHT REFLECTIONS", "SONICS OF DUSK",
  "TEMPO OF US", "SILENT RESONANCE", "HARMONY IN TIME", "COORDINATE E-102"
];

const LOCATIONS = [
  "TOKYO, JP", "PARIS, FR", "AMALFI, IT", "NEW YORK, US", "LONDON, UK", "HER HEART, IN",
  "RETROGRADE ARCHIVE", "DUSK HORIZON", "ECHO CHAMBER", "AMPLITUDE LAB"
];

// Dynamically gets consistent metadata for any photo based on its file path
function getCardMetadata(path: string) {
  const date = getStableDateForPhoto(path);
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = path.charCodeAt(i) + ((hash << 5) - hash);
  }
  const milestone = MILESTONE_TITLES[Math.abs(hash) % MILESTONE_TITLES.length];
  const location = LOCATIONS[Math.abs(hash >> 3) % LOCATIONS.length];
  const catalogNum = 100 + Math.abs(hash >> 5) % 900;
  
  return {
    code: `SVR-${catalogNum}`,
    title: date, // Date as the main card title
    description: milestone,
    location: location,
    duration: "ARCHIVE"
  };
}




const FIRST_HERO_IMAGE = "/yashu/IMG-20250815-WA0005.jpg";

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'gallery' | 'wishes'>('main');

  // Hero images array (only the specified single image visible in the hero section)
  const [heroImages] = useState<string[]>([FIRST_HERO_IMAGE]);

  // Slides double-buffered state for high performance cross-fade
  const [slides, setSlides] = useState({
    active: FIRST_HERO_IMAGE,
    incoming: heroImages[1] || FIRST_HERO_IMAGE,
    showIncoming: false
  });
  const heroIndexRef = useRef(0);

  // Deck states (stores array of photo path strings)
  const shuffledPool = useRef<string[]>([]);
  const nextPhotoIndex = useRef(0);
  
  


  const [cards, setCards] = useState<string[]>(() => {
    const rest = GF_PHOTOS.filter(p => p !== FIRST_HERO_IMAGE);
    const pool = [FIRST_HERO_IMAGE, ...shuffleArray(rest)];
    shuffledPool.current = pool;
    nextPhotoIndex.current = 6;
    return pool.slice(0, 6);
  });

  // Refs for scroll elements to target GPU transitions directly
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const spanLeftRef = useRef<HTMLSpanElement>(null);
  const spanRightRef = useRef<HTMLSpanElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const duotoneRef = useRef<HTMLDivElement>(null);
  const dotTealRef = useRef<HTMLDivElement>(null);
  const dotAmberRef = useRef<HTMLDivElement>(null);
  const circleWrapRef = useRef<HTMLDivElement>(null);
  // Gestures dragging states
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [throwingState, setThrowingState] = useState<{ active: boolean; dir: 'left' | 'right' | null }>({
    active: false,
    dir: null
  });

  const dragStart = useRef({ x: 0, y: 0 });
  const deckRef = useRef<HTMLDivElement>(null);
  const isThrowing = useRef(false);


  // High-performance double-buffered image cycling
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      const nextIdx = (heroIndexRef.current + 1) % heroImages.length;
      heroIndexRef.current = nextIdx;
      
      // 1. Prepare next image on top layers and trigger opacity fade
      setSlides(prev => ({
        ...prev,
        incoming: heroImages[nextIdx],
        showIncoming: true
      }));

      // 2. Commit to active background and reset incoming layer after transition is done (1.5s)
      setTimeout(() => {
        setSlides(prev => ({
          ...prev,
          active: heroImages[nextIdx],
          showIncoming: false
        }));
      }, 1500);

    }, 4500);

    return () => clearInterval(timer);
  }, [heroImages]);

  // Buttery-smooth inertial scroll loop targeting DOM nodes directly (skip React renders)
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionClass = (isReduced: boolean) => {
      if (isReduced) {
        document.body.classList.remove('allow-animations');
      } else {
        document.body.classList.add('allow-animations');
      }
    };
    
    updateMotionClass(motionQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      updateMotionClass(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Scroll interpolation parameters
    let currentProgress = 0;
    let targetProgress = 0;
    let currentScrollY = 0;
    let targetScrollY = 0;
    let rafId = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
      const portalThreshold = 700;
      targetProgress = Math.max(0, Math.min(targetScrollY / portalThreshold, 1));
    };

    const smoothAnimationLoop = () => {
      // Easing algorithm: current += (target - current) * factor
      currentProgress += (targetProgress - currentProgress) * 0.085;
      currentScrollY += (targetScrollY - currentScrollY) * 0.085;

      const p = currentProgress;
      const s = currentScrollY;

      // Apply transforms directly via DOM style properties (triggers GPU layer composition, zero lag)
      if (leftPanelRef.current) {
        leftPanelRef.current.style.transform = `translate3d(${-51 * p}vw, 0, 0)`;
      }
      if (rightPanelRef.current) {
        rightPanelRef.current.style.transform = `translate3d(${51 * p}vw, 0, 0)`;
      }
      if (spanLeftRef.current) {
        spanLeftRef.current.style.transform = `translate3d(${-18 * p}vw, 0, 0)`;
      }
      if (spanRightRef.current) {
        spanRightRef.current.style.transform = `translate3d(${18 * p}vw, 0, 0)`;
      }
      if (titleContainerRef.current) {
        const scale = 1 + 0.22 * p;
        const letterSpacing = 0.06 - 0.08 * p;
        titleContainerRef.current.style.transform = `scale3d(${scale}, ${scale}, 1)`;
        titleContainerRef.current.style.letterSpacing = `${letterSpacing}em`;
      }
      if (bgWrapRef.current) {
        const bgScale = 1.15 - 0.15 * p;
        bgWrapRef.current.style.transform = `scale3d(${bgScale}, ${bgScale}, 1)`;
      }
      if (duotoneRef.current) {
        duotoneRef.current.style.opacity = `${p * 0.35}`;
      }
      if (dotTealRef.current) {
        dotTealRef.current.style.transform = `translate3d(calc(-50% - ${40 * p}vw), calc(-50% - ${40 * p}vh), 0)`;
      }
      if (dotAmberRef.current) {
        dotAmberRef.current.style.transform = `translate3d(calc(-50% + ${40 * p}vw), calc(-50% + ${40 * p}vh), 0)`;
      }
      if (circleWrapRef.current) {
        const driftX = s * 0.06;
        const driftY = s * -0.03;
        const rotate = s * 0.08;
        circleWrapRef.current.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) rotate(${rotate}deg)`;
      }

      rafId = requestAnimationFrame(smoothAnimationLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(smoothAnimationLoop);

    // Intersection Observer for fade-in animations
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  // Throwable Card Deck Logic
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (throwingState.active || isThrowing.current) return;
    const cardElement = e.currentTarget;
    cardElement.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dX = e.clientX - dragStart.current.x;
    const dY = e.clientY - dragStart.current.y;
    setDragOffset({ x: dX, y: dY });
  };

  const throwCard = (direction: 'left' | 'right') => {
    if (isThrowing.current) return;
    isThrowing.current = true;
    setIsDragging(false);
    setThrowingState({ active: true, dir: direction });
    
    // Simulate swipe out transition completion
    setTimeout(() => {
      const nextPhoto = shuffledPool.current[nextPhotoIndex.current];
      
      setCards((prev) => {
        const next = [...prev];
        next.shift(); // remove the top swiped card
        next.push(nextPhoto); // add new card to bottom
        return next;
      });

      // Update refs & count outside the React StrictMode-run functional state updater
      nextPhotoIndex.current = (nextPhotoIndex.current + 1) % shuffledPool.current.length;

      setDragOffset({ x: 0, y: 0 });
      setThrowingState({ active: false, dir: null });
      isThrowing.current = false;
    }, 300);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const deckWidth = deckRef.current?.offsetWidth || 380;
    const threshold = deckWidth * 0.1; // 10% of deck width
    
    if (dragOffset.x > threshold) {
      throwCard('right');
    } else if (dragOffset.x < -threshold) {
      throwCard('left');
    } else {
      // Snap back smoothly
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (throwingState.active || isThrowing.current) return;
    if (e.key === 'ArrowRight') {
      throwCard('right');
    } else if (e.key === 'ArrowLeft') {
      throwCard('left');
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      throwCard('right');
    }
  };

  // Scroll smooth anchor links
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };


  if (currentView === 'gallery') {
    return <GalleryView onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'wishes') {
    return <SpecialPage onBack={() => setCurrentView('main')} />;
  }

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-wordmark">
          BIRTHDAY CHRONICLES // 2026
        </div>
        <div className="nav-links">
          <a href="#statement" onClick={(e) => { e.preventDefault(); scrollToSection('statement'); }} className="nav-link">INFO</a>
          <a href="#releases" onClick={(e) => { e.preventDefault(); scrollToSection('releases'); }} className="nav-link">MOMENTS</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="nav-link">ABOUT</a>
          <button onClick={() => setCurrentView('gallery')} className="btn-pill">VIEW PHOTOS</button>
        </div>
      </nav>

      {/* 1. Portal Hero */}
      <section className="portal-hero">
        <div className="portal-stage">
          {/* Layer 1: Background Images Slideshow (Fades between active/incoming buffers) */}
          <div ref={bgWrapRef} className="portal-bg-wrap">
            <img
              src={slides.active}
              className="portal-bg active"
              alt="Active background memory slideshow"
            />
            <img
              src={slides.incoming}
              className="portal-bg"
              style={{ opacity: slides.showIncoming ? 1 : 0 }}
              alt="Incoming background memory slideshow"
            />
          </div>

          {/* Layer 2: Duotone Wash */}
          <div ref={duotoneRef} className="portal-duotone"></div>

          {/* Layer 3: Radial Veil */}
          <div className="portal-veil"></div>

          {/* Layer 4: Two Solid Panels */}
          <div ref={leftPanelRef} className="portal-panel left"></div>
          <div ref={rightPanelRef} className="portal-panel right"></div>

          {/* Layer 5: Traveling Accent Dots */}
          <div className="portal-center-dots">
            <div ref={dotTealRef} className="portal-dot teal-dot"></div>
            <div ref={dotAmberRef} className="portal-dot amber-dot"></div>
          </div>

          {/* Layer 6: Splitting & Growing Wordmark */}
          <div ref={titleContainerRef} className="portal-title-container">
            <h1 className="portal-title">
              <span ref={spanLeftRef} className="span-left">HAPPY BIRTHDAY</span>
              <span ref={spanRightRef} className="span-right">CHINNODA</span>
            </h1>
          </div>

          {/* Corner Metadata */}
          <div className="portal-meta top-left">SVR-2026 // BDAY</div>
          <div className="portal-meta top-right">EST. 08.03</div>
          <div className="portal-meta bottom-left">SCROLL TO UNCOVER</div>
          <div className="portal-meta bottom-right">BDAY ARCHIVE</div>
        </div>
      </section>

      {/* 2. Statement Fold */}
      <section id="statement" className="statement-fold">
        <div className="statement-numeral">01</div>
        
        {/* Drifting and rotating circular image */}
        <div ref={circleWrapRef} className="statement-circle-wrap">
          <img src="/yashu/Snapchat-143669298.jpg" className="statement-circle-img" alt="Milestone memory circle" />
        </div>

        <div className="statement-wrapper">
          <div className="statement-content reveal">
            <div className="statement-text-container">
              <h3 className="statement-heading">Many more returns of the day, Ammu ❤️🎂</h3>
              
              <p className="statement-paragraph">
                Happy Birthday to the most precious person in my life. Thank you for filling my days with love, happiness, and countless beautiful memories. You make my world brighter just by being in it.
              </p>

              <p className="statement-paragraph">
                I hope this year brings you endless smiles, good health, success, and everything you've ever wished for. No matter what life brings, I'll always be by your side, cheering for you and loving you with all my heart.
              </p>

              <p className="statement-paragraph">
                Thank you for being my peace, my strength, and my greatest blessing. Keep smiling, because your smile is my favorite thing in the world.
              </p>

              <p className="statement-paragraph highlight-closing">
                I love you more than words can ever express. Happy Birthday once again, my love. ❤️✨
              </p>
            </div>
          </div>

          <div className="statement-card-container reveal">
            <Card />
          </div>
        </div>
      </section>

      {/* 3. Releases Section */}
      <section id="releases" className="releases-section">
        <div className="releases-info reveal">
          <span className="label-caps" style={{ display: 'block', marginBottom: '24px' }}>
            MY FAVORITE MOMENTS<span className="accent-dot teal"></span>
          </span>
          <h2 className="releases-title">EVERY MOMENT WITH YOU</h2>
          <p className="releases-lede">
            If someone asked me what my favorite moment with you is, I could never pick just one, because every moment with you becomes my new favorite. ❤️
          </p>
          <p className="releases-lede" style={{ marginTop: '16px', marginBottom: '32px' }}>
            You're one of the best things that's ever happened to me, and you've made my life happier in ways you'll never fully realize. I don't know what the future has planned, but I know I'll always be grateful that it brought you into my life. Thank you.
          </p>
          <div className="releases-actions">
            <button className="btn-pill" onClick={() => setCurrentView('gallery')}>VIEW PHOTOS</button>
          </div>
        </div>

        {/* Right side: Throwable Deck */}
        <div className="deck-container-wrap reveal">
          <div 
            ref={deckRef}
            className="deck-container"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label="Throwable album catalog stack. Use left and right arrow keys to browse."
          >
            {cards.map((photoPath, index) => {
              const cardData = getCardMetadata(photoPath);
              const isTop = index === 0;
              
              // Base stack parameters
              const offsetMultiplier = 1;
              const xOffset = index * 8 * offsetMultiplier;
              const yOffset = index * 6 * offsetMultiplier;
              const rOffset = index * 1.5 * (index % 2 === 0 ? 1 : -1);
              const scaleOffset = 1 - index * 0.03;

              // Apply drag styles to the top card only
              let style: React.CSSProperties = {
                zIndex: GF_PHOTOS.length - index,
                transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rOffset}deg) scale(${scaleOffset})`,
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease'
              };

              if (isTop) {
                if (isDragging) {
                  const rotateDrag = dragOffset.x * 0.06;
                  style = {
                    ...style,
                    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotateDrag}deg) scale(1.03)`,
                    cursor: 'grabbing'
                  };
                } else if (throwingState.active) {
                  const throwX = throwingState.dir === 'right' ? 500 : -500;
                  const throwR = throwingState.dir === 'right' ? 60 : -60;
                  style = {
                    ...style,
                    transform: `translate(${throwX}px, ${dragOffset.y + 40}px) rotate(${throwR}deg) scale(0.95)`,
                    opacity: 0
                  };
                }
              }

              return (
                <div
                  key={photoPath}
                  className="deck-card"
                  style={style}
                  onPointerDown={isTop ? handlePointerDown : undefined}
                  onPointerMove={isTop ? handlePointerMove : undefined}
                  onPointerUp={isTop ? handlePointerUp : undefined}
                  onPointerCancel={isTop ? handlePointerUp : undefined}
                >
                  <div className="card-artwork-wrap">
                    <img 
                      src={photoPath} 
                      className="card-artwork" 
                      alt={`Memory from ${cardData.title}`}
                    />
                  </div>
                  <div className="card-details">
                    <div className="card-top">
                      <span className="card-code">{cardData.code}</span>
                      <span className="card-code">{cardData.duration}</span>
                    </div>
                    <div className="card-meta">
                      <span>{cardData.description}</span>
                      <span>{cardData.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="deck-controls">
            <div className="deck-dots">
              {/* Render indicator dots matching the active stack */}
              {cards.map((_, i) => (
                <div 
                  key={i} 
                  className={`deck-dot ${i === 0 ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* 5. About Birthday Chronicles Section (Signature 2-Column Theme Layout) */}
      <section id="about" className="about-chronicles-section">
        <div className="about-numeral">03</div>

        {/* Left Column: Info & Story */}
        <div className="about-info reveal">
          <h2 className="about-title">WHY "BIRTHDAY CHRONICLES"?</h2>

          <p className="about-lead">
            Every birthday marks the beginning of a new chapter—not just in life, but in the memories we create together. That's why I chose the name <strong>Birthday Chronicles</strong>.
          </p>

          <p className="about-body">
            A chronicle is a collection of stories recorded over time. Instead of making a single birthday website, I wanted to create something that grows with every passing year. Each edition captures a moment, a feeling, and the person you are at that point in your life.
          </p>

          <p className="about-body">
            My hope is that, years from now, we'll look back at these chronicles together and relive every birthday, one chapter at a time.
          </p>

          <div className="about-red-quote-container">
            <span className="about-red-quote-text">
              "Because some stories deserve to be written every year." ❤️
            </span>
          </div>
        </div>

        {/* Right Column: Chronicle Chapter Cards Stack */}
        <div className="about-cards-stack reveal">
          <div className="chronicle-chapter-card amber-theme">
            <div className="chapter-badge">EDITION 01</div>
            <div className="chapter-header">
              <span className="chapter-year">2025</span>
              <h3 className="chapter-title">THE FIRST WISH</h3>
            </div>
            <p className="chapter-desc">
              Where this journey began—a simple way of celebrating you and everything you mean to me.
            </p>
            <div className="chapter-footer">
              <span>SVR-2025</span>
              <span>VOL. I</span>
            </div>
          </div>

          <div className="chronicle-chapter-card teal-theme">
            <div className="chapter-badge teal">EDITION 02</div>
            <div className="chapter-header">
              <span className="chapter-year teal">2026</span>
              <h3 className="chapter-title">THE NEXT CHAPTER</h3>
            </div>
            <p className="chapter-desc">
              Isn't just another version of a website. It's another page in our story, filled with new memories, new smiles, and another year of loving the incredible person you are.
            </p>
            <div className="chapter-footer">
              <span>SVR-2026</span>
              <span>VOL. II</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Close Section */}
      <section className="close-section">
        <div className="close-top reveal">
          <div className="close-left">
            <div className="close-header">
              <span className="label-caps" style={{ display: 'block', marginBottom: '24px' }}>
                THE CONCLUSION<span className="accent-dot amber"></span>
              </span>
              <h2 className="close-title">THANK YOU ❤️</h2>
              <p className="close-lede" style={{ marginBottom: '32px' }}>
                Loving you has been the toughest and most beautiful part of my life.
              </p>
            </div>
            <div className="close-actions">
              <button className="btn-outline" onClick={() => scrollToSection('portal-hero')}>BACK TO TOP</button>
            </div>
          </div>

          {/* Stationary Heart PNG Entrance filling the gap in conclusion */}
          <div className="close-center-png-wrap" onClick={() => setCurrentView('wishes')}>
            <img
              src="/39926b66c9ddf7c0dcd85730eeabac8f-removebg-preview.png"
              className="stationary-png-img"
              alt="Secret Souvenir Portal"
            />
            <button
              className="btn-pill btn-click-here"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView('wishes');
              }}
            >
              <ArrowUp size={14} color="var(--amber)" /> CLICK HERE
            </button>
          </div>


        </div>

        <div className="close-footer">
          <div className="close-footer-bar">
            <span>© 2026 BIRTHDAY CHRONICLES. ALL RIGHTS RESERVED FOR YASHU.</span>
            <span>DESIGNED BY YASHWANTH GALLA</span>
          </div>
          <div className="close-big-wordmark">
            <span className="wordmark-white-y">Y</span>ASHU
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
export { shuffleArray };
