import { NextResponse } from "next/server";
import { fetchOdooBlogPosts } from "@/lib/odoo/blog";

export const revalidate = 300;

export async function GET() {
  try {
    const posts = await fetchOdooBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Erreur /api/odoo/blog :", error);
    return NextResponse.json(
      {
        posts: [],
        error: error instanceof Error ? error.message : "Erreur Odoo",
      },
      { status: 500 }
    );
  }
}
