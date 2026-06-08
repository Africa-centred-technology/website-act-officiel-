import { POST as _POST } from "@/lib/api/contact";

export async function POST(req: Request) {
  return _POST(req);
}
