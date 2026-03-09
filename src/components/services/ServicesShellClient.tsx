"use client";

import dynamic from "next/dynamic";

const ServiceRoomShell = dynamic(() => import("./ServiceRoomShell"), { ssr: false });

export default function ServicesShellClient() {
  return <ServiceRoomShell />;
}
