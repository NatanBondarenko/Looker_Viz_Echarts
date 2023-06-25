import { Visualization, LookerCharts } from '@looker/looker-charts';
import { select } from 'd3-selection';
import Chart from 'chart.js';

export default class DoughnutChart extends Visualization {
  constructor(element, config, queryResponse) {
    super(element, config, queryResponse);
  }

  async initialize() {
    await super.initialize();
    this.element.innerHTML = '<canvas id="doughnutChart" width="400" height="400"></canvas>';
  }

  async updateAsync(data, element, config, queryResponse) {
    const labels = data.fields.dimension[0].data.map(row => row.formattedValue);
    const values = data.fields.measure[0].data.map(row => row.value);

    const chartData = {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)'],
      }]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    const canvas = select('#doughnutChart');
    const ctx = canvas.node().getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions
    });

    this.done();
  }
}

looker.plugins.visualizations.add(DoughnutChart);
