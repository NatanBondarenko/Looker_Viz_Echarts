import { create, Doughnut } from 'chart.js';

looker.plugins.visualizations.add({
  create: function(element, config) {
    element.innerHTML = '<canvas id="doughnutChart" width="400" height="400"></canvas>';
  },
  update: function(data, element, config, queryResponse) {
    const canvas = element.querySelector('#doughnutChart');
    const ctx = canvas.getContext('2d');

    const chartData = {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: data.colors,
      }]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      // Add more options as needed for customization
    };

    const chart = new Doughnut(ctx, {
      data: chartData,
      options: chartOptions
    });
  }
});
