# Leasing Dashboard

A single-page dashboard that showcases residential tenant placement and leasing performance. The page now includes four ready-to-use scenarios—historical, current, projected, and lease-up—so you can compare how the portfolio performs across different periods and asset types.

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
3. Use the **Scenario** selector in the top-right corner to switch between the four versions:
   - **Core Portfolio · Aug 2024** – the original August view of the stabilized portfolio.
   - **Core Portfolio · Jul 2024** – a slower month with higher vacancy and late payments.
   - **Core Portfolio · Sep 2024** – forward-looking projections with improved conversions.
   - **Urban Lease-Up · Aug 2024** – a downtown asset in lease-up with heavier traffic.
4. Toggle between dark and light mode with the moon/sun button next to the scenario selector. The dashboard remembers your choice for the next visit.
5. Review the filter chips (Property, Bedroom Mix, Agent, Developer, Development, Funding Bank) to confirm which subset of the portfolio you are viewing.

No build step is required—the dashboard is a static page.

## Data Highlights

- Placement pipeline metrics (applications, viewings, placements, no-shows) for each day in the selected scenario.
- Portfolio supply KPIs (vacancy, incoming units, conversion rates) recalculated automatically for each version.
- Tenant performance trends (rent collection, default rates, payment punctuality) tailored to each scenario.
- Summary insights that explain the drivers and focus areas for the active view.
- Scenario-specific ownership filters so you can track Developer, Development, and Funding Bank context alongside the original leasing filters.
