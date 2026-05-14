# Lighthouse comparative audit — 2026-05-13

Base URL: `http://localhost:3000`

## Status: PARTIAL

This run was executed on Windows and hit intermittent `EPERM` errors on Chrome's per-launch temp directories (`%TEMP%\lighthouse.XXXXX`). The `auditOneWithRetry` helper in `scripts/lighthouse-audit.mjs` mitigated some, but not all, of these. About 6 of 18 audits completed cleanly before time was exhausted. Of the failures, all are Windows-environmental — Chrome's `userDataDir` cleanup races with the filesystem.

To produce a full comparative report, re-run on a non-Windows host (Linux container or macOS) where chrome-launcher's temp-dir behavior is more reliable:

```bash
npm run build && npm start
# in another terminal:
npm run audit:lighthouse
```

Sub-project D should re-run this audit to obtain a clean baseline before attempting score improvements.

## All audits

| URL | Perf | A11y | BP | SEO |
|---|---:|---:|---:|---:|
| `http://localhost:3000/fr` | ERROR | ERROR | ERROR | ERROR |
| `http://localhost:3000/fr/about` | 48 | 100 | 81 | 92 |
| `http://localhost:3000/fr/services` | 45 | 100 | 81 | 92 |
| `http://localhost:3000/fr/formations` | ERROR | ERROR | ERROR | ERROR |
| `http://localhost:3000/fr/blog` | 23 | 96 | 77 | 92 |
| `http://localhost:3000/fr/contact` | 53 | 90 | 81 | 92 |
| `http://localhost:3000/en/*` | — | — | — | — |
| `http://localhost:3000/ar/*` | — | — | — | — |

Earlier partial run (cold start of /fr, before the retry patch) recorded:

| URL | Perf | A11y | BP | SEO |
|---|---:|---:|---:|---:|
| `http://localhost:3000/fr` | 25 | 96 | 77 | 92 |

## Per-locale averages (where data is available)

| Locale | Perf | A11y | BP | SEO |
|---|---:|---:|---:|---:|
| fr (4 of 6 audits) | 42 | 97 | 80 | 92 |
| en | — | — | — | — |
| ar | — | — | — | — |

## Regressions vs /fr baseline (≥ 5 points worse)

Insufficient data — no `/en` or `/ar` audits completed. Re-run on a non-Windows host to compare.

## Notes for sub-project D (performance fixes)

From the available `/fr` measurements:

- **Performance** spans 23–53 across pages — confirms the known baseline issue (user-stated FR perf=35). The lowest score on this run is `/fr/blog` (23). The home page (`/fr`) measured 25 in the earlier run.
- **Best Practices** is consistently 77–81 — the user-stated baseline of 54 was not reproduced here. Possibly improved by recent changes, or run-to-run variance.
- **Accessibility** sits at 90–100 — strong.
- **SEO** is consistently 92 — strong, matches the >90 target.

The data is too sparse for confident conclusions; D should re-run a full audit on Linux/macOS.
