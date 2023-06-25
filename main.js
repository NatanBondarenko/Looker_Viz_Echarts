looker.plugins.visualizations.add({
  id: 'my-google-chart',
  label: 'My Google Chart',
  options: {
    title: {
      label: 'Chart Title',
      type: 'string',
      default: 'My Chart',
    },
    chartType: {
      label: 'Chart Type',
      section: 'Style',
      type: 'string',
      display: 'select',
      values: [
        { 'PieChart': 'Pie Chart' },
        { 'BarChart': 'Bar Chart' },
      ],
      default: 'PieChart',
    },
  },
  handleErrors: function (data, queryResponse) {
    return [];
  },
  create: function (element, config) {
    element.innerHTML = '<style>script[src="https://www.gstatic.com/charts/loader.js"] { display: none !important; }</style><div id="myChart"></div>';
  },
  updateAsync: function (data, element, config, queryResponse, details, done) {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var dataTable = new google.visualization.DataTable();
      // Prepare your data here and populate the `dataTable` object

      var chart;
      if (config.chartType === 'PieChart') {
        chart = new google.visualization.PieChart(element.querySelector('#myChart'));
      } else if (config.chartType === 'BarChart') {
        chart = new google.visualization.BarChart(element.querySelector('#myChart'));
      }

      chart.draw(dataTable, {
        title: config.title,
      });

      done();
    }
  },
});
