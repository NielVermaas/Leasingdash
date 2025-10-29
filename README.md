# Leasing Dashboard

A single-page dashboard that showcases residential tenant placement and leasing performance. The page now includes four ready-to-use timeframes—historical, current, projected, and lease-up—so you can compare how the portfolio performs across different periods and asset types.

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
4. Toggle between dark and light mode with the small moon/sun icon to the right of the year filter. The dashboard remembers your choice for the next visit.
5. Review the KPI cards—vacancy snapshot, incoming supply, and payment discipline—and the supporting charts to understand how the selected timeframe is performing across placement, tenant, and supply metrics.

No build step is required—the dashboard is a static page.

## Printing

- Use your browser's print dialog (or save as PDF) when you need a hard copy. The dashboard automatically shifts to a clean light
  palette, hides interactive-only controls, and refreshes chart colors for legibility without altering the on-screen appearance.

## Data Highlights

- Placement pipeline metrics (applications, viewings, placements, no-shows) for each day in the selected timeframe.
- Portfolio supply KPIs (vacancy, incoming units, conversion rates) recalculated automatically for each version.
- Annual supply trend visuals showing vacancy rate by month and how many buildings come online each month for the active timeframe.
- Tenant performance trends with full-year monthly coverage for rent collection and default rates, plus payment punctuality detail across all 31 days that mirrors typical residential patterns (18% paid on the 1st, 12% on the 2nd, tapering through month-end).
