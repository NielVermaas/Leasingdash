const chartDefaults = {
  color: '#cbd5f5',
  font: {
    family: 'Inter, sans-serif',
    size: 12
  }
};

Chart.defaults.color = chartDefaults.color;
Chart.defaults.font.family = chartDefaults.font.family;
Chart.defaults.font.size = chartDefaults.font.size;
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.borderColor = 'rgba(148, 163, 208, 0.3)';

const monthlyTrendLabels = ['April', 'May', 'June', 'July', 'August', 'September'];

const rentCollection = {
  expected: [210000, 210000, 211000, 212000, 212000, 213000],
  actual: [204000, 206000, 208000, 205000, 207000, 209000]
};

const defaultRate = {
  paid: [110, 111, 112, 108, 109, 110],
  unpaid: [10, 9, 8, 12, 11, 10]
};

document.addEventListener('DOMContentLoaded', () => {
  const portfolioSize = 120;

  const monthProfiles = {
    '2024-05': {
      label: 'May 2024',
      pipeline: {
        applications: [
          4, 5, 5, 6, 5, 5, 7, 5, 4, 6, 5, 4, 5, 6, 4, 4, 5, 6, 5, 5, 4, 4, 5, 6, 5, 5, 4, 4, 6, 5, 4
        ],
        viewings: [
          3, 4, 4, 5, 4, 4, 5, 4, 3, 5, 4, 3, 4, 5, 3, 3, 4, 5, 4, 4, 3, 3, 4, 5, 4, 4, 3, 3, 5, 4, 3
        ],
        placements: [
          1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1
        ],
        noShows: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ]
      },
      supply: {
        vacancyUnits: 15,
        newUnits: 8
      },
      paymentDiscipline: {
        avgLateDays: 2.1,
        avgLeaseMonths: 23.0
      },
      paymentPunctuality: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        values: [44, 25, 13, 7, 5, 3, 1, 1, 0.5, 0.5]
      },
      insights: {
        highlights: [
          'May 7 led the pre-summer spike with 7 applications and 2 signed leases.',
          'Conversion held steady at 24.8% lead-to-placement despite heavier traffic.',
          'Vacancy trimmed to 12.5% with 8 units pre-leased before go-live.'
        ],
        focus: [
          'Tighten reminder cadence to reduce 30 scheduled no-shows.',
          'Prioritize make-ready on 15 available homes to capture Memorial Day demand.',
          'Upsell autopay to push average late days below 2.0.'
        ]
      }
    },
    '2024-06': {
      label: 'June 2024',
      pipeline: {
        applications: [
          5, 6, 6, 7, 6, 6, 8, 6, 5, 7, 6, 5, 6, 7, 5, 5, 6, 7, 6, 6, 5, 5, 6, 7, 6, 6, 5, 5, 7, 6
        ],
        viewings: [
          4, 5, 5, 6, 5, 5, 6, 5, 4, 6, 5, 4, 5, 6, 4, 4, 5, 6, 5, 5, 4, 4, 5, 6, 5, 5, 4, 4, 6, 5
        ],
        placements: [
          1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1
        ],
        noShows: [
          1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ]
      },
      supply: {
        vacancyUnits: 13,
        newUnits: 10
      },
      paymentDiscipline: {
        avgLateDays: 2.0,
        avgLeaseMonths: 23.3
      },
      paymentPunctuality: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        values: [47, 26, 12, 6, 4, 2, 1, 1, 0.5, 0.5]
      },
      insights: {
        highlights: [
          'June 7 delivered the strongest funnel with 8 applications and full attendance.',
          'Lead-to-viewing conversion rose to 82.7% as marketing refresh went live.',
          'Ten new units released mid-month kept inventory healthy at 10.8% vacancy.'
        ],
        focus: [
          'Manage higher no-show count (31) with text confirmations.',
          'Coordinate early showings for 10 incoming units to sustain momentum.',
          'Monitor weekend traffic—placements dip on Saturdays.'
        ]
      }
    },
    '2024-07': {
      label: 'July 2024',
      pipeline: {
        applications: [
          6, 7, 6, 8, 6, 7, 9, 6, 5, 8, 7, 5, 6, 8, 5, 6, 6, 7, 6, 7, 5, 6, 6, 8, 6, 6, 5, 6, 8, 7, 6
        ],
        viewings: [
          5, 6, 5, 7, 5, 6, 7, 5, 4, 6, 6, 4, 5, 7, 4, 5, 5, 6, 5, 6, 4, 5, 5, 7, 5, 5, 4, 5, 7, 6, 5
        ],
        placements: [
          1, 2, 1, 2, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 1
        ],
        noShows: [
          1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ]
      },
      supply: {
        vacancyUnits: 16,
        newUnits: 11
      },
      paymentDiscipline: {
        avgLateDays: 2.7,
        avgLeaseMonths: 23.4
      },
      paymentPunctuality: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        values: [43, 22, 14, 8, 5, 4, 1.5, 1, 0.5, 0.5]
      },
      insights: {
        highlights: [
          'July 7 peaked at 9 applications; double placements landed on multiple weekdays.',
          'Collections softened with 90.0% paid by the 5th, matching rent trend.',
          'Incoming supply climbed to 9.2% (11 units) ahead of renewal season.'
        ],
        focus: [
          'Address 33 no-shows by expanding virtual tours.',
          'Escalate outreach for July balances lagging past the 5th.',
          'Fast-track make-ready for 16 vacant homes to curb vacancy to 11%.'
        ]
      }
    },
    '2024-08': {
      label: 'August 2024',
      pipeline: {
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
      },
      supply: {
        vacancyUnits: 14,
        newUnits: 9
      },
      paymentDiscipline: {
        avgLateDays: 2.4,
        avgLeaseMonths: 23.5
      },
      paymentPunctuality: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        values: [46, 24, 12, 7, 5, 3, 1, 1, 0.5, 0.5]
      },
      insights: {
        highlights: [
          'August 7 repeated as the top lead day with 8 applications and 2 placements.',
          'Lead-to-placement conversion improved to 27.0%, highest of the summer.',
          'Collections rebounded to 97.6% of expected rent by the 5th.'
        ],
        focus: [
          'Target the 35 no-shows with Saturday reminders.',
          'Reduce vacancy (14 units) via pre-leasing on September availability.',
          'Expand autopay adoption to cut 2.4 average late days.'
        ]
      }
    }
  };

  const monthKeys = ['2024-05', '2024-06', '2024-07', '2024-08'];
  const defaultMonthKey = '2024-08';

  const createDayLabels = (count) => Array.from({ length: count }, (_, idx) => `${idx + 1}`);
  Object.values(monthProfiles).forEach((month) => {
    month.dailyLabels = createDayLabels(month.pipeline.applications.length);
  });

  const elements = {
    monthSelector: document.getElementById('monthSelector'),
    selectedMonthLabel: document.getElementById('selectedMonthLabel'),
    portfolioSizeValue: document.getElementById('portfolioSizeValue'),
    funnelValue: document.getElementById('funnelValue'),
    leadToViewingRate: document.getElementById('leadToViewingRate'),
    viewingToPlacementRate: document.getElementById('viewingToPlacementRate'),
    leadToPlacementRate: document.getElementById('leadToPlacementRate'),
    applicationsTotal: document.getElementById('applicationsTotal'),
    viewingsTotal: document.getElementById('viewingsTotal'),
    placementsTotal: document.getElementById('placementsTotal'),
    noShowRateValue: document.getElementById('noShowRateValue'),
    leadToPlacementSummary: document.getElementById('leadToPlacementSummary'),
    viewingToPlacementSummary: document.getElementById('viewingToPlacementSummary'),
    vacancyRateValue: document.getElementById('vacancyRateValue'),
    vacancyMeta: document.getElementById('vacancyMeta'),
    incomingRateValue: document.getElementById('incomingRateValue'),
    incomingMeta: document.getElementById('incomingMeta'),
    avgLateValue: document.getElementById('avgLateValue'),
    avgLeaseValue: document.getElementById('avgLeaseValue'),
    paymentPunctualitySubtitle: document.getElementById('paymentPunctualitySubtitle'),
    highlightsList: document.getElementById('highlightsList'),
    focusList: document.getElementById('focusList')
  };

  if (elements.portfolioSizeValue) {
    elements.portfolioSizeValue.textContent = portfolioSize.toLocaleString('en-US');
  }

  monthKeys.forEach((key) => {
    const profile = monthProfiles[key];
    if (!profile || !elements.monthSelector) return;
    const option = document.createElement('option');
    option.value = key;
    option.textContent = profile.label;
    elements.monthSelector.appendChild(option);
  });

  const initialKey = monthProfiles[defaultMonthKey] ? defaultMonthKey : monthKeys[0];
  const initialMonth = monthProfiles[initialKey];

  const dailyPipelineChart = renderDailyPipelineChart(initialMonth.dailyLabels, initialMonth.pipeline);
  const attendanceChart = renderAttendanceChart(initialMonth.dailyLabels, initialMonth.pipeline);
  renderRentCollectionChart(monthlyTrendLabels, rentCollection);
  renderDefaultRateChart(monthlyTrendLabels, defaultRate);
  const paymentPunctualityChart = renderPaymentPunctualityChart(
    initialMonth.paymentPunctuality.labels,
    initialMonth.paymentPunctuality.values
  );

  updateDashboard(initialKey);
  if (elements.monthSelector) {
    elements.monthSelector.value = initialKey;
    elements.monthSelector.addEventListener('change', (event) => {
      updateDashboard(event.target.value);
    });
  }

  function updateDashboard(key) {
    const monthData = monthProfiles[key];
    if (!monthData) return;

    const totals = calculateTotals(monthData.pipeline);
    const conversion = calculateConversion(totals);

    if (elements.selectedMonthLabel) {
      elements.selectedMonthLabel.textContent = monthData.label;
    }

    if (elements.funnelValue) {
      elements.funnelValue.textContent = `Applications ${formatCount(totals.applications)} → Viewings ${formatCount(
        totals.viewings
      )} → Placements ${formatCount(totals.placements)}`;
    }

    const leadToViewing = formatPercent(conversion.leadToViewing);
    const viewingToPlacement = formatPercent(conversion.viewingToPlacement);
    const leadToPlacement = formatPercent(conversion.leadToPlacement);
    const noShowRate = formatPercent(conversion.noShowRate);

    if (elements.leadToViewingRate) elements.leadToViewingRate.textContent = leadToViewing;
    if (elements.viewingToPlacementRate) elements.viewingToPlacementRate.textContent = viewingToPlacement;
    if (elements.leadToPlacementRate) elements.leadToPlacementRate.textContent = leadToPlacement;

    if (elements.applicationsTotal) elements.applicationsTotal.textContent = formatCount(totals.applications);
    if (elements.viewingsTotal) elements.viewingsTotal.textContent = formatCount(totals.viewings);
    if (elements.placementsTotal) elements.placementsTotal.textContent = formatCount(totals.placements);
    if (elements.noShowRateValue) elements.noShowRateValue.textContent = noShowRate;
    if (elements.leadToPlacementSummary) elements.leadToPlacementSummary.textContent = leadToPlacement;
    if (elements.viewingToPlacementSummary) elements.viewingToPlacementSummary.textContent = viewingToPlacement;

    const monthName = monthData.label.split(' ')[0];

    const vacancyUnits = monthData.supply.vacancyUnits;
    const vacancyRate = vacancyUnits / portfolioSize;
    if (elements.vacancyRateValue) elements.vacancyRateValue.textContent = formatPercent(vacancyRate);
    if (elements.vacancyMeta)
      elements.vacancyMeta.textContent = `${formatCount(vacancyUnits)} units available by ${monthName} 5th`;

    const incomingUnits = monthData.supply.newUnits;
    const incomingRate = incomingUnits / portfolioSize;
    if (elements.incomingRateValue) elements.incomingRateValue.textContent = formatPercent(incomingRate);
    if (elements.incomingMeta)
      elements.incomingMeta.textContent = `${formatCount(incomingUnits)} new units becoming available in ${monthName}`;

    if (elements.avgLateValue)
      elements.avgLateValue.textContent = `Avg. ${monthData.paymentDiscipline.avgLateDays.toFixed(1)} days late`;
    if (elements.avgLeaseValue)
      elements.avgLeaseValue.textContent = `Average lease duration: ${monthData.paymentDiscipline.avgLeaseMonths.toFixed(
        1
      )} months`;

    if (elements.paymentPunctualitySubtitle) {
      elements.paymentPunctualitySubtitle.textContent = `Share of monthly rent received each day (${monthData.label})`;
    }

    updateList(elements.highlightsList, monthData.insights.highlights);
    updateList(elements.focusList, monthData.insights.focus);

    dailyPipelineChart.data.labels = monthData.dailyLabels;
    dailyPipelineChart.data.datasets[0].data = monthData.pipeline.applications;
    dailyPipelineChart.data.datasets[1].data = monthData.pipeline.viewings;
    dailyPipelineChart.data.datasets[2].data = monthData.pipeline.placements;
    dailyPipelineChart.update();

    attendanceChart.data.labels = monthData.dailyLabels;
    attendanceChart.data.datasets[0].data = monthData.pipeline.viewings;
    attendanceChart.data.datasets[1].data = monthData.pipeline.noShows;
    attendanceChart.data.datasets[2].data = monthData.pipeline.placements;
    attendanceChart.update();

    const punctualityColors = monthData.paymentPunctuality.values.map((_, idx) =>
      idx < 5 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(148, 163, 208, 0.65)'
    );
    paymentPunctualityChart.data.labels = monthData.paymentPunctuality.labels;
    paymentPunctualityChart.data.datasets[0].data = monthData.paymentPunctuality.values;
    paymentPunctualityChart.data.datasets[0].backgroundColor = punctualityColors;
    paymentPunctualityChart.update();
  }
});

function calculateTotals(pipeline) {
  return {
    applications: sum(pipeline.applications),
    viewings: sum(pipeline.viewings),
    placements: sum(pipeline.placements),
    noShows: sum(pipeline.noShows)
  };
}

function calculateConversion(totals) {
  const scheduledViewings = totals.viewings + totals.noShows;
  return {
    leadToViewing: safeDivide(totals.viewings, totals.applications),
    viewingToPlacement: safeDivide(totals.placements, totals.viewings),
    leadToPlacement: safeDivide(totals.placements, totals.applications),
    noShowRate: safeDivide(totals.noShows, scheduledViewings)
  };
}

function renderDailyPipelineChart(labels, data) {
  const ctx = document.getElementById('dailyPipelineChart');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Applications',
          data: data.applications,
          backgroundColor: 'rgba(56, 189, 248, 0.8)',
          borderRadius: 6,
          maxBarThickness: 18
        },
        {
          label: 'Viewings',
          data: data.viewings,
          backgroundColor: 'rgba(125, 211, 252, 0.7)',
          borderRadius: 6,
          maxBarThickness: 18
        },
        {
          label: 'Placements',
          data: data.placements,
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
          grid: { color: 'rgba(148, 163, 208, 0.15)' }
        }
      }
    }
  });
}

function renderAttendanceChart(labels, data) {
  const ctx = document.getElementById('attendanceChart');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Viewings',
          data: data.viewings,
          backgroundColor: 'rgba(56, 189, 248, 0.75)',
          borderRadius: 6,
          maxBarThickness: 20
        },
        {
          label: 'No-Shows',
          data: data.noShows,
          backgroundColor: 'rgba(248, 113, 113, 0.8)',
          borderRadius: 6,
          maxBarThickness: 20
        },
        {
          label: 'Placements',
          data: data.placements,
          backgroundColor: 'rgba(74, 222, 128, 0.85)',
          borderRadius: 6,
          maxBarThickness: 20
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { maxRotation: 0 }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: 'rgba(148, 163, 208, 0.15)' }
        }
      }
    }
  });
}

function renderRentCollectionChart(labels, data) {
  const ctx = document.getElementById('rentCollectionChart');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Expected',
          data: data.expected,
          backgroundColor: 'rgba(148, 163, 208, 0.5)',
          borderRadius: 8,
          maxBarThickness: 26
        },
        {
          label: 'Actual',
          data: data.actual,
          backgroundColor: 'rgba(56, 189, 248, 0.8)',
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
          beginAtZero: false,
          grid: { color: 'rgba(148, 163, 208, 0.15)' },
          ticks: {
            callback(value) {
              return `$${(value / 1000).toLocaleString()}k`;
            }
          }
        }
      }
    }
  });
}

function renderDefaultRateChart(labels, data) {
  const ctx = document.getElementById('defaultRateChart');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Units Paid',
          data: data.paid,
          backgroundColor: 'rgba(74, 222, 128, 0.85)',
          borderRadius: 8,
          maxBarThickness: 26
        },
        {
          label: 'Units Unpaid',
          data: data.unpaid,
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
          grid: { color: 'rgba(148, 163, 208, 0.15)' }
        }
      }
    }
  });
}

function renderPaymentPunctualityChart(labels, values) {
  const ctx = document.getElementById('paymentPunctualityChart');
  const backgroundColor = values.map((_, idx) =>
    idx < 5 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(148, 163, 208, 0.65)'
  );
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '% of Rent Received',
          data: values,
          backgroundColor,
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
            color: '#94a3c1'
          }
        },
        y: {
          beginAtZero: true,
          max: 50,
          grid: { color: 'rgba(148, 163, 208, 0.15)' },
          title: {
            display: true,
            text: '% of Monthly Rent',
            color: '#94a3c1'
          }
        }
      }
    }
  });
}

function updateList(container, items) {
  if (!container) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    container.appendChild(li);
  });
}

function sum(values) {
  return values.reduce((acc, value) => acc + value, 0);
}

function safeDivide(numerator, denominator) {
  if (!denominator) return 0;
  return numerator / denominator;
}

function formatCount(value) {
  return value.toLocaleString('en-US');
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}
