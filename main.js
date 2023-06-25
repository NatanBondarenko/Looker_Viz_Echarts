import { Visualization } from '@looker/visualization-api';

const vis = {
  id: 'my-google-pie-chart',
  label: 'My Google Pie Chart',
  options: {
    title: {
      label: 'Chart Title',
      type: 'string',
      default: 'World Wide Wine Production',
    },
  },
  handleErrors: function (data, queryResponse) {
    return [];
  },
  create: function (element, config) {
    element.innerHTML = '<div id="myChart" style="width:100%; max-width:600px; height:500px;"></div>';
  },
  updateAsync: function (data, element, config, queryResponse, details, done) {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', 'Country');
      dataTable.addColumn('number', 'Mhl');

      data.forEach(function (row) {
        var countryValue = row[0].value; // Assuming the first column in the data table represents the country
        var mhlValue = parseFloat(row[1].value); // Assuming the second column in the data table represents the Mhl value
        dataTable.addRow([countryValue, mhlValue]);
      });

      var options = {
        title: config.title,
      };

      var chart = new google.visualization.BarChart(element.querySelector('#myChart'));
      chart.draw(dataTable, options);

      done();
    }
  },
};

const googlePieChart = new Visualization(vis);
