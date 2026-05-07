"use client";

import React from "react";

/**
 * Bandeau d'annonces défilant.
 * Affiché UNIQUEMENT si `items` contient au moins une entrée.
 * Source : metafield Shopify `custom.announcement_items` (JSON, array de strings) par formation.
 */

interface AnnouncementBarProps {
  items?: string[];
}

export default function AnnouncementBar({ items }: AnnouncementBarProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="announcement-bar" style={containerStyle}>
      <div className="announcement-track" style={trackStyle}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={itemStyle}>
            <span style={diamondStyle} /> {item}
          </span>
        ))}
      </div>

      <style jsx global>{`
        @keyframes announcementScroll {
          to { transform: translateX(-50%); }
        }
        .announcement-bar:hover .announcement-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  background: "linear-gradient(90deg, #0A1410 0%, #1B3022 50%, #0A1410 100%)",
  borderBottom: "1px solid rgba(211,84,0,0.35)",
  overflow: "hidden",
  padding: "10px 0",
  zIndex: 101,
};

const trackStyle: React.CSSProperties = {
  display: "flex",
  gap: 56,
  whiteSpace: "nowrap",
  width: "max-content",
  animation: "announcementScroll 60s linear infinite",
};

const itemStyle: React.CSSProperties = {
  fontFamily: "'Poppins', system-ui, sans-serif",
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#FCF9F2",
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  gap: 14,
};

const diamondStyle: React.CSSProperties = {
  display: "inline-block",
  width: 8,
  height: 8,
  background: "#D35400",
  transform: "rotate(-43.264deg)",
  flexShrink: 0,
};
