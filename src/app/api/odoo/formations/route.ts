import { NextResponse } from "next/server";
import { fetchOdooFormations } from "@/lib/odoo/formations";

export const revalidate = 300; // 5 min — même cadence que la route Shopify

export async function GET() {
  try {
    const formations = await fetchOdooFormations();
    return NextResponse.json({ formations });
  } catch (error) {
    console.error("Erreur /api/odoo/formations :", error);
    return NextResponse.json(
      {
        formations: [],
        error: error instanceof Error ? error.message : "Erreur Odoo",
      },
      { status: 500 }
    );
  }
}
