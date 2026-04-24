"use client";

/**
 * Home2Shell — Single-page architecture.
 * All rooms are declared in the ROOMS table and rendered in one pass.
 * To add / remove / reorder a room: edit the ROOMS array only.
 */

import React from "react";
import dynamic from "next/dynamic";

import RoomEntree from "@/components/home/rooms/RoomEntree";
import RoomAtelier from "@/components/home/rooms/RoomAtelier";
import RoomManifeste from "@/components/home/rooms/RoomManifeste";
import RoomSortie from "@/components/home/rooms/RoomSortie";
import RoomQuiSommesNous from "@/components/home/rooms/RoomQuiSommesNous";
import RoomPortail from "@/components/home/rooms/RoomPortail";
import RoomBlog from "@/components/home/rooms/RoomBlog";
import FooterStrip from "@/components/layout/FooterStrip";

/* Canvas / window-dependent — client only */
const WaveTerrain = dynamic(() => import("@/components/background/WaveTerrain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/background/Cursor"), { ssr: false });
const Grain = dynamic(() => import("@/components/background/Grain"), { ssr: false });

/* ─────────────────────────────────────────────────────────────────
   ROOM REGISTRY — single source of truth
───────────────────────────────────────────────────────────────── */
export interface Room {
  id: string;
  label: string;
  number: string;
  Component: React.ComponentType;
  /** Set to true to hide the bottom border (use on the last room) */
  flush?: boolean;
  /** Set to true to let the room manage its own footer */
  ownsFooter?: boolean;
}

export const ROOMS: Room[] = [
  { id: "continent",       label: "LE CONTINENT",    number: "01", Component: RoomEntree },
  { id: "qui-sommes-nous", label: "QUI SOMMES-NOUS", number: "02", Component: RoomQuiSommesNous },
  { id: "cite",            label: "LA CITÉ",         number: "03", Component: RoomAtelier },
  { id: "maison",          label: "LA MAISON",       number: "04", Component: RoomManifeste },
  { id: "portail",         label: "LE PORTAIL",      number: "05", Component: RoomPortail },
  { id: "blog",            label: "LE BLOG",         number: "06", Component: RoomBlog },
  { id: "horizon",         label: "L'HORIZON",       number: "07", Component: RoomSortie, flush: true, ownsFooter: true },
];

/* ─────────────────────────────────────────────────────────────────
   SHARED SECTION SHELL
───────────────────────────────────────────────────────────────── */
function RoomSection({ room }: { room: Room }) {
  const { id, Component, flush } = room;
  return (
    <section
      id={id}
      data-room={id}
      className="room-section"
      style={{
        borderBottom: flush ? "none" : "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <Component />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function Home2Shell() {
  const lastRoomOwnsFooter = ROOMS[ROOMS.length - 1]?.ownsFooter;

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* ── Fixed animated background layers ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <WaveTerrain />
        <Grain />
      </div>

      <Cursor />

      <style>{`
        .room-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }
        .room-section > * {
          flex: 1 1 auto;
          width: 100%;
          min-height: 100vh;
        }
        @media (max-width: 900px) {
          .room-section { min-height: auto; }
          .room-section > * { min-height: auto; }
          .room-section [style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .mobile-flex-col {
            flex-direction: column !important;
            gap: 3rem !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            transform: none !important;
          }
          .mobile-txt-center {
            text-align: center !important;
            align-items: center !important;
          }
          .footer-container {
            position: relative !important;
            bottom: auto !important;
            margin-top: 4rem !important;
            padding: 0 1rem !important;
          }
        }
      `}</style>

      {/* ── Rooms stacked — data-driven from ROOMS table ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {ROOMS.map((room) => (
          <RoomSection key={room.id} room={room} />
        ))}

        {/* Global footer — rendered only if the last room doesn't carry one */}
        {!lastRoomOwnsFooter && <FooterStrip />}
      </div>
    </div>
  );
}
