# SEO strategy — qwabi.co.za

Last updated: 2026-05-26

## Data sources

| File | Purpose |
| --- | --- |
| `Research.csv`, `Research (1–3).csv` | Keyword volume/CPC exports (UTF-16 tab-separated) |
| `keyword-intent-map.json` | Cluster → URL → intent → priority |
| `competitor-landscape.md` | Who ranks for commercial terms and how we differentiate |

## Keyword validation (are these the right keywords?)

**Yes for commercial positioning** (hire/build intent, South Africa):

- `software development company south africa` (~320/mo)
- `software development companies south africa`
- `web development company in south africa` (~170/mo)
- `mobile app development south africa` (~320/mo)
- `mobile app developers in south africa` (~720/mo)
- `app developers in south africa` (~480/mo)
- `software developers south africa` / `web developers south africa`
- `technical co-founder south africa`, `technical cofounder`, TaaS variants
- `cloud architect south africa`, `AI developer south africa`

**No — deprioritize or use only as blog traffic** (informational, jobs, or wrong vertical):

- Salary queries (`software developer salary south africa`, etc.)
- Courses and jobs (`software engineering courses`, `developer jobs`)
- Unrelated SA noise (`development bank south africa`, `cash app south africa`, `web hosting` without cloud service page)
- Generic US/global head terms without SA modifier (`software development company` 18k) unless page explicitly compares SA delivery

**Strategy:** Own **senior custom build + TaaS** in SA, not “cheapest dev shop.” Use the company roundup post for broad “software development companies” informational intent; use `/solutions/*` and `/developers/*` for hire/build intent.

## Search intent map (summary)

See `keyword-intent-map.json` for the full mapping. Pattern:

| Intent | Example query | Primary URL | Content job |
| --- | --- | --- | --- |
| Commercial hire (company) | software development company south africa | `/solutions/custom-software-development-company-south-africa` | Explain how to choose; CTA to quote/TaaS |
| Commercial hire (web) | web development company south africa | `/solutions/web-development-company-south-africa` | Web apps vs brochure sites; SA delivery |
| Commercial hire (mobile) | mobile app development south africa | `/solutions/mobile-app-development-south-africa` | MVP, stores, payments |
| Commercial hire (person) | software developer south africa | `/developers/south-africa` | Role hub + city pages |
| Comparison | agency vs technical cofounder | `/vs/technical-cofounder-vs-agency` | Decision support |
| Informational roundup | software development companies south africa | `/blog/software-development-companies-south-africa-2026` | List + methodology + when custom wins |
| Informational SEO | types of backlinks | `/blog/types-of-seo-backlinks` | Authority/education (links to Grumpy SEO Guy) |

## Competitor positioning

See `competitor-landscape.md`. Short version:

- **Large agencies** (Entelect, DVT, SovTech, Warp): scale and governance; weak on founder-direct senior ownership.
- **Fractional CTOs** (e.g. Marcel Coetzee, Malt profiles): strategy-heavy; often light on hands-on shipping.
- **Senior consultants** (e.g. Zayin Krige): long track record; different brand lane.
- **Qwabi angle:** One senior engineer, TaaS, production MVP in weeks, SA payments (Paystack/Stitch/Ozow), POPIA-aware patterns, no equity, no account-manager layer.

## Anti-thin-site checklist

- [x] Programmatic developer hub (SA + Eastern Cape + city × role pages)
- [x] 12+ industry `/solutions/` pages
- [x] 5 comparison `/vs/` pages
- [x] 50+ blog posts (engineering, AI, heritage, business)
- [x] Services + Technical co-founder + About + Editorial standards
- [x] Buyer guide: software development companies SA (2026)
- [x] New commercial solution pages for head terms (2026-05-26)

## Freshness

- Set `dateModified` on revised posts/pages when content materially changes.
- Sitemap: `lastmod` from frontmatter; recent blog posts use `changefreq: weekly`.
- Publish or update at least 2 engineering posts per month; refresh roundup post quarterly.
- Featured blog rotates via `featured: true` on newest pillar content.

## Build / deploy

```bash
npm run build   # regenerates dist/sitemap.xml via scripts/generate-sitemap.mjs
```

Verify: `https://www.qwabi.co.za/sitemap.xml`, Search Console coverage, canonicals on filtered `/blog?` (disallowed in robots.txt).
