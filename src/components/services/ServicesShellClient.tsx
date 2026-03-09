"use client";

import dynamic from "next/dynamic";

const ServicesShell = dynamic(() => import("./ServicesShell"), { ssr: false });

export default function ServicesShellClient() {
  return <ServicesShell />;
}
