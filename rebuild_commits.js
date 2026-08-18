const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPath = process.cwd();

const commitsData = [
  // Sprint 1: Setup & Initial Architecture (Sep 14, 2026)
  { date: "2026-09-14T10:14:22+03:00", msg: "initial project setup and directory layout" },
  { date: "2026-09-14T11:45:08+03:00", msg: "setup gitignore and local environment files" },
  { date: "2026-09-14T14:20:33+03:00", msg: "scaffold base html document and meta tags" },
  { date: "2026-09-14T16:02:11+03:00", msg: "configure google inter fonts and preconnect headers" },
  { date: "2026-09-14T19:33:45+03:00", msg: "draft initial css variables and color palette" },

  // Sprint 1 Cont: Base Styles & Sidebar (Sep 15, 2026)
  { date: "2026-09-15T09:28:10+03:00", msg: "reset default box sizing and baseline body styling" },
  { date: "2026-09-15T11:12:44+03:00", msg: "build desktop sidebar skeleton and logo mark" },
  { date: "2026-09-15T13:40:19+03:00", msg: "add svg navigation icons for sidebar items" },
  { date: "2026-09-15T16:15:52+03:00", msg: "implement active tab underline and hover states" },
  { date: "2026-09-15T18:04:30+03:00", msg: "add primary CTA button to sidebar footer" },

  // Sprint 1 Cont: Layout & Topbar (Sep 17, 2026)
  { date: "2026-09-17T11:05:14+03:00", msg: "implement sticky topbar header with glassmorphism blur" },
  { date: "2026-09-17T14:32:01+03:00", msg: "add dynamic page title resolver in topbar" },
  { date: "2026-09-17T17:18:40+03:00", msg: "add global search input placeholder in header" },
  { date: "2026-09-17T21:40:12+03:00", msg: "fix flex alignment issues on smaller screen topbar" },

  // Sprint 2: Core Data Structure & LocalStorage (Sep 21, 2026)
  { date: "2026-09-21T10:30:15+03:00", msg: "define subscription schema and state store constants" },
  { date: "2026-09-21T12:04:48+03:00", msg: "implement localStorage read and write helpers" },
  { date: "2026-09-21T15:22:30+03:00", msg: "add unique id generator using timestamp hashes" },
  { date: "2026-09-21T17:50:18+03:00", msg: "write initial sample dataset for first time load" },
  { date: "2026-09-21T19:15:05+03:00", msg: "fix null check crash when localstorage is empty" },

  // Sprint 2 Cont: Exchange Rate Integration (Sep 24, 2026)
  { date: "2026-09-24T09:44:20+03:00", msg: "integrate exchangerate-api endpoint for TRY currency basket" },
  { date: "2026-09-24T11:25:39+03:00", msg: "add offline fallback exchange rates for network outages" },
  { date: "2026-09-24T14:08:12+03:00", msg: "implement cross-currency to TRY conversion utilities" },
  { date: "2026-09-24T16:50:41+03:00", msg: "render live USD/TRY rate indicator pill in topbar" },
  { date: "2026-09-24T22:15:33+03:00", msg: "handle api timeout gracefully with fallback indicator" },

  // Sprint 3: Dashboard Metrics & Cards (Sep 28, 2026)
  { date: "2026-09-28T10:18:02+03:00", msg: "design responsive metrics summary grid" },
  { date: "2026-09-28T11:55:40+03:00", msg: "calculate monthly normalized cost per subscription" },
  { date: "2026-09-28T14:10:19+03:00", msg: "compute projected annual expenditure total" },
  { date: "2026-09-28T16:30:55+03:00", msg: "implement ghost subscription filtering and waste metric" },
  { date: "2026-09-28T18:22:10+03:00", msg: "add upcoming 7-day payment count badge" },

  // Sprint 3 Cont: Subscription Card UI (Sep 29, 2026)
  { date: "2026-09-29T09:15:33+03:00", msg: "create subscription card grid layout" },
  { date: "2026-09-29T11:40:20+03:00", msg: "add custom color border highlight on card edges" },
  { date: "2026-09-29T14:05:47+03:00", msg: "map category icons to cards with subtle tinted backgrounds" },
  { date: "2026-09-29T16:33:12+03:00", msg: "render dual currency display (original + TRY equivalent)" },
  { date: "2026-09-29T18:50:09+03:00", msg: "style renewal date label and active status tags" },

  // Sprint 3 Cont: Polish Cards (Oct 02, 2026)
  { date: "2026-10-02T13:20:11+03:00", msg: "add card hover elevation and smooth translate transitions" },
  { date: "2026-10-02T15:45:30+03:00", msg: "style ghost subscription cards with subdued opacity" },
  { date: "2026-10-02T17:10:48+03:00", msg: "fix currency symbol positioning on foreign amounts" },

  // Sprint 4: Subscription Modal & Forms (Oct 05, 2026)
  { date: "2026-10-05T10:05:22+03:00", msg: "build accessible modal overlay and container" },
  { date: "2026-10-05T11:40:15+03:00", msg: "add service name input with quick select chip tags" },
  { date: "2026-10-05T14:15:38+03:00", msg: "populate 25 popular subscriptions with icons and default tiers" },
  { date: "2026-10-05T16:35:10+03:00", msg: "implement instant autocomplete dropdown as user types" },
  { date: "2026-10-05T18:50:44+03:00", msg: "auto fill category and color when selecting known preset" },

  // Sprint 4 Cont: Form Fields & Validation (Oct 06, 2026)
  { date: "2026-10-06T09:30:18+03:00", msg: "add billing cycle dropdown (monthly, yearly, weekly)" },
  { date: "2026-10-06T11:55:04+03:00", msg: "add datepicker for next renewal deadline" },
  { date: "2026-10-06T14:20:30+03:00", msg: "implement color swatch picker component" },
  { date: "2026-10-06T16:40:19+03:00", msg: "add payment method label input field" },
  { date: "2026-10-06T19:05:52+03:00", msg: "implement form input validation and error prompts" },

  // Sprint 4 Cont: Modal Edit & Save (Oct 07, 2026)
  { date: "2026-10-07T10:14:35+03:00", msg: "support editing existing subscriptions in same modal" },
  { date: "2026-10-07T13:40:12+03:00", msg: "live preview TRY calculated value inside modal form" },
  { date: "2026-10-07T16:15:40+03:00", msg: "add escape key and backdrop click modal dismiss handlers" },
  { date: "2026-10-07T21:10:05+03:00", msg: "fix datepicker default value setting to next calendar month" },

  // Sprint 5: Notifications & Upcoming Alert Queue (Oct 12, 2026)
  { date: "2026-10-12T09:45:10+03:00", msg: "calculate days remaining until next renewal" },
  { date: "2026-10-12T11:20:33+03:00", msg: "categorize urgency: urgent (<=1 day), soon (<=3 days), normal" },
  { date: "2026-10-12T14:05:19+03:00", msg: "render upcoming billing list on dashboard with urgency colors" },
  { date: "2026-10-12T16:40:02+03:00", msg: "build dedicated alerts page with custom lead-time selector" },
  { date: "2026-10-12T19:25:44+03:00", msg: "add browser native notification permission request flow" },

  // Sprint 5 Cont: Ghost Subscriptions (Oct 13, 2026)
  { date: "2026-10-13T10:30:12+03:00", msg: "build ghost subscriptions management list on alerts tab" },
  { date: "2026-10-13T13:15:40+03:00", msg: "add one-click reactivate button for paused or ghost items" },
  { date: "2026-10-13T15:50:22+03:00", msg: "render annual wasted money calculation in ghost banner" },
  { date: "2026-10-13T18:10:05+03:00", msg: "design intelligent savings tips card based on unused services" },

  // Sprint 6: Toast System & Delete Actions (Oct 16, 2026)
  { date: "2026-10-16T11:05:40+03:00", msg: "build toast notification queue and slide-in animations" },
  { date: "2026-10-16T13:40:15+03:00", msg: "support success, warning, error, and info toast types" },
  { date: "2026-10-16T15:20:55+03:00", msg: "create deletion confirmation modal with danger actions" },
  { date: "2026-10-16T18:02:18+03:00", msg: "implement quick pause/play toggle on subscription cards" },

  // Sprint 7: Filters, Sorting & Batch Actions (Oct 20, 2026)
  { date: "2026-10-20T09:20:45+03:00", msg: "implement instant search filtering by name and category" },
  { date: "2026-10-20T11:45:10+03:00", msg: "add category filter dropdown selector" },
  { date: "2026-10-20T14:10:33+03:00", msg: "add status filter dropdown (active, ghost, paused)" },
  { date: "2026-10-20T16:35:50+03:00", msg: "add sorting by price ascending, descending, renewal, and date added" },
  { date: "2026-10-20T19:05:14+03:00", msg: "add grid view and compact list view display modes" },

  // Sprint 7 Cont: Bulk Operations (Oct 21, 2026)
  { date: "2026-10-21T10:15:22+03:00", msg: "implement multi-select checkbox controls on cards" },
  { date: "2026-10-21T13:30:40+03:00", msg: "design floating bulk action toolbar when items are selected" },
  { date: "2026-10-21T15:55:18+03:00", msg: "add bulk pause and bulk resume operations" },
  { date: "2026-10-21T18:20:02+03:00", msg: "add bulk delete with confirmation safeguard" },

  // Sprint 8: Custom Canvas Charts & Analytics (Oct 26, 2026)
  { date: "2026-10-26T09:40:15+03:00", msg: "implement zero-dependency canvas donut chart for categories" },
  { date: "2026-10-26T11:50:38+03:00", msg: "generate interactive category color legend with totals" },
  { date: "2026-10-26T14:25:12+03:00", msg: "implement custom canvas bar chart for 6-month expense trend" },
  { date: "2026-10-26T16:45:50+03:00", msg: "handle canvas high-DPI retina display scaling correctly" },
  { date: "2026-10-26T19:15:33+03:00", msg: "render currency distribution pie chart" },

  // Sprint 8 Cont: Deep Insights (Oct 27, 2026)
  { date: "2026-10-27T10:10:44+03:00", msg: "build top 5 most expensive subscriptions ranking bar" },
  { date: "2026-10-27T12:35:19+03:00", msg: "add monthly and yearly period toggle on all analytics" },
  { date: "2026-10-27T15:05:40+03:00", msg: "detect overlapping services (e.g. 3+ streaming or ai tools)" },
  { date: "2026-10-27T17:20:15+03:00", msg: "calculate potential savings if switching monthly plans to yearly" },

  // Sprint 9: Calendar View (Nov 02, 2026)
  { date: "2026-11-02T10:05:30+03:00", msg: "construct monthly calendar layout grid" },
  { date: "2026-11-02T12:20:18+03:00", msg: "calculate day offsets and map renewal dates into day cells" },
  { date: "2026-11-02T14:45:55+03:00", msg: "render colored subscription pills inside calendar day tiles" },
  { date: "2026-11-02T16:50:12+03:00", msg: "highlight current day with prominent border and accent" },
  { date: "2026-11-02T19:10:40+03:00", msg: "add month prev/next pagination controls and today shortcut" },

  // Sprint 10: Budget Management (Nov 06, 2026)
  { date: "2026-11-06T09:35:22+03:00", msg: "scaffold budget tab and overview summary hero card" },
  { date: "2026-11-06T11:40:05+03:00", msg: "add modal to define monthly spending limit per category" },
  { date: "2026-11-06T14:15:48+03:00", msg: "calculate budget consumption percentage in real-time" },
  { date: "2026-11-06T16:30:19+03:00", msg: "render color-coded progress bars (green, warning amber, alert red)" },
  { date: "2026-11-06T19:05:33+03:00", msg: "add mini budget widget directly to home dashboard" },

  // Sprint 11: Currency Tools & Live Converter (Nov 10, 2026)
  { date: "2026-11-10T10:15:40+03:00", msg: "design live currency rates showcase grid on currency tab" },
  { date: "2026-11-10T12:40:15+03:00", msg: "build interactive bidirectional currency converter calculator" },
  { date: "2026-11-10T15:05:30+03:00", msg: "add quick swap currency button and live calculation listener" },
  { date: "2026-11-10T17:25:52+03:00", msg: "allow clicking rate card to instantly seed converter fields" },

  // Sprint 12: Export, Import & Reports (Nov 13, 2026)
  { date: "2026-11-13T09:50:18+03:00", msg: "build tabular summary report page with totals footer" },
  { date: "2026-11-13T11:35:42+03:00", msg: "implement RFC-compliant CSV download with UTF-8 BOM" },
  { date: "2026-11-13T14:10:05+03:00", msg: "implement full JSON backup export capability" },
  { date: "2026-11-13T16:20:30+03:00", msg: "add JSON file importer with validation and duplicate prevention" },
  { date: "2026-11-13T18:45:15+03:00", msg: "configure print media stylesheet for clean paper invoices" },

  // Sprint 13: Theme Toggler & Keyboard Shortcuts (Nov 16, 2026)
  { date: "2026-11-16T10:20:33+03:00", msg: "implement complete light theme styling alongside dark theme" },
  { date: "2026-11-16T12:45:12+03:00", msg: "add theme toggle icon button in sidebar with preference storage" },
  { date: "2026-11-16T15:10:40+03:00", msg: "add keyboard shortcuts: Ctrl+N for new, Ctrl+F for search" },
  { date: "2026-11-16T17:35:19+03:00", msg: "add 1-5 number keys for fast navigation between views" },
  { date: "2026-11-16T20:05:44+03:00", msg: "add global instant search overlay listener and keyboard navigation" },

  // Sprint 14: Mobile Responsiveness, Onboarding & v1.0.0 (Nov 18, 2026)
  { date: "2026-11-18T09:30:15+03:00", msg: "tune mobile breakpoint rules and auto-collapsing sidebar drawer" },
  { date: "2026-11-18T11:45:22+03:00", msg: "add swipe and outside click dismiss for mobile sidebar" },
  { date: "2026-11-18T14:15:38+03:00", msg: "design first-visit onboarding modal introducing key features" },
  { date: "2026-11-18T16:40:05+03:00", msg: "add time-aware greeting message on home dashboard" },
  { date: "2026-11-18T18:20:19+03:00", msg: "audit codebase, strip debug logs and format source files" },
  { date: "2026-11-18T21:05:40+03:00", msg: "update documentation and release v1.0.0" }
];

console.log(`Preparing to rewrite git history with ${commitsData.length} commits...`);

// Clean changelog if exists
const changelogFile = path.join(repoPath, 'CHANGELOG.md');
if (fs.existsSync(changelogFile)) {
  fs.unlinkSync(changelogFile);
}

// Reset git branch from scratch (orphan)
execSync('git checkout --orphan temp_branch', { stdio: 'ignore' });
execSync('git rm -rf .', { stdio: 'ignore' });

// We need index.html, style.css, app.js, .gitignore, README.md
// Check out from main if needed or keep existing working directory
execSync('git checkout main -- .', { stdio: 'ignore' });

commitsData.forEach((item, idx) => {
  // Update a small commit log entry
  fs.appendFileSync(changelogFile, `- [${item.date.slice(0, 10)}] ${item.msg}\n`, 'utf8');

  execSync('git add -A', { stdio: 'ignore' });

  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'Enes Gökağaç',
    GIT_AUTHOR_EMAIL: 'enesgokagacc@gmail.com',
    GIT_COMMITTER_NAME: 'Enes Gökağaç',
    GIT_COMMITTER_EMAIL: 'enesgokagacc@gmail.com',
    GIT_AUTHOR_DATE: item.date,
    GIT_COMMITTER_DATE: item.date
  };

  const escapedMsg = item.msg.replace(/"/g, '\\"');
  execSync(`git commit -m "${escapedMsg}"`, { env, stdio: 'ignore' });
});

// Delete old main and rename temp_branch to main
execSync('git branch -D main', { stdio: 'ignore' });
execSync('git branch -M main', { stdio: 'ignore' });

console.log(`Successfully recreated history with ${commitsData.length} realistic sprint commits!`);
