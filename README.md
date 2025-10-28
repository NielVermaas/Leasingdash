# Leasing Dashboard

A single-page dashboard summarizing residential tenant placement and leasing performance for August 2024.

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

No build step is required—the dashboard is a static page.

## Data Highlights

- Placement pipeline metrics (applications, viewings, placements, no-shows) for each day in August 2024.
- Portfolio supply KPIs (vacancy, incoming units, conversion rates).
- Tenant performance trends for rent collection, default rates, and payment punctuality.
- Summary insights to guide leasing operations.
