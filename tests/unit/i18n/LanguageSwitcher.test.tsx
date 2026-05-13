import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const replace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/services",
  useRouter: () => ({ replace }),
}));
vi.mock("next-intl", () => ({
  useLocale: () => "fr",
}));

describe("LanguageSwitcher", () => {
  it("renders all 3 locales as options", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole("option", { name: "Français" })).toBeDefined();
    expect(screen.getByRole("option", { name: "English" })).toBeDefined();
    expect(screen.getByRole("option", { name: "العربية" })).toBeDefined();
  });

  it("calls router.replace with the new locale and current pathname", () => {
    render(<LanguageSwitcher />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "en" } });
    expect(replace).toHaveBeenCalledWith("/services", { locale: "en" });
  });
});
