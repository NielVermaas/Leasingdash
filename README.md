# Leasing Dashboard

A single-page dashboard that showcases residential tenant placement and leasing performance. Use the month and year filters to pivot across four ready-to-use timeframes—historical, current, projected, and lease-up—to see how the portfolio performs across different periods and asset types.

## Repository Layout

```
index.html     # Dashboard markup
styles.css     # Layout and theme styles
dashboard.js   # Chart.js configuration and dashboard data
```

If you do not see these files after cloning the repository, make sure you have checked out the latest commit on the `work` branch, which contains the dashboard implementation.

### Publishing to GitHub

If your remote repository is empty, push the latest dashboard commit:

1. Set the remote (replace `<YOUR-REPO-URL>` with your GitHub repo):
   ```bash
   git remote add origin <YOUR-REPO-URL>
   ```
2. Push the branch containing the dashboard files:
   ```bash
   git push -u origin work
   ```
3. Open a pull request on GitHub (or merge the branch into `main`) so the files appear on the default branch.

## Getting Started

1. Clone or download the repository.
2. Open `index.html` in a modern browser with internet access so the Chart.js CDN can load.
3. Use the **Month** and **Year** filters to focus on a specific rent cycle. The dataset includes four curated views:
   - **July 2024 – Core Portfolio**: a slower month with higher vacancy and late payments.
   - **August 2024 – Core Portfolio**: the stabilized portfolio baseline.
   - **September 2024 – Core Portfolio**: forward-looking projections with improved conversions.
   - **October 2024 – Urban Lease-Up**: a downtown asset in lease-up with heavier traffic.
4. Review the KPI cards—vacancy snapshot, incoming supply, payment discipline, and average lease duration—alongside the placement, tenant, and supply charts to understand how the selected timeframe is performing.

No build step is required—the dashboard is a static page.

## Printing

- Use your browser's print dialog (or save as PDF) when you need a hard copy. The dashboard automatically shifts to a clean light
  palette, tightens card and chart spacing, hides interactive-only controls, and refreshes chart colors for legibility without
  altering the on-screen appearance.
- Print-specific styling adds built-in page numbers, suppresses browser footers, and enforces 1.5 cm top and bottom margins so
  exported copies stay uncluttered while the layout mirrors what you see on screen.

## Data Highlights

- Placement pipeline metrics (applications, viewings, placements, no-shows) for each day in the selected timeframe.
- Portfolio supply KPIs (vacancy, incoming units, conversion rates) recalculated automatically for each version.
- Average lease duration indicator highlights how long current residents remain in place for the active timeframe.
- Annual supply trend visuals showing vacancy rate by month and how many buildings come online each month for the active timeframe.
- Tenant performance trends with full-year monthly coverage, including rent collection bars comparing total contracted versus actual receipts with variance percentages noted on the bars, default rates with arrears percentages atop each bar, and payment punctuality detail across every day of the month that mirrors typical residential patterns.
- A month-over-month rent collection stat block showing how much more or less was collected than the prior month (with the corresponding percentage change) and how the default rate shifted compared with the previous month.
- Rent and arrears figures across the dashboard are expressed in South African Rand (ZAR) for consistency.
