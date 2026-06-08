import { POST as _POST } from "@/lib/api/brochure";

export async function POST(req: Request) {
  return _POST(req);
}
