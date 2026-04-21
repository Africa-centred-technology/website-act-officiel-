"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X, ShoppingCart, Minus, Plus, Trash2, ArrowRight,
  CheckCircle, Shield, CreditCard
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Dark theme palette
const W = {
  overlay: "rgba(0,0,0,0.65)",
  bg: "#0F1A14",
  surface: "#1B2920",
  surfaceGray: "#162210",
  border: "#2A3D2E",
  text: "#F5F0E8",
  textMid: "#A8B8A0",
  textLight: "#6B7D65",
  orange: "#D35400",
  orangeLight: "#E67E22",
  orangeHover: "#B84A00",
  orangeBg: "#1C1208",
  green: "#34D399",
  greenBg: "#052E1C",
};

const fmtMAD = (n: number) =>
  new Intl.NumberFormat("fr-MA", { style: "decimal", maximumFractionDigits: 0 }).format(n) + " MAD";

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, totalSavings } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "success">("cart");
  // Remplace window.confirm (bloquant, non stylé sur mobile) par un dialog React
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Swipe-to-dismiss (mobile): drag feedback + close on swipe right >= 72px
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [swipeDelta, setSwipeDelta] = useState(0);
  const isHorizontalSwipe = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = false;
    setSwipeDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);

    // Determine swipe axis on first significant move
    if (!isHorizontalSwipe.current && Math.abs(dx) > 8) {
      isHorizontalSwipe.current = Math.abs(dx) > dy;
    }

    // Only track rightward horizontal swipe (dismiss direction)
    if (isHorizontalSwipe.current && dx > 0) {
      setSwipeDelta(dx);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    // Close if swiped right >= 72px along horizontal axis
    if (isHorizontalSwipe.current && delta > 72) {
      setIsCartOpen(false);
    }
    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalSwipe.current = false;
    setSwipeDelta(0);
  };

  const handleCheckout = () => {
    setCheckoutStep("success");
    setTimeout(() => {
      clearCart();
      setCheckoutStep("cart");
      setIsCartOpen(false);
    }, 3000);
  };

  const handleDeleteRequest = (id: string) => setItemToDelete(id);
  const confirmDelete = () => {
    if (itemToDelete) { removeFromCart(itemToDelete); setItemToDelete(null); }
  };
  const cancelDelete = () => setItemToDelete(null);

  return (
    <>
      {/*
       * Breakpoints :
       *   mobile  (<768px)       → 100vw (plein écran)
       *   tablet  (768-1279px)   → 400px fixe
       *   desktop (1280px+)      → 480px fixe
       * Les media-queries CSS overrident le width calculé en JS car
       * la largeur réelle vient uniquement de cette classe (pas d'inline width).
       *
       * FIX overflow-x : le panel lui-même ne peut pas dépasser 100vw.
       * FIX iOS backdrop tap : pointer-events sur l'overlay est géré via onClick.
       * FIX iOS scroll lock sur l'overlay : touch-action none empêche le scroll
       *      de "passer" à travers le backdrop sur Safari.
       */}
      <style>{`
        .cart-drawer-panel {
          width: min(480px, 100vw);
          /* Empêche tout dépassement horizontal du panel */
          max-width: 100vw;
          box-sizing: border-box;
        }
        @media (max-width: 767px) {
          .cart-drawer-panel {
            /* Plein écran sur mobile — 90vw minimum garanti par min(480px,100vw) */
            width: 100vw;
          }
        }
        @media (min-width: 768px) and (max-width: 1279px) {
          .cart-drawer-panel { width: 400px; }
        }
        /* Overlay : bloque le scroll iOS Safari en dessous */
        .cart-overlay {
          touch-action: none;
          overscroll-behavior: contain;
        }
        /* Scrollable interne : scroll inertiel iOS */
        .cart-scroll-area {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        /*
         * FIX height fallback pour navigateurs sans support svh :
         * Le style inline utilise 100svh ; on ajoute un fallback 100vh
         * via @supports pour les navigateurs qui ignorent svh.
         */
        @supports not (height: 100svh) {
          .cart-drawer-panel {
            height: 100vh !important;
          }
        }
      `}</style>

      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay — ferme le drawer au tap en dehors.
                className="cart-overlay" : touch-action:none bloque le scroll
                iOS Safari qui "traverse" l'overlay (bug connu WebKit). */}
            <motion.div
              className="cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              aria-hidden="true"
              style={{
                position: "fixed",
                inset: 0,
                background: W.overlay,
                zIndex: 999,
                /* Cursor pointer sur desktop pour signaler que le clic ferme */
                cursor: "pointer",
              }}
            />

            {/* Drawer panel
                FIX touchAction : on NE met PAS touchAction sur le panel lui-même
                car ça bloque le swipe-to-dismiss horizontal. La gestion du geste
                est entièrement dans nos handlers onTouchStart/Move/End.
                Le scroll vertical est géré par le div .cart-scroll-area interne.

                FIX height : 100dvh est préférable à 100svh sur Android Chrome
                récent tout en restant compatible Safari iOS via le fallback 100vh.
            */}
            <motion.div
              className="cart-drawer-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Panier d'achat"
              initial={{ x: "100%" }}
              animate={{ x: swipeDelta > 0 ? swipeDelta : 0 }}
              exit={{ x: "100%" }}
              transition={
                swipeDelta > 0
                  ? { type: "tween", duration: 0.01 }
                  : { type: "spring", damping: 30, stiffness: 300 }
              }
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                /*
                 * FIX height : 100svh (Small Viewport Height) couvre le viewport
                 * en excluant les barres d'interface mobiles iOS/Android.
                 * Fallback 100vh pour navigateurs anciens via la feuille de style.
                 */
                height: "100svh",
                background: W.bg,
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
                /* Empêche tout scroll ou overflow horizontal sur le panel */
                overflowX: "hidden",
                overflowY: "hidden",
              }}
            >
              {/* ── HEADER : sticky en haut ── */}
              <div style={{
                padding: "clamp(0.875rem, 3vw, 1.5rem)",
                borderBottom: `1px solid ${W.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                  <ShoppingCart size={22} color={W.orange} style={{ flexShrink: 0 }} />
                  <h2 style={{
                    /* clamp adapte la taille sur mobile sans déborder */
                    fontSize: "clamp(1rem, 4vw, 1.35rem)",
                    fontWeight: 700,
                    color: W.text,
                    margin: 0,
                    fontFamily: "var(--font-display, Lora, serif)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    Panier {totalItems > 0 && `(${totalItems})`}
                  </h2>
                </div>
                {/* Bouton fermer — 44×44 touch target (WCAG 2.5.5) */}
                <button
                  type="button"
                  aria-label="Fermer le panier"
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: `1px solid ${W.border}`,
                    background: W.surface,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = W.border; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = W.surface; }}
                >
                  <X size={18} color={W.textMid} />
                </button>
              </div>

              {/* ── CONTENT : scroll interne ──
                  FIX : className="cart-scroll-area" apporte le scroll inertiel
                  iOS via -webkit-overflow-scrolling:touch (CSS, non deprecated
                  dans ce contexte d'usage) et overscroll-behavior:contain
                  pour empêcher le bounce de remonter au body.
                  FIX WebkitOverflowScrolling : retiré du style inline
                  (deprecated en React 18 strict) — remplacé par la classe CSS.
              */}
              <div
                className="cart-scroll-area"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  padding: "clamp(0.875rem, 3vw, 1.5rem)",
                }}
              >
                {checkoutStep === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", padding: "3rem 1rem" }}
                  >
                    <CheckCircle size={64} color={W.green} style={{ marginBottom: "1.5rem" }} />
                    <h3 style={{
                      fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                      fontWeight: 700,
                      color: W.text,
                      marginBottom: "0.75rem",
                      fontFamily: "var(--font-display, Lora, serif)",
                    }}>
                      Commande confirmée !
                    </h3>
                    <p style={{
                      color: W.textMid,
                      lineHeight: 1.6,
                      fontFamily: "var(--font-body, Poppins, sans-serif)",
                      fontSize: "clamp(0.85rem, 3vw, 0.95rem)",
                    }}>
                      Vous recevrez un email de confirmation avec les détails de votre formation.
                    </p>
                  </motion.div>
                ) : items.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                    <ShoppingCart size={48} color={W.textLight} style={{ marginBottom: "1rem", opacity: 0.4 }} />
                    <p style={{
                      color: W.textMid,
                      fontSize: "clamp(0.9rem, 3.5vw, 1rem)",
                      marginBottom: "0.5rem",
                      fontFamily: "var(--font-body, Poppins, sans-serif)",
                      lineHeight: 1.5,
                    }}>
                      Votre panier est vide
                    </p>
                    <Link
                      href="/formations"
                      onClick={() => setIsCartOpen(false)}
                      style={{
                        color: W.orange,
                        fontWeight: 700,
                        textDecoration: "none",
                        fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
                        fontSize: "clamp(0.8rem, 3vw, 0.9rem)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Découvrir nos formations →
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {items.map(item => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        onRemove={() => handleDeleteRequest(item.id)}
                        onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── FOOTER : sticky en bas ── */}
              {items.length > 0 && checkoutStep === "cart" && (
                <div style={{
                  padding: "clamp(0.875rem, 3vw, 1.5rem)",
                  borderTop: `1px solid ${W.border}`,
                  background: W.surface,
                  flexShrink: 0,
                  overflowX: "hidden",
                }}>
                  {/* Savings badge */}
                  {totalSavings > 0 && (
                    <div style={{
                      padding: "0.625rem 0.75rem",
                      background: W.greenBg,
                      border: `1px solid ${W.green}30`,
                      borderRadius: "0.5rem",
                      marginBottom: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}>
                      <CheckCircle size={16} color={W.green} style={{ flexShrink: 0 }} />
                      <span style={{
                        fontSize: "clamp(0.78rem, 3vw, 0.9rem)",
                        fontWeight: 700,
                        color: W.green,
                        fontFamily: "var(--font-body, Poppins, sans-serif)",
                      }}>
                        Vous économisez {fmtMAD(totalSavings)} !
                      </span>
                    </div>
                  )}

                  {/* Lignes total */}
                  <div style={{ marginBottom: "0.875rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{
                        color: W.textMid,
                        fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
                        fontSize: "clamp(0.75rem, 3vw, 0.875rem)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>Sous-total</span>
                      <span style={{
                        fontWeight: 700,
                        color: W.text,
                        fontFamily: "var(--font-body, Poppins, sans-serif)",
                        fontSize: "clamp(0.8rem, 3vw, 0.95rem)",
                      }}>{fmtMAD(totalPrice)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{
                        color: W.textMid,
                        fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
                        fontSize: "clamp(0.75rem, 3vw, 0.875rem)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>TVA</span>
                      <span style={{
                        color: W.textLight,
                        fontFamily: "var(--font-body, Poppins, sans-serif)",
                        fontSize: "clamp(0.75rem, 3vw, 0.875rem)",
                      }}>En cours</span>
                    </div>
                    <div style={{ height: "1px", background: W.border, margin: "0.625rem 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: "clamp(0.85rem, 3.5vw, 1rem)",
                        fontWeight: 700,
                        color: W.text,
                        fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}>Total</span>
                      <span style={{
                        fontSize: "clamp(1rem, 4vw, 1.3rem)",
                        fontWeight: 700,
                        color: W.orange,
                        fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
                      }}>
                        {fmtMAD(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Bouton checkout — 48px min height, touch-friendly */}
                  <motion.button
                    type="button"
                    aria-label="Procéder au paiement"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                    style={{
                      width: "100%",
                      minHeight: "48px",
                      padding: "0.875rem 1rem",
                      background: items.length === 0
                        ? W.border
                        : `linear-gradient(135deg, ${W.orange}, ${W.orangeLight})`,
                      border: "none",
                      borderRadius: "0.75rem",
                      color: items.length === 0 ? W.textLight : "#fff",
                      fontWeight: 700,
                      fontSize: "clamp(0.8rem, 3.5vw, 0.95rem)",
                      cursor: items.length === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      boxShadow: items.length === 0 ? "none" : `0 4px 16px ${W.orange}40`,
                      fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      transition: "background 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={e => {
                      if (items.length > 0) {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          `linear-gradient(135deg, ${W.orangeHover}, ${W.orange})`;
                      }
                    }}
                    onMouseLeave={e => {
                      if (items.length > 0) {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          `linear-gradient(135deg, ${W.orange}, ${W.orangeLight})`;
                      }
                    }}
                  >
                    Procéder au paiement <ArrowRight size={18} />
                  </motion.button>

                  {/* Trust signals */}
                  <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "clamp(0.7rem, 2.5vw, 0.8rem)",
                      color: W.textLight,
                      fontFamily: "var(--font-body, Poppins, sans-serif)",
                    }}>
                      <Shield size={14} style={{ flexShrink: 0 }} />
                      <span>Paiement 100% sécurisé</span>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "clamp(0.7rem, 2.5vw, 0.8rem)",
                      color: W.textLight,
                      fontFamily: "var(--font-body, Poppins, sans-serif)",
                    }}>
                      <CreditCard size={14} style={{ flexShrink: 0 }} />
                      <span>Carte bancaire · Virement · PayPal</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Dialog de confirmation suppression (remplace window.confirm) ── */}
      <AnimatePresence>
        {itemToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1100 }}
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="cart-del-title"
              aria-describedby="cart-del-desc"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                /* min(90vw, 360px) : full-width safe sur 320px */
                width: "min(90vw, 360px)",
                background: W.bg,
                border: `1px solid ${W.border}`,
                borderRadius: "1rem",
                padding: "clamp(1.25rem, 4vw, 1.75rem)",
                zIndex: 1101,
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <h4
                id="cart-del-title"
                style={{
                  color: W.text,
                  fontFamily: "var(--font-display, Lora, serif)",
                  fontSize: "clamp(1rem, 4vw, 1.15rem)",
                  fontWeight: 700,
                  marginBottom: "0.625rem",
                }}
              >
                Retirer du panier ?
              </h4>
              <p
                id="cart-del-desc"
                style={{
                  color: W.textMid,
                  fontFamily: "var(--font-body, Poppins, sans-serif)",
                  fontSize: "clamp(0.85rem, 3vw, 0.95rem)",
                  lineHeight: 1.5,
                  marginBottom: "1.25rem",
                }}
              >
                Voulez-vous retirer cette formation de votre panier ?
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={cancelDelete}
                  style={{
                    flex: 1,
                    minHeight: "44px",
                    border: `1px solid ${W.border}`,
                    background: W.surface,
                    borderRadius: "0.5rem",
                    color: W.textMid,
                    fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
                    fontSize: "clamp(0.78rem, 3vw, 0.875rem)",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  style={{
                    flex: 1,
                    minHeight: "44px",
                    border: "none",
                    background: "#DC2626",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
                    fontSize: "clamp(0.78rem, 3vw, 0.875rem)",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Retirer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function CartItemCard({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: import("@/contexts/CartContext").CartItem;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "0.75rem",
        padding: "0.875rem",
        background: W.surface,
        border: `1px solid ${W.border}`,
        borderRadius: "0.75rem",
        /* Empêche le card de dépasser la largeur du drawer */
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* Image — taille fluide pour préserver l'espace texte sur petit écran */}
      <div style={{ flexShrink: 0 }}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{
              width: "clamp(56px, 15vw, 80px)",
              height: "clamp(56px, 15vw, 80px)",
              objectFit: "cover",
              borderRadius: "0.5rem",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "clamp(56px, 15vw, 80px)",
              height: "clamp(56px, 15vw, 80px)",
              background: W.surfaceGray,
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingCart size={20} color={W.textLight} opacity={0.3} />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Titre + catégorie */}
        <div style={{ marginBottom: "0.4rem" }}>
          <h4 style={{
            fontSize: "clamp(0.85rem, 3.5vw, 1.05rem)",
            fontWeight: 600,
            color: W.text,
            marginBottom: "0.2rem",
            lineHeight: 1.3,
            fontFamily: "var(--font-display, Lora, serif)",
            /* Tronque après 2 lignes — évite overflow sur 320px */
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {item.title}
          </h4>
          <span style={{
            fontSize: "clamp(0.7rem, 2.5vw, 0.82rem)",
            color: W.textMid,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {item.category} · {item.duration}
          </span>
        </div>

        {/* Contrôles quantité + bouton supprimer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.4rem",
          marginBottom: "0.4rem",
          flexWrap: "wrap",
        }}>
          {/* Boutons +/- */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            background: W.bg,
            padding: "0.2rem",
            borderRadius: "0.4rem",
          }}>
            <button
              type="button"
              aria-label="Diminuer la quantité"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              style={{
                /* 44×44 touch target (WCAG 2.5.5) */
                width: "44px",
                height: "44px",
                border: `1px solid ${W.border}`,
                background: W.surface,
                borderRadius: "0.35rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Minus size={14} color={W.textMid} />
            </button>
            <span style={{
              minWidth: "24px",
              textAlign: "center",
              fontWeight: 700,
              color: W.text,
              fontFamily: "var(--font-body, Poppins, sans-serif)",
              fontSize: "clamp(0.82rem, 3vw, 0.95rem)",
            }}>
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Augmenter la quantité"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              style={{
                width: "44px",
                height: "44px",
                border: `1px solid ${W.border}`,
                background: W.surface,
                borderRadius: "0.35rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Plus size={14} color={W.textMid} />
            </button>
          </div>

          {/* Bouton supprimer — 44×44 touch target */}
          <button
            type="button"
            aria-label="Supprimer cet article"
            onClick={onRemove}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "0.4rem 0.5rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: "#F87171",
              fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
              fontSize: "clamp(0.68rem, 2.5vw, 0.78rem)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontWeight: 600,
              transition: "color 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#DC2626"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#F87171"; }}
          >
            <Trash2 size={14} />
            <span>Retirer</span>
          </button>
        </div>

        {/* Prix */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", flexWrap: "wrap" }}>
          <span style={{
            fontSize: "clamp(0.9rem, 3.5vw, 1.1rem)",
            fontWeight: 700,
            color: W.orange,
            fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
          }}>
            {fmtMAD(item.price * item.quantity)}
          </span>
          {item.originalPrice && (
            <span style={{
              fontSize: "clamp(0.7rem, 2.5vw, 0.82rem)",
              textDecoration: "line-through",
              color: W.textLight,
              fontFamily: "var(--font-body, Poppins, sans-serif)",
            }}>
              {fmtMAD(item.originalPrice * item.quantity)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
