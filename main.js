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
    var dimensionIndex = queryResponse.fields.dimensions.findIndex(function (field) {
      return field.name === config.dimension;
    });
    var measureIndex = queryResponse.fields.measures.findIndex(function (field) {
      return field.name === config.measure;
    });

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', config.dimension);
    dataTable.addColumn('number', config.measure);

    data.forEach(function (row) {
      var dimensionValue = row[dimensionIndex].rendered || row[dimensionIndex].value;
      var measureValue = parseFloat(row[measureIndex].value);
      dataTable.addRow([dimensionValue, measureValue]);
    });

    var chart = new google.visualization.PieChart(element.querySelector('#myChart'));
    chart.draw(dataTable, {
      title: config.title,
    });

    done();
  },
});
