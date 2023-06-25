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
    cssFile: {
      label: 'CSS File URL or Path',
      type: 'string',
      default: '',
    },
    googleChartsFile: {
      label: 'Google Charts Library URL or Path',
      type: 'string',
      default: '',
    },
  },
  handleErrors: function (data, queryResponse) {
    return [];
  },
  create: function (element, config) {
    if (config.cssFile) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = config.cssFile;
      element.appendChild(link);
    }

    if (config.googleChartsFile) {
      var script = document.createElement('script');
      script.src = config.googleChartsFile;
      script.onload = function () {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);
      };
      element.appendChild(script);
    } else {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(drawChart);
    }

    function drawChart() {
      var dataTable = new google.visualization.DataTable();

      // Get the dimensions from Looker data table
      var dimensions = data.fields.dimension_like;
      dimensions.forEach(function (dimension) {
        dataTable.addColumn('string', dimension.label);
      });

      // Get the measures from Looker data table
      var measures = data.fields.measure_like;
      measures.forEach(function (measure) {
        dataTable.addColumn('number', measure.label);
      });

      // Populate the data rows
      data.forEach(function (row) {
        var dataRow = [];
        dimensions.forEach(function (dimension) {
          dataRow.push(row[dimension.name].value);
        });
        measures.forEach(function (measure) {
          dataRow.push(row[measure.name].value);
        });
        dataTable.addRow(dataRow);
      });

      var chart;
      if (config.chartType === 'PieChart') {
        chart = new google.visualization.PieChart(element.querySelector('#myChart'));
      } else if (config.chartType === 'BarChart') {
        chart = new google.visualization.BarChart(element.querySelector('#myChart'));
      }

      chart.draw(dataTable, {
        title: config.title,
      });
    }
  },
});
