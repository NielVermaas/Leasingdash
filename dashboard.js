const basePipeline = {
  applications: [
    5, 6, 4, 7, 5, 6, 8, 5, 4, 7, 6, 5, 6, 7, 4, 5, 6, 7, 5, 6, 4, 5, 6, 7, 5, 6, 4, 5, 7, 6, 5
  ],
  viewings: [
    4, 5, 3, 6, 4, 5, 6, 4, 3, 5, 5, 4, 5, 5, 3, 4, 5, 5, 4, 5, 3, 4, 5, 5, 4, 5, 3, 4, 5, 5, 4
  ],
  placements: [
    1, 2, 1, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 2, 1
  ],
  noShows: [
    1, 1, 0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1
  ]
};

const THEME_STORAGE_KEY = 'leasingdash-theme';
let currentThemeTokens = null;

document.addEventListener('DOMContentLoaded', () => {
  const state = { charts: {} };

  initializeTheme(state);

  const scenarios = buildScenarios();
  const scenarioKeys = Object.keys(scenarios);
  const scenarioSelect = document.getElementById('scenarioSelect');

  scenarioKeys.forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = scenarios[key].optionLabel;
    scenarioSelect.appendChild(option);
  });

  const initialKey = scenarioKeys[0];
  scenarioSelect.value = initialKey;
  updateScenario(scenarios[initialKey], state);

  scenarioSelect.addEventListener('change', (event) => {
    const selectedScenario = scenarios[event.target.value];
    updateScenario(selectedScenario, state);
  });
});

function initializeTheme(state) {
  if (getStoredTheme() === 'light') {
    document.body.classList.add('theme-light');
  }

  currentThemeTokens = captureThemeTokens();
  applyChartDefaults(currentThemeTokens);

  const toggle = document.getElementById('themeToggle');
  if (!toggle) {
    return;
  }
  const isLight = document.body.classList.contains('theme-light');
  updateThemeToggleUi(toggle, isLight);

  toggle.addEventListener('click', () => {
    const nextIsLight = !document.body.classList.contains('theme-light');
    document.body.classList.toggle('theme-light', nextIsLight);
    persistTheme(nextIsLight ? 'light' : 'dark');
    currentThemeTokens = captureThemeTokens();
    applyChartDefaults(currentThemeTokens);
    updateThemeToggleUi(toggle, nextIsLight);
    updateChartsTheme(state.charts);
  });
}

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    /* storage not available */
  }
}

function captureThemeTokens() {
  const styles = getComputedStyle(document.documentElement);
  return {
    chartText: styles.getPropertyValue('--chart-text').trim(),
    chartGrid: styles.getPropertyValue('--chart-grid').trim(),
    tooltipBg: styles.getPropertyValue('--tooltip-bg').trim(),
    tooltipBorder: styles.getPropertyValue('--tooltip-border').trim(),
    axisTitle: styles.getPropertyValue('--axis-title').trim(),
    textMuted: styles.getPropertyValue('--text-muted').trim()
  };
}

function getThemeToken(key) {
  return currentThemeTokens ? currentThemeTokens[key] : undefined;
}

function updateThemeToggleUi(button, isLight) {
  if (!button) return;
  const icon = button.querySelector('.theme-toggle__icon');
  const label = button.querySelector('.theme-toggle__label');
  button.setAttribute('aria-pressed', String(isLight));
  button.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  button.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  if (icon) {
    icon.textContent = isLight ? '☀️' : '🌙';
  }
  if (label) {
    label.textContent = isLight ? 'Light mode' : 'Dark mode';
  }
}

function updateChartsTheme(charts) {
  Object.values(charts).forEach((chart) => {
    if (!chart) return;
    const { options } = chart;
    if (options.plugins?.tooltip) {
      options.plugins.tooltip.backgroundColor = getThemeToken('tooltipBg');
      options.plugins.tooltip.borderColor = getThemeToken('tooltipBorder');
    }
    if (options.plugins?.legend?.labels) {
      options.plugins.legend.labels.color = getThemeToken('chartText');
    }
    if (options.scales) {
      Object.values(options.scales).forEach((scale) => {
        if (scale.ticks) {
          scale.ticks.color = getThemeToken('chartText');
        }
        if (scale.grid) {
          scale.grid.color = getThemeToken('chartGrid');
        }
        if (scale.title) {
          scale.title.color = getThemeToken('axisTitle') || getThemeToken('chartText');
        }
      });
    }
    chart.update();
  });
}

function buildScenarios() {
  return {
    'core-aug-2024': {
      optionLabel: 'Core Portfolio · Aug 2024',
      title: 'Residential Portfolio Dashboard',
      subtitle: 'August 2024 • Portfolio Size: 120 units',
      pipeline: buildPipeline(basePipeline, { days: 31 }),
      rent: {
        months: ['April', 'May', 'June', 'July', 'August', 'September'],
        expected: [210000, 210000, 211000, 212000, 212000, 213000],
        actual: [204000, 206000, 208000, 205000, 207000, 209000]
      },
      defaultRate: {
        months: ['April', 'May', 'June', 'July', 'August', 'September'],
        paid: [110, 111, 112, 108, 109, 110],
        unpaid: [10, 9, 8, 12, 11, 10]
      },
      paymentPunctuality: {
        label: 'September 2024 rent run',
        days: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        values: [46, 24, 12, 7, 5, 3, 1, 1, 0.5, 0.5],
        frontLoadedDays: 5
      },
      supply: {
        vacancyRate: 0.117,
        vacancyDetail: '14 units available by August 5th',
        incomingRate: 0.075,
        incomingDetail: '9 new units becoming available in August'
      },
      discipline: {
        avgDaysLate: 2.4,
        avgLeaseDuration: 23.5
      },
      insights: {
        highlights: [
          'August 7th produced the highest lead volume (8 applications) with 2 placements.',
          'Attendance dips on weekends drive a 20.3% no-show rate.',
          'July rent run lagging at 96.7% collection prompts follow-up calls.'
        ],
        focus: [
          'Prioritize turn on 14 vacant units to cut vacancy by 2 pts.',
          'Leverage autopay campaign to reduce average late days below 2.',
          'Monitor 9 incoming units for pre-leasing opportunities.'
        ]
      }
    },
    'core-jul-2024': {
      optionLabel: 'Core Portfolio · Jul 2024',
      title: 'Residential Portfolio Dashboard',
      subtitle: 'July 2024 • Portfolio Size: 120 units',
      pipeline: buildPipeline(basePipeline, {
        days: 31,
        adjustments: {
          applications: (value, idx) => Math.max(3, value - (idx % 5 === 0 ? 1 : 0) - (idx % 6 === 0 ? 1 : 0)),
          viewings: (value, idx) => Math.max(2, value - (idx % 4 === 0 ? 1 : 0)),
          placements: (value, idx) => Math.max(1, value - (idx % 3 === 0 ? 1 : 0)),
          noShows: (value, idx) => Math.max(0, value + (idx % 6 === 0 ? 1 : 0))
        }
      }),
      rent: {
        months: ['March', 'April', 'May', 'June', 'July', 'August'],
        expected: [209000, 210000, 210000, 211000, 211000, 212000],
        actual: [203000, 204000, 206000, 207000, 205000, 206500]
      },
      defaultRate: {
        months: ['March', 'April', 'May', 'June', 'July', 'August'],
        paid: [109, 110, 111, 112, 108, 109],
        unpaid: [11, 10, 9, 8, 12, 11]
      },
      paymentPunctuality: {
        label: 'July 2024 rent run',
        days: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        values: [42, 22, 13, 8, 6, 4, 2, 1.5, 0.8, 0.7],
        frontLoadedDays: 4
      },
      supply: {
        vacancyRate: 0.132,
        vacancyDetail: '16 units available by July 5th',
        incomingRate: 0.055,
        incomingDetail: '7 new units became available in July'
      },
      discipline: {
        avgDaysLate: 3.1,
        avgLeaseDuration: 22.8
      },
      insights: {
        highlights: [
          'Late-July heatwave saw showings slow with a 24% no-show rate.',
          'Lead-to-placement conversion eased to 23% amid seasonal churn.',
          'Collections stabilized above 97% through early summer months.'
        ],
        focus: [
          'Tighten screening follow-up to recapture weekend no-shows.',
          'Accelerate make-ready schedule for 16 vacant units.',
          'Promote online payment adoption ahead of August renewals.'
        ]
      }
    },
    'core-sep-2024': {
      optionLabel: 'Core Portfolio · Sep 2024',
      title: 'Residential Portfolio Dashboard',
      subtitle: 'September 2024 • Portfolio Size: 120 units (projected)',
      pipeline: buildPipeline(basePipeline, {
        days: 30,
        adjustments: {
          applications: (value, idx) => value + (idx % 4 === 0 ? 1 : 0),
          viewings: (value, idx) => value + (idx % 3 === 0 ? 1 : 0),
          placements: (value, idx) => value + (idx % 5 === 0 ? 1 : 0),
          noShows: (value, idx) => Math.max(0, value - (idx % 4 === 0 ? 1 : 0))
        }
      }),
      rent: {
        months: ['May', 'June', 'July', 'August', 'September', 'October'],
        expected: [210500, 211000, 212000, 212500, 213000, 213500],
        actual: [206000, 208000, 209500, 210000, 209000, 211500]
      },
      defaultRate: {
        months: ['May', 'June', 'July', 'August', 'September', 'October'],
        paid: [111, 112, 109, 110, 111, 112],
        unpaid: [9, 8, 11, 10, 9, 8]
      },
      paymentPunctuality: {
        label: 'Projected October 2024 rent run',
        days: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        values: [48, 25, 11, 6, 4, 3, 1, 1, 0.7, 0.3],
        frontLoadedDays: 5
      },
      supply: {
        vacancyRate: 0.095,
        vacancyDetail: '11 units expected vacant by September 5th',
        incomingRate: 0.083,
        incomingDetail: '10 units targeted for turnover in September'
      },
      discipline: {
        avgDaysLate: 2.1,
        avgLeaseDuration: 24.2
      },
      insights: {
        highlights: [
          'Pipeline volume improving with 4% more applications than August.',
          'Projected no-show rate drops to 16% after reminder campaigns.',
          'October collection outlook trending above 98% by the 5th.'
        ],
        focus: [
          'Lock renewals early to hold vacancy below 10%.',
          'Sustain text reminders to protect reduced no-show rate.',
          'Pre-lease 10 upcoming turnovers to maintain rent momentum.'
        ]
      }
    },
    'urban-aug-2024': {
      optionLabel: 'Urban Lease-Up · Aug 2024',
      title: 'Urban Lease-Up Dashboard',
      subtitle: 'August 2024 • Portfolio Size: 95 units',
      pipeline: buildPipeline(basePipeline, {
        days: 31,
        adjustments: {
          applications: (value, idx) => value + (idx % 2 === 0 ? 2 : 1),
          viewings: (value, idx) => value + (idx % 3 === 0 ? 2 : 1),
          placements: (value, idx) => value + (idx % 4 === 0 ? 2 : 1),
          noShows: (value, idx) => Math.max(0, value + (idx % 5 === 0 ? 1 : 0))
        }
      }),
      rent: {
        months: ['April', 'May', 'June', 'July', 'August', 'September'],
        expected: [156000, 157500, 159000, 160500, 161000, 162500],
        actual: [150000, 152500, 153800, 154500, 155800, 158000]
      },
      defaultRate: {
        months: ['April', 'May', 'June', 'July', 'August', 'September'],
        paid: [82, 83, 84, 82, 83, 84],
        unpaid: [13, 12, 11, 13, 12, 11]
      },
      paymentPunctuality: {
        label: 'August 2024 rent run',
        days: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        values: [38, 27, 14, 8, 6, 3, 2, 1, 0.7, 0.3],
        frontLoadedDays: 4
      },
      supply: {
        vacancyRate: 0.168,
        vacancyDetail: '16 units available by August 5th',
        incomingRate: 0.105,
        incomingDetail: '10 new units releasing in August'
      },
      discipline: {
        avgDaysLate: 3.6,
        avgLeaseDuration: 15.4
      },
      insights: {
        highlights: [
          'Lease-up traffic surges mid-month with multiple 12+ application days.',
          'Two-bedroom premiums holding rents 3% above underwriting.',
          'Collections improving as autopay adoption tops 58%.'
        ],
        focus: [
          'Staff additional tour blocks for high-demand weekends.',
          'Target corporate housing leads to accelerate velocity.',
          'Extend concierge follow-up to curb 17% vacancy early in lease-up.'
        ]
      }
    }
  };
}

function buildPipeline(base, { days, adjustments = {} }) {
  return Array.from({ length: days }, (_, idx) => ({
    day: idx + 1,
    applications: applyAdjustment(getBaseValue(base.applications, idx), idx, adjustments.applications),
    viewings: applyAdjustment(getBaseValue(base.viewings, idx), idx, adjustments.viewings),
    placements: applyAdjustment(getBaseValue(base.placements, idx), idx, adjustments.placements),
    noShows: applyAdjustment(getBaseValue(base.noShows, idx), idx, adjustments.noShows)
  }));
}

function applyAdjustment(baseValue, idx, adjustFn) {
  if (typeof adjustFn === 'function') {
    return Math.max(0, Math.round(adjustFn(baseValue, idx)));
  }
  return baseValue;
}

function getBaseValue(array, idx) {
  if (idx < array.length) {
    return array[idx];
  }
  return array[array.length - 1];
}

function updateScenario(scenario, state) {
  updateHeader(scenario);
  updateKpis(scenario);
  updateInsights(scenario.insights);
  updateCharts(scenario, state);
}

function updateHeader(scenario) {
  document.getElementById('dashboardTitle').textContent = scenario.title;
  document.getElementById('portfolioSubtitle').textContent = scenario.subtitle;
}

function updateKpis(scenario) {
  const totals = summarizePipeline(scenario.pipeline);
  const noShowRate = computeNoShowRate(scenario.pipeline);

  document.getElementById('funnelHeadline').textContent = `Applications ${totals.applications} → Viewings ${totals.viewings} → Placements ${totals.placements}`;
  document.getElementById('funnelMeta').textContent = [
    `Lead to Viewing: ${formatPercent(totals.viewingRatio)}`,
    `Viewing to Placement: ${formatPercent(totals.placementRatioFromViewings)}`,
    `Lead to Placement: ${formatPercent(totals.placementRatio)}`
  ].join(' | ');

  document.getElementById('vacancyRate').textContent = formatPercent(scenario.supply.vacancyRate);
  document.getElementById('vacancyDetail').textContent = scenario.supply.vacancyDetail;
  document.getElementById('incomingSupply').textContent = formatPercent(scenario.supply.incomingRate);
  document.getElementById('incomingDetail').textContent = scenario.supply.incomingDetail;
  document.getElementById('paymentDiscipline').textContent = `Avg. ${scenario.discipline.avgDaysLate.toFixed(1)} days late`;
  document.getElementById('leaseDuration').textContent = `Average lease duration: ${scenario.discipline.avgLeaseDuration.toFixed(1)} months`;

  document.getElementById('totalApplications').textContent = totals.applications.toString();
  document.getElementById('totalViewings').textContent = totals.viewings.toString();
  document.getElementById('totalPlacements').textContent = totals.placements.toString();
  document.getElementById('totalNoShowRate').textContent = formatPercent(noShowRate);
  document.getElementById('leadToPlacement').textContent = formatPercent(totals.placementRatio);
  document.getElementById('viewingToPlacement').textContent = formatPercent(totals.placementRatioFromViewings);
}

function updateInsights(insights) {
  populateList('insightHighlights', insights.highlights);
  populateList('insightFocus', insights.focus);
}

function updateCharts(scenario, state) {
  const dailyLabels = scenario.pipeline.map((item) => item.day.toString());
  const pipelineDataset = {
    applications: scenario.pipeline.map((item) => item.applications),
    viewings: scenario.pipeline.map((item) => item.viewings),
    placements: scenario.pipeline.map((item) => item.placements),
    noShows: scenario.pipeline.map((item) => item.noShows)
  };

  const pipelineChart = ensureChart(state, 'pipeline', () =>
    createDailyPipelineChart('dailyPipelineChart', dailyLabels, pipelineDataset)
  );
  refreshDailyPipelineChart(pipelineChart, dailyLabels, pipelineDataset);

  const attendanceChart = ensureChart(state, 'attendance', () =>
    createAttendanceChart('attendanceChart', dailyLabels, pipelineDataset)
  );
  refreshAttendanceChart(attendanceChart, dailyLabels, pipelineDataset);

  const rentChart = ensureChart(state, 'rent', () =>
    createRentCollectionChart('rentCollectionChart', scenario.rent)
  );
  refreshRentCollectionChart(rentChart, scenario.rent);

  const defaultChart = ensureChart(state, 'default', () =>
    createDefaultRateChart('defaultRateChart', scenario.defaultRate)
  );
  refreshDefaultRateChart(defaultChart, scenario.defaultRate);

  const paymentChart = ensureChart(state, 'payment', () =>
    createPaymentPunctualityChart('paymentPunctualityChart', scenario.paymentPunctuality)
  );
  refreshPaymentPunctualityChart(paymentChart, scenario.paymentPunctuality);

  updateChartsTheme(state.charts);
}

function ensureChart(state, key, createFn) {
  if (!state.charts[key]) {
    state.charts[key] = createFn();
  }
  return state.charts[key];
}

function summarizePipeline(pipeline) {
  return pipeline.reduce(
    (acc, day) => {
      acc.applications += day.applications;
      acc.viewings += day.viewings;
      acc.placements += day.placements;
      acc.noShows += day.noShows;
      return acc;
    },
    {
      applications: 0,
      viewings: 0,
      placements: 0,
      noShows: 0,
      get viewingRatio() {
        return this.applications ? this.viewings / this.applications : 0;
      },
      get placementRatioFromViewings() {
        return this.viewings ? this.placements / this.viewings : 0;
      },
      get placementRatio() {
        return this.applications ? this.placements / this.applications : 0;
      }
    }
  );
}

function computeNoShowRate(pipeline) {
  const totals = pipeline.reduce(
    (acc, day) => {
      acc.viewings += day.viewings;
      acc.noShows += day.noShows;
      return acc;
    },
    { viewings: 0, noShows: 0 }
  );
  const scheduled = totals.viewings + totals.noShows;
  return scheduled ? totals.noShows / scheduled : 0;
}

function populateList(elementId, items) {
  const listElement = document.getElementById(elementId);
  listElement.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    listElement.appendChild(li);
  });
}

function formatPercent(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}

function applyChartDefaults(themeTokens) {
  Chart.defaults.color = themeTokens.chartText;
  Chart.defaults.font.family = 'Inter, sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.labels.boxWidth = 12;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.tooltip.backgroundColor = themeTokens.tooltipBg;
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.borderColor = themeTokens.tooltipBorder;
}

function createDailyPipelineChart(elementId, labels, dataset) {
  const ctx = document.getElementById(elementId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Applications',
          data: dataset.applications,
          backgroundColor: 'rgba(56, 189, 248, 0.8)',
          borderRadius: 6,
          maxBarThickness: 18
        },
        {
          label: 'Viewings',
          data: dataset.viewings,
          backgroundColor: 'rgba(125, 211, 252, 0.7)',
          borderRadius: 6,
          maxBarThickness: 18
        },
        {
          label: 'Placements',
          data: dataset.placements,
          backgroundColor: 'rgba(74, 222, 128, 0.85)',
          borderRadius: 6,
          maxBarThickness: 18
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 0 }
        },
        y: {
          beginAtZero: true,
          grid: { color: getThemeToken('chartGrid') }
        }
      }
    }
  });
}

function refreshDailyPipelineChart(chart, labels, dataset) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = dataset.applications;
  chart.data.datasets[1].data = dataset.viewings;
  chart.data.datasets[2].data = dataset.placements;
  chart.update();
}

function createAttendanceChart(elementId, labels, dataset) {
  const ctx = document.getElementById(elementId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Viewings',
          data: dataset.viewings,
          backgroundColor: 'rgba(56, 189, 248, 0.75)',
          borderRadius: 6,
          maxBarThickness: 20
        },
        {
          label: 'No-Shows',
          data: dataset.noShows,
          backgroundColor: 'rgba(248, 113, 113, 0.8)',
          borderRadius: 6,
          maxBarThickness: 20
        },
        {
          label: 'Placements',
          data: dataset.placements,
          backgroundColor: 'rgba(74, 222, 128, 0.85)',
          borderRadius: 6,
          maxBarThickness: 20
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          stacked: true,
          grid: { color: getThemeToken('chartGrid') }
        }
      }
    }
  });
}

function refreshAttendanceChart(chart, labels, dataset) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = dataset.viewings;
  chart.data.datasets[1].data = dataset.noShows;
  chart.data.datasets[2].data = dataset.placements;
  chart.update();
}

function createRentCollectionChart(elementId, rent) {
  const ctx = document.getElementById(elementId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rent.months,
      datasets: [
        {
          label: 'Expected Rent',
          data: rent.expected,
          backgroundColor: 'rgba(56, 189, 248, 0.8)',
          borderRadius: 8,
          maxBarThickness: 28
        },
        {
          label: 'Actual Rent',
          data: rent.actual,
          backgroundColor: 'rgba(74, 222, 128, 0.8)',
          borderRadius: 8,
          maxBarThickness: 28
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: getThemeToken('chartGrid') }
        }
      }
    }
  });
}

function refreshRentCollectionChart(chart, rent) {
  chart.data.labels = rent.months;
  chart.data.datasets[0].data = rent.expected;
  chart.data.datasets[1].data = rent.actual;
  chart.update();
}

function createDefaultRateChart(elementId, defaultRate) {
  const ctx = document.getElementById(elementId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: defaultRate.months,
      datasets: [
        {
          label: 'Units Paid',
          data: defaultRate.paid,
          backgroundColor: 'rgba(74, 222, 128, 0.85)',
          borderRadius: 8,
          maxBarThickness: 26
        },
        {
          label: 'Units Unpaid',
          data: defaultRate.unpaid,
          backgroundColor: 'rgba(248, 113, 113, 0.85)',
          borderRadius: 8,
          maxBarThickness: 26
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: getThemeToken('chartGrid') }
        }
      }
    }
  });
}

function refreshDefaultRateChart(chart, defaultRate) {
  chart.data.labels = defaultRate.months;
  chart.data.datasets[0].data = defaultRate.paid;
  chart.data.datasets[1].data = defaultRate.unpaid;
  chart.update();
}

function createPaymentPunctualityChart(elementId, punctuality) {
  const ctx = document.getElementById(elementId);
  document.getElementById('paymentPunctualityCaption').textContent = `Share of monthly rent received each day — ${punctuality.label}`;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: punctuality.days,
      datasets: [
        {
          label: '% of Rent Received',
          data: punctuality.values,
          backgroundColor: buildPunctualityColors(punctuality.values.length, punctuality.frontLoadedDays),
          borderRadius: 8,
          maxBarThickness: 28
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.parsed.y}% of rent received`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          title: {
            display: true,
            text: 'Day of Month',
            color: getThemeToken('axisTitle') || getThemeToken('chartText')
          }
        },
        y: {
          beginAtZero: true,
          max: 50,
          grid: { color: getThemeToken('chartGrid') },
          title: {
            display: true,
            text: '% of Monthly Rent',
            color: getThemeToken('axisTitle') || getThemeToken('chartText')
          }
        }
      }
    }
  });
}

function refreshPaymentPunctualityChart(chart, punctuality) {
  document.getElementById('paymentPunctualityCaption').textContent = `Share of monthly rent received each day — ${punctuality.label}`;
  chart.data.labels = punctuality.days;
  chart.data.datasets[0].data = punctuality.values;
  chart.data.datasets[0].backgroundColor = buildPunctualityColors(
    punctuality.values.length,
    punctuality.frontLoadedDays
  );
  chart.update();
}

function buildPunctualityColors(length, frontLoadedDays) {
  return Array.from({ length }, (_, idx) =>
    idx < frontLoadedDays ? 'rgba(56, 189, 248, 0.85)' : 'rgba(148, 163, 208, 0.65)'
  );
}
