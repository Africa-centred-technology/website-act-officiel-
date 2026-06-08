import { POST as _POST } from "@/lib/api/inscription";

export async function POST(req: Request) {
  return _POST(req);
}
