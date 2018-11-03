﻿var BlazorCharts = [];

Blazor.BlazorCharts = BlazorCharts;
window.ChartJSInterop = {
    InitializeChart: function(config) {
        if (!BlazorCharts.find(currentChart => currentChart.id === config.canvasId)) {
            let thisChart = initializeChartjsChart2(config);
            BlazorCharts.push({ id: config.canvasId, chart: thisChart });
        }

        return true;
    },

    ReloadChart: function(config) {
        if (!BlazorCharts.find(currentChart => currentChart.id === config.canvasId))
            throw `Could not find a chart with the given id. ${config.canvasId}`;

        let myChart = BlazorCharts.find(currentChart => currentChart.id === config.canvasId);

        myChart.chart.destroy();
        myChart.chart = {};
        let newChart = initializeChartjsChart2(config);
        myChart.chart = newChart;

        return true;
    },

    UpdateChart: function(config) {
        if (!BlazorCharts.find(currentChart => currentChart.id === config.canvasId))
            throw `Could not find a chart with the given id. ${config.canvasId}`;

        let myChart = BlazorCharts.find(currentChart => currentChart.id === config.canvasId);

        myChart.chart.config.data.datasets = config.data.datasets;
        myChart.chart.config.data.labels = config.data.labels;

        myChart.chart.render({
            duration: 800,
            lazy: false,
            easing: 'easeOutBounce'
        });
        myChart.chart.update();

        return true;
    }
};

function initializeChartjsChart2(config) {
    let ctx = document.getElementById(config.canvasId);

    // replace the Legend OnHover function name with the actual function (if present)
    // ToDo: this can be improved a lot :D
    if (config.options.legend.onHover &&
        typeof config.options.legend.onHover === "string" &&
        config.options.legend.onHover.includes(".")) {

        var onHoverNamespaceAndFunc = config.options.legend.onHover.split(".");
        var onHoverFunc = window[onHoverNamespaceAndFunc[0]][onHoverNamespaceAndFunc[1]];

        if (typeof onHoverFunc === "function") {
            config.options.legend.onHover = onHoverFunc;
        } else { // fallback to the default
            config.options.legend.onHover = null;
        }
    } else { // fallback to the default
        config.options.legend.onHover = null;
    }

    // replace the Legend OnClick function name with the actual function (if present)
    // ToDo: this can be improved a lot :D
    if (config.options.legend.onClick &&
        typeof config.options.legend.onClick === "string" &&
        config.options.legend.onClick.includes(".")) {

        var onClickNamespaceAndFunc = config.options.legend.onClick.split(".");
        var onClickFunc = window[onClickNamespaceAndFunc[0]][onClickNamespaceAndFunc[1]];

        if (typeof onClickFunc === "function") {
            config.options.legend.onClick = onClickFunc;
        } else { // fallback to the default
            config.options.legend.onClick = Chart.defaults.global.legend.onClick;
        }
    } else { // fallback to the default
        config.options.legend.onClick = Chart.defaults.global.legend.onClick;
    }

    // replace the Labels GenerateLabels function name with the actual function (if present)
    // ToDo: this can be improved a lot :D
    if (config.options.legend.labels.generateLabels &&
        typeof config.options.legend.labels.generateLabels === "string" &&
        config.options.legend.labels.generateLabels.includes(".")) {

        var generateLabelsNamespaceAndFunc = config.options.legend.labels.generateLabels.split(".");
        var generateLabelsFunc = window[generateLabelsNamespaceAndFunc[0]][generateLabelsNamespaceAndFunc[1]];

        if (typeof generateLabels === "function") {
            config.options.legend.labels.generateLabels = generateLabelsFunc;
        } else { // fallback to the default
            config.options.legend.labels.generateLabels = Chart.defaults.global.legend.labels.generateLabels;
        }
    } else { // fallback to the default
        config.options.legend.labels.generateLabels = Chart.defaults.global.legend.labels.generateLabels;
    }

    // replace the Labels Filter function name with the actual function (if present)
    // see details here: http://www.chartjs.org/docs/latest/configuration/legend.html#legend-label-configuration
    // ToDo: this can be improved a lot :D
    if (config.options.legend.labels.filter &&
        typeof config.options.legend.labels.filter === "string" &&
        config.options.legend.labels.filter.includes(".")) {

        var filtersNamespaceAndFunc = config.options.legend.labels.filter.split(".");
        var filterFunc = window[filtersNamespaceAndFunc[0]][filtersNamespaceAndFunc[1]];

        if (typeof filterFunc === "function") {
            config.options.legend.labels.filter = filterFunc;
        } else { // fallback to the default, which is null
            config.options.legend.labels.filter = null;
        }
    } else { // fallback to the default, which is null
        config.options.legend.labels.filter = null;
    }

    let myChart = new Chart(ctx, config);

    return myChart;
}