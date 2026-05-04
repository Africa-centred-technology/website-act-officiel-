import { NextResponse } from "next/server";
import { fetchOdooFormationBySlug } from "@/lib/odoo/formations";

export const revalidate = 300;

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await ctx.params;
    const formation = await fetchOdooFormationBySlug(slug);
    if (!formation) {
      return NextResponse.json({ formation: null }, { status: 404 });
    }
    return NextResponse.json({ formation });
  } catch (error) {
    console.error("Erreur /api/odoo/formations/[slug] :", error);
    return NextResponse.json(
      {
        formation: null,
        error: error instanceof Error ? error.message : "Erreur Odoo",
      },
      { status: 500 }
    );
  }
}
