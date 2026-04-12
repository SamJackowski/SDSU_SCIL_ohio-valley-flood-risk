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
    ramp:   ['#eff3ff','#bdd7e7','#6baed6','#2171b5','#084594'],
    unit:   'score (0–100)',
  },
  {
    label:  'Inland Flood Expected Annual Loss',
    column: 'IFLD_EALS',
    scale:  [0, 10, 25, 50, 75],
    ramp:   ['#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'],
    unit:   'score (0–100)',
  },
  {
    label:  'Overall Risk Score',
    column: 'RISK_SCORE',
    scale:  [0, 20, 40, 60, 80],
    ramp:   ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'],
    unit:   'score (0–100)',
  },
  {
    label:  'Social Vulnerability Score',
    column: 'SOVI_SCORE',
    scale:  [0, 20, 40, 60, 80],
    ramp:   ['#f7f7f7','#cccccc','#969696','#636363','#252525'],
    unit:   'score (0–100)',
  },
  {
    label:  'Community Resilience Score',
    column: 'RESL_SCORE',
    scale:  [0, 20, 40, 60, 80],
    ramp:   ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc'],
    unit:   'score (0–100, higher = more resilient)',
  },
  {
    label:  'Median Household Income ($)',
    column: 'MEDIAN_INCOME',
    scale:  [0, 40000, 55000, 70000, 90000],
    ramp:   ['#d73027','#fc8d59','#fee090','#91bfdb','#4575b4'],
    unit:   '$ median household income',
  },
  {
    label:  'Poverty Rate (%)',
    column: 'POVERTY_RATE',
    scale:  [0, 10, 15, 20, 30],
    ramp:   ['#ffffcc','#c7e9b4','#7fcdbb','#1d91c0','#0c2c84'],
    unit:   '% below poverty line',
  },
<<<<<<< HEAD
  {
    label:  'Median Home Value ($)',
    column: 'MEDIAN_HOME_VALUE',
    scale:  [0, 100000, 175000, 250000, 350000],
    ramp:   ['#d73027','#fc8d59','#fee090','#91bfdb','#4575b4'],
    unit:   '$ median home value',
  },
=======
>>>>>>> f8fa7308455cb44bc1909f3fbfb7675023da5bc5
];

// Global Variables
var activeDataset = DATASETS[0];
var mapInstance, geojsonLayer, infoControl, legendControl;
<<<<<<< HEAD
var cursorTip;


document.addEventListener('DOMContentLoaded', function () {
  // Cursor tooltip reference
  cursorTip = document.getElementById('cursor-tooltip');

  // Move tooltip with mouse
  document.getElementById('mapid').addEventListener('mousemove', function(e) {
    cursorTip.style.left = (e.clientX + 14) + 'px';
    cursorTip.style.top  = (e.clientY - 10) + 'px';
  }); 
  
=======

document.addEventListener('DOMContentLoaded', function () {

>>>>>>> f8fa7308455cb44bc1909f3fbfb7675023da5bc5
  // Create map centered on Ohio Valley
  mapInstance = L.map('mapid').setView([38.5, -83.5], 6);

  
  mapInstance.createPane('tractsPane');
  mapInstance.createPane('riverPane');

  mapInstance.getPane('tractsPane').style.zIndex = 400;
  mapInstance.getPane('riverPane').style.zIndex = 650;
  

  // Add basemap
  L.tileLayer('https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
  }).addTo(mapInstance);

  // Info box
  infoControl = L.control({ position: 'topright' });
  infoControl.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  infoControl.update = function (props) {
    var val  = props ? props[activeDataset.column] : null;
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
    refreshMap();
  });

  // Load GeoJSON
  fetch('OhioValleyTractAndDataSImplified.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      geojsonLayer = L.geoJson(data, {
        pane: 'tractsPane', // <-- ADDED
        style: styleFeature,
        onEachFeature: onEachFeature,
      }).addTo(mapInstance);
    })
    .catch(function (err) {
      console.error('Failed to load GeoJSON:', err);
    });

  // Load Ohio River
  var riverLayer;
  fetch('ohio_river.geojson')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      riverLayer = L.geoJson(data, {
        pane: 'riverPane', // <-- ADDED
        style: {
          color: '#00c3ff',
          weight: 5,
          opacity: 1,
        }
      }).addTo(mapInstance);
    });
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
    fillColor:   getColor(feature.properties[activeDataset.column]),
    weight:      0.4,
    opacity:     1,
    color:       '#0a0a14',
    fillOpacity: 0.82,
  };
}

<<<<<<< HEAD
=======
// Map Interaction
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({ weight: 2, color: '#00d2ff', fillOpacity: 0.95 });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) layer.bringToFront();
  infoControl.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
  infoControl.update();
}

>>>>>>> f8fa7308455cb44bc1909f3fbfb7675023da5bc5
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout:  resetHighlight,
  });
}

<<<<<<< HEAD
// Map Interaction

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({ weight: 2, color: '#00d2ff', fillOpacity: 0.95 });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) layer.bringToFront();
  infoControl.update(layer.feature.properties);

  // Show value next to cursor
  var val = layer.feature.properties[activeDataset.column];
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
=======
// Update Map
function refreshMap() {
  if (!geojsonLayer) return;
>>>>>>> f8fa7308455cb44bc1909f3fbfb7675023da5bc5
  geojsonLayer.eachLayer(function (layer) {
    geojsonLayer.resetStyle(layer);
  });
  infoControl.update();
  updateLegend(legendControl._div);
}

function updateLegend(div) {
  var breaks = activeDataset.scale;
  var ramp   = activeDataset.ramp;
  var html   = '<strong>' + activeDataset.label + '</strong><br>' +
               '<small>' + activeDataset.unit + '</small><br><br>';
  for (var i = breaks.length - 1; i >= 0; i--) {
    var from = breaks[i];
    var to   = breaks[i + 1];
    html +=
      '<i style="background:' + ramp[i] + '"></i> ' +
      from.toLocaleString() + (to != null ? '&ndash;' + to.toLocaleString() : '+') + '<br>';
  }
  div.innerHTML = html;
}