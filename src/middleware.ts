import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match root and locale-prefixed paths, exclude API, _next, static files
    "/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon\\.ico|logo|fonts|images|icons|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\..*).*)",
  ],
};
