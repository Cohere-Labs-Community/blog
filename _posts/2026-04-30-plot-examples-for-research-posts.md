---
layout: distill
title: Plot Examples for Research Posts
date: 2026-04-30 01:00:00
description: Examples for adding Chart.js, Plotly.js, ECharts, and Vega-Lite visualizations to Cohere Labs Blog posts.
author: Cohere Labs Community
authors:
  - name: Cohere Labs Community
    affiliations:
      name: Cohere Labs
tags: community research visualization
toc:
  - name: When To Use Interactive Plots
  - name: Enable Plot Libraries
  - name: Chart.js
  - name: Plotly.js
  - name: ECharts
  - name: Vega-Lite
  - name: Choosing A Library
chart:
  chartjs: true
  plotly: true
  echarts: true
  vega_lite: true
---

Interactive plots can help when a static table or figure would hide an important comparison. Use them for small, focused views: a metric curve, a compact ablation, a distribution, or a comparison that benefits from tooltips.

Prefer static images for final paper figures, screenshots, or anything that must render identically everywhere. Each chart library adds JavaScript to the page, so only enable the libraries a post actually uses.

## Enable Plot Libraries

Chart libraries are enabled in front matter. This page enables all supported chart libraries so contributors can compare their syntax:

```yaml
chart:
  chartjs: true
  plotly: true
  echarts: true
  vega_lite: true
```

For a normal post, keep only the keys you need.

## Chart.js

[Chart.js](https://www.chartjs.org/) is a good fit for simple line, bar, and doughnut charts. Add a fenced `chartjs` block containing a Chart.js JSON config.

````markdown
```chartjs
{
  "type": "line",
  "data": {
    "labels": ["1B", "3B", "8B", "14B"],
    "datasets": [
      {
        "label": "Average accuracy",
        "data": [42, 51, 58, 62],
        "borderColor": "#b509ac",
        "backgroundColor": "rgba(181, 9, 172, 0.12)",
        "tension": 0.25,
        "fill": true
      }
    ]
  },
  "options": {
    "plugins": {
      "legend": {
        "display": true
      }
    },
    "scales": {
      "y": {
        "beginAtZero": true,
        "title": {
          "display": true,
          "text": "Accuracy"
        }
      }
    }
  }
}
```
````

```chartjs
{
  "type": "line",
  "data": {
    "labels": ["1B", "3B", "8B", "14B"],
    "datasets": [
      {
        "label": "Average accuracy",
        "data": [42, 51, 58, 62],
        "borderColor": "#b509ac",
        "backgroundColor": "rgba(181, 9, 172, 0.12)",
        "tension": 0.25,
        "fill": true
      }
    ]
  },
  "options": {
    "plugins": {
      "legend": {
        "display": true
      }
    },
    "scales": {
      "y": {
        "beginAtZero": true,
        "title": {
          "display": true,
          "text": "Accuracy"
        }
      }
    }
  }
}
```

## Plotly.js

[Plotly.js](https://plotly.com/javascript/) is useful for interactive scatter, line, and multi-trace charts. Use a fenced `plotly` block with `data` and optional `layout`.

````markdown
```plotly
{
  "data": [
    {
      "x": [1, 2, 4, 8, 16],
      "y": [31, 42, 53, 61, 64],
      "mode": "lines+markers",
      "name": "Model A"
    },
    {
      "x": [1, 2, 4, 8, 16],
      "y": [28, 39, 48, 57, 60],
      "mode": "lines+markers",
      "name": "Model B"
    }
  ],
  "layout": {
    "height": 360,
    "margin": {
      "l": 50,
      "r": 20,
      "t": 20,
      "b": 45
    },
    "xaxis": {
      "title": "Training tokens (B)"
    },
    "yaxis": {
      "title": "Accuracy"
    }
  }
}
```
````

```plotly
{
  "data": [
    {
      "x": [1, 2, 4, 8, 16],
      "y": [31, 42, 53, 61, 64],
      "mode": "lines+markers",
      "name": "Model A"
    },
    {
      "x": [1, 2, 4, 8, 16],
      "y": [28, 39, 48, 57, 60],
      "mode": "lines+markers",
      "name": "Model B"
    }
  ],
  "layout": {
    "height": 360,
    "margin": {
      "l": 50,
      "r": 20,
      "t": 20,
      "b": 45
    },
    "xaxis": {
      "title": "Training tokens (B)"
    },
    "yaxis": {
      "title": "Accuracy"
    }
  }
}
```

## ECharts

[ECharts](https://echarts.apache.org/) is strong for dashboard-like charts, grouped bars, and polished tooltips. Use a fenced `echarts` block with an ECharts option object.

````markdown
```echarts
{
  "tooltip": {
    "trigger": "axis"
  },
  "legend": {
    "top": 0
  },
  "grid": {
    "left": 45,
    "right": 20,
    "top": 55,
    "bottom": 35
  },
  "xAxis": {
    "type": "category",
    "data": ["English", "Spanish", "Arabic", "Hindi"]
  },
  "yAxis": {
    "type": "value",
    "name": "Score"
  },
  "series": [
    {
      "name": "Baseline",
      "type": "bar",
      "data": [68, 54, 49, 46]
    },
    {
      "name": "Adapted",
      "type": "bar",
      "data": [70, 61, 58, 55]
    }
  ]
}
```
````

```echarts
{
  "tooltip": {
    "trigger": "axis"
  },
  "legend": {
    "top": 0
  },
  "grid": {
    "left": 45,
    "right": 20,
    "top": 55,
    "bottom": 35
  },
  "xAxis": {
    "type": "category",
    "data": ["English", "Spanish", "Arabic", "Hindi"]
  },
  "yAxis": {
    "type": "value",
    "name": "Score"
  },
  "series": [
    {
      "name": "Baseline",
      "type": "bar",
      "data": [68, 54, 49, 46]
    },
    {
      "name": "Adapted",
      "type": "bar",
      "data": [70, 61, 58, 55]
    }
  ]
}
```

## Vega-Lite

[Vega-Lite](https://vega.github.io/vega-lite/) is a good choice when you want a declarative grammar of graphics. Use a fenced `vega_lite` block with a Vega-Lite spec.

````markdown
```vega_lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 280,
  "data": {
    "values": [
      {"language": "English", "model": "Baseline", "score": 68},
      {"language": "English", "model": "Adapted", "score": 70},
      {"language": "Spanish", "model": "Baseline", "score": 54},
      {"language": "Spanish", "model": "Adapted", "score": 61},
      {"language": "Arabic", "model": "Baseline", "score": 49},
      {"language": "Arabic", "model": "Adapted", "score": 58},
      {"language": "Hindi", "model": "Baseline", "score": 46},
      {"language": "Hindi", "model": "Adapted", "score": 55}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "language",
      "type": "nominal",
      "axis": {
        "title": null
      }
    },
    "xOffset": {
      "field": "model"
    },
    "y": {
      "field": "score",
      "type": "quantitative",
      "title": "Score"
    },
    "color": {
      "field": "model",
      "type": "nominal"
    },
    "tooltip": [
      {"field": "language", "type": "nominal"},
      {"field": "model", "type": "nominal"},
      {"field": "score", "type": "quantitative"}
    ]
  }
}
```
````

```vega_lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 280,
  "data": {
    "values": [
      { "language": "English", "model": "Baseline", "score": 68 },
      { "language": "English", "model": "Adapted", "score": 70 },
      { "language": "Spanish", "model": "Baseline", "score": 54 },
      { "language": "Spanish", "model": "Adapted", "score": 61 },
      { "language": "Arabic", "model": "Baseline", "score": 49 },
      { "language": "Arabic", "model": "Adapted", "score": 58 },
      { "language": "Hindi", "model": "Baseline", "score": 46 },
      { "language": "Hindi", "model": "Adapted", "score": 55 }
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "language",
      "type": "nominal",
      "axis": {
        "title": null
      }
    },
    "xOffset": {
      "field": "model"
    },
    "y": {
      "field": "score",
      "type": "quantitative",
      "title": "Score"
    },
    "color": {
      "field": "model",
      "type": "nominal"
    },
    "tooltip": [
      { "field": "language", "type": "nominal" },
      { "field": "model", "type": "nominal" },
      { "field": "score", "type": "quantitative" }
    ]
  }
}
```

## Choosing A Library

Use Chart.js for simple charts, Plotly.js for exploratory interactive plots, ECharts for polished dashboard-style visuals, and Vega-Lite when a declarative grammar makes the chart easier to maintain.

For most research posts, one plotting library is enough. If the chart is central to the argument, include the data source, axis definitions, and any preprocessing choices in the surrounding text.
