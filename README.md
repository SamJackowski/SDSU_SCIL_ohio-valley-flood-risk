# 🌊 Ohio Valley Risk Explorer

> **An interactive geospatial dashboard for exploring flood risk, socioeconomic vulnerability, and community resilience across the Ohio River Valley.**

https://samjackowski.github.io/SDSU_SCIL_ohio-valley-flood-risk/

---

## 📖 Overview

The **Ohio Valley Risk Explorer** is an interactive web-based GIS application designed to visualize and analyze flood risk alongside socioeconomic and demographic indicators across the **Ohio River Valley**.

The dashboard combines **FEMA National Risk Index** data with **U.S. Census** and community resilience metrics to help researchers, planners, emergency managers, and policymakers identify vulnerable communities and better understand how environmental hazards intersect with social conditions.

Users can seamlessly switch between datasets, explore census tract–level information, and gain insights into regional flood exposure and community resilience.

---
## Preview 

<img width="1276" height="679" alt="image" src="https://github.com/user-attachments/assets/09c13ec5-22c5-401e-a292-6f70558033ec" />

## Features

### Flood Risk Metrics
- Inland Flood Risk Score
- Inland Flood Expected Annual Loss
- Overall Risk Score

### 🏘 Community Vulnerability
- Flood Vulnerability Index
- Social Vulnerability Score
- Community Resilience Score

### Socioeconomic Indicators
- Median Household Income
- Poverty Rate
- Employment Rate
- Median Home Value
- Median Rent
- Population Density
- Population Total
- Median Age
- Households Without Vehicles

### Interactive GIS Dashboard
- Interactive choropleth mapping
- Census tract-level visualization
- Dynamic dataset selector
- Hover tooltips
- Zoom & pan navigation
- Summary statistics panel
- Distribution histogram
- Automatic legends

---

## Study Area

The dashboard covers the **Ohio River Valley**, including portions of:

- Illinois
- Indiana
- Ohio
- Kentucky
- West Virginia
- Pennsylvania

All analyses are performed at the **Census Tract** level.

---

### Data Sources

- **FEMA National Risk Index**
  - Inland Flood Risk Score
  - Expected Annual Loss
  - Overall Risk Score

- **U.S. Census Bureau**
  - American Community Survey (ACS)

- **CDC Social Vulnerability Index**

- **OpenStreetMap**

- **CARTO Dark Matter Basemap**

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Leaflet.js | Interactive mapping |
| JavaScript | Dashboard logic |
| HTML5 | User interface |
| CSS3 | Styling |
| GeoJSON | Spatial datasets |
| OpenStreetMap | Geographic data |
| CARTO | Dark Matter basemap |

---

---

## Project Structure

```text
Ohio-Valley-Risk-Explorer/
│
├── assets/
│   └── dashboard.png
│
├── css/
│   └── styles.css
│
├── data/
│   ├── flood_risk.geojson
│   ├── vulnerability.geojson
│   └── socioeconomic.geojson
│
├── js/
│   ├── map.js
│   ├── layers.js
│   ├── charts.js
│   └── controls.js
│
├── index.html
└── README.md
```

---

## Available Layers

| Category | Variables |
|----------|-----------|
| Flood Risk | Inland Flood Risk Score, Expected Annual Loss, Overall Risk |
| Vulnerability | Flood Vulnerability Index, Social Vulnerability Score, Community Resilience Score |
| Economics | Median Income, Poverty Rate, Employment Rate |
| Housing | Home Value, Rent |
| Demographics | Population, Density, Median Age |
| Transportation | Households Without Vehicles |

---

## Applications

- Flood risk assessment
- Urban and regional planning
- Emergency management
- Disaster preparedness
- Environmental justice research
- Community resilience analysis
- Public policy and decision support

---

## Future Improvements

- Satellite imagery overlays
- FEMA floodplain visualization
- Time-series analysis
- Export selected census tract data
- Search by county or ZIP code
- Additional hazard layers (tornado, wildfire, drought)
- Mobile-responsive interface

---

