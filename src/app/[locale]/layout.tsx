import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/i18n/seo-jsonld";
import CookieBanner from "@/components/layout/CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.a-ct.ma"),
  icons: {
    icon: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
  verification: {
    google: "iRIaR0ZtvBgQSDQPwMV4eOL0-Gajr88p6_t-qKfiSno",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  return (
    <>
      <JsonLd data={organizationJsonLd(locale)} />

      <NextIntlClientProvider messages={messages}>
        <ThemeProvider>
          <Header />
          <main className="grow">{children}</main>
          <CookieBanner />
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}
