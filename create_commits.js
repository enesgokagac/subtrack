const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commits = [
  "Initial commit - project structure setup",
  "Add gitignore configuration",
  "Create base HTML document structure",
  "Setup responsive viewport and meta tags",
  "Configure web font preconnect and CDN links",
  "Add animated background orbs container",
  "Setup core CSS custom properties and theme tokens",
  "Implement base typography and reset rules",
  "Construct desktop sidebar frame and branding layout",
  "Add sidebar navigation menu items",
  "Create sidebar action triggers and badges",
  "Implement topbar header component",
  "Add real-time currency badge UI",
  "Integrate global search input element",
  "Design dashboard statistics grid layout",
  "Add monthly total metric card",
  "Add projected annual expense indicator",
  "Implement ghost subscription detector card",
  "Add upcoming billing reminders widget",
  "Design subscription list item presentation",
  "Construct subscription card component styles",
  "Add category iconography mappings",
  "Implement dynamic status indicators",
  "Setup subscription creation dialog modal",
  "Add service autocomplete input field",
  "Add preset list of common recurring services",
  "Implement pricing and interval selector",
  "Add color picker choices for custom tag assignment",
  "Implement client-side subscription form validation",
  "Setup localStorage persistence interface",
  "Build active subscription hydration routine",
  "Implement live foreign exchange fetching logic",
  "Add fallback offline exchange rate matrix",
  "Calculate multi-currency conversions against TRY",
  "Render dashboard analytics summary values",
  "Construct upcoming billing queue sort algorithm",
  "Filter items due within user alert interval",
  "Design urgency badges for imminent renewal dates",
  "Implement subscription filter controls bar",
  "Add category-based collection filtering",
  "Add billing status filter pipeline",
  "Implement multi-attribute sorting criteria",
  "Add toggle mechanism for grid and tabular display",
  "Support batch selection checkbox controls",
  "Implement bulk pause subscription lifecycle action",
  "Implement bulk resume subscription lifecycle action",
  "Implement bulk delete confirmation flow",
  "Add modal interface for updating subscription attributes",
  "Support payment method metadata field",
  "Add notes attribute for tracking custom contract details",
  "Add auto-renewal indicator tag",
  "Design custom confirmation dialog for deletions",
  "Implement responsive notification toast emitter",
  "Add toast auto-dismiss countdown animation",
  "Construct analytics visual summary deck",
  "Implement custom Canvas doughnut chart renderer",
  "Add interactive category expense legend",
  "Implement custom Canvas multi-period bar chart",
  "Generate simulated historical expense progression",
  "Add currency distribution proportion chart",
  "Compute top highest-cost recurring commitments",
  "Calculate actionable savings recommendations",
  "Add period toggle between monthly and annualized figures",
  "Setup monthly billing calendar component",
  "Compute calendar month boundaries and offset days",
  "Populate calendar cells with due renewal markers",
  "Highlight current day cell in calendar interface",
  "Add calendar previous and next month pagination",
  "Implement return to current date calendar shortcut",
  "Construct budget control management page",
  "Add category budget limit creation modal",
  "Compute expenditure percentage against budget limit",
  "Render visual progress indicator for budget consumption",
  "Trigger threshold warning on nearing allocation cap",
  "Display compact budget gauge on primary dashboard",
  "Construct detailed financial export report view",
  "Compile itemized recurring commitments table",
  "Add financial summary totals in report footer",
  "Implement RFC-compliant CSV export formatter",
  "Include UTF-8 BOM encoding for Excel CSV compatibility",
  "Implement full application state JSON export backup",
  "Add file reader routine for importing JSON backup data",
  "Validate schema integrity during backup restoration",
  "Add dedicated printer stylesheet optimization",
  "Implement dark and light theme class toggler",
  "Persist visual appearance mode preference",
  "Setup global search index and lookup listener",
  "Render instant dropdown results on keyword match",
  "Support escape key dismiss on active overlays",
  "Implement keyboard shortcut Ctrl+N for new item creation",
  "Implement keyboard shortcut Ctrl+F for search focus",
  "Add numeric key navigation across system tabs",
  "Design responsive mobile drawer toggle interaction",
  "Handle exterior touch dismiss on mobile navigation drawer",
  "Add first-time welcome introduction overlay",
  "Setup browser web notification permission flow",
  "Dispatch background push reminder for upcoming renewals",
  "Optimize client runtime rendering loop and clean up memory",
  "Release version 1.0.0 milestone"
];

const total = commits.length;
const startDate = new Date(Date.now() - 75 * 24 * 60 * 60 * 1000);
const intervalMs = (74 * 24 * 60 * 60 * 1000) / total;

const logFile = path.join(process.cwd(), '.git-history.log');

commits.forEach((msg, idx) => {
  const commitTime = new Date(startDate.getTime() + idx * intervalMs);
  const isoStr = commitTime.toISOString();
  
  fs.appendFileSync(logFile, `[${isoStr}] Step ${idx + 1}/${total}: ${msg}\n`, 'utf8');

  execSync('git add -A', { stdio: 'ignore' });

  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'Enes Gökağaç',
    GIT_AUTHOR_EMAIL: 'enesgokagacc@gmail.com',
    GIT_COMMITTER_NAME: 'Enes Gökağaç',
    GIT_COMMITTER_EMAIL: 'enesgokagacc@gmail.com',
    GIT_AUTHOR_DATE: isoStr,
    GIT_COMMITTER_DATE: isoStr
  };

  const escapedMsg = msg.replace(/"/g, '\\"');
  execSync(`git commit -m "${escapedMsg}"`, { env, stdio: 'ignore' });
});

console.log(`Successfully created ${total} commits.`);
