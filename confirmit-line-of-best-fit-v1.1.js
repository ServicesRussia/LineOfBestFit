
var j=jQuery.noConflict();

//setTimeout(function() { 
   
    var label = [], x = [], y = [];

    // Get labels from RegressionTable
    j('.RegressionTable:eq(0) tbody tr td:first-child').each(function() {
        label.push(j(this).html());
    });

    // Get average (x coordinates) from RegressionTable
    j('.RegressionTable:eq(0) tbody td.TableDataCell:even').each(function() {
        x.push(parseFloat(j(this).html()));
    });

    // Get standard deviation (y coordinates) from RegressionTable
    j('.RegressionTable:eq(0) tbody td.TableDataCell:odd').each(function() {
        y.push(parseFloat(j(this).html()));
    });

    //console.log(label+'    '+x+'    '+y);

    var len = label.length;

    // Set points coordinates of xy scatter plot
    var coord = [];
    for (var i = 0; i < len; i++) 
        coord.push([x[i], y[i]]); 

    // Set xy plot dots series
    var series = [];
    for (var i = 0; i < len; i++) 
        series.push({
            type: 'scatter',
            name: label[i],
            data: [[x[i], y[i]]]
        }
    );

    /*** Calculate line of best fit equation - see http://hotmath.com/hotmath_help/topics/line-of-best-fit.html ***/

    // Function to get average of numbers array
    function mean(numbers) {
        var total = 0, i;
        for (i = 0; i < numbers.length; i++) 
            total += numbers[i];
        return parseFloat((total / numbers.length).toFixed(2));
    }

    // Get average of x and y coordinates
    var avg_x = mean(x);
    var avg_y = mean(y);
    
    //console.log('avg_x='+avg_x+' avg_y='+avg_y);

    function sum(numbers) {
        var total = 0, i;
        for (i = 0; i < numbers.length; i++) 
            total += numbers[i];
        return total;
    }

    // Calculate the slope of the line of best fit - m
    var xy = 0, x2 = 0, m = 0;
    for(var i=0; i < len; i++ )     {
       xy += (x[i] - avg_x)*(y[i] - avg_y);
       x2 += (x[i] - avg_x)*(x[i] - avg_x); 
    }
    m = parseFloat((xy / x2).toFixed(2));

    //console.log('xy='+xy+' x^2='+x2+' slope m='+m); 

    // Compute the y-intercept of the line - b
    var b = parseFloat((avg_y - m*avg_x).toFixed(2));

    //console.log('b='+b);

    // Sorting function - ascending order
    function compare(a, b) {
      if (a < b)
        return -1;
      else if (a > b)
        return 1;
      else 
        return 0;
    }

    x.sort(compare);
    y.sort(compare);
    
    // Get minimum, maximum and mean of x and y coordinates
    var x_min = x[0];
    var x_max = x[x.length-1]; 
    var y_min = y[0];
    var y_max = y[y.length-1]; 

    console.log('x_max='+x_max+' y_max='+y_max);

    var mean_x = mean([x_min, x_max]);
    var mean_y = mean([y_min, y_max]);

    //console.log('mean_x='+mean_x+' mean_y='+mean_y);

    // Set 2 points of line of best fit 
    var regr = [];
    regr.push([x_min, m*x_min+b]); 
    regr.push([x_max, m*x_max+b]);

    //console.log(regr); 
  
    // Add seria for lone of the best fit
    series.push( {
        type: 'line',
        name: 'Regression Line: y='+m+'x+'+b,
        data: regr,
        color: '#FF0000',
        marker: {
            enabled: false
        },
        states: {
            hover: {
                lineWidth: 0
            }
        },
        enableMouseTracking: false,
        dataLabels: { enabled: false }
    }); 

    j(function () {
        j('#container').highcharts({

            title: {
                text: 'Line of Best Fit'
            },

            subtitle: {
               text: 'Least Square Method'
            },

            chart: {
                plotBorderColor: '#ddd',
                plotBorderWidth: 1
            },

            xAxis: {
                title: {
                    enabled: true,
                    text: 'Overall client service (mean)'
                },
                lineColor: '#ddd',
                startOnTick: true,
                endOnTick: true,
                plotLines: [{
                    color: '#ddd',
                    width: 1,
                    value: mean_x
                }],
                tickLength: 0
            },

            yAxis: {
                title: {
                    text: 'Consistency of overall client service (standard deviation)'
                },
                lineColor: '#ddd',
                gridLineWidth: 0, 
                plotLines: [{
                    color: '#ddd',
                    width: 1,
                    value: mean_y
                }]
            },

            legend: {
                borderWidth: 1,
                itemStyle: '{"color": "#555", "fontSize": "12px", "fontWeight": "normal"}',
            },

            plotOptions: {            
                series: {
                    dataLabels: {
                        enabled: true,
                        style: '{"color": "#555", "fontSize": "12px", "fontWeight": "normal"}',
                        format: '{series.name}',
                        x: 2,
                        y: -2
                    },
                }, 
                scatter: {
                    marker: {
                        symbol: 'circle',
                        radius: 5
                    }

                }
            },

            series: series,

            credits: false

        });   
    });

//},2000);
