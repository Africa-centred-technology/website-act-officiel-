import { GET as _GET } from "@/lib/api/formations";

export async function GET(req: Request) {
  return _GET(req);
}
