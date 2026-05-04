import { NextResponse } from "next/server";
import { fetchOdooBlogPostBySlug } from "@/lib/odoo/blog";

export const revalidate = 300;

export async function GET(_req: Request, ctx: { params: Promise<{ handle: string }> }) {
  try {
    const { handle } = await ctx.params;
    const post = await fetchOdooBlogPostBySlug(handle);
    if (!post) {
      return NextResponse.json({ post: null }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Erreur /api/odoo/blog/[handle] :", error);
    return NextResponse.json(
      {
        post: null,
        error: error instanceof Error ? error.message : "Erreur Odoo",
      },
      { status: 500 }
    );
  }
}
