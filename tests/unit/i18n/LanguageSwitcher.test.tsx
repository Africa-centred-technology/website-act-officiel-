import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next-intl + navigation hooks
const replaceMock = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/services",
  useRouter: () => ({ replace: replaceMock }),
}));

// Per-test locale mock — reassignable so each `it` can swap it.
// Captured by closure inside the factory below.
let currentLocale = "fr";
vi.mock("next-intl", () => ({
  useLocale: () => currentLocale,
}));

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    replaceMock.mockReset();
  });

  it("displays the current locale code in uppercase", () => {
    currentLocale = "fr";
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button")).toHaveTextContent("FR");
  });

  it("cycles fr → en when clicked", () => {
    currentLocale = "fr";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    expect(replaceMock).toHaveBeenCalledWith("/services", { locale: "en" });
  });

  it("cycles en → ar when clicked", () => {
    currentLocale = "en";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    expect(replaceMock).toHaveBeenCalledWith("/services", { locale: "ar" });
  });

  it("cycles ar → fr when clicked (wraps around)", () => {
    currentLocale = "ar";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    expect(replaceMock).toHaveBeenCalledWith("/services", { locale: "fr" });
  });

  it("aria-label announces the next locale", () => {
    currentLocale = "fr";
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Switch to English");
  });
});
