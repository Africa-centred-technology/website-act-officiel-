import { getBySlug } from "@/lib/api/formations";

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  return getBySlug(req, ctx);
}
