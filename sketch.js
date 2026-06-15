//==================================================================================================
// SCIL Data Viewer
//
// This map showcases Poverty, Median Income, Flood Risk Data, and other Socioeconomic Data
// For the 6 main states in the Ohio River Valley Region: Indiana, Illinois, Ohio, Pennsylvania,
// Kentucky, and West Virginia
// Risk data sourced from the FEMA NRI Table (https://www.fema.gov/about/openfema/data-sets/national-risk-index-data)
// Socioeconomic data sourced from US Census Bureau (Tables S1701 and B19013)
// By Sam Jackowski
//==================================================================================================

// Datasets: Name, Column Name, Scale, Colors, Unit of measure

var DATASETS = [
  {
    label:  'Inland Flood Risk Score',
    column: 'IFLD_RISKS',
    scale:  [0, 20, 40, 60, 80],
    ramp: ['#fff5f0','#fcbba1','#fc9272','#fb6a4a','#cb181d'],
    unit:   'score (0–100)',
    description: "FEMA score estimating relative inland flood risk.",

  },
  {
    label:  'Inland Flood Expected Annual Loss',
    column: 'IFLD_EALS',
    scale:  [0, 10, 25, 50, 75],
    ramp: ['#fff5f0','#fcbba1','#fc9272','#fb6a4a','#cb181d'],  
    unit:   'score (0–100)',
    description: "FEMA estimate of annualized flood loss risk.",
  },
  {
    label:  'Overall Risk Score',
    column: 'RISK_SCORE',
    scale:  [0, 20, 40, 60, 80],
    ramp: ['#fff5f0','#fcbba1','#fc9272','#fb6a4a','#cb181d'],
    unit:   'score (0–100)',
    description:  "FEMA composite natural hazard risk score.", 
  },
  {
    label:  'Social Vulnerability Score',
    column: 'SOVI_SCORE',
    scale:  [0, 20, 40, 60, 80],
    ramp: ['#fff5f0','#fcbba1','#fc9272','#fb6a4a','#cb181d'],
    unit:   'score (0–100)',
    description:  "FEMA score for community sensitivity to hazards.", 
  },
  {
    label:  'Community Resilience Score',
    column: 'RESL_SCORE',
    scale:  [0, 20, 40, 60, 80],
    ramp:   ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc'],
    unit:   'score (0–100, higher = more resilient)',
    description:  "FEMA score for ability to prepare, respond, and recover.", 
  },
  {
    label:  'Median Household Income ($)',
    column: 'MEDIAN_INCOME',
    animationPrefix: 'MEDIAN_INCOME',
    animated: true,
    scale:  [0, 40000, 55000, 70000, 90000],
    ramp:   ['#d73027','#fc8d59','#fee090','#91bfdb','#4575b4'],
    unit:   '$ median household income',
    description:  "Census tract median household income.", 
  },
  {
    label:  'Poverty Rate (%)',
    column: 'POVERTY_RATE',
    scale:  [0, 10, 15, 20, 30],
    ramp: ['#fff5f0','#fcbba1','#fc9272','#fb6a4a','#cb181d'],
    unit:   '% below poverty line',
    description:  "Percent of population below poverty level.", 
  },
  {
    label:  'Median Home Value ($)',
    column: 'MEDIAN_HOME_VALUE',
    animationPrefix: 'MEDIAN_HOME_VALUE',
    animated: true,
    scale:  [0, 100000, 175000, 250000, 350000],
    ramp:   ['#d73027','#fc8d59','#fee090','#91bfdb','#4575b4'],
    unit:   '$ median home value',
    description:  "Census tract median home value.", 
  },
  {
  label: 'Flood Vulnerability Index',
  column: 'FLOOD_VULN_INDEX',
  scale: [0, 20, 40, 60, 80],
  ramp: ['#fff5f0','#fcbba1','#fc9272','#ef3b2c','#99000d'],
  unit: 'composite vulnerability score (0–100)',
  description: 'Composite measure combining flood hazard, poverty, income, and resilience.',
  },
  {
  label: 'Median Age',
  column: 'MEDIAN_AGE',
  scale: [0, 40, 45, 50, 55],
  ramp: ['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#253494'],
  unit: 'years',
  description: 'Median age of residents in each census tract.',
  },
  {
    label: 'Employment Rate (%)',
    column: 'EMPLOYMENT_RATE',
    animationPrefix: 'EMPLOYMENT_RATE',
    animated: true,
    scale: [0, 90, 92, 94, 96],
    ramp: ['#d73027','#fc8d59','#fee090','#91bfdb','#4575b4'],
    unit: '% employed civilian labor force',
    description: 'Percent of the civilian labor force that is employed.',
  },
  {
    label: 'Median Rent ($)',
    column: 'MEDIAN_RENT',
    scale: [0, 700, 900, 1100, 1400],
    ramp: ['#d73027','#fc8d59','#fee090','#91bfdb','#4575b4'],
    unit: '$ median gross rent',
    description: 'Median gross rent by census tract.',
  },
  {
  label: 'Population Total',
  column: 'POPULATION_TOTAL',
  scale: [0, 1000, 2500, 5000, 10000],
  ramp: ['#ffffcc','#c2e699','#78c679','#31a354','#006837'],
  unit: 'people',
  description: 'Total population by census tract.',
  },
  {
    label: 'Population Density',
    column: 'POP_DENSITY_SQ_MI',
    scale: [0, 250, 1000, 2500, 5000],
    ramp: ['#ffffcc','#c2e699','#78c679','#31a354','#006837'],
    unit: 'people per square mile',
    description: 'Population density based on tract population and land area.',
  },
  {
    label: 'Households Without Vehicles (%)',
    column: 'PCT_HH_NO_VEHICLE',
    scale: [0, 5, 10, 15, 25],
    ramp: ['#ffffcc','#fed976','#fd8d3c','#f03b20','#bd0026'],
    unit: '% households with no vehicle',
    description: 'Percentage of households without access to a vehicle.',
  },
];

// Global Variables
var activeDataset = DATASETS[0];
var mapInstance, geojsonLayer, infoControl, legendControl;
var cursorTip;
var cityLabelsLayer;
var cityLabelsVisible = true;
var hospitalLayer;
var hospitalsVisible = true;
var activeYear = 2024;
var animationTimer = null;

// Major cities in Ohio Valley Region
var CITIES = [
  { name: 'Indianapolis', lat: 39.7684, lng: -86.1581, size: 'large' },
  { name: 'Columbus', lat: 39.9612, lng: -82.9988, size: 'large' },
  { name: 'Cincinnati', lat: 39.1031, lng: -84.5120, size: 'large' },
  { name: 'Louisville', lat: 38.2527, lng: -85.7585, size: 'large' },
  { name: 'Pittsburgh', lat: 40.4406, lng: -79.9959, size: 'large' },
  { name: 'Akron', lat: 41.0814, lng: -81.5190, size: 'medium' },
  { name: 'Dayton', lat: 39.7589, lng: -84.1916, size: 'medium' },
  { name: 'Lexington', lat: 38.0406, lng: -84.5037, size: 'medium' },
  { name: 'Charleston', lat: 38.3498, lng: -81.6326, size: 'medium' },
  { name: 'Huntington', lat: 38.4192, lng: -82.4452, size: 'medium' },
  { name: 'Evansville', lat: 37.9716, lng: -87.5711, size: 'medium' },
  { name: 'Youngstown', lat: 41.0998, lng: -80.6495, size: 'medium' },
  { name: 'Canton', lat: 40.7989, lng: -81.3784, size: 'medium' },
  { name: 'Bloomington', lat: 39.1653, lng: -86.5264, size: 'medium' },
  { name: 'Muncie', lat: 40.1934, lng: -85.3864, size: 'medium' },
  { name: 'Bowling Green', lat: 36.9685, lng: -86.4808, size: 'medium' },
  { name: 'Wheeling', lat: 40.0640, lng: -80.7209, size: 'small' },
  { name: 'Parkersburg', lat: 39.2667, lng: -81.5615, size: 'small' },
  { name: 'Owensboro', lat: 37.7742, lng: -87.1117, size: 'small' },
  { name: 'Morgantown', lat: 39.6295, lng: -79.9559, size: 'small' }
];


// Animation Helpers
function getActiveColumn() {
  if (activeDataset.animated) {
    return activeDataset.animationPrefix + '_' + activeYear;
  }

  return activeDataset.column;
}

function updateAnimationControls() {
  var controls = document.getElementById('animationControls');

  if (activeDataset.animated) {
    controls.classList.remove('hidden');
  } else {
    controls.classList.add('hidden');

    if (animationTimer) {
      clearInterval(animationTimer);
      animationTimer = null;
      document.getElementById('playAnimationBtn').textContent = '▶ PLAY';
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Cursor tooltip reference
  cursorTip = document.getElementById('cursor-tooltip');

  // Move tooltip with mouse
  document.getElementById('mapid').addEventListener('mousemove', function(e) {
    cursorTip.style.left = (e.clientX + 14) + 'px';
    cursorTip.style.top  = (e.clientY - 10) + 'px';
  }); 
  
  // Create map centered on Ohio Valley
// after map creation
mapInstance = L.map('mapid').setView([38.5, -83.5], 6);

mapInstance.createPane('tractsPane');
mapInstance.createPane('riverPane');
mapInstance.createPane('cityPane');
mapInstance.createPane('hospitalPane');

mapInstance.getPane('tractsPane').style.zIndex = 400;
mapInstance.getPane('riverPane').style.zIndex = 650;
mapInstance.getPane('cityPane').style.zIndex = 700;
mapInstance.getPane('hospitalPane').style.zIndex = 725;
  

  // Add basemap
  L.tileLayer('https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
  }).addTo(mapInstance);

  L.control.scale({
  position: 'bottomleft',
  imperial: true,
  metric: false,
  maxWidth: 140
}).addTo(mapInstance);

  // Info box
  infoControl = L.control({ position: 'topright' });
  infoControl.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  infoControl.update = function (props) {
    var val  = props ? props[getActiveColumn()] : null;
    var name = props ? (props.NAME || props.COUNTY || props.GEOID || '?') : null;
    var state = props ? (props.STATEABBRV || '') : '';

    this._div.innerHTML =
      '<h4>' + activeDataset.label + '</h4>' +
      (props
        ? '<b>' + name + (state ? ', ' + state : '') + '</b><br>' +
          (val != null && val !== '' && val !== -9999
            ? Number(val).toLocaleString()
            : 'No data') +
          '<br><span class="unit">' + activeDataset.unit + '</span>'
        : 'Hover over a tract');
  };
  infoControl.addTo(mapInstance);

  // Legend
  legendControl = L.control({ position: 'bottomright' });
  legendControl.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info legend');
    updateLegend(this._div);
    return this._div;
  };
  legendControl.addTo(mapInstance);


  // Dropdown
  var select = document.getElementById('categorySelect');

  DATASETS.forEach(function (ds, i) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.textContent = ds.label;
    select.appendChild(opt);
  });

  select.addEventListener('change', function () {
  activeDataset = DATASETS[parseInt(this.value)];

  updateAnimationControls();
  refreshMap();

  if (geojsonLayer) {
    updateDashboard(geojsonLayer.toGeoJSON());
  }
  });

  // Load GeoJSON
  fetch('ohio_river_valley_final.geojson')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      geojsonLayer = L.geoJson(data, {
        pane: 'tractsPane', 
        style: styleFeature,
        onEachFeature: onEachFeature,
      }).addTo(mapInstance);

      mapInstance.fitBounds(geojsonLayer.getBounds(), {
      padding: [30, 30]
      });

      updateDashboard(data);

    })
    .catch(function (err) {
      console.error('Failed to load GeoJSON:', err);
    });



  // Load Ohio River
  var riverLayer;
  fetch('ohio_river.geojson')
    .then(function (r) { return r.json(); })
    .then(function (data) {
        L.geoJson(data, {
            pane: 'riverPane',
            style: {
              color: '#00c3ff',
              weight: 12,
              opacity: 0.18
            }
          }).addTo(mapInstance);

      riverLayer = L.geoJson(data, {
        pane: 'riverPane', // <-- ADDED
        style: {
          color: '#00c3ff',
          weight: 5,
          opacity: 1,
        }
      }).addTo(mapInstance);
    });

  fetch('ohio_river_valley_hospitals_filtered.geojson')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    hospitalLayer = L.geoJson(data, {
      pane: 'hospitalPane',

        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
            pane: 'hospitalPane',
            radius: 7,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillColor: '#00d2ff',
            fillOpacity: 1
          });
        },

      onEachFeature: function(feature, layer) {
        var name =
          feature.properties.NAME ||
          feature.properties.NAME_1 ||
          feature.properties.HOSP_NAME ||
          'Hospital';

        layer.bindPopup('<b>' + name + '</b>');
      }
    }).addTo(mapInstance);
  })
  .catch(function(err) {
    console.error('Failed to load hospitals:', err);
  });


  // Add city labels
  addCityLabels();

  // City toggle button
  document.getElementById('cityToggle').addEventListener('click', function() {
    cityLabelsVisible = !cityLabelsVisible;
    this.textContent = cityLabelsVisible ? '🏙️ HIDE CITIES' : '🏙️ SHOW CITIES';
    this.classList.toggle('inactive');
    updateCityLabelsVisibility();
  });

  document.getElementById('resetViewBtn').addEventListener('click', function() {
  if (geojsonLayer) {
    mapInstance.fitBounds(geojsonLayer.getBounds(), {
      padding: [30, 30]
     });
    }
  });


  document.getElementById('helpBtn').addEventListener('click', function() {
  document.getElementById('helpModal').classList.remove('hidden');
});

  document.getElementById('closeHelpBtn').addEventListener('click', function() {
    document.getElementById('helpModal').classList.add('hidden');
  });

  document.getElementById('helpModal').addEventListener('click', function(e) {
    if (e.target.id === 'helpModal') {
      this.classList.add('hidden');
    }
  });

  document.getElementById('hospitalToggle').addEventListener('click', function() {
  hospitalsVisible = !hospitalsVisible;

  this.textContent = hospitalsVisible ? '🏥 HIDE HOSPITALS' : '🏥 SHOW HOSPITALS';
  this.classList.toggle('inactive');

  if (!hospitalLayer) return;

  if (hospitalsVisible) {
    hospitalLayer.addTo(mapInstance);
  } else {
    mapInstance.removeLayer(hospitalLayer);
  }
  });

  document.getElementById('yearSlider').addEventListener('input', function() {
  activeYear = Number(this.value);
  document.getElementById('yearLabel').textContent = activeYear;

  refreshMap();

  if (geojsonLayer) {
    updateDashboard(geojsonLayer.toGeoJSON());
  }
});

  document.getElementById('playAnimationBtn').addEventListener('click', function() {
    if (animationTimer) {
      clearInterval(animationTimer);
      animationTimer = null;
      this.textContent = '▶ PLAY';
      return;
    }

    this.textContent = '⏸ PAUSE';

    animationTimer = setInterval(function() {
      activeYear++;

      if (activeYear > 2024) {
        activeYear = 2011;
      }

      document.getElementById('yearSlider').value = activeYear;
      document.getElementById('yearLabel').textContent = activeYear;

      refreshMap();

      if (geojsonLayer) {
        updateDashboard(geojsonLayer.toGeoJSON());
      }
    }, 900);
  });

    updateAnimationControls();
});

// Style
function getColor(value) {
  var breaks = activeDataset.scale;
  var ramp   = activeDataset.ramp;
  if (value == null || value === '' || isNaN(Number(value)) || Number(value) < 0) {
    return '#2a2a2a';
  }
  var v = Number(value);
  for (var i = breaks.length - 1; i >= 0; i--) {
    if (v > breaks[i]) return ramp[i];
  }
  return ramp[0];
}

function styleFeature(feature) {
  return {
    fillColor: getColor(feature.properties[getActiveColumn()]),
    weight:      0.4,
    opacity:     1,
    color:       '#0a0a14',
    fillOpacity: 0.7,
  };
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout:  resetHighlight,
  });
}

// Map Interaction

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({ weight: 2, color: '#00d2ff', fillOpacity: 0.95 });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) layer.bringToFront();
  infoControl.update(layer.feature.properties);

  // Show value next to cursor
  var val = layer.feature.properties[getActiveColumn()];
  if (cursorTip && val != null && val !== '' && Number(val) >= 0) {
    cursorTip.textContent = Number(val).toLocaleString();
    cursorTip.style.display = 'block';
  }
}

function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
  infoControl.update();
  if (cursorTip) cursorTip.style.display = 'none';
}

// Update Map
function refreshMap() {
  if (!geojsonLayer) return;
  if (cursorTip) cursorTip.style.display = 'none'; 
  geojsonLayer.eachLayer(function (layer) {
    geojsonLayer.resetStyle(layer);
  });
  infoControl.update();
  updateLegend(legendControl._div);
}

function updateLegend(div) {
  var breaks = activeDataset.scale;
  var ramp   = activeDataset.ramp;
  var title = activeDataset.animated
    ? activeDataset.label + ' (' + activeYear + ')'
    : activeDataset.label;
  var html = '<strong>' + title + '</strong><br>';
  for (var i = breaks.length - 1; i >= 0; i--) {
    var from = breaks[i];
    var to   = breaks[i + 1];
    html +=
      '<i style="background:' + ramp[i] + '"></i> ' +
      from.toLocaleString() + (to != null ? '&ndash;' + to.toLocaleString() : '+') + '<br>';
  }
  div.innerHTML = html;
}

// City Labels Functions
function addCityLabels() {
  cityLabelsLayer = L.layerGroup();
  
  CITIES.forEach(function(city) {
    // Create custom icon based on city size
    var iconSize = city.size === 'large' ? [8, 8] : city.size === 'medium' ? [6, 6] : [4, 4];
    var fontSize = city.size === 'large' ? 14 : city.size === 'medium' ? 12 : 10;
    
    var cityIcon = L.divIcon({
      className: 'city-label',
      html: '<div class="city-marker city-' + city.size + '"></div>' +
            '<div class="city-name" style="font-size: ' + fontSize + 'px;">' + city.name + '</div>',
      iconSize: [100, 40],
      iconAnchor: [50, 0]
    });
    
    var marker = L.marker([city.lat, city.lng], {
      icon: cityIcon,
      interactive: false,
      pane: 'cityPane'
    });
    
    marker.addTo(cityLabelsLayer);
  });
  
  cityLabelsLayer.addTo(mapInstance);
}

function updateCityLabelsVisibility() {
  if (cityLabelsVisible) {
    cityLabelsLayer.addTo(mapInstance);
  } else {
    mapInstance.removeLayer(cityLabelsLayer);
  }
}

function getValidValues(features, column) {
  return features
    .map(function(f) { return Number(f.properties[column]); })
    .filter(function(v) { return !isNaN(v) && v >= 0; });
}

function average(values) {
  if (!values.length) return null;
  return values.reduce(function(a, b) { return a + b; }, 0) / values.length;
}

function makeBins(values, breaks) {
  var counts = new Array(breaks.length - 1).fill(0);

  values.forEach(function(v) {
    for (var i = 0; i < breaks.length - 1; i++) {
      if (v >= breaks[i] && v < breaks[i + 1]) {
        counts[i]++;
        return;
      }
    }
    if (v >= breaks[breaks.length - 2]) {
      counts[counts.length - 1]++;
    }
  });

  return counts;
}

var datasetChart = null;

function updateDashboard(data) {
  var features = data.features;
  var activeColumn = getActiveColumn();

  var values = features
    .map(function(f) { return Number(f.properties[activeColumn]); })
    .filter(function(v) { return !isNaN(v) && v >= 0; });

  if (!values.length) return;

  var avg = average(values);
  var max = Math.max(...values);
  var min = Math.min(...values);

  var topFeature = features
    .filter(function(f) {
      return !isNaN(Number(f.properties[activeColumn]));
    })
    .sort(function(a, b) {
      return Number(b.properties[activeColumn]) -
             Number(a.properties[activeColumn]);
    })[0];

  document.getElementById('dashboardTitle').textContent =
    activeDataset.animated
      ? activeDataset.label + ' (' + activeYear + ')'
      : activeDataset.label;

  document.getElementById('dashboardDescription').textContent = activeDataset.description;
  document.getElementById('dashboardAverage').textContent = avg.toFixed(1);
  document.getElementById('dashboardMaximum').textContent = max.toFixed(1);
  document.getElementById('dashboardMinimum').textContent = min.toFixed(1);

  document.getElementById('dashboardTopFeature').textContent = topFeature
    ? (topFeature.properties.COUNTY || topFeature.properties.GEOID)
    : 'No data';

  makeDatasetChart(values);
}

function makeDatasetChart(values) {
  var ctx = document.getElementById('datasetChart');

  if (datasetChart) {
    datasetChart.destroy();
  }

  var labels;
  var breaks;

  if (activeDataset.animationPrefix === 'MEDIAN_INCOME') {
    breaks = [0, 40000, 55000, 70000, 90000, Infinity];
    labels = ['$0–40k', '$40k–55k', '$55k–70k', '$70k–90k', '$90k+'];

  } else if (activeDataset.column === 'MEDIAN_HOME_VALUE') {
    breaks = [0, 100000, 175000, 250000, 350000, Infinity];
    labels = ['$0–100k', '$100k–175k', '$175k–250k', '$250k–350k', '$350k+'];

  } else if (activeDataset.column === 'POVERTY_RATE') {
    breaks = [0, 10, 15, 20, 30, Infinity];
    labels = ['0–10%', '10–15%', '15–20%', '20–30%', '30%+'];

  }  else if (activeDataset.column === 'POPULATION_TOTAL') {
  breaks = [0, 1000, 2500, 5000, 10000, Infinity];
  labels = ['0–1k', '1k–2.5k', '2.5k–5k', '5k–10k', '10k+'];

  } else if (activeDataset.column === 'POP_DENSITY_SQ_MI') {
    breaks = [0, 250, 1000, 2500, 5000, Infinity];
    labels = ['0–250', '250–1k', '1k–2.5k', '2.5k–5k', '5k+'];

  } else if (activeDataset.column === 'PCT_HH_NO_VEHICLE') {
    breaks = [0, 5, 10, 15, 25, Infinity];
    labels = ['0–5%', '5–10%', '10–15%', '15–25%', '25%+'];

  } else if (activeDataset.column === 'HOSPITAL_COUNT') {
    breaks = [0, 1, 2, 5, 10, Infinity];
    labels = ['0', '1', '2–4', '5–9', '10+'];
  } else {
    breaks = [0, 20, 40, 60, 80, Infinity];
    labels = ['0–20', '20–40', '40–60', '60–80', '80+'];
  } 
  

  datasetChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: activeDataset.label,
        data: makeBins(values, breaks),
        backgroundColor: '#ef3b2c'
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: '#c8d8e8' }
        }
      },
      scales: {
        x: { ticks: { color: '#c8d8e8' }, grid: { color: '#1a2535' } },
        y: { ticks: { color: '#c8d8e8' }, grid: { color: '#1a2535' } }
      }
    }
  });
}