# Domain → recommended `~/.cursor/skills` bundles

Use this table to pick **at least three** skills for the task. Prefer rows whose keywords match the user request. If a row has fewer than three entries, add neutral complements from **General quality** (for example `calcom-cal.com-vercel-react-best-practices` + `ui-ux-pro-max` + `affaan-m-everything-claude-code-frontend-design` for UI work).

Paths are directory names under `~/.cursor/skills/`. Always resolve to full `SKILL.md` paths when instructing the user.

| Domain keywords | Suggested skills (pick ≥3) |
|-----------------|----------------------------|
| HTML, CSS, web UI, layout, landing, dashboard | `davila7-claude-code-templates-senior-frontend`, `affaan-m-everything-claude-code-frontend-design`, `nextlevelbuilder-ui-ux-pro-max-skill-ui-ux-pro-max`, `ui-ux-pro-max`, `wshobson-agents-design-system-patterns`, `calcom-cal.com-vercel-react-best-practices` |
| React, Next.js, App Router, performance | `davila7-claude-code-templates-senior-frontend`, `calcom-cal.com-vercel-react-best-practices`, `davila7-claude-code-templates-nextjs-supabase-auth` |
| React Native, Expo, mobile UI | `vercel-labs-agent-skills-react-native-skills`, `wshobson-agents-react-native-architecture`, `wshobson-agents-react-native-design`, `sickn33-antigravity-awesome-skills-react-native-architecture`, `sickn33-antigravity-awesome-skills-mobile-developer`, `shopify-flash-list-upgrade-react-native` |
| Supabase, Postgres, SQL | `sickn33-antigravity-awesome-skills-supabase-automation`, `davila7-claude-code-templates-supabase-postgres-best-practices`, `davila7-claude-code-templates-nextjs-supabase-auth` |
| Git, commits, branches | `basher83-lunar-claude-git-workflow`, `davila7-claude-code-templates-commit-work` |
| Netlify deploy | `davila7-claude-code-templates-netlify-deploy` |
| Cross-platform (web + mobile) | `sickn33-antigravity-awesome-skills-multi-platform-apps-multi-platform`, `sickn33-antigravity-awesome-skills-mobile-developer`, `davila7-claude-code-templates-senior-frontend` |
| Docs-first / APD / planning | `apd`, `apd-execute`, `apd-state-engine`, `apd-resume`, `apd-market`, `apd-market-execute` |

**Note:** Inventory changes when new folders appear under `~/.cursor/skills/`. Run `python3 scripts/list_cursor_skills.py --markdown` from this skill directory to refresh a machine-local list.
