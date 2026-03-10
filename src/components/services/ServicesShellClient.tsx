"use client";

import dynamic from "next/dynamic";

const ServicesIntroShell = dynamic(() => import("./ServicesIntroShell"), { ssr: false });

export default function ServicesShellClient() {
  return <ServicesIntroShell />;
}
