const chartInstances = {};

const dashboardVersions = {
  'august-2024': {
    id: 'august-2024',
    displayName: 'August 2024',
    portfolioSize: 120,
    supply: {
      vacancyRate: 11.7,
      units: 14,
      asOf: 'August 5th',
      incomingRate: 7.5,
      incomingUnits: 9,
      incomingMonth: 'August'
    },
    paymentDiscipline: {
      avgLate: 2.4,
      leaseDuration: 23.5
    },
    daily: {
      labels: Array.from({ length: 31 }, (_, idx) => `${idx + 1}`),
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
    rentCollection: {
      labels: ['April', 'May', 'June', 'July', 'August', 'September'],
      expected: [210000, 210000, 211000, 212000, 212000, 213000],
      actual: [204000, 206000, 208000, 205000, 207000, 209000]
    },
    defaultRate: {
      labels: ['April', 'May', 'June', 'July', 'August', 'September'],
      paid: [110, 111, 112, 108, 109, 110],
      unpaid: [10, 9, 8, 12, 11, 10]
    },
    paymentPunctuality: {
      period: 'September 2024',
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      values: [46, 24, 12, 7, 5, 3, 1, 1, 0.5, 0.5]
    },
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
  },
  'july-2024': {
    id: 'july-2024',
    displayName: 'July 2024',
    portfolioSize: 120,
    supply: {
      vacancyRate: 9.2,
      units: 11,
      asOf: 'July 5th',
      incomingRate: 6.5,
      incomingUnits: 8,
      incomingMonth: 'July'
    },
    paymentDiscipline: {
      avgLate: 2.1,
      leaseDuration: 23.0
    },
    daily: {
      labels: Array.from({ length: 31 }, (_, idx) => `${idx + 1}`),
      applications: [
        6, 5, 5, 6, 6, 7, 7, 6, 5, 6, 5, 6, 6, 6, 5, 6, 6, 6, 5, 6, 5, 5, 6, 6, 5, 6, 5, 5, 6, 6, 5
      ],
      viewings: [
        5, 4, 4, 5, 5, 6, 6, 5, 4, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 4, 4, 5, 5, 4, 5, 4, 4, 5, 5, 4
      ],
      placements: [
        2, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 2, 1
      ],
      noShows: [
        1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
      ]
    },
    rentCollection: {
      labels: ['March', 'April', 'May', 'June', 'July', 'August'],
      expected: [208000, 209000, 210000, 211000, 211000, 212000],
      actual: [202000, 204000, 206000, 207000, 205000, 206000]
    },
    defaultRate: {
      labels: ['March', 'April', 'May', 'June', 'July', 'August'],
      paid: [109, 110, 111, 112, 108, 109],
      unpaid: [11, 10, 9, 8, 12, 11]
    },
    paymentPunctuality: {
      period: 'August 2024',
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      values: [44, 23, 13, 7, 5, 3, 2, 1, 1, 1]
    },
    highlights: [
      'Early July weekends delivered 7 applications per day with strong follow-through.',
      'Lead-to-placement conversion held near 29% despite heavier volume weeks.',
      'Rent collected by July 5th reached 97.2% of billings.'
    ],
    focus: [
      'Reallocate showings toward midweek evenings to curb persistent no-shows.',
      'Keep autopay campaigns live to protect sub-2 day average lateness.',
      'Coordinate pre-leasing on 8 incoming homes to lock fall move-ins.'
    ]
  },
  'june-2024': {
    id: 'june-2024',
    displayName: 'June 2024',
    portfolioSize: 118,
    supply: {
      vacancyRate: 10.5,
      units: 13,
      asOf: 'June 5th',
      incomingRate: 5.0,
      incomingUnits: 6,
      incomingMonth: 'June'
    },
    paymentDiscipline: {
      avgLate: 2.7,
      leaseDuration: 22.8
    },
    daily: {
      labels: Array.from({ length: 30 }, (_, idx) => `${idx + 1}`),
      applications: [
        5, 5, 4, 5, 5, 5, 6, 5, 4, 5, 5, 4, 5, 5, 4, 5, 5, 5, 4, 5, 4, 5, 5, 5, 4, 5, 4, 4, 5, 5
      ],
      viewings: [
        4, 4, 3, 4, 4, 4, 5, 4, 3, 4, 4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 3, 4, 4, 4, 3, 4, 3, 3, 4, 4
      ],
      placements: [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
      ],
      noShows: [
        1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
      ]
    },
    rentCollection: {
      labels: ['February', 'March', 'April', 'May', 'June', 'July'],
      expected: [207000, 208000, 209000, 210000, 210000, 211000],
      actual: [201000, 203000, 204000, 206000, 207000, 205000]
    },
    defaultRate: {
      labels: ['February', 'March', 'April', 'May', 'June', 'July'],
      paid: [108, 109, 110, 111, 109, 108],
      unpaid: [12, 11, 10, 9, 11, 12]
    },
    paymentPunctuality: {
      period: 'July 2024',
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      values: [42, 22, 12, 8, 6, 4, 2, 1, 1, 2]
    },
    highlights: [
      'Application pace steadied at 5 per day while keeping show rates above 78%.',
      'Collections through June 5th improved two points over spring performance.',
      'Default recovery held near 90% despite a bump in aged balances.'
    ],
    focus: [
      'Target make-ready scheduling to move 6 incoming units faster.',
      'Expand reminder cadence between the 2nd–4th to trim late spikes.',
      'Track renewals closely as the average lease age dips below 23 months.'
    ]
  },
  'may-2024': {
    id: 'may-2024',
    displayName: 'May 2024',
    portfolioSize: 116,
    supply: {
      vacancyRate: 12.0,
      units: 14,
      asOf: 'May 5th',
      incomingRate: 4.5,
      incomingUnits: 5,
      incomingMonth: 'May'
    },
    paymentDiscipline: {
      avgLate: 3.0,
      leaseDuration: 22.4
    },
    daily: {
      labels: Array.from({ length: 31 }, (_, idx) => `${idx + 1}`),
      applications: [
        4, 5, 4, 5, 4, 5, 6, 4, 4, 5, 5, 4, 5, 5, 4, 4, 5, 5, 4, 5, 4, 4, 5, 5, 4, 5, 4, 4, 5, 5, 4
      ],
      viewings: [
        3, 4, 3, 4, 3, 4, 5, 3, 3, 4, 4, 3, 4, 4, 3, 3, 4, 4, 3, 4, 3, 3, 4, 4, 3, 4, 3, 3, 4, 4, 3
      ],
      placements: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
      ],
      noShows: [
        1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
      ]
    },
    rentCollection: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      expected: [206000, 207000, 208000, 209000, 209000, 210000],
      actual: [200000, 201000, 203000, 204000, 205000, 206000]
    },
    defaultRate: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      paid: [107, 108, 109, 110, 108, 109],
      unpaid: [13, 12, 11, 10, 12, 11]
    },
    paymentPunctuality: {
      period: 'June 2024',
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      values: [40, 21, 13, 8, 6, 5, 3, 2, 1, 1]
    },
    highlights: [
      'Leads grew steadily through May with weekend campaigns producing 6 applications.',
      'Viewing-to-placement conversion hovered near 30% as renewal traffic picked up.',
      'Collections through May 5th held at 98% after back-to-back outreach pushes.'
    ],
    focus: [
      'Trim vacancy from 12% by accelerating turns on 14 ready units.',
      'Build nurture journeys to pull prospects from inquiry to viewing faster.',
      'Monitor aging balances as punctuality tails off after the 6th of the month.'
    ]
  }
};

const orderedVersions = ['august-2024', 'july-2024', 'june-2024', 'may-2024'];

Chart.defaults.color = '#cbd5f5';
Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.borderColor = 'rgba(148, 163, 208, 0.3)';

window.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('versionSelector');
  if (!selector) return;

  selector.innerHTML = '';

  orderedVersions.forEach((id, index) => {
    const version = dashboardVersions[id];
    if (!version) return;
    const option = document.createElement('option');
    option.value = version.id;
    option.textContent = version.displayName;
    if (index === 0) {
      option.selected = true;
    }
    selector.append(option);
  });

  selector.addEventListener('change', (event) => {
    renderDashboard(event.target.value);
  });

  renderDashboard(selector.value || orderedVersions[0]);
});

function renderDashboard(versionId) {
  const data = dashboardVersions[versionId];
  if (!data) {
    return;
  }

  const totals = calculateTotals(data.daily);

  updateTextContent('selectedMonth', data.displayName);
  updateTextContent('portfolioSize', data.portfolioSize.toLocaleString());
  updateTextContent(
    'funnelCounts',
    `Applications ${formatNumber(totals.applications)} → Viewings ${formatNumber(totals.viewings)} → Placements ${formatNumber(
      totals.placements
    )}`
  );
  updateHTML(
    'funnelConversion',
    `Lead to Viewing: ${formatRate(totals.leadToViewing)} &nbsp;|&nbsp; Viewing to Placement: ${formatRate(
      totals.viewingToPlacement
    )} &nbsp;|&nbsp; Lead to Placement: ${formatRate(totals.leadToPlacement)}`
  );

  updateTextContent('vacancyRate', `${data.supply.vacancyRate.toFixed(1)}%`);
  updateTextContent('vacancyMeta', `${data.supply.units} units available by ${data.supply.asOf}`);
  updateTextContent('incomingRate', `${data.supply.incomingRate.toFixed(1)}%`);
  updateTextContent('incomingMeta', `${data.supply.incomingUnits} new units becoming available in ${data.supply.incomingMonth}`);

  updateTextContent('avgLate', `Avg. ${data.paymentDiscipline.avgLate.toFixed(1)} days late`);
  updateTextContent('leaseDuration', `Average lease duration: ${data.paymentDiscipline.leaseDuration.toFixed(1)} months`);

  updateTextContent('totalApplications', formatNumber(totals.applications));
  updateTextContent('totalViewings', formatNumber(totals.viewings));
  updateTextContent('totalPlacements', formatNumber(totals.placements));
  updateTextContent('totalNoShowRate', formatRate(totals.noShowRate));
  updateTextContent('totalLeadPlacement', formatRate(totals.leadToPlacement));
  updateTextContent('totalViewingPlacement', formatRate(totals.viewingToPlacement));

  populateList('highlightList', data.highlights);
  populateList('focusList', data.focus);

  updateTextContent('paymentPeriodLabel', data.paymentPunctuality.period);

  updateDailyPipelineChart(data.daily.labels, data.daily);
  updateAttendanceChart(data.daily.labels, data.daily);
  updateRentCollectionChart(data.rentCollection.labels, data.rentCollection);
  updateDefaultRateChart(data.defaultRate.labels, data.defaultRate);
  updatePaymentPunctualityChart(data.paymentPunctuality.labels, data.paymentPunctuality.values);
}

function calculateTotals(daily) {
  const applications = sum(daily.applications);
  const viewings = sum(daily.viewings);
  const placements = sum(daily.placements);
  const noShows = sum(daily.noShows);
  const scheduled = viewings + noShows;

  return {
    applications,
    viewings,
    placements,
    noShows,
    leadToViewing: applications ? (viewings / applications) * 100 : 0,
    leadToPlacement: applications ? (placements / applications) * 100 : 0,
    viewingToPlacement: viewings ? (placements / viewings) * 100 : 0,
    noShowRate: scheduled ? (noShows / scheduled) * 100 : 0
  };
}

function updateDailyPipelineChart(labels, daily) {
  const ctx = document.getElementById('dailyPipelineChart');
  if (!ctx) return;

  if (!chartInstances.dailyPipeline) {
    chartInstances.dailyPipeline = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Applications',
            data: daily.applications,
            backgroundColor: 'rgba(56, 189, 248, 0.8)',
            borderRadius: 6,
            maxBarThickness: 18
          },
          {
            label: 'Viewings',
            data: daily.viewings,
            backgroundColor: 'rgba(125, 211, 252, 0.7)',
            borderRadius: 6,
            maxBarThickness: 18
          },
          {
            label: 'Placements',
            data: daily.placements,
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
    return;
  }

  const chart = chartInstances.dailyPipeline;
  chart.data.labels = labels;
  chart.data.datasets[0].data = daily.applications;
  chart.data.datasets[1].data = daily.viewings;
  chart.data.datasets[2].data = daily.placements;
  chart.update();
}

function updateAttendanceChart(labels, daily) {
  const ctx = document.getElementById('attendanceChart');
  if (!ctx) return;

  if (!chartInstances.attendance) {
    chartInstances.attendance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Viewings',
            data: daily.viewings,
            backgroundColor: 'rgba(56, 189, 248, 0.75)',
            borderRadius: 6,
            maxBarThickness: 20
          },
          {
            label: 'No-Shows',
            data: daily.noShows,
            backgroundColor: 'rgba(248, 113, 113, 0.8)',
            borderRadius: 6,
            maxBarThickness: 20
          },
          {
            label: 'Placements',
            data: daily.placements,
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
    return;
  }

  const chart = chartInstances.attendance;
  chart.data.labels = labels;
  chart.data.datasets[0].data = daily.viewings;
  chart.data.datasets[1].data = daily.noShows;
  chart.data.datasets[2].data = daily.placements;
  chart.update();
}

function updateRentCollectionChart(labels, rentCollection) {
  const ctx = document.getElementById('rentCollectionChart');
  if (!ctx) return;

  if (!chartInstances.rentCollection) {
    chartInstances.rentCollection = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Expected',
            data: rentCollection.expected,
            backgroundColor: 'rgba(148, 163, 208, 0.5)',
            borderRadius: 8,
            maxBarThickness: 26
          },
          {
            label: 'Actual',
            data: rentCollection.actual,
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
    return;
  }

  const chart = chartInstances.rentCollection;
  chart.data.labels = labels;
  chart.data.datasets[0].data = rentCollection.expected;
  chart.data.datasets[1].data = rentCollection.actual;
  chart.update();
}

function updateDefaultRateChart(labels, defaultRate) {
  const ctx = document.getElementById('defaultRateChart');
  if (!ctx) return;

  if (!chartInstances.defaultRate) {
    chartInstances.defaultRate = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
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
            grid: { color: 'rgba(148, 163, 208, 0.15)' }
          }
        }
      }
    });
    return;
  }

  const chart = chartInstances.defaultRate;
  chart.data.labels = labels;
  chart.data.datasets[0].data = defaultRate.paid;
  chart.data.datasets[1].data = defaultRate.unpaid;
  chart.update();
}

function updatePaymentPunctualityChart(labels, values) {
  const ctx = document.getElementById('paymentPunctualityChart');
  if (!ctx) return;

  const colors = values.map((_, idx) => (idx < 5 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(148, 163, 208, 0.65)'));

  if (!chartInstances.paymentPunctuality) {
    chartInstances.paymentPunctuality = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '% of Rent Received',
            data: values,
            backgroundColor: colors,
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
    return;
  }

  const chart = chartInstances.paymentPunctuality;
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  chart.data.datasets[0].backgroundColor = colors;
  chart.update();
}

function populateList(elementId, items) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    container.append(li);
  });
}

function updateTextContent(id, value) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = value;
}

function updateHTML(id, value) {
  const element = document.getElementById(id);
  if (!element) return;
  element.innerHTML = value;
}

function formatRate(value) {
  return `${value.toFixed(1)}%`;
}

function formatNumber(value) {
  return value.toLocaleString();
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}
