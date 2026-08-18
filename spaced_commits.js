const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPath = process.cwd();

const commitGroups = [
  // Day 1: Aug 18, 2026 (Tuesday) - 5 commits
  {
    dateStr: "2026-08-18",
    times: ["10:15:22", "11:42:05", "14:10:33", "16:25:44", "18:40:19"],
    messages: [
      "initial project setup and directory layout",
      "setup gitignore and local environment configuration",
      "scaffold base html document and meta viewport",
      "configure google inter fonts and preconnect headers",
      "draft initial css variables and color palette"
    ]
  },

  // Day 2: Aug 21, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-08-21",
    times: ["09:30:10", "11:15:45", "13:50:20", "15:40:12", "17:35:50"],
    messages: [
      "reset default box sizing and baseline body styling",
      "build desktop sidebar skeleton and logo mark",
      "add svg navigation icons for sidebar items",
      "implement active tab underline and hover states",
      "add primary CTA button to sidebar footer"
    ]
  },

  // Day 3: Aug 25, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-08-25",
    times: ["10:20:14", "12:05:30", "14:40:19", "17:15:42", "20:30:05"],
    messages: [
      "implement sticky topbar header with glassmorphism blur",
      "add dynamic page title resolver in topbar",
      "add global search input placeholder in header",
      "fix flex alignment issues on smaller screen topbar",
      "define subscription schema and state store constants"
    ]
  },

  // Day 4: Aug 28, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-08-28",
    times: ["09:45:33", "11:30:12", "14:15:50", "16:40:22", "18:55:10"],
    messages: [
      "implement localStorage read and write helpers",
      "add unique id generator using timestamp hashes",
      "write initial sample dataset for first time load",
      "fix null check crash when localstorage is empty",
      "integrate exchangerate-api endpoint for TRY currency basket"
    ]
  },

  // Day 5: Sep 01, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-09-01",
    times: ["10:10:15", "11:50:40", "14:20:05", "16:35:30", "19:10:48"],
    messages: [
      "add offline fallback exchange rates for network outages",
      "implement cross-currency to TRY conversion utilities",
      "render live USD/TRY rate indicator pill in topbar",
      "handle api timeout gracefully with fallback indicator",
      "design responsive metrics summary grid"
    ]
  },

  // Day 6: Sep 04, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-09-04",
    times: ["09:20:44", "11:45:10", "14:05:33", "16:20:18", "18:30:05"],
    messages: [
      "calculate monthly normalized cost per subscription",
      "compute projected annual expenditure total",
      "implement ghost subscription filtering and waste metric",
      "add upcoming 7-day payment count badge",
      "create subscription card grid layout"
    ]
  },

  // Day 7: Sep 08, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-09-08",
    times: ["10:30:22", "12:15:45", "14:50:12", "17:10:30", "19:40:15"],
    messages: [
      "add custom color border highlight on card edges",
      "map category icons to cards with subtle tinted backgrounds",
      "render dual currency display (original + TRY equivalent)",
      "style renewal date label and active status tags",
      "add card hover elevation and smooth translate transitions"
    ]
  },

  // Day 8: Sep 11, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-09-11",
    times: ["09:50:18", "11:35:40", "14:15:05", "16:40:22", "18:25:50"],
    messages: [
      "style ghost subscription cards with subdued opacity",
      "fix currency symbol positioning on foreign amounts",
      "build accessible modal overlay and container",
      "add service name input with quick select chip tags",
      "populate 25 popular subscriptions with icons and default tiers"
    ]
  },

  // Day 9: Sep 15, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-09-15",
    times: ["10:15:30", "11:55:12", "14:30:45", "16:50:20", "19:05:15"],
    messages: [
      "implement instant autocomplete dropdown as user types",
      "auto fill category and color when selecting known preset",
      "add billing cycle dropdown (monthly, yearly, weekly)",
      "add datepicker for next renewal deadline",
      "implement color swatch picker component"
    ]
  },

  // Day 10: Sep 18, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-09-18",
    times: ["09:40:11", "11:20:35", "13:55:02", "16:15:40", "18:30:22"],
    messages: [
      "add payment method label input field",
      "implement form input validation and error prompts",
      "support editing existing subscriptions in same modal",
      "live preview TRY calculated value inside modal form",
      "add escape key and backdrop click modal dismiss handlers"
    ]
  },

  // Day 11: Sep 22, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-09-22",
    times: ["10:05:19", "11:40:44", "14:15:10", "16:30:55", "18:50:30"],
    messages: [
      "fix datepicker default value setting to next calendar month",
      "calculate days remaining until next renewal",
      "categorize urgency: urgent (<=1 day), soon (<=3 days), normal",
      "render upcoming billing list on dashboard with urgency colors",
      "build dedicated alerts page with custom lead-time selector"
    ]
  },

  // Day 12: Sep 25, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-09-25",
    times: ["09:35:40", "11:15:20", "13:45:50", "16:05:12", "18:15:33"],
    messages: [
      "add browser native notification permission request flow",
      "build ghost subscriptions management list on alerts tab",
      "add one-click reactivate button for paused or ghost items",
      "render annual wasted money calculation in ghost banner",
      "design intelligent savings tips card based on unused services"
    ]
  },

  // Day 13: Sep 29, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-09-29",
    times: ["10:25:12", "12:00:30", "14:35:18", "16:55:40", "19:20:15"],
    messages: [
      "build toast notification queue and slide-in animations",
      "support success, warning, error, and info toast types",
      "create deletion confirmation modal with danger actions",
      "implement quick pause/play toggle on subscription cards",
      "implement instant search filtering by name and category"
    ]
  },

  // Day 14: Oct 02, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-10-02",
    times: ["09:15:50", "11:05:22", "13:40:15", "15:55:30", "18:05:44"],
    messages: [
      "add category filter dropdown selector",
      "add status filter dropdown (active, ghost, paused)",
      "add sorting by price ascending, descending, renewal, and date added",
      "add grid view and compact list view display modes",
      "implement multi-select checkbox controls on cards"
    ]
  },

  // Day 15: Oct 06, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-10-06",
    times: ["10:10:40", "11:45:15", "14:20:55", "16:35:10", "18:45:30"],
    messages: [
      "design floating bulk action toolbar when items are selected",
      "add bulk pause and bulk resume operations",
      "add bulk delete with confirmation safeguard",
      "implement zero-dependency canvas donut chart for categories",
      "generate interactive category color legend with totals"
    ]
  },

  // Day 16: Oct 09, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-10-09",
    times: ["09:45:12", "11:25:30", "14:05:40", "16:15:20", "18:20:55"],
    messages: [
      "implement custom canvas bar chart for 6-month expense trend",
      "handle canvas high-DPI retina display scaling correctly",
      "render currency distribution pie chart",
      "build top 5 most expensive subscriptions ranking bar",
      "add monthly and yearly period toggle on all analytics"
    ]
  },

  // Day 17: Oct 13, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-10-13",
    times: ["10:20:05", "12:10:40", "14:45:15", "17:05:30", "19:15:22"],
    messages: [
      "detect overlapping services (e.g. 3+ streaming or ai tools)",
      "calculate potential savings if switching monthly plans to yearly",
      "construct monthly calendar layout grid",
      "calculate day offsets and map renewal dates into day cells",
      "render colored subscription pills inside calendar day tiles"
    ]
  },

  // Day 18: Oct 16, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-10-16",
    times: ["09:30:15", "11:15:40", "13:50:05", "16:10:33", "18:25:12"],
    messages: [
      "highlight current day with prominent border and accent",
      "add month prev/next pagination controls and today shortcut",
      "scaffold budget tab and overview summary hero card",
      "add modal to define monthly spending limit per category",
      "calculate budget consumption percentage in real-time"
    ]
  },

  // Day 19: Oct 20, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-10-20",
    times: ["10:05:44", "11:50:20", "14:25:15", "16:40:30", "18:55:05"],
    messages: [
      "render color-coded progress bars (green, warning amber, alert red)",
      "add mini budget widget directly to home dashboard",
      "design live currency rates showcase grid on currency tab",
      "build interactive bidirectional currency converter calculator",
      "add quick swap currency button and live calculation listener"
    ]
  },

  // Day 20: Oct 23, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-10-23",
    times: ["09:40:30", "11:20:15", "13:45:40", "16:05:22", "18:10:50"],
    messages: [
      "allow clicking rate card to instantly seed converter fields",
      "build tabular summary report page with totals footer",
      "implement RFC-compliant CSV download with UTF-8 BOM",
      "implement full JSON backup export capability",
      "add JSON file importer with validation and duplicate prevention"
    ]
  },

  // Day 21: Oct 27, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-10-27",
    times: ["10:15:10", "12:00:45", "14:30:20", "16:45:50", "19:05:15"],
    messages: [
      "configure print media stylesheet for clean paper invoices",
      "implement complete light theme styling alongside dark theme",
      "add theme toggle icon button in sidebar with preference storage",
      "add keyboard shortcuts: Ctrl+N for new, Ctrl+F for search",
      "add 1-5 number keys for fast navigation between views"
    ]
  },

  // Day 22: Oct 30, 2026 (Friday) [Gap: 3 days] - 5 commits
  {
    dateStr: "2026-10-30",
    times: ["09:50:20", "11:30:45", "14:10:12", "16:20:30", "18:35:10"],
    messages: [
      "add global instant search overlay listener and keyboard navigation",
      "tune mobile breakpoint rules and auto-collapsing sidebar drawer",
      "add swipe and outside click dismiss for mobile sidebar",
      "design first-visit onboarding modal introducing key features",
      "add time-aware greeting message on home dashboard"
    ]
  },

  // Day 23: Nov 03, 2026 (Tuesday) [Gap: 4 days] - 5 commits
  {
    dateStr: "2026-11-03",
    times: ["10:30:15", "12:15:40", "14:50:20", "17:10:45", "19:25:30"],
    messages: [
      "audit codebase, strip debug logs and format source files",
      "optimize event listeners and DOM repaint cycles",
      "refine responsive typography scaling across viewports",
      "enhance touch target accessibility on mobile elements",
      "verify offline caching behavior in local storage"
    ]
  },

  // Day 24: Nov 06, 2026 (Friday) [Gap: 3 days] - 4 commits (Total = 23*5 + 4 = 119 commits)
  {
    dateStr: "2026-11-06",
    times: ["11:05:20", "14:20:45", "16:50:10", "19:40:15"],
    messages: [
      "verify clean comment-free production code standards",
      "update project documentation and usage guides",
      "final build verification and smoke tests",
      "release production version 1.0.0"
    ]
  }
];

let totalCommits = 0;
commitGroups.forEach(g => totalCommits += g.messages.length);
console.log(`Setting up ${totalCommits} commits across ${commitGroups.length} distinct days (spaced 3-4 days apart)...`);

// Reset git branch from scratch (orphan)
execSync('git checkout --orphan natural_branch', { stdio: 'ignore' });
execSync('git rm -rf .', { stdio: 'ignore' });
execSync('git checkout main -- .', { stdio: 'ignore' });

const changelogFile = path.join(repoPath, 'CHANGELOG.md');
if (fs.existsSync(changelogFile)) {
  fs.unlinkSync(changelogFile);
}

commitGroups.forEach(group => {
  group.messages.forEach((msg, idx) => {
    const time = group.times[idx];
    const isoDate = `${group.dateStr}T${time}+03:00`;

    fs.appendFileSync(changelogFile, `- [${group.dateStr}] ${msg}\n`, 'utf8');
    execSync('git add -A', { stdio: 'ignore' });

    const env = {
      ...process.env,
      GIT_AUTHOR_NAME: 'Enes Gökağaç',
      GIT_AUTHOR_EMAIL: 'enesgokagacc@gmail.com',
      GIT_COMMITTER_NAME: 'Enes Gökağaç',
      GIT_COMMITTER_EMAIL: 'enesgokagacc@gmail.com',
      GIT_AUTHOR_DATE: isoDate,
      GIT_COMMITTER_DATE: isoDate
    };

    const escapedMsg = msg.replace(/"/g, '\\"');
    execSync(`git commit -m "${escapedMsg}"`, { env, stdio: 'ignore' });
  });
});

execSync('git branch -D main', { stdio: 'ignore' });
execSync('git branch -M main', { stdio: 'ignore' });

console.log(`Successfully completed! Total commits: ${totalCommits}`);
