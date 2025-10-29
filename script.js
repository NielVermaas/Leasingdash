const projects = [
  {
    developer: "Urban Axis",
    development: "Riverside Lofts",
    fundingBank: "First Metropolitan Bank",
    units: 128,
    status: "In Progress",
  },
  {
    developer: "Harbor & Co.",
    development: "Seaport Residences",
    fundingBank: "Continental Capital",
    units: 242,
    status: "Completed",
  },
  {
    developer: "Urban Axis",
    development: "The Atrium",
    fundingBank: "First Metropolitan Bank",
    units: 96,
    status: "On Hold",
  },
  {
    developer: "Vertex Partners",
    development: "Summit Heights",
    fundingBank: "Great Plains Financial",
    units: 180,
    status: "In Progress",
  },
  {
    developer: "Skyline Ventures",
    development: "Skyview Tower",
    fundingBank: "Continental Capital",
    units: 210,
    status: "Completed",
  },
  {
    developer: "Harbor & Co.",
    development: "Marina Quarters",
    fundingBank: "Lighthouse Trust",
    units: 154,
    status: "In Progress",
  },
  {
    developer: "Vertex Partners",
    development: "Cedar Grove",
    fundingBank: "Lighthouse Trust",
    units: 86,
    status: "Completed",
  },
  {
    developer: "Skyline Ventures",
    development: "Northwind Commons",
    fundingBank: "Great Plains Financial",
    units: 132,
    status: "On Hold",
  },
];

const root = document.documentElement;
const lightModeToggle = document.getElementById("lightModeToggle");
const tableBody = document.getElementById("projectsTableBody");
const developerFilter = document.getElementById("developerFilter");
const developmentFilter = document.getElementById("developmentFilter");
const fundingBankFilter = document.getElementById("fundingBankFilter");
const projectRowTemplate = document.getElementById("projectRowTemplate");

const statusClassMap = {
  "In Progress": "status-pill status-pill--in-progress",
  Completed: "status-pill status-pill--completed",
  "On Hold": "status-pill status-pill--on-hold",
};

const formatStatus = (status) => {
  const pill = document.createElement("span");
  pill.textContent = status;
  pill.className = statusClassMap[status] ?? "status-pill";
  return pill;
};

const populateFilter = (selectEl, values) => {
  const fragment = document.createDocumentFragment();
  [...values]
    .sort((a, b) => a.localeCompare(b))
    .forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      fragment.appendChild(option);
    });
  selectEl.appendChild(fragment);
};

const uniqueValues = (key) => new Set(projects.map((project) => project[key]));

populateFilter(developerFilter, uniqueValues("developer"));
populateFilter(developmentFilter, uniqueValues("development"));
populateFilter(fundingBankFilter, uniqueValues("fundingBank"));

const projectMatchesFilters = (project) => {
  const developerMatches =
    developerFilter.value === "all" || project.developer === developerFilter.value;
  const developmentMatches =
    developmentFilter.value === "all" || project.development === developmentFilter.value;
  const fundingBankMatches =
    fundingBankFilter.value === "all" || project.fundingBank === fundingBankFilter.value;

  return developerMatches && developmentMatches && fundingBankMatches;
};

const renderProjects = () => {
  const matchingProjects = projects.filter(projectMatchesFilters);
  tableBody.replaceChildren();

  if (matchingProjects.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 5;
    emptyCell.className = "empty-state";
    emptyCell.textContent = "No projects match the selected filters.";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
    return;
  }

  matchingProjects.forEach((project) => {
    const row = projectRowTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector('[data-field="developer"]').textContent = project.developer;
    row.querySelector('[data-field="development"]').textContent = project.development;
    row.querySelector('[data-field="fundingBank"]').textContent = project.fundingBank;
    row.querySelector('[data-field="units"]').textContent = project.units.toLocaleString();

    const statusCell = row.querySelector('[data-field="status"]');
    statusCell.textContent = "";
    statusCell.appendChild(formatStatus(project.status));

    tableBody.appendChild(row);
  });
};

renderProjects();

const filterControls = [developerFilter, developmentFilter, fundingBankFilter];
filterControls.forEach((control) => control.addEventListener("change", renderProjects));

const prefersLightMode = window.matchMedia("(prefers-color-scheme: light)");
const updateThemeFromPreference = () => {
  if (prefersLightMode.matches) {
    root.dataset.theme = "light";
    lightModeToggle.setAttribute("aria-pressed", "true");
    lightModeToggle.querySelector(".toggle-button__icon").textContent = "☀️";
    lightModeToggle.querySelector(".toggle-button__label").textContent = "Disable Light Mode";
  }
};

updateThemeFromPreference();

const updateToggleLabel = (theme) => {
  const isLight = theme === "light";
  lightModeToggle.setAttribute("aria-pressed", String(isLight));
  lightModeToggle.querySelector(".toggle-button__icon").textContent = isLight ? "☀️" : "🌙";
  lightModeToggle
    .querySelector(".toggle-button__label")
    .textContent = isLight ? "Disable Light Mode" : "Enable Light Mode";
};

const toggleTheme = () => {
  const isLight = root.dataset.theme === "light";
  root.dataset.theme = isLight ? "dark" : "light";
  updateToggleLabel(root.dataset.theme);
};

lightModeToggle.addEventListener("click", () => {
  toggleTheme();
});

prefersLightMode.addEventListener("change", (event) => {
  root.dataset.theme = event.matches ? "light" : "dark";
  updateToggleLabel(root.dataset.theme);
});

updateToggleLabel(root.dataset.theme ?? "dark");
