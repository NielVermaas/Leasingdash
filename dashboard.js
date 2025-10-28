document.addEventListener('DOMContentLoaded', () => {
  const monthlyLabels = [
    'April',
    'May',
    'June',
    'July',
    'August',
    'September'
  ];

  const dailyLabels = Array.from({ length: 31 }, (_, idx) => `${idx + 1}`);

  const pipelineData = {
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

  const rentCollection = {
    expected: [210000, 210000, 211000, 212000, 212000, 213000],
    actual: [204000, 206000, 208000, 205000, 207000, 209000]
  };

  const defaultRate = {
    paid: [110, 111, 112, 108, 109, 110],
    unpaid: [10, 9, 8, 12, 11, 10]
  };

  const paymentPunctuality = [46, 24, 12, 7, 5, 3, 1, 1, 0.5, 0.5];

  renderDailyPipelineChart(dailyLabels, pipelineData);
  renderAttendanceChart(dailyLabels, pipelineData);
  renderRentCollectionChart(monthlyLabels, rentCollection);
  renderDefaultRateChart(monthlyLabels, defaultRate);
  renderPaymentPunctualityChart(paymentPunctuality);
});

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

function renderDailyPipelineChart(labels, data) {
  const ctx = document.getElementById('dailyPipelineChart');
  new Chart(ctx, {
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
  new Chart(ctx, {
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
  new Chart(ctx, {
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
  new Chart(ctx, {
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

function renderPaymentPunctualityChart(data) {
  const ctx = document.getElementById('paymentPunctualityChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [
        {
          label: '% of Rent Received',
          data,
          backgroundColor: data.map((value, idx) =>
            idx < 5 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(148, 163, 208, 0.65)'
          ),
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
