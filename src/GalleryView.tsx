import React, { useState, useEffect } from 'react';
import { GF_PHOTOS } from './photos';
import './GalleryView.css';

interface GalleryViewProps {
  onBack: () => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ onBack }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to top when gallery opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') {
        setSelectedIdx(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev === null ? null : (prev + 1) % filteredPhotos.length));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) => (prev === null ? null : (prev - 1 + filteredPhotos.length) % filteredPhotos.length));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  const filteredPhotos = GF_PHOTOS.filter((path) =>
    path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="gallery-page">
      {/* Gallery Header */}
      <nav className="gallery-navbar">
        <button onClick={onBack} className="btn-outline gallery-back-btn">
          ← BACK TO CATALOGUE
        </button>
        <div className="gallery-wordmark">
          PHOTO ARCHIVE
        </div>
        <div className="gallery-search-wrap">
          <input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="gallery-search-input"
          />
        </div>
      </nav>

      {/* Main Gallery Grid */}
      <main className="gallery-content">
        <header className="gallery-header-section">
          <span className="label-caps">
            COMPLETE COLLECTION <span className="accent-dot amber"></span>
          </span>
          <h1 className="gallery-title">ALL UPLOADED MEMORIES</h1>
          <p className="gallery-subtitle">
            Exploring curated moments preserved in the birthday archive. Click any photo to view in full resolution.
          </p>
        </header>

        <div className="gallery-grid">
          {filteredPhotos.map((path, idx) => {
            const fileName = path.split('/').pop() || `Photo #${idx + 1}`;
            return (
              <div
                key={path}
                className="gallery-card"
                onClick={() => setSelectedIdx(idx)}
              >
                <img
                  src={path}
                  alt={fileName}
                  className="gallery-img"
                  loading="lazy"
                />
                <div className="gallery-card-overlay">
                  <span className="gallery-card-name">{fileName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div className="lightbox-overlay" onClick={() => setSelectedIdx(null)}>
          <button
            className="lightbox-close"
            onClick={() => setSelectedIdx(null)}
            aria-label="Close modal"
          >
            ✕
          </button>
          
          <button
            className="lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIdx((selectedIdx - 1 + filteredPhotos.length) % filteredPhotos.length);
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredPhotos[selectedIdx]}
              alt={`Photo ${selectedIdx + 1}`}
              className="lightbox-img"
            />
            <div className="lightbox-footer">
              <span>{filteredPhotos[selectedIdx].split('/').pop()}</span>
            </div>
          </div>

          <button
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIdx((selectedIdx + 1) % filteredPhotos.length);
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
