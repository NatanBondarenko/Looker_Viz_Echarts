import * as Chart from 'chart.js';

looker.plugins.visualizations.add({
  options: {
    my_option: {
      type: 'string',
      label: 'My Option',
      default: 'Default Value',
    },
  },
  create: function(element, config) {
    element.innerHTML = '<canvas id="doughnutChart" width="400" height="400"></canvas>';
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    const canvas = element.querySelector('#doughnutChart');
    const ctx = canvas.getContext('2d');

    const chartData = {
      labels: data.fields.dimensions[0].values,
      datasets: [
        {
          data: data.fields.measure_like[0].value,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      // Add more options as needed for customization
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions,
    });

    done();
  },
});
