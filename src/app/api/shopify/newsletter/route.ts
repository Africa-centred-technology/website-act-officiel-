import { POST as _POST } from "@/lib/api/newsletter";

export async function POST(req: Request) {
  return _POST(req);
}
