const FALLBACK_COLORS = {
  accent1: 'rgba(66, 212, 142, 0.85)',
  accent2: 'rgba(12, 59, 46, 0.85)',
  accent3: 'rgba(214, 255, 92, 0.85)',
  accent4: 'rgba(202, 166, 255, 0.85)'
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

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

const rentVarianceLabelPlugin = {
  id: 'rentVarianceLabel',
  afterDatasetsDraw(chart, args, opts) {
    if (!chart || !chart.data?.datasets) {
      return;
    }

    const datasetIndex = chart.data.datasets.findIndex((dataset) => dataset?.isActualRent);
    if (datasetIndex === -1) {
      return;
    }

    const dataset = chart.data.datasets[datasetIndex];
    const varianceValues = dataset.varianceValues;
    if (!Array.isArray(varianceValues)) {
      return;
    }

    const meta = chart.getDatasetMeta(datasetIndex);
    if (!meta || meta.hidden) {
      return;
    }

    const ctx = chart.ctx;
    const fontSize = opts?.fontSize || Chart.defaults.font.size || 12;
    const fontFamily = Chart.defaults.font.family || 'Inter, sans-serif';
    const offset = typeof opts?.offset === 'number' ? opts.offset : 12;
    ctx.save();
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    meta.data.forEach((element, index) => {
      const variance = varianceValues[index];
      if (!Number.isFinite(variance)) {
        return;
      }
      const { x, y } = element.tooltipPosition();
      ctx.fillStyle = variance >= 0 ? getAccentColor(1, FALLBACK_COLORS.accent1) : getAccentColor(4, FALLBACK_COLORS.accent4);
      ctx.fillText(formatVarianceLabel(variance), x, y - offset);
    });

    ctx.restore();
  }
};

if (typeof Chart !== 'undefined') {
  Chart.register(rentVarianceLabelPlugin);
}

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

function getBufferedScaleMax(values, { multiplier = 1.1, minBuffer = 0, cap = null } = {}) {
  if (!Array.isArray(values) || values.length === 0) {
    return undefined;
  }
  const maxValue = Math.max(...values);
  if (!Number.isFinite(maxValue)) {
    return undefined;
  }
  let buffered = maxValue * multiplier;
  if (minBuffer > 0) {
    buffered = Math.max(buffered, maxValue + minBuffer);
  }
  if (cap !== null) {
    buffered = Math.min(buffered, cap);
  }
  return buffered;
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) {
    return currencyFormatter.format(0);
  }
  return currencyFormatter.format(value);
}

function formatPercentValue(value, decimals = 1) {
  if (!Number.isFinite(value)) {
    return '0%';
  }
  const factor = 10 ** decimals;
  const rounded = Math.round(value * factor) / factor;
  return `${rounded.toFixed(decimals)}%`;
}

function formatVarianceLabel(value) {
  if (!Number.isFinite(value)) {
    return '0.0%';
  }
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

function calculateRentVariancePercent(expected, actual) {
  return expected.map((expectedValue, index) => {
    const baseline = Number(expectedValue) || 0;
    const actualValue = Number(actual[index]) || 0;
    if (baseline === 0) {
      return 0;
    }
    const variance = ((actualValue - baseline) / baseline) * 100;
    return Math.round(variance * 10) / 10;
  });
}

function buildTimeframeKey(monthKey, year) {
  return `${year}-${monthKey}`;
}

function buildTimeframeIndex(scenarios) {
  return scenarios.reduce((map, scenario) => {
    const key = buildTimeframeKey(scenario.timeframe.monthKey, scenario.timeframe.year);
    map.set(key, scenario);
    return map;
  }, new Map());
}

function buildMonthsByYear(scenarios) {
  return scenarios.reduce((map, scenario) => {
    const { year, monthKey, monthLabel } = scenario.timeframe;
    if (!map.has(year)) {
      map.set(year, new Map());
    }
    const monthMap = map.get(year);
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, monthLabel);
    }
    return map;
  }, new Map());
}

function getFirstScenarioForYear(monthsByYear, timeframeIndex, year) {
  const monthMap = monthsByYear.get(year);
  if (!monthMap || monthMap.size === 0) {
    return null;
  }
  const [firstMonth] = Array.from(monthMap.keys()).sort((a, b) => Number(a) - Number(b));
  if (!firstMonth) {
    return null;
  }
  return timeframeIndex.get(buildTimeframeKey(firstMonth, year)) || null;
}

let currentThemeTokens = null;

document.addEventListener('DOMContentLoaded', () => {
  const state = { charts: {} };

  initializeTheme();

  const scenarios = buildScenarios();
  const scenarioList = Object.values(scenarios);
  const timeframeIndex = buildTimeframeIndex(scenarioList);
  const monthsByYear = buildMonthsByYear(scenarioList);

  const monthSelect = document.getElementById('monthSelect');
  const yearSelect = document.getElementById('yearSelect');

  const yearOptions = Array.from(monthsByYear.keys()).sort((a, b) => a - b);

  if (yearSelect) {
    yearSelect.innerHTML = '';
    yearOptions.forEach((year) => {
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = String(year);
      yearSelect.appendChild(option);
    });
  }

  const renderMonthOptions = (year, preferredMonth) => {
    if (!monthSelect) {
      return null;
    }
    const monthMap = monthsByYear.get(year);
    monthSelect.innerHTML = '';
    if (!monthMap || monthMap.size === 0) {
      return null;
    }
    const entries = Array.from(monthMap.entries()).sort((a, b) => Number(a[0]) - Number(b[0]));
    entries.forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      monthSelect.appendChild(option);
    });
    const selectedMonth =
      preferredMonth && monthMap.has(preferredMonth) ? preferredMonth : entries[0][0];
    monthSelect.value = selectedMonth;
    return selectedMonth;
  };

  const fallbackYear = yearOptions[0] ?? scenarioList[0]?.timeframe.year;
  if (yearSelect && fallbackYear !== undefined) {
    yearSelect.value = String(fallbackYear);
  }

  const initialMonth =
    fallbackYear !== undefined
      ? renderMonthOptions(
          fallbackYear,
          scenarioList.find((scenario) => scenario.timeframe.year === fallbackYear)?.timeframe
            .monthKey
        )
      : null;

  let activeScenario =
    (initialMonth !== null && fallbackYear !== undefined
      ? timeframeIndex.get(buildTimeframeKey(initialMonth, fallbackYear))
      : null) || scenarioList[0] || null;

  const applyScenario = (scenario) => {
    if (!scenario) {
      return;
    }
    activeScenario = scenario;
    if (monthSelect) {
      monthSelect.value = scenario.timeframe.monthKey;
    }
    if (yearSelect) {
      yearSelect.value = String(scenario.timeframe.year);
    }
    updateScenario(scenario, state);
  };

  applyScenario(activeScenario);

  if (monthSelect) {
    monthSelect.addEventListener('change', () => {
      const selectedMonth = monthSelect.value;
      const selectedYear =
        yearSelect && yearSelect.value
          ? Number(yearSelect.value)
          : activeScenario?.timeframe.year;
      if (Number.isNaN(selectedYear) || selectedYear === undefined) {
        return;
      }
      let scenario = timeframeIndex.get(buildTimeframeKey(selectedMonth, selectedYear));
      if (!scenario) {
        scenario =
          getFirstScenarioForYear(monthsByYear, timeframeIndex, selectedYear) || scenarioList[0] || null;
      }
      applyScenario(scenario);
    });
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      const year = Number(yearSelect.value);
      const preferredMonth =
        activeScenario && activeScenario.timeframe.year === year
          ? activeScenario.timeframe.monthKey
          : null;
      const monthKey = renderMonthOptions(year, preferredMonth) || preferredMonth;
      let scenario =
        (monthKey ? timeframeIndex.get(buildTimeframeKey(monthKey, year)) : null) ||
        getFirstScenarioForYear(monthsByYear, timeframeIndex, year) ||
        scenarioList[0] ||
        null;
      applyScenario(scenario);
    });
  }

  setupPrintMode(state);
});

function initializeTheme() {
  currentThemeTokens = captureThemeTokens();
  applyChartDefaults(currentThemeTokens);
}

function setupPrintMode(state) {
  if (typeof window === 'undefined') {
    return;
  }

  let printPaletteActive = false;

  const applyPrintPalette = () => {
    if (printPaletteActive) {
      return;
    }
    document.body.classList.add('print-mode');
    currentThemeTokens = captureThemeTokens();
    applyChartDefaults(currentThemeTokens);
    updateChartsTheme(state.charts);
    resizeCharts(state.charts);
    printPaletteActive = true;
  };

  const restorePalette = () => {
    if (!printPaletteActive) {
      return;
    }
    document.body.classList.remove('print-mode');
    currentThemeTokens = captureThemeTokens();
    applyChartDefaults(currentThemeTokens);
    updateChartsTheme(state.charts);
    resizeCharts(state.charts);
    printPaletteActive = false;
  };

  window.addEventListener('beforeprint', applyPrintPalette);
  window.addEventListener('afterprint', restorePalette);

  if (typeof window.matchMedia === 'function') {
    const mediaQueryList = window.matchMedia('print');
    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', (event) => {
        if (event.matches) {
          applyPrintPalette();
        } else {
          restorePalette();
        }
      });
    } else if (typeof mediaQueryList.addListener === 'function') {
      mediaQueryList.addListener((event) => {
        if (event.matches) {
          applyPrintPalette();
        } else {
          restorePalette();
        }
      });
    }
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
    textMuted: styles.getPropertyValue('--text-muted').trim(),
    chartAccent1: styles.getPropertyValue('--chart-accent-1').trim(),
    chartAccent2: styles.getPropertyValue('--chart-accent-2').trim(),
    chartAccent3: styles.getPropertyValue('--chart-accent-3').trim(),
    chartAccent4: styles.getPropertyValue('--chart-accent-4').trim()
  };
}

function getThemeToken(key) {
  return currentThemeTokens ? currentThemeTokens[key] : undefined;
}

function getAccentColor(index, fallback) {
  return getThemeToken(`chartAccent${index}`) || fallback;
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

function resizeCharts(charts) {
  Object.values(charts).forEach((chart) => {
    if (chart && typeof chart.resize === 'function') {
      chart.resize();
    }
  });
}

function buildScenarios() {
  return {
    'core-aug-2024': {
      optionLabel: 'Core Portfolio · Aug 2024',
      title: 'Residential Portfolio Dashboard',
      subtitle: 'August 2024 • Portfolio Size: 120 units',
      timeframe: {
        monthKey: '08',
        monthLabel: 'August',
        year: 2024
      },
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
        avgLeaseDuration: 23.5,
        leaseDetail: 'Current residents across 120-unit core portfolio'
      }
    },
    'core-jul-2024': {
      optionLabel: 'Core Portfolio · Jul 2024',
      title: 'Residential Portfolio Dashboard',
      subtitle: 'July 2024 • Portfolio Size: 120 units',
      timeframe: {
        monthKey: '07',
        monthLabel: 'July',
        year: 2024
      },
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
        avgLeaseDuration: 22.8,
        leaseDetail: 'Weighted across the 120-unit core portfolio'
      }
    },
    'core-sep-2024': {
      optionLabel: 'Core Portfolio · Sep 2024',
      title: 'Residential Portfolio Dashboard',
      subtitle: 'September 2024 • Portfolio Size: 120 units (projected)',
      timeframe: {
        monthKey: '09',
        monthLabel: 'September',
        year: 2024
      },
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
        avgLeaseDuration: 24.2,
        leaseDetail: 'Projected resident average for the 120-unit core portfolio'
      }
    },
    'urban-oct-2024': {
      optionLabel: 'Urban Lease-Up · Oct 2024',
      title: 'Urban Lease-Up Dashboard',
      subtitle: 'October 2024 • Portfolio Size: 95 units',
      timeframe: {
        monthKey: '10',
        monthLabel: 'October',
        year: 2024
      },
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
        label: 'October 2024 rent run',
        days: [...monthDayLabels],
        values: [...typicalPunctualityDistribution],
        dueWindowDays: 5
      },
      supply: {
        vacancyRate: 0.168,
        vacancyDetail: '16 units available by October 5th',
        incomingRate: 0.105,
        incomingDetail: '10 new units releasing in October',
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
        avgLeaseDuration: 15.4,
        leaseDetail: 'Current leases within the 95-unit urban asset'
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
  document.getElementById('paymentDetail').textContent = `Rent run: ${scenario.paymentPunctuality.label}`;
  document.getElementById('averageLeaseDuration').textContent = `${scenario.discipline.avgLeaseDuration.toFixed(1)} months`;
  document.getElementById('averageLeaseDetail').textContent =
    scenario.discipline.leaseDetail || 'Across current residents';

  document.getElementById('totalApplications').textContent = totals.applications.toString();
  document.getElementById('totalViewings').textContent = totals.viewings.toString();
  document.getElementById('totalPlacements').textContent = totals.placements.toString();
  document.getElementById('totalNoShowRate').textContent = formatPercent(noShowRate);
  document.getElementById('leadToPlacement').textContent = formatPercent(totals.placementRatio);
  document.getElementById('viewingToPlacement').textContent = formatPercent(totals.placementRatioFromViewings);
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
          backgroundColor: getAccentColor(1, FALLBACK_COLORS.accent1),
          borderRadius: 6,
          maxBarThickness: 18
        },
        {
          label: 'Viewings',
          data: dataset.viewings,
          backgroundColor: getAccentColor(2, FALLBACK_COLORS.accent2),
          borderRadius: 6,
          maxBarThickness: 18
        },
        {
          label: 'Placements',
          data: dataset.placements,
          backgroundColor: getAccentColor(3, FALLBACK_COLORS.accent3),
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
  chart.data.datasets[0].backgroundColor = getAccentColor(1, FALLBACK_COLORS.accent1);
  chart.data.datasets[1].data = dataset.viewings;
  chart.data.datasets[1].backgroundColor = getAccentColor(2, FALLBACK_COLORS.accent2);
  chart.data.datasets[2].data = dataset.placements;
  chart.data.datasets[2].backgroundColor = getAccentColor(3, FALLBACK_COLORS.accent3);
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
          backgroundColor: getAccentColor(1, FALLBACK_COLORS.accent1),
          borderRadius: 6,
          maxBarThickness: 20
        },
        {
          label: 'No-Shows',
          data: dataset.noShows,
          backgroundColor: getAccentColor(4, FALLBACK_COLORS.accent4),
          borderRadius: 6,
          maxBarThickness: 20
        },
        {
          label: 'Placements',
          data: dataset.placements,
          backgroundColor: getAccentColor(3, FALLBACK_COLORS.accent3),
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
  chart.data.datasets[0].backgroundColor = getAccentColor(1, FALLBACK_COLORS.accent1);
  chart.data.datasets[1].data = dataset.noShows;
  chart.data.datasets[1].backgroundColor = getAccentColor(4, FALLBACK_COLORS.accent4);
  chart.data.datasets[2].data = dataset.placements;
  chart.data.datasets[2].backgroundColor = getAccentColor(3, FALLBACK_COLORS.accent3);
  chart.update();
}

function createRentCollectionChart(elementId, rent) {
  const ctx = document.getElementById(elementId);
  const variancePercent = calculateRentVariancePercent(rent.expected, rent.actual);
  const rentCeiling = getBufferedScaleMax([...rent.expected, ...rent.actual], {
    multiplier: 1.12,
    minBuffer: 2000
  });

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rent.months,
      datasets: [
        {
          label: 'Total Contracted Rent',
          data: rent.expected,
          backgroundColor: getAccentColor(2, FALLBACK_COLORS.accent2),
          borderRadius: 8,
          maxBarThickness: 28
        },
        {
          label: 'Actual Rent',
          data: rent.actual,
          backgroundColor: getAccentColor(1, FALLBACK_COLORS.accent1),
          borderRadius: 8,
          maxBarThickness: 28,
          isActualRent: true,
          varianceValues: variancePercent
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        rentVarianceLabel: {
          offset: 14
        },
        tooltip: {
          callbacks: {
            label(context) {
              const valueLabel = formatCurrency(context.parsed.y);
              if (context.dataset.isActualRent) {
                const variance = context.dataset.varianceValues?.[context.dataIndex];
                if (Number.isFinite(variance)) {
                  return `${context.dataset.label}: ${valueLabel} (${formatVarianceLabel(variance)})`;
                }
              }
              return `${context.dataset.label}: ${valueLabel}`;
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
            callback: (value) => formatCurrency(value)
          },
          title: {
            display: true,
            text: 'Rent Collected by 5th (USD)',
            color: getThemeToken('axisTitle') || getThemeToken('chartText')
          },
          suggestedMax: rentCeiling
        }
      }
    }
  });
}

function refreshRentCollectionChart(chart, rent) {
  const variancePercent = calculateRentVariancePercent(rent.expected, rent.actual);
  const rentCeiling = getBufferedScaleMax([...rent.expected, ...rent.actual], {
    multiplier: 1.12,
    minBuffer: 2000
  });

  chart.data.labels = rent.months;
  chart.data.datasets[0].data = rent.expected;
  chart.data.datasets[0].backgroundColor = getAccentColor(2, FALLBACK_COLORS.accent2);
  chart.data.datasets[1].data = rent.actual;
  chart.data.datasets[1].backgroundColor = getAccentColor(1, FALLBACK_COLORS.accent1);
  chart.data.datasets[1].varianceValues = variancePercent;
  chart.data.datasets[1].isActualRent = true;
  chart.options.scales.y.ticks.callback = (value) => formatCurrency(value);
  chart.options.scales.y.suggestedMax = rentCeiling;
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
          backgroundColor: getAccentColor(1, FALLBACK_COLORS.accent1),
          borderRadius: 8,
          maxBarThickness: 26
        },
        {
          label: 'Units Unpaid',
          data: defaultRate.unpaid,
          backgroundColor: getAccentColor(4, FALLBACK_COLORS.accent4),
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
  chart.data.datasets[0].backgroundColor = getAccentColor(1, FALLBACK_COLORS.accent1);
  chart.data.datasets[1].data = defaultRate.unpaid;
  chart.data.datasets[1].backgroundColor = getAccentColor(4, FALLBACK_COLORS.accent4);
  chart.update();
}

function createPaymentPunctualityChart(elementId, punctuality) {
  const ctx = document.getElementById(elementId);
  document.getElementById('paymentPunctualityCaption').textContent = `This chart shows the share of monthly rent received each day during ${punctuality.label}.`;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: punctuality.days,
      datasets: [
        {
          label: '% of Rent Received',
          data: punctuality.values,
          backgroundColor: getAccentColor(1, FALLBACK_COLORS.accent1),
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
  document.getElementById('paymentPunctualityCaption').textContent = `This chart shows the share of monthly rent received each day during ${punctuality.label}.`;
  chart.data.labels = punctuality.days;
  chart.data.datasets[0].data = punctuality.values;
  chart.data.datasets[0].backgroundColor = getAccentColor(1, FALLBACK_COLORS.accent1);
  chart.update();
}

function createVacancyTrendChart(elementId, trend) {
  const ctx = document.getElementById(elementId);
  const suggestedMax = getBufferedScaleMax(trend.rates, {
    multiplier: 1.12,
    minBuffer: 0.02,
    cap: 1
  });
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: trend.months,
      datasets: [
        {
          label: 'Vacancy Rate',
          data: trend.rates,
          backgroundColor: getAccentColor(2, FALLBACK_COLORS.accent2),
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
          suggestedMax,
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
  chart.data.datasets[0].backgroundColor = getAccentColor(2, FALLBACK_COLORS.accent2);
  const suggestedMax = getBufferedScaleMax(trend.rates, {
    multiplier: 1.12,
    minBuffer: 0.02,
    cap: 1
  });
  if (suggestedMax !== undefined) {
    chart.options.scales.y.suggestedMax = suggestedMax;
  }
  chart.update();
}

function createNewInventoryChart(elementId, inventory) {
  const ctx = document.getElementById(elementId);
  const suggestedMax = getBufferedScaleMax(inventory.buildings, {
    multiplier: 1.15,
    minBuffer: 1
  });
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: inventory.months,
      datasets: [
        {
          label: 'New Buildings Online',
          data: inventory.buildings,
          backgroundColor: getAccentColor(1, FALLBACK_COLORS.accent1),
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
          suggestedMax,
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
  chart.data.datasets[0].backgroundColor = getAccentColor(1, FALLBACK_COLORS.accent1);
  const suggestedMax = getBufferedScaleMax(inventory.buildings, {
    multiplier: 1.15,
    minBuffer: 1
  });
  if (suggestedMax !== undefined) {
    chart.options.scales.y.suggestedMax = suggestedMax;
  }
  chart.update();
}
