looker.plugins.visualizations.add({
  create: function(element, config) {
    // Initialize the visualization if required
  },

  updateAsync: function(data, element, config, queryResponse, details, done) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      // Ensure the data fits the requirements
      if (!handleErrors(this, queryResponse, { 
        min_pivots: 0, max_pivots: 0, 
        min_dimensions: 1, max_dimensions: 1, 
        min_measures: 1, max_measures: 99
      })) {
        return;
      }

      var dimension = queryResponse.fields.dimension_like[0].name;
      var measure_count = queryResponse.fields.measure_like.length;
      var x_label = queryResponse.fields.dimension_like[0].label_short;
      var series = [];
      var x = [];
      var all_series = [];

      for (let i = 0; i < measure_count; i++) {
        series[i] = {
          name: queryResponse.fields.measure_like[i].label,
          field_name: queryResponse.fields.measure_like[i].name,
          data: [],
          rendered_data: [],
          links: []
        };
      }

      for (let i = 0; i < data.length; i++) {
        x.push(data[i][dimension].value);
        for (let j = 0; j < measure_count; j++) {
          let datapoint = data[i][series[j].field_name];
          if (datapoint.links) {
            series[j].links.push(datapoint.links);
          }
          if (config.plot_null && !datapoint.value) {
            series[j].data.push([x[i], 0]);
            series[j].rendered_data.push([x[i], 0]);
          } else {
            series[j].data.push([x[i], datapoint.value]);
            series[j].rendered_data.push([x[i], datapoint.rendered]);
            all_series.push(datapoint.value);
          }
        }
      }

      var minX = Math.min(...all_series) * (1 - config.range_scale);
      var maxX = Math.max(...all_series) * (1 + config.range_scale);

      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', x_label);
      for (let i = 0; i < measure_count; i++) {
        dataTable.addColumn('number', series[i].name);
      }
      dataTable.addRows(x.length);
      for (let i = 0; i < x.length; i++) {
        dataTable.setValue(i, 0, x[i]);
        for (let j = 0; j < measure_count; j++) {
          dataTable.setValue(i, j + 1, series[j].data[i][1]);
        }
      }

      var options = {
        colors: config.color_range,
        title: null,
        legend: { position: config.show_legend ? 'top' : 'none' },
        tooltip: { isHtml: true },
        hAxis: { title: config.x_axis_label },
        vAxis: { title: config.y_axis_label, viewWindow: { min: minX, max: maxX } },
        pointShape: config.point_style === 'none' ? 'circle' : config.point_style,
        pointSize: 6,
        series: {
          0: { pointShape: config.point_style === 'none' ? 'circle' : config.point_style }
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('vis'));
      chart.draw(dataTable, options);

      google.visualization.events.addListener(chart, 'click', function(e) {
        if (series[e.row].links.length) {
          LookerCharts.Utils.openDrillMenu({
            links: series[e.row].links[e.column - 1],
            event: e
          });
        }
      });

      done();
    }
  }
});
