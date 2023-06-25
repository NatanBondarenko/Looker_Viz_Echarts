looker.plugins.visualizations.add({
  id: 'my-google-pie-chart',
  label: 'My Google Pie Chart',
  options: {
    title: {
      label: 'Chart Title',
      type: 'string',
      default: 'My Chart',
    },
    dimension: {
      label: 'Dimension',
      section: 'Data',
      type: 'string',
    },
    measure: {
      label: 'Measure',
      section: 'Data',
      type: 'string',
    },
  },
  handleErrors: function (data, queryResponse) {
    return [];
  },
  create: function (element, config) {
    element.innerHTML = '<div id="myChart"></div>';
  },
  updateAsync: function (data, element, config, queryResponse, details, done) {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', config.dimension);
      dataTable.addColumn('number', config.measure);

      data.forEach(function (row) {
        var dimensionValue = row[config.dimension].value;
        var measureValue = parseFloat(row[config.measure].value);
        dataTable.addRow([dimensionValue, measureValue]);
      });

      var chart = new google.visualization.PieChart(element.querySelector('#myChart'));
      chart.draw(dataTable, {
        title: config.title,
      });

      done();
    }
  },
});
