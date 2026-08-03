import React, { useState } from 'react';
import {
  Camera,
  MessageSquareQuote,
  ArrowLeft,
  Calendar,
  MapPin,
  Quote,
  User,
  X,
  Heart
} from 'lucide-react';
import type { UsPhoto, WishMessage } from './wishesData';
import { US_PHOTOS, WISHES_MESSAGES } from './wishesData';
import ChromaGrid from './ChromaGrid';
import type { ChromaItem } from './ChromaGrid';
import './SpecialPage.css';

interface SpecialPageProps {
  onBack: () => void;
}

export const SpecialPage: React.FC<SpecialPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'us' | 'wishes'>('us');
  const [photos] = useState<UsPhoto[]>(US_PHOTOS);
  const [wishes] = useState<WishMessage[]>(WISHES_MESSAGES);
  const [selectedPhoto, setSelectedPhoto] = useState<UsPhoto | null>(null);

  const chromaItems: ChromaItem[] = photos.map((photo, idx) => ({
    image: photo.url,
    title: photo.title,
    borderColor: idx % 2 === 0 ? '#E8913C' : '#2E6B72',
    gradient: idx % 2 === 0
      ? 'linear-gradient(145deg, rgba(232, 145, 60, 0.2), var(--secondary-ground))'
      : 'linear-gradient(145deg, rgba(46, 107, 114, 0.2), var(--secondary-ground))',
    onClick: () => setSelectedPhoto(photo)
  }));

  return (
    <div className="special-page-container">
      {/* Top Floating Navigation Header */}
      <header className="special-nav">
        <button className="special-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>RETURN TO PORTAL</span>
        </button>

        <div className="special-brand">
          <Heart size={16} fill="var(--amber)" color="var(--amber)" />
          <span>SOUVENIR // US ARCHIVE</span>
        </div>

        <div className="special-badge">
          <span>08.03 EDITION</span>
        </div>
      </header>

      {/* Hero Welcome Banner / Tab Navigation */}
      <section className="special-hero">
        <div className="special-hero-content">
          {/* Tab Controls matching app theme */}
          <div className="special-tabs">
            <button
              className={`tab-btn ${activeTab === 'us' ? 'active' : ''}`}
              onClick={() => setActiveTab('us')}
            >
              <Camera size={14} />
              <span>US</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'wishes' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishes')}
            >
              <MessageSquareQuote size={14} />
              <span>BIRTHDAY WISHES</span>
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: US */}
      {activeTab === 'us' && (
        <section className="special-section animate-fade-in">
          <div className="section-header-box">
            <div>
              <span className="label-caps">
                THE US ARCHIVE<span className="accent-dot teal"></span>
              </span>
              <h2 className="section-heading">MEMORIES CREATED TOGETHER</h2>
            </div>
            <div className="section-meta-info">
              <Calendar size={13} />
              <span>COLLECTION FROM THE /US FOLDER</span>
            </div>
          </div>

          {/* Chroma Grid for Our Pics */}
          <ChromaGrid items={chromaItems} showInfo={false} />
        </section>
      )}

      {/* TAB 2: BIRTHDAY WISHES */}
      {activeTab === 'wishes' && (
        <section className="special-section animate-fade-in">
          <div className="section-header-box">
            <div>
              <span className="label-caps">
                THE WISHES LOG<span className="accent-dot amber"></span>
              </span>
              <h2 className="section-heading">MESSAGES FROM LOVED ONES</h2>
            </div>
            <div className="section-meta-info">
              <Heart size={13} fill="var(--amber)" color="var(--amber)" />
              <span>CURATED BIRTHDAY MESSAGES</span>
            </div>
          </div>

          {/* Wishes Grid */}
          <div className="wishes-grid">
            {wishes.map((item, idx) => {
              const accentColor = idx % 2 === 0 ? 'var(--amber)' : 'var(--teal)';
              return (
                <div key={item.id} className="wish-card">
                  <div className="wish-card-header">
                    <div
                      className="wish-avatar"
                      style={{
                        background: item.avatarColor || 'var(--secondary-ground)',
                        borderColor: idx % 2 === 0 ? 'rgba(232, 145, 60, 0.3)' : 'rgba(46, 107, 114, 0.3)'
                      }}
                    >
                      <User size={20} color={accentColor} />
                    </div>
                    <div className="wish-sender-info">
                      <h3 className="wish-sender-name">{item.sender}</h3>
                      <span className="wish-relationship" style={{ color: accentColor }}>
                        {item.relationship}
                      </span>
                      {item.timestamp && (
                        <span className="wish-time">{item.timestamp}</span>
                      )}
                    </div>
                  </div>

                  <div className="wish-body">
                    <Quote className="wish-quote-bg" size={28} />
                    <p className="wish-text">{item.message}</p>
                  </div>

                  <div className="wish-footer" style={{ color: accentColor }}>
                    <Heart size={12} fill={accentColor} color={accentColor} />
                    <span>WISHED WITH LOVE</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Lightbox Modal for Photo Enlarge */}
      {selectedPhoto && (
        <div className="lightbox-backdrop" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>
              <X size={18} />
            </button>
            <div className="lightbox-image-wrap">
              <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            </div>
            <div className="lightbox-details">
              <div className="photo-meta-tags">
                <span className="tag-date"><Calendar size={12} /> {selectedPhoto.date}</span>
                <span className="tag-location"><MapPin size={12} /> {selectedPhoto.location}</span>
              </div>
              <h2>{selectedPhoto.title}</h2>
              <p>{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* Special Page Footer */}
      <footer className="special-footer">
        <p>BUILT WITH INTENTION & CARE • SOUVENIR ARCHIVE</p>
        <button className="btn-outline" onClick={onBack}>
          <ArrowLeft size={14} /> BACK TO MAIN PORTAL
        </button>
      </footer>
    </div>
  );
};

export default SpecialPage;
