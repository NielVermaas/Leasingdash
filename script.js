const projects = [
  {
    developer: "Northwind Partners",
    development: "Marina Point",
    fundingBank: "First Horizon",
    units: 168,
    status: "In Progress",
  },
  {
    developer: "Northwind Partners",
    development: "Canopy Heights",
    fundingBank: "Blue Ridge Capital",
    units: 132,
    status: "In Progress",
  },
  {
    developer: "Ridgeview Group",
    development: "Riverfront Commons",
    fundingBank: "First Horizon",
    units: 210,
    status: "Completed",
  },
  {
    developer: "Ridgeview Group",
    development: "Stonegate Square",
    fundingBank: "Heritage Bank",
    units: 184,
    status: "Delayed",
  },
  {
    developer: "Harborline",
    development: "Tidewater Lofts",
    fundingBank: "Blue Ridge Capital",
    units: 94,
    status: "In Progress",
  },
  {
    developer: "Harborline",
    development: "Beacon Residences",
    fundingBank: "Commonwealth Credit",
    units: 126,
    status: "Completed",
  },
  {
    developer: "Summit Estates",
    development: "Vista Canyon",
    fundingBank: "Heritage Bank",
    units: 155,
    status: "Completed",
  },
  {
    developer: "Summit Estates",
    development: "Arbor Terrace",
    fundingBank: "Commonwealth Credit",
    units: 142,
    status: "In Progress",
  },
];

const body = document.body;
const themeToggle = document.querySelector("#themeToggle");
const tableBody = document.querySelector("#projectsBody");
const projectTemplate = document.querySelector("#projectRow");
const projectsCount = document.querySelector("#projectsCount");

const filters = {
  developer: document.querySelector("#developerFilter"),
  development: document.querySelector("#developmentFilter"),
  fundingBank: document.querySelector("#fundingFilter"),
};

function setInitialTheme() {
  const stored = window.localStorage.getItem("leasingdash-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  if (stored === "light" || (!stored && prefersLight)) {
    body.classList.replace("theme-dark", "theme-light");
    themeToggle.setAttribute("aria-pressed", "true");
    themeToggle.querySelector(".theme-toggle__icon").textContent = "☀️";
    themeToggle.querySelector(".theme-toggle__label").textContent = "Disable light mode";
  }
}

function toggleTheme() {
  const isLight = body.classList.toggle("theme-light");
  if (isLight) {
    body.classList.remove("theme-dark");
  } else {
    body.classList.add("theme-dark");
  }

  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.querySelector(".theme-toggle__icon").textContent = isLight ? "☀️" : "🌙";
  themeToggle.querySelector(".theme-toggle__label").textContent = isLight
    ? "Disable light mode"
    : "Enable light mode";

  window.localStorage.setItem("leasingdash-theme", isLight ? "light" : "dark");
}

function uniqueValuesFor(field) {
  return Array.from(new Set(projects.map((project) => project[field]))).sort();
}

function populateFilters() {
  Object.entries(filters).forEach(([field, select]) => {
    const values = uniqueValuesFor(field);
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  });
}

function renderProjects(items) {
  const fragment = document.createDocumentFragment();
  items.forEach((project) => {
    const row = projectTemplate.content.cloneNode(true);
    row.querySelector('[data-field="developer"]').textContent = project.developer;
    row.querySelector('[data-field="development"]').textContent = project.development;
    row.querySelector('[data-field="fundingBank"]').textContent = project.fundingBank;
    row.querySelector('[data-field="units"]').textContent = project.units.toLocaleString();
    const statusElement = row.querySelector('[data-field="status"]');
    statusElement.textContent = project.status;
    statusElement.dataset.status = project.status.toLowerCase();
    fragment.append(row);
  });

  tableBody.replaceChildren(fragment);
  projectsCount.textContent = `${items.length} project${items.length === 1 ? "" : "s"} shown`;
}

function collectFilters() {
  return Object.fromEntries(
    Object.entries(filters).map(([field, select]) => [field, select.value])
  );
}

function applyFilters() {
  const active = collectFilters();
  const filtered = projects.filter((project) => {
    return Object.entries(active).every(([field, value]) => {
      if (value === "all") return true;
      return project[field] === value;
    });
  });

  renderProjects(filtered);
}

function wireFilterEvents() {
  Object.values(filters).forEach((select) => {
    select.addEventListener("change", applyFilters);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setInitialTheme();
  populateFilters();
  wireFilterEvents();
  renderProjects(projects);
  themeToggle.addEventListener("click", toggleTheme);
});
