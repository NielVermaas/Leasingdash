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

const monthDayLabels = Array.from({ length: 31 }, (_, idx) => (idx + 1).toString());

const typicalPunctualityDistribution = buildTypicalPunctualityDistribution();

function buildTypicalPunctualityDistribution() {
  const tableDistribution = [
    { count: 1, value: 18 },   // Day 1
    { count: 1, value: 12 },   // Day 2
    { count: 1, value: 6 },    // Day 3
    { count: 1, value: 4 },    // Day 4
    { count: 1, value: 3 },    // Day 5
    { count: 5, value: 1.5 },  // Days 6–10
    { count: 5, value: 1.2 },  // Days 11–15
    { count: 5, value: 1.1 },  // Days 16–20
    { count: 4, value: 1.5 },  // Days 21–24
    { count: 1, value: 6 },    // Day 25
    { count: 1, value: 6 },    // Day 26
    { count: 1, value: 6 },    // Day 27
    { count: 1, value: 4 },    // Day 28
    { count: 1, value: 3 },    // Day 29
    { count: 1, value: 3 },    // Day 30
    { count: 1, value: 1 }     // Day 31
  ];

  return tableDistribution.flatMap(({ count, value }) =>
    Array.from({ length: count }, () => value)
  );
}

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
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        expected: [206500, 207000, 207500, 210000, 210000, 211000, 211500, 212000, 212500, 213000, 213500, 214000],
        actual: [201500, 203000, 204500, 204000, 206000, 208000, 205000, 207000, 209000, 211000, 211500, 212500]
      },
      defaultRate: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        paid: [108, 109, 110, 110, 111, 112, 108, 109, 110, 111, 112, 112],
        unpaid: [12, 11, 10, 10, 9, 8, 12, 11, 10, 9, 8, 8]
      },
      paymentPunctuality: {
        label: 'September 2024 rent run',
        days: [...monthDayLabels],
        values: [...typicalPunctualityDistribution],
        dueWindowDays: 5
      },
      supply: {
        vacancyRate: 0.117,
        vacancyDetail: '14 units available by August 5th',
        incomingRate: 0.075,
        incomingDetail: '9 new units becoming available in August',
        vacancyTrend: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          rates: [0.094, 0.096, 0.098, 0.101, 0.108, 0.112, 0.118, 0.117, 0.109, 0.103, 0.098, 0.095]
        },
        newInventory: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          buildings: [1, 0, 1, 1, 2, 1, 1, 2, 2, 1, 1, 0]
        }
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
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        expected: [205000, 205500, 206000, 207000, 207500, 208000, 209000, 209500, 210000, 211000, 211500, 212000],
        actual: [199000, 200500, 202000, 203000, 204500, 205500, 205000, 206500, 207000, 208500, 209500, 210000]
      },
      defaultRate: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        paid: [107, 108, 109, 110, 111, 112, 108, 109, 110, 111, 111, 112],
        unpaid: [13, 12, 11, 10, 9, 8, 12, 11, 10, 9, 9, 8]
      },
      paymentPunctuality: {
        label: 'July 2024 rent run',
        days: [...monthDayLabels],
        values: [...typicalPunctualityDistribution],
        dueWindowDays: 5
      },
      supply: {
        vacancyRate: 0.132,
        vacancyDetail: '16 units available by July 5th',
        incomingRate: 0.055,
        incomingDetail: '7 new units became available in July',
        vacancyTrend: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          rates: [0.107, 0.11, 0.112, 0.116, 0.12, 0.125, 0.132, 0.128, 0.12, 0.113, 0.109, 0.105]
        },
        newInventory: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          buildings: [0, 1, 1, 2, 2, 1, 1, 1, 2, 1, 0, 0]
        }
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
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        expected: [206000, 206500, 207000, 208000, 208500, 209500, 210500, 211500, 213000, 213500, 214000, 214500],
        actual: [202000, 203000, 204000, 205000, 206000, 207000, 209500, 210000, 209000, 211500, 212500, 213500]
      },
      defaultRate: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        paid: [108, 109, 110, 111, 112, 112, 111, 111, 112, 113, 113, 114],
        unpaid: [12, 11, 10, 9, 8, 8, 9, 9, 8, 7, 7, 6]
      },
      paymentPunctuality: {
        label: 'Projected October 2024 rent run',
        days: [...monthDayLabels],
        values: [...typicalPunctualityDistribution],
        dueWindowDays: 5
      },
      supply: {
        vacancyRate: 0.095,
        vacancyDetail: '11 units expected vacant by September 5th',
        incomingRate: 0.083,
        incomingDetail: '10 units targeted for turnover in September',
        vacancyTrend: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          rates: [0.1, 0.101, 0.103, 0.099, 0.097, 0.095, 0.094, 0.095, 0.093, 0.092, 0.091, 0.09]
        },
        newInventory: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          buildings: [1, 1, 1, 1, 2, 2, 2, 2, 3, 2, 1, 1]
        }
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
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        expected: [145000, 147000, 149000, 151000, 153000, 155000, 158000, 161000, 162500, 164000, 165500, 167000],
        actual: [138000, 140500, 143000, 145500, 148000, 150500, 151800, 155800, 158000, 160500, 162000, 164500]
      },
      defaultRate: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        paid: [75, 76, 78, 79, 80, 81, 82, 83, 84, 84, 85, 86],
        unpaid: [20, 19, 17, 16, 15, 14, 13, 12, 11, 11, 10, 9]
      },
      paymentPunctuality: {
        label: 'August 2024 rent run',
        days: [...monthDayLabels],
        values: [...typicalPunctualityDistribution],
        dueWindowDays: 5
      },
      supply: {
        vacancyRate: 0.168,
        vacancyDetail: '16 units available by August 5th',
        incomingRate: 0.105,
        incomingDetail: '10 new units releasing in August',
        vacancyTrend: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          rates: [0.142, 0.148, 0.153, 0.158, 0.162, 0.166, 0.169, 0.168, 0.16, 0.152, 0.145, 0.14]
        },
        newInventory: {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          buildings: [2, 2, 3, 4, 4, 5, 5, 6, 5, 4, 3, 2]
        }
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

  const vacancyTrendChart = ensureChart(state, 'vacancyTrend', () =>
    createVacancyTrendChart('vacancyTrendChart', scenario.supply.vacancyTrend)
  );
  refreshVacancyTrendChart(vacancyTrendChart, scenario.supply.vacancyTrend);

  const newInventoryChart = ensureChart(state, 'newInventory', () =>
    createNewInventoryChart('newInventoryChart', scenario.supply.newInventory)
  );
  refreshNewInventoryChart(newInventoryChart, scenario.supply.newInventory);

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
          backgroundColor: 'rgba(56, 189, 248, 0.85)',
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
  chart.data.datasets[0].backgroundColor = 'rgba(56, 189, 248, 0.85)';
  chart.update();
}

function createVacancyTrendChart(elementId, trend) {
  const ctx = document.getElementById(elementId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: trend.months,
      datasets: [
        {
          label: 'Vacancy Rate',
          data: trend.rates,
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderRadius: 8,
          maxBarThickness: 28
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label(context) {
              return `${(context.parsed.y * 100).toFixed(1)}% vacancy`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: getThemeToken('chartGrid') },
          ticks: {
            callback(value) {
              return `${(value * 100).toFixed(0)}%`;
            }
          }
        }
      }
    }
  });
}

function refreshVacancyTrendChart(chart, trend) {
  chart.data.labels = trend.months;
  chart.data.datasets[0].data = trend.rates;
  chart.update();
}

function createNewInventoryChart(elementId, inventory) {
  const ctx = document.getElementById(elementId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: inventory.months,
      datasets: [
        {
          label: 'New Buildings Online',
          data: inventory.buildings,
          backgroundColor: 'rgba(74, 222, 128, 0.85)',
          borderRadius: 8,
          maxBarThickness: 28
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.parsed.y} building${context.parsed.y === 1 ? '' : 's'} online`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: getThemeToken('chartGrid') },
          ticks: {
            precision: 0,
            stepSize: 1
          }
        }
      }
    }
  });
}

function refreshNewInventoryChart(chart, inventory) {
  chart.data.labels = inventory.months;
  chart.data.datasets[0].data = inventory.buildings;
  chart.update();
}
