"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FormationInscriptionForm from "./FormationInscriptionForm";

const ORANGE = "#D35400";

interface FormationInscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formationTitle?: string;
  formationSlug?: string;
}

export default function FormationInscriptionModal({
  isOpen,
  onClose,
  formationTitle,
  formationSlug,
}: FormationInscriptionModalProps) {
  // Empêcher le scroll quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(8px)",
              zIndex: 9998,
            }}
          />

          {/* Modal Container */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              overflow: "auto",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "2rem 1rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.6, 0.08, 0.02, 0.99] }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "1200px",
                margin: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "-1.5rem",
                  right: "-1.5rem",
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                  background: ORANGE,
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "all 0.2s",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow = `0 4px 30px ${ORANGE}88`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
                }}
              >
                <X size={28} />
              </button>

              {/* Form Content */}
              <FormationInscriptionForm
                formationTitle={formationTitle}
                formationSlug={formationSlug}
                onSuccess={() => {
                  // Attendre 3s puis fermer le modal
                  setTimeout(() => onClose(), 3000);
                }}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
