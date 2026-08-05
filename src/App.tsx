import { useState, useEffect, useRef, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import './SpecialPage.css';
import { GF_PHOTOS } from './photos';
import { WISHES_MESSAGES } from './wishesData';
import Card from './Card';
import DepthCarousel from './DepthCarousel';
import AccordionGallery from './AccordionGallery';
import GalleryView from './GalleryView';
import SpecialPage from './SpecialPage';
import ProtectedRoute from './ProtectedRoute';
import { logoutUser } from './authConfig';
import { ArrowUp, Quote, Heart, ChevronLeft, ChevronRight, Lock, ExternalLink, Sparkles, Volume2, VolumeX } from 'lucide-react';

// Single Wish Message Carousel with left photo & right message matter
export function WishesCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? WISHES_MESSAGES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev === WISHES_MESSAGES.length - 1 ? 0 : prev + 1));
  };

  const item = WISHES_MESSAGES[currentIdx];
  const accentColor = currentIdx % 2 === 0 ? 'var(--amber)' : 'var(--teal)';

  return (
    <div className="wishes-slider-wrapper">
      <button 
        className="wish-nav-arrow left" 
        onClick={handlePrev}
        aria-label="Previous wish message"
      >
        <ChevronLeft size={22} color="var(--ink)" />
      </button>

      <div className="wish-single-card" key={item.id}>
        {/* Left Side: Photo */}
        <div 
          className="wish-card-photo-side"
          style={{ borderColor: accentColor }}
        >
          <img 
            src={item.photoUrl || '/wish/wish-1.jpg'} 
            alt={item.sender}
            className="wish-photo-img" 
            onError={(e) => {
              // Fallback to default souvenir photo if custom /wish/ photo is not found
              (e.currentTarget as HTMLImageElement).src = '/us/photo_2026-05-22_15-47-57.jpg';
            }}
          />
          <div className="wish-photo-overlay" />
          <span className="wish-photo-badge" style={{ background: accentColor }}>
            {item.relationship}
          </span>
        </div>

        {/* Right Side: Message Content Matter */}
        <div className="wish-card-content-side">
          <div className="wish-content-header">
            <div>
              <h3 className="wish-sender-title">{item.sender}</h3>
              <span className="wish-relation-tag" style={{ color: accentColor }}>
                {item.relationship}
              </span>
            </div>
            {item.timestamp && (
              <span className="wish-date-badge">{item.timestamp}</span>
            )}
          </div>

          <div className="wish-content-body">
            <Quote className="wish-large-quote-icon" size={32} style={{ color: accentColor }} />
            <p className="wish-paragraph-text">{item.message}</p>
          </div>

          <div className="wish-content-footer" style={{ color: accentColor }}>
            <Heart size={14} fill={accentColor} color={accentColor} />
            <span>WISHED WITH LOVE</span>
          </div>
        </div>
      </div>

      <button 
        className="wish-nav-arrow right" 
        onClick={handleNext}
        aria-label="Next wish message"
      >
        <ChevronRight size={22} color="var(--ink)" />
      </button>

      <div className="wishes-carousel-dots">
        {WISHES_MESSAGES.map((_, idx) => (
          <button
            key={idx}
            className={`wish-dot-pill ${idx === currentIdx ? 'active' : ''}`}
            onClick={() => setCurrentIdx(idx)}
            aria-label={`Go to wish ${idx + 1}`}
            style={{
              background: idx === currentIdx ? accentColor : 'rgba(237, 231, 220, 0.15)'
            }}
          />
        ))}
      </div>
    </div>
  );
}

const ACCORDION_POEM = `"నచ్చేసావే మల్లెగంప
నీ అందాలే నాలో దింప
ఏం తిన్నావో కాయ దుంప
నీ యవ్వారం జరదా ముంప

నీ చుట్టూరా కళ్ళేసి
లోగుట్టే నమిలేసి
లొట్టెసి ఊరాయి
నోట నీళ్లు

నీ సింగారాన్ని చూత్తావుంటే
సొంగకార్చుకుందే
గుండె బెంగ నిదరని మింగే హంగే
చెయ్యలేసే చెయ్యలేసే"`;

// Animated Handwriting Text component that types Telugu graphemes letter-by-letter in a loop
export function AnimatedHandwritingText({ text = ACCORDION_POEM }: { text?: string }) {
  const [displayedCount, setDisplayedCount] = useState(0);

  const graphemes = useMemo(() => {
    if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
      const segmenter = new (Intl as any).Segmenter('te', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (s: any) => s.segment);
    }
    return Array.from(text);
  }, [text]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | number;
    let current = 0;
    const total = graphemes.length;

    const typeNext = () => {
      if (current <= total) {
        setDisplayedCount(current);
        current++;
        timer = setTimeout(typeNext, 120);
      } else {
        timer = setTimeout(() => {
          current = 0;
          setDisplayedCount(0);
          timer = setTimeout(typeNext, 400);
        }, 4000);
      }
    };

    timer = setTimeout(typeNext, 300);

    return () => clearTimeout(timer as number);
  }, [graphemes]);

  return (
    <div className="animated-handwriting-wrapper" aria-label={text}>
      <span className="handwriting-text">
        {graphemes.map((char, index) => {
          if (char === '\n') {
            return <br key={index} />;
          }
          return (
            <span
              key={index}
              className={`handwriting-letter ${index < displayedCount ? 'visible' : ''}`}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </span>
      <span className="handwriting-cursor">|</span>
    </div>
  );
}

const AA_MUKKU_AUDIO_SRC = encodeURI('/Aa Mukku Pai Pettikopam - Chikiri Chikiri _ Mohit Chauhan _ Peddi _ Telugu.mp3');

export const AA_MUKKU_TIMED_LYRICS = [
  { id: 0, time: 3.0, endTime: 5.9, text: 'ఆ ముక్కు పై పెట్టి కోపం', stanza: 1 },
  { id: 1, time: 5.9, endTime: 8.8, text: 'తొక్కేసావే ముక్కెర అందం', stanza: 1 },
  { id: 2, time: 8.8, endTime: 11.8, text: 'చింతాకులా ఉందే పాదం', stanza: 1 },
  { id: 3, time: 11.8, endTime: 15.0, text: 'చిరాకులే నడిచే వాటం', stanza: 1 },

  { id: 4, time: 15.0, endTime: 17.4, text: 'ఏం బుగ్గవో అందాలు', stanza: 2 },
  { id: 5, time: 17.4, endTime: 19.8, text: 'ఒళ్ళంతా వంకీలు', stanza: 2 },
  { id: 6, time: 19.8, endTime: 22.2, text: 'నీ మధ్యే దాగిందా', stanza: 2 },
  { id: 7, time: 22.2, endTime: 25.0, text: 'తాటి కల్లు', stanza: 2 },

  { id: 8, time: 25.0, endTime: 28.3, text: 'కూసింతే చూత్తే నీలో వగలు', stanza: 3 },
  { id: 9, time: 28.3, endTime: 31.0, text: 'రాసేత్తారుగా ఎకరాలు', stanza: 3 },
  { id: 10, time: 31.0, endTime: 33.6, text: 'నువ్వే నడిచిన చోటంతా', stanza: 3 },
  { id: 11, time: 33.6, endTime: 9999, text: 'పొర్లు దండాలు', stanza: 3 }
];

export function SyncedKaraokeLyrics({
  lines,
  currentTime,
  isPlaying,
  label = "Song Lyrics"
}: {
  lines: typeof AA_MUKKU_TIMED_LYRICS;
  currentTime: number;
  isPlaying: boolean;
  label?: string;
}) {
  return (
    <div className="synced-karaoke-wrapper" aria-label={label}>
      <div className="karaoke-quote-mark">“</div>

      {/* Stanza 1 */}
      <div className="karaoke-stanza">
        {lines.slice(0, 4).map(line => {
          const isActive = isPlaying && currentTime >= line.time && currentTime < line.endTime;
          const isPassed = currentTime >= line.endTime;
          return (
            <div
              key={line.id}
              className={`karaoke-line ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Stanza 2 */}
      <div className="karaoke-stanza">
        {lines.slice(4, 8).map(line => {
          const isActive = isPlaying && currentTime >= line.time && currentTime < line.endTime;
          const isPassed = currentTime >= line.endTime;
          return (
            <div
              key={line.id}
              className={`karaoke-line ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Stanza 3 */}
      <div className="karaoke-stanza">
        {lines.slice(8, 12).map(line => {
          const isActive = isPlaying && currentTime >= line.time && currentTime < line.endTime;
          const isPassed = currentTime >= line.endTime;
          return (
            <div
              key={line.id}
              className={`karaoke-line ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      <div className="karaoke-quote-mark end">”</div>
    </div>
  );
}

export function MemoriesSection({ memoriesItems }: { memoriesItems: any[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = new Audio(AA_MUKKU_AUDIO_SRC);
    audio.volume = 0.5; // 50% volume as requested
    audio.loop = true;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
    };
  }, []);

  const fadeTimerRef = useRef<any>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const audio = audioRef.current;
          if (!audio) return;

          if (entry.isIntersecting) {
            if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
            audio.volume = 0.5;
            audio.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {
              // Fallback if browser requires interaction
            });
          } else {
            if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
            let currentVol = audio.volume;
            fadeTimerRef.current = setInterval(() => {
              currentVol -= 0.05;
              if (currentVol <= 0.02) {
                clearInterval(fadeTimerRef.current);
                audio.volume = 0;
                audio.pause();
                audio.volume = 0.5;
                setIsPlaying(false);
              } else {
                audio.volume = currentVol;
              }
            }, 40);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
    if (!audio.muted && audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <section id="memories" ref={sectionRef} className="memories-section reveal">
      <div className="memories-audio-controls">
        <button
          onClick={toggleMute}
          className="btn-audio-mute"
          title={isMuted ? 'Unmute Song' : 'Mute Song'}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? (
            <>
              <VolumeX size={15} color="var(--amber)" />
              <span>MUTED</span>
            </>
          ) : (
            <>
              <Volume2 size={15} color="var(--amber)" />
              <span>AUDIO ON</span>
            </>
          )}
        </button>
      </div>

      <div className="memories-frame-wrapper">
        <div className="memories-side-badge">
          <SyncedKaraokeLyrics
            lines={AA_MUKKU_TIMED_LYRICS}
            currentTime={currentTime}
            isPlaying={isPlaying}
            label="Aa Mukku Pai Petti Kopam Lyrics"
          />
        </div>

        <div className="memories-carousel-container">
          <DepthCarousel
            items={memoriesItems}
            cardWidth={355}
            cardHeight={455}
            radius={20}
            depth={220}
            spread={95}
            tilt={22}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            autoplay={true}
            autoplayDelay={3200}
            loop={true}
            showControls={false}
            showIndicators={false}
            enableWheel={false}
            random={true}
          />
        </div>
      </div>
    </section>
  );
}

const NACHCHESAAVE_AUDIO_SRC = encodeURI('/Nachchesaave Mallegampa - Chikiri Chikiri _ Mohit Chauhan _ Peddi _ Telugu.mp3');

export const NACHCHESAAVE_TIMED_LYRICS = [
  { id: 0, time: 3.0, endTime: 5.8, text: 'నచ్చేసావే మల్లెగంప', stanza: 1 },
  { id: 1, time: 5.8, endTime: 8.7, text: 'నీ అందాలే నాలో దింప', stanza: 1 },
  { id: 2, time: 8.7, endTime: 11.8, text: 'ఏం తిన్నావో కాయ దుంప', stanza: 1 },
  { id: 3, time: 11.8, endTime: 15.0, text: 'నీ యవ్వారం జరదా ముంప', stanza: 1 },

  { id: 4, time: 15.0, endTime: 17.3, text: 'నీ చుట్టూరా కళ్ళేసి', stanza: 2 },
  { id: 5, time: 17.3, endTime: 19.6, text: 'లోగుట్టే నమిలేసి', stanza: 2 },
  { id: 6, time: 19.6, endTime: 22.0, text: 'లొట్టెసి ఊరాయి', stanza: 2 },
  { id: 7, time: 22.0, endTime: 25.0, text: 'నోట నీళ్లు', stanza: 2 },

  { id: 8, time: 25.0, endTime: 28.2, text: 'నీ సింగారాన్ని చూత్తావుంటే', stanza: 3 },
  { id: 9, time: 28.2, endTime: 30.7, text: 'సొంగకార్చుకుందే', stanza: 3 },
  { id: 10, time: 30.7, endTime: 33.5, text: 'గుండె బెంగ నిదరని మింగే హంగే', stanza: 3 },
  { id: 11, time: 33.5, endTime: 9999, text: 'చెయ్యలేసే చెయ్యలేసే', stanza: 3 }
];

export function AccordionGallerySection({ accordionItems }: { accordionItems: any[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const audio = new Audio(NACHCHESAAVE_AUDIO_SRC);
    audio.volume = 0.5; // 50% volume requirement
    audio.loop = true;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const audio = audioRef.current;
          if (!audio) return;

          if (entry.isIntersecting) {
            if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
            audio.volume = 0.5;
            audio.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {
              // Autoplay fallback
            });
          } else {
            if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
            let currentVol = audio.volume;
            fadeTimerRef.current = setInterval(() => {
              currentVol -= 0.05;
              if (currentVol <= 0.02) {
                clearInterval(fadeTimerRef.current);
                audio.volume = 0;
                audio.pause();
                audio.volume = 0.5;
                setIsPlaying(false);
              } else {
                audio.volume = currentVol;
              }
            }, 40);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
    if (!audio.muted && audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <section id="accordion-gallery" ref={sectionRef} className="accordion-section reveal">
      <div className="accordion-audio-controls">
        <button
          onClick={toggleMute}
          className="btn-audio-mute"
          title={isMuted ? 'Unmute Song' : 'Mute Song'}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? (
            <>
              <VolumeX size={15} color="var(--amber)" />
              <span>MUTED</span>
            </>
          ) : (
            <>
              <Volume2 size={15} color="var(--amber)" />
              <span>AUDIO ON</span>
            </>
          )}
        </button>
      </div>

      <div className="accordion-container-wrap">
        <div className="accordion-gallery-col">
          <AccordionGallery
            items={accordionItems}
            defaultIndex={2}
            expandRatio={isMobile ? 0.68 : 0.58}
            trigger="hover"
            accentColor="var(--amber)"
            overlayColor="#0a0c0e"
            height={isMobile ? 520 : 460}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            showLabels={false}
            grayscale={false}
          />
        </div>

        <div className="accordion-lyrics-col">
          <SyncedKaraokeLyrics
            lines={NACHCHESAAVE_TIMED_LYRICS}
            currentTime={currentTime}
            isPlaying={isPlaying}
            label="Nachchesaave Mallegampa Lyrics"
          />
        </div>
      </div>
    </section>
  );
}

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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

const FIRST_HERO_IMAGE = "/ammu/IMG-20250815-WA0005.jpg";

function MainPortalView() {
  const navigate = useNavigate();

  // Selected photo items for Memories 3D DepthCarousel
  const memoriesItems = useMemo(() => {
    const step = Math.max(1, Math.floor(GF_PHOTOS.length / 18));
    const items: { image: string; alt: string }[] = [];
    for (let i = 0; i < GF_PHOTOS.length && items.length < 18; i += step) {
      items.push({
        image: GF_PHOTOS[i],
        alt: `Memory photo ${items.length + 1}`
      });
    }
    return items;
  }, []);

  // Selected exact 5 photo items for AccordionGallery as requested by user
  const accordionItems = useMemo(() => {
    const selectedPhotos = [
      "/ammu/IMG_20251219_174511_799.jpg",
      "/ammu/IMG_20251219_224509_848.jpg",
      "/ammu/photo_4_2026-08-03_16-49-03.jpg",
      "/ammu/IMG_20251219_224449_707.jpg",
      "/ammu/.trashed-1767193932-Snapchat-779559609.jpg"
    ];
    const labels = ["AMMU", "HER SMILE", "MOMENTS", "PARADISE", "TOGETHER"];
    return selectedPhotos.map((img, idx) => ({
      image: img,
      label: labels[idx % labels.length],
      alt: `Accordion photo ${idx + 1}`
    }));
  }, []);

  // Hero images array
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

  // Refs for scroll elements
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
      
      setSlides(prev => ({
        ...prev,
        incoming: heroImages[nextIdx],
        showIncoming: true
      }));

      setTimeout(() => {
        setSlides({
          active: heroImages[nextIdx],
          incoming: heroImages[(nextIdx + 1) % heroImages.length],
          showIncoming: false
        });
      }, 1500);
    }, 4500);

    return () => clearInterval(timer);
  }, [heroImages]);

  const seamRef = useRef<HTMLDivElement>(null);

  // Scroll Animation Engine using RAF & Direct DOM Updates
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const heroHeight = windowHeight * 1.8;

      const progress = Math.min(Math.max(scrollY / (heroHeight - windowHeight), 0), 1);
      // Smoothstep easing for silky opening curve
      const eased = progress * progress * (3 - 2 * progress);

      if (leftPanelRef.current && rightPanelRef.current) {
        const translateLeft = eased * -102;
        const translateRight = eased * 102;
        const skew = eased * 1.5;
        leftPanelRef.current.style.transform = `translate3d(${translateLeft}%, 0, 0) skewY(${-skew}deg)`;
        rightPanelRef.current.style.transform = `translate3d(${translateRight}%, 0, 0) skewY(${skew}deg)`;
      }

      if (seamRef.current) {
        const seamOpacity = Math.max(0, 1 - eased * 2.5);
        seamRef.current.style.opacity = `${seamOpacity}`;
        seamRef.current.style.transform = `translateX(-50%) scaleY(${1 + eased * 0.5})`;
      }

      if (spanLeftRef.current && spanRightRef.current) {
        const isMobile = window.innerWidth <= 768;
        const moveDist = isMobile ? 70 : 280;
        const textTranslateLeft = eased * -moveDist;
        const textTranslateRight = eased * moveDist;
        const scale = 1 + eased * (isMobile ? 0.08 : 0.25);
        spanLeftRef.current.style.transform = `translate3d(${textTranslateLeft}px, 0, 0) scale(${scale})`;
        spanRightRef.current.style.transform = `translate3d(${textTranslateRight}px, 0, 0) scale(${scale})`;
      }

      if (titleContainerRef.current) {
        titleContainerRef.current.style.opacity = `${Math.max(0, 1 - eased * 1.2)}`;
        titleContainerRef.current.style.transform = `translate3d(0, ${eased * -60}px, 0)`;
      }

      if (bgWrapRef.current) {
        const bgScale = 1.12 - eased * 0.12;
        const brightness = 0.75 + eased * 0.25;
        bgWrapRef.current.style.transform = `scale(${bgScale})`;
        bgWrapRef.current.style.filter = `brightness(${brightness})`;
      }

      if (duotoneRef.current) {
        duotoneRef.current.style.opacity = `${0.3 + eased * 0.4}`;
      }

      if (dotTealRef.current && dotAmberRef.current) {
        const tealX = Math.sin(eased * Math.PI * 2) * 180;
        const tealY = eased * -240;
        const amberX = Math.cos(eased * Math.PI * 2) * -180;
        const amberY = eased * -240;

        dotTealRef.current.style.transform = `translate3d(${tealX}px, ${tealY}px, 0) scale(${1 + eased * 1.5})`;
        dotAmberRef.current.style.transform = `translate3d(${amberX}px, ${amberY}px, 0) scale(${1 + eased * 1.5})`;
        dotTealRef.current.style.opacity = `${Math.max(0, 1 - eased * 1.2)}`;
        dotAmberRef.current.style.opacity = `${Math.max(0, 1 - eased * 1.2)}`;
      }

      if (circleWrapRef.current) {
        const circleY = (scrollY - windowHeight) * 0.15;
        const rotateDeg = scrollY * 0.05;
        circleWrapRef.current.style.transform = `translate3d(0, ${circleY}px, 0) rotate(${rotateDeg}deg)`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // IntersectionObserver for reveal sections
  useEffect(() => {
    document.body.classList.add('allow-animations');

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

    revealElements.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('active');
      }
    });

    return () => {
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
    
    setTimeout(() => {
      const nextPhoto = shuffledPool.current[nextPhotoIndex.current];
      
      setCards((prev) => {
        const next = [...prev];
        next.shift();
        next.push(nextPhoto);
        return next;
      });

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
    const threshold = deckWidth * 0.1;
    
    if (dragOffset.x > threshold) {
      throwCard('right');
    } else if (dragOffset.x < -threshold) {
      throwCard('left');
    } else {
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <a href="#memories" onClick={(e) => { e.preventDefault(); scrollToSection('memories'); }} className="nav-link">MEMORIES</a>
          <a href="#wishes" onClick={(e) => { e.preventDefault(); scrollToSection('wishes'); }} className="nav-link">WISHES</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="nav-link">ABOUT</a>
          <button onClick={() => navigate('/gallery')} className="btn-pill">VIEW PHOTOS</button>
          <button 
            onClick={() => {
              logoutUser();
              window.location.reload();
            }} 
            className="btn-pill"
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Lock Website & Logout"
          >
            <Lock size={12} /> LOCK
          </button>
        </div>
      </nav>

      {/* 1. Portal Hero */}
      <section className="portal-hero">
        <div className="portal-stage">
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

          <div ref={duotoneRef} className="portal-duotone"></div>
          <div className="portal-veil"></div>

          <div ref={leftPanelRef} className="portal-panel left"></div>
          <div ref={rightPanelRef} className="portal-panel right"></div>
          <div ref={seamRef} className="portal-seam-line"></div>

          <div className="portal-center-dots">
            <div ref={dotTealRef} className="portal-dot teal-dot"></div>
            <div ref={dotAmberRef} className="portal-dot amber-dot"></div>
          </div>

          <div ref={titleContainerRef} className="portal-title-container">
            <h1 className="portal-title">
              <span ref={spanLeftRef} className="span-left">HAPPY BIRTHDAY</span>
              <span ref={spanRightRef} className="span-right">CHINNODA</span>
            </h1>
          </div>

          <div className="portal-meta top-left">SVR-2026 // BDAY</div>
          <div className="portal-meta top-right">EST. 08.03</div>
          <div className="portal-meta bottom-left">SCROLL TO UNCOVER</div>
          <div className="portal-meta bottom-right">BDAY ARCHIVE</div>
        </div>
      </section>

      {/* 2. Statement Fold */}
      <section id="statement" className="statement-fold">
        <div className="statement-numeral">01</div>
        
        <div ref={circleWrapRef} className="statement-circle-wrap">
          <img src="/ammu/Snapchat-143669298.jpg" className="statement-circle-img" alt="Milestone memory circle" />
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
            <button className="btn-pill" onClick={() => navigate('/gallery')}>VIEW PHOTOS</button>
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
              
              const offsetMultiplier = 1;
              const xOffset = index * 8 * offsetMultiplier;
              const yOffset = index * 6 * offsetMultiplier;
              const rOffset = index * 1.5 * (index % 2 === 0 ? 1 : -1);
              const scaleOffset = 1 - index * 0.03;

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

      {/* 3.5 Memories Section with Auto Audio & Synced Karaoke */}
      <MemoriesSection memoriesItems={memoriesItems} />

      {/* 3.6 Accordion Gallery Section with Auto Audio & Synced Karaoke */}
      <AccordionGallerySection accordionItems={accordionItems} />

      {/* 4. Birthday Wishes Section */}
      <section id="wishes" className="wishes-main-section reveal">
        <div className="wishes-section-header">
          <span className="label-caps" style={{ display: 'block', marginBottom: '16px' }}>
            THE WISHES LOG<span className="accent-dot amber"></span>
          </span>
          <h2 className="section-heading">MESSAGES FROM LOVED ONES</h2>
          <p className="wishes-section-sub">
            Warm birthday wishes and heartfelt blessings recorded for your special day.
          </p>
        </div>

        {/* Wishes Single Card Slider */}
        <WishesCarousel />
      </section>

      {/* 5. About Birthday Chronicles Section */}
      <section id="about" className="about-chronicles-section">
        <div className="about-numeral">03</div>

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
              <a
                href="https://thefirstwish.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="chapter-vol-link"
                title="Visit Vol 1: The First Wish"
              >
                VOL. I <ExternalLink size={12} style={{ marginLeft: '4px' }} />
              </a>
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
              <a
                href="https://thefirstwish.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline vol1-btn"
                title="Open Vol 1: The First Wish Deployment"
              >
                <Sparkles size={14} color="var(--amber)" /> VOL. 1 DEPLOYMENT <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="close-center-png-wrap" onClick={() => navigate('/special')}>
            <img
              src="/39926b66c9ddf7c0dcd85730eeabac8f-removebg-preview.png"
              className="stationary-png-img"
              alt="Secret Souvenir Portal"
            />
            <button
              className="btn-pill btn-click-here"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/special');
              }}
            >
              <ArrowUp size={14} color="var(--amber)" /> CLICK HERE
            </button>
          </div>
        </div>

        <div className="close-footer">
          <div className="close-footer-bar">
            <span>© 2026 BIRTHDAY CHRONICLES. ALL RIGHTS RESERVED FOR YASHU.</span>
            <a
              href="https://thefirstwish.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-vol1-link"
              title="Visit Vol 1: The First Wish"
            >
              <Sparkles size={12} color="var(--amber)" />
              <span>VOL. 1: THE FIRST WISH</span>
              <ExternalLink size={12} />
            </a>
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

function GalleryViewRoute() {
  const navigate = useNavigate();
  return <GalleryView onBack={() => navigate('/')} />;
}

function SpecialPageRoute() {
  const navigate = useNavigate();
  return <SpecialPage onBack={() => navigate('/')} />;
}

function App() {
  return (
    <BrowserRouter>
      <ProtectedRoute>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainPortalView />} />
          <Route path="/gallery" element={<GalleryViewRoute />} />
          <Route path="/special" element={<SpecialPageRoute />} />
          <Route path="/wishes" element={<SpecialPageRoute />} />
        </Routes>
      </ProtectedRoute>
    </BrowserRouter>
  );
}

export default App;
export { shuffleArray };
