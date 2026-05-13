#!/usr/bin/env node
/**
 * Comparative Lighthouse audit for /fr, /en, /ar locales.
 * Runs 18 audits (6 paths × 3 locales) and writes a markdown report.
 *
 * Usage:
 *   npm run build && npm start    # in one terminal
 *   node scripts/lighthouse-audit.mjs    # in another
 *
 * Env:
 *   BASE_URL — defaults to http://localhost:3000
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const PATHS = ["", "/about", "/services", "/formations", "/blog", "/contact"];
const LOCALES = ["fr", "en", "ar"];
const REPORT_PATH = path.join("docs", "lighthouse-audit-2026-05-13.md");
const REGRESSION_THRESHOLD = 5; // points

async function pingServer() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error(`\nCannot reach ${BASE_URL}. Run \`npm run build && npm start\` first.\n`);
    process.exit(1);
  }
}

async function auditOne(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      preset: "desktop",
    });
    const cats = result.lhr.categories;
    return {
      perf: Math.round((cats.performance?.score ?? 0) * 100),
      a11y: Math.round((cats.accessibility?.score ?? 0) * 100),
      bp:   Math.round((cats["best-practices"]?.score ?? 0) * 100),
      seo:  Math.round((cats.seo?.score ?? 0) * 100),
    };
  } finally {
    await chrome.kill();
  }
}

/** Retry an audit once on Windows EPERM errors caused by Chrome temp-dir contention. */
async function auditOneWithRetry(url) {
  try {
    return await auditOne(url);
  } catch (err) {
    if (err?.code === "EPERM" || /EPERM/.test(String(err?.message))) {
      // Brief pause for Windows to release the previous Chrome temp dir lock.
      await new Promise((r) => setTimeout(r, 3000));
      return await auditOne(url);
    }
    throw err;
  }
}

async function runAllAudits() {
  const rows = [];
  for (const locale of LOCALES) {
    for (const pathPart of PATHS) {
      const url = `${BASE_URL}/${locale}${pathPart}`;
      process.stdout.write(`Auditing ${url} ... `);
      try {
        const scores = await auditOneWithRetry(url);
        rows.push({ url, locale, pathPart, ...scores });
        console.log(`perf=${scores.perf} a11y=${scores.a11y} bp=${scores.bp} seo=${scores.seo}`);
      } catch (err) {
        rows.push({ url, locale, pathPart, perf: "ERROR", a11y: "ERROR", bp: "ERROR", seo: "ERROR", error: err.message });
        console.log(`ERROR: ${err.message}`);
      }
      // Brief gap between audits to reduce Windows temp-dir contention.
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return rows;
}

function formatMarkdown(rows) {
  const date = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push(`# Lighthouse comparative audit — ${date}`);
  lines.push("");
  lines.push(`Base URL: \`${BASE_URL}\``);
  lines.push("");
  lines.push("## All audits");
  lines.push("");
  lines.push("| URL | Perf | A11y | BP | SEO |");
  lines.push("|---|---:|---:|---:|---:|");
  for (const r of rows) {
    lines.push(`| \`${r.url}\` | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} |`);
  }
  lines.push("");

  // Per-locale summary
  lines.push("## Per-locale averages");
  lines.push("");
  lines.push("| Locale | Perf | A11y | BP | SEO |");
  lines.push("|---|---:|---:|---:|---:|");
  for (const locale of LOCALES) {
    const localeRows = rows.filter((r) => r.locale === locale && r.perf !== "ERROR");
    if (localeRows.length === 0) {
      lines.push(`| ${locale} | — | — | — | — |`);
      continue;
    }
    const avg = (key) => Math.round(localeRows.reduce((sum, r) => sum + Number(r[key]), 0) / localeRows.length);
    lines.push(`| ${locale} | ${avg("perf")} | ${avg("a11y")} | ${avg("bp")} | ${avg("seo")} |`);
  }
  lines.push("");

  // Regressions vs /fr baseline
  lines.push(`## Regressions vs /fr baseline (≥ ${REGRESSION_THRESHOLD} points worse)`);
  lines.push("");
  const regressions = [];
  for (const pathPart of PATHS) {
    const frRow = rows.find((r) => r.locale === "fr" && r.pathPart === pathPart);
    if (!frRow || frRow.perf === "ERROR") continue;
    for (const locale of ["en", "ar"]) {
      const otherRow = rows.find((r) => r.locale === locale && r.pathPart === pathPart);
      if (!otherRow || otherRow.perf === "ERROR") continue;
      for (const cat of ["perf", "a11y", "bp", "seo"]) {
        const delta = Number(frRow[cat]) - Number(otherRow[cat]);
        if (delta >= REGRESSION_THRESHOLD) {
          regressions.push(`- \`/${locale}${pathPart || "/"}\` **${cat}**: ${otherRow[cat]} vs fr ${frRow[cat]} (−${delta})`);
        }
      }
    }
  }
  if (regressions.length === 0) {
    lines.push("None.");
  } else {
    lines.push(...regressions);
  }
  lines.push("");

  return lines.join("\n");
}

async function main() {
  await pingServer();
  const rows = await runAllAudits();
  const md = formatMarkdown(rows);
  await fs.mkdir("docs", { recursive: true });
  await fs.writeFile(REPORT_PATH, md, "utf8");
  console.log(`\nReport written to ${REPORT_PATH}`);
  const allErrored = rows.every((r) => r.perf === "ERROR");
  process.exit(allErrored ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
